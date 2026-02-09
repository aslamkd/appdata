(function createDropdownButtonProgress() {
  if (window.__PRD_BOOKMARKLET_LOADED__) {
    alert("PRD Survey Tool already loaded");
    return;
  }
  window.__PRD_BOOKMARKLET_LOADED__ = true;

  let gpPasswords = {};

  fetch("https://raw.githubusercontent.com/aslamkd/appdata/refs/heads/main/prdDownloadPass.json")
    .then(r => r.json())
    .then(d => gpPasswords = d)
    .catch(() => {});

  const container = document.createElement("div");
  Object.assign(container.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#fff",
    padding: "10px",
    border: "1px solid #ccc",
    zIndex: 99999,
    fontFamily: "Arial",
    boxShadow: "0 0 8px rgba(0,0,0,.2)"
  });

  container.innerHTML = `
    <select id="gppicker_ext" style="width:200px;margin-bottom:5px">
      <option value="0" data-boundary-id="">Select GP</option>
      <option value="6" data-boundary-id="839">KARIMPUR-I</option>
      <option value="6" data-boundary-id="840">KARIMPUR-II</option>
      <option value="6" data-boundary-id="841">JAMSHERPUR</option>
      <option value="6" data-boundary-id="842">MAGHUGARI</option>
      <option value="6" data-boundary-id="843">HOGALBARIA</option>
      <option value="6" data-boundary-id="844">PIPULBERIA</option>
      <option value="6" data-boundary-id="845">HAREKRISHNAPUR</option>
      <option value="6" data-boundary-id="846">SHIKARPUR</option>
    </select>
    <button id="downloadSurveyCsv" style="width:200px">⬇ Download Survey CSV</button>

    <div id="progressBar" style="display:none;margin-top:5px;height:20px;background:#eee;position:relative">
      <div id="progressFill" style="height:100%;width:0;background:#28a745"></div>
      <div id="progressText" style="position:absolute;left:5px;top:0;font-size:12px"></div>
    </div>
  `;

  document.body.appendChild(container);

  document.getElementById("downloadSurveyCsv").onclick = async function () {

    const pageSelect = document.querySelector(".boundaryidpicker2#gppicker");
    const extSelect = document.getElementById("gppicker_ext");

    if (!pageSelect || pageSelect.value !== extSelect.value) {
      alert("⛔ GP selection mismatch");
      return;
    }

    const opt = pageSelect.selectedOptions[0];
    const boundaryID = opt.getAttribute("data-boundary-id");
    const boundaryLevelID = opt.value;

    if (!boundaryID) {
      alert("❗ Select GP");
      return;
    }

    if (gpPasswords[boundaryID]) {
      const p = prompt("🔒 Enter password");
      if (p !== gpPasswords[boundaryID]) {
        alert("❌ Wrong password");
        return;
      }
    }

    const progressBar = document.getElementById("progressBar");
    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");

    progressBar.style.display = "block";
    progressFill.style.width = "0%";

    const geoRes = await fetch(
      `https://prdvbdrs.in/getGeoJsonDetails?BoundaryID=${boundaryID}&BoundaryLevelID=${boundaryLevelID}`,
      { headers: { "x-requested-with": "XMLHttpRequest" } }
    );

    const geoData = await geoRes.json();
    const features = JSON.parse(geoData.geoJson).features;

    const csrfHeader = document.querySelector("meta[name='_csrf_header']")?.content;
    const csrfToken = document.querySelector("meta[name='_csrf']")?.content;
    const contextPath = document.getElementById("contextPath")?.value || "";

    const headers = [
      "survey_id","survey_type_id","district_name","block_name","gram_panchayet_name",
      "gram_sansad_name","para_name","survey_date","family_head_name",
      "family_head_guardian_name","hh_contact_no","total_family_member",
      "is_mosquito_larvae_found","latitude","longitude","surveyor_name","surveyor_contact_no","Map"
    ];

    let csvFiles = [];
    let currentRows = [headers.join(",")];
    let fileIndex = 1;

    for (let i = 0; i < features.length; i++) {
      const f = features[i];

      try {
        const res = await fetch(contextPath + "/getSurveytypeInfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            ...(csrfHeader && csrfToken ? { [csrfHeader]: csrfToken } : {})
          },
          body: new URLSearchParams({
            survey_id: f.properties.survey_id,
            survey_type_id: f.properties.survey_type_id
          })
        });

        const detail = await res.json();
        const h = detail.house || {};

        const lat = h.latitude || "";
        const lng = h.longitude || "";
        const mapLink = lat && lng
          ? `"=HYPERLINK(""https://www.google.com/maps?q=${lat},${lng}"",""View Map"")"`
          : "";

        currentRows.push([
          f.properties.survey_id,
          f.properties.survey_type_id,
          h.district_name||"",
          h.block_name||"",
          h.gram_panchayet_name||"",
          h.gram_sansad_name||"",
          h.para_name||"",
          h.house_survey_date||"",
          h.family_head_name||"",
          h.family_head_guardian_name||"",
          h.hh_contact_no||"",
          h.total_family_member||"",
          h.is_mosquito_larvae_found||"",
          lat,lng,
          h.surveyor_name||"",
          h.surveyor_contact_no||"",
          mapLink
        ].join(","));

        if (currentRows.length === 1201 || i === features.length - 1) {
          csvFiles.push(currentRows.join("\n"));
          currentRows = [headers.join(",")];
        }

      } catch(e) {}

      progressFill.style.width = ((i+1)/features.length*100).toFixed(1)+"%";
      progressText.textContent = `${i+1} / ${features.length}`;

      await new Promise(r => setTimeout(r, 120)); // 🔥 mobile-safe delay
    }

    csvFiles.forEach((content, idx) => {
      const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `survey_${opt.textContent}_${idx+1}.csv`;
      a.click();
    });

    alert(`✅ Downloaded ${csvFiles.length} CSV files`);
  };

})();
