(function createDropdownButtonProgress() {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.background = "#fff";
  container.style.padding = "10px";
  container.style.border = "1px solid #ccc";
  container.style.zIndex = 9999;
  container.style.fontFamily = "Arial, sans-serif";
  container.style.boxShadow = "0 0 8px rgba(0,0,0,0.2)";

  container.innerHTML = `
    <select id="gppicker" style="margin-bottom:5px;width:200px;">
      <option value="0" data-boundary-id="">All GP</option>
      <option value="6" data-boundary-id="839">KARIMPUR-I</option>
      <option value="6" data-boundary-id="840">KARIMPUR-II</option>
      <option value="6" data-boundary-id="841">JAMSHERPUR</option>
      <option value="6" data-boundary-id="842">MAGHUGARI</option>
      <option value="6" data-boundary-id="843">HOGALBARIA</option>
      <option value="6" data-boundary-id="844">PIPULBERIA</option>
      <option value="6" data-boundary-id="845">HAREKRISHNAPUR</option>
      <option value="6" data-boundary-id="846">SHIKARPUR</option>
    </select><br>
    <button id="downloadSurveyCsv" style="width:200px; margin-bottom:5px;">⬇ Download Survey CSV</button>
    <div id="progressBar" style="width: 100%; height: 6px; background: #eee; display: none; margin-top: 5px;">
      <div id="progressFill" style="height: 100%; width: 0%; background: #28a745;"></div>
    </div>
  `;
  document.body.appendChild(container);

  document.getElementById("downloadSurveyCsv").addEventListener("click", function () {
    const gpSelect = document.getElementById("gppicker");
    const selectedOption = gpSelect.options[gpSelect.selectedIndex];
    const boundaryID = selectedOption.getAttribute("data-boundary-id");
    const boundaryLevelID = selectedOption.value;

    if (!boundaryID || !boundaryLevelID || boundaryID === "0") {
      alert("❗ অনুগ্রহ করে একটি GP নির্বাচন করুন");
      return;
    }

    const progressBar = document.getElementById("progressBar");
    const progressFill = document.getElementById("progressFill");

    progressBar.style.display = "block";
    progressFill.style.width = "0%";

    fetch(`https://prdvbdrs.in/getGeoJsonDetails?BoundaryID=${boundaryID}&BoundaryLevelID=${boundaryLevelID}`, {
      headers: { "x-requested-with": "XMLHttpRequest" }
    })
      .then(res => res.json())
      .then(data => {
        const jsonObject = JSON.parse(data.geoJson);
        const allFeatures = jsonObject.features;

        const csrfHeader = document.querySelector("meta[name='_csrf_header']")?.content;
        const csrfToken = document.querySelector("meta[name='_csrf']")?.content;
        const contextPath = document.getElementById("contextPath")?.value || "";

        const headers = [
          "survey_id", "survey_type_id", "district_name", "block_name", "gram_panchayet_name",
          "gram_sansad_name", "para_name", "survey_date", "surveyor_name", "surveyor_contact_no"
        ];
        const csvRows = [headers.join(",")];

        let completed = 0;

        const promises = allFeatures.map(f => {
          const survey_id = f.properties?.survey_id;
          const survey_type_id = f.properties?.survey_type_id;

          return fetch(contextPath + "/getSurveytypeInfo", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              ...(csrfHeader && csrfToken ? { [csrfHeader]: csrfToken } : {})
            },
            body: new URLSearchParams({
              survey_id,
              survey_type_id
            })
          })
            .then(res => res.json())
            .then(detail => {
              const row = [
                survey_id,
                survey_type_id,
                detail.house?.district_name || "",
                detail.house?.block_name || "",
                detail.house?.gram_panchayet_name || "",
                detail.house?.gram_sansad_name || "",
                detail.house?.para_name || "",
                detail.house?.house_survey_date || "",
                detail.house?.surveyor_name || "",
                detail.house?.surveyor_contact_no || ""
              ];
              csvRows.push(row.join(","));
            })
            .catch(err => {
              console.warn(`❌ Failed for survey_id=${survey_id}`, err);
            })
            .finally(() => {
              completed++;
              const percent = ((completed / allFeatures.length) * 100).toFixed(1);
              progressFill.style.width = percent + "%";
            });
        });

        Promise.all(promises).then(() => {
          const csvContent = csvRows.join("\n");
          const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = `survey_details_gp_${boundaryID}.csv`;
          a.click();

          setTimeout(() => {
            progressBar.style.display = "none";
            progressFill.style.width = "0%";
          }, 1000);
        });
      })
      .catch(err => {
        console.error("❌ Error fetching GeoJSON:", err);
        progressBar.style.display = "none";
      });
  });
})();
