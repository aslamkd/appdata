$(document).on('change', '.get-boundary-dropdown', function(e) {
	e.stopPropagation();

	var boundary_level_id = $(this).val(); // Get the selected value
	var boundary_id = $(this).find('option:selected').data("boundary-id");
	var boundary_level_name = "";
	var div_id = $(this).data('boundary-div-id');
	var boundary_select_id = "";
	if (div_id == 1) {
		boundary_level_name = "Block"
		boundary_select_id = "blockpicker";
	}
	else if (div_id == 2) {
		boundary_level_name = "GP"
		boundary_select_id = "gppicker";
	}

	/*console.log("Selected Value:", boundary_level_id);
	console.log("Selected Label:", boundary_level_name);
	console.log("Selected Label:", div_id);
		console.log("Selected Label:", boundary_id);*/
	/*var from_year = $('#yearpicker1 option:selected').val();*/

	do {
		if (boundary_level_id == 0) {
			Swal.fire({
				title: "failure",
				text: "",
				icon: "warning"
			});
			break;
		}

		else {
			var contextPath = document.getElementById("contextPath").value;

			$("#divLoader").show();
			$("#divLoading").addClass('show');

			var csrfHeader = $("meta[name='_csrf_header']").attr("content");
			var csrfToken = $("meta[name='_csrf']").attr("content");

			$.get
				({
					url: contextPath + "/getmainMapSurveyDetailsajax",
					data: {
						boundary_level_id: boundary_level_id,
						boundary_level_name: boundary_level_name,
						boundary_id: boundary_id,
						boundary_select_id: boundary_select_id
					},

					beforeSend: function(xhr) {
						xhr.setRequestHeader(
							csrfHeader, csrfToken);
					},
					success: function(data) {
						//console.log(data)
						$("#divLoader").hide();
						if (div_id == 1) {

							$("#block_drop_down_div").html();

							$("#block_drop_down_div").html(data);
						}
						else if (div_id == 2) {

							$("#gp_drop_down_div").html();

							$("#gp_drop_down_div").html(data);
						}


						/*var saveGPProvileMsg = document.getElementById("saveGPProvileMsg").value;
		
						if (saveGPProvileMsg != "") {
							Swal.fire({
								text: saveGPProvileMsg
							});
						}*/
					},
					failure: function(data) {
						//console.log(data);
					}
				});
		}
	}
	while (false);
});

$('#btn_search_details').on('click', function(e) {
	e.stopPropagation();
	debugger
	var block_name = $('#blockpicker option:selected').val();
	var gp_name = $('#gppicker option:selected').val();
	var district_name = $('#districtpicker option:selected').val();
	var district_boundary_level_id = $('#districtpicker option:selected').val();
	var district_boundary_id = $('#districtpicker option:selected').data('boundary-id');
	//$('.boundaryidpicker option:selected').val();
	var block_boundary_level_id = $('#blockpicker option:selected').val();
	var block_boundary_id = $('#blockpicker option:selected').data('boundary-id');
	//$('.boundaryidpicker1 option:selected').val();
	var gp_boundary_level_id = $('#gppicker option:selected').val();
	var gp_boundary_id = $('#gppicker option:selected').data('boundary-id');
	//$('.boundaryidpicker2 option:selected').val();
	console.log("district_name " + district_name)
	console.log("block_name " + block_name)
	console.log("gp_name " + gp_name)

	if (gp_name == 0 && block_name != 0) {
		boundary_level_id = block_boundary_level_id;
		boundary_id = block_boundary_id;
	}
	else if (block_name == 0 && gp_name == 0 || block_name == 0) {
		boundary_level_id = district_boundary_level_id;
		boundary_id = district_boundary_id;
	}
	else {
		boundary_level_id = gp_boundary_level_id;
		boundary_id = gp_boundary_id;
	}

	console.log("boundary_id " + boundary_id)
	console.log("boundary_level_id " + boundary_level_id)
	/*var district_name = $('#districtpicker option:selected').val();
	var block_name = $('#blockpicker option:selected').val();*/
	/*var boundary_level_id = $('#gppicker option:selected').val();
	//var boundary_id = $(this).find(':selected').data('data-boundary-id')
	var boundary_id = $('#gppicker option:selected').data('boundary-id');
	//var boundary_id = $(this).find(':selected').attr('data-boundary-id').val();*/
	/*var period_type_id = $('#Periodpicker option:selected').val();
	var day = $('#daypicker option:selected').val();
	var forthnight = $('#Fortnightpicker option:selected').val();
	var month = $('#monthpicker option:selected').val();
	var year = $('#yearpicker1 option:selected').val();
	console.log("boundary_id "+boundary_id)
	console.log("boundary_level_id "+boundary_level_id)
	//console.log(gp_name)
	console.log(day)
	if(period_type_id == 1)
	{
		period_value = day;
	}
	else if(period_type_id == 3)
	{
		period_value = forthnight;
	}
	else if(period_type_id == 4)
	{
		period_value = month;
	}
	else if(period_type_id == 5)
	{
		period_value = year;
	}
	else
	{
		period_value = 0;
	}*/
	do {
		if (district_name == 0) {
			Swal.fire({
				title: "failure",
				text: "Please selet District",
				icon: "warning"
			});
			break;
		}
		else if (block_name == 0) {
			Swal.fire({
				title: "failure",
				text: "Please selet Block",
				icon: "warning"
			});
			break;
		}
		else if (gp_name == 0) {
			Swal.fire({
				title: "failure",
				text: "Please selet Block",
				icon: "warning"
			});
			break;
		}

		else {
			var contextPath = document.getElementById("contextPath").value;

			$("#divLoader").show();
			$("#divLoading").addClass('show');

			var csrfHeader = $("meta[name='_csrf_header']").attr("content");
			var csrfToken = $("meta[name='_csrf']").attr("content");
			var contextPath = document.getElementById("contextPath").value;
			function clearMap() {
				const layers = ['DistrictBoundary-layer-line', 'clusters', 'cluster-count', 'unclustered-point', 'clusterspopup'];
				const sources = ['DistrictBoundary', 'earthquakes'];

				layers.forEach((layer) => {
					if (map_Main.getLayer(layer)) {
						map_Main.removeLayer(layer);
					}
				});

				sources.forEach((source) => {
					if (map_Main.getSource(source)) {
						map_Main.removeSource(source);
					}
				});
			}

			clearMap();

			$.get({
				url: contextPath + '/getBlockBoundaryDetails',
				data: {},
				beforeSend: function(xhr) {
					xhr.setRequestHeader(csrfHeader, csrfToken);
				},
				success: function(data) {
					$("#divLoader").hide();


					const stateBoundaryObject = JSON.parse(data);

					map_Main.addSource("DistrictBoundary", {
						type: "geojson",
						lineMetrics: true,
						data: stateBoundaryObject,
					});

					map_Main.addLayer({
						id: "DistrictBoundary-layer-line",
						type: "line",
						source: "DistrictBoundary",
						paint: {
							"line-color": "#F3E754",
							"line-width": 2,
						},
					});

					map_Main.on("click", "DistrictBoundary-layer", function(e) {
						var lngLat = e.lngLat;
						if (e.features.length > 0) {
							if (hoveredStateId) {
								map_Main.setFeatureState(
									{ source: "DistrictBoundary", id: hoveredStateId },
									{ hover: false }
								);
							}
							hoveredStateId = e.features[0].id;
							map_Main.setFeatureState(
								{ source: "DistrictBoundary", id: hoveredStateId },
								{ hover: true }
							);

							var htmltxt =
								'<div class="info-box">' +
								'<span class="info-box-icon bg-success"><i class="fa fa-map-marker"></i></span>' +
								'<div class="info-box-content">' +
								'<span class="info-box-text map-popup-txt">District Name</span>' +
								'<span class="info-box-number map-popup-txt">' +
								e.features[0].properties.DIST_NAME +
								"</span>" +
								"</div></div>";
							currentPopup = new mapboxgl.Popup()
								.setLngLat(lngLat)
								.setHTML(htmltxt)
								.addTo(map_Main);
						}
					});

					setTimeout(function() {
					}, 2000);

					$.get({
						url: contextPath + '/getGeoJsonDetails',


						data: {
							BoundaryID: boundary_id,
							BoundaryLevelID: boundary_level_id
						},
						beforeSend: function(xhr) {
							xhr.setRequestHeader(csrfHeader, csrfToken);
						},
						success: function(data) {
							const jsonObject = JSON.parse(data.geoJson);
							console.log(jsonObject)

							// Function to get CSS variable value
							function getCssVariableValue(className, variableName) {
								const tempElement = document.createElement('div');
								tempElement.className = className;
								document.body.appendChild(tempElement);
								const value = getComputedStyle(tempElement).getPropertyValue(variableName);
								document.body.removeChild(tempElement);
								return value.trim();
							}
							// Extract colors from CSS classes
							const clusterColors = {
								1: getCssVariableValue('color-cluster-1', '--color'),
								2: getCssVariableValue('color-cluster-2', '--color'),
								3: getCssVariableValue('color-cluster-3', '--color')
							};

							// Extract colors from CSS classes
							const surveyTypeColors = {
								1: getCssVariableValue('color-survey-type-1', '--color'),
								2: getCssVariableValue('color-survey-type-2', '--color'),
								default: getCssVariableValue('color-default', '--color')
							};

							map_Main.addSource("earthquakes", {
								type: "geojson",
								data: jsonObject,
								cluster: true,
								clusterMaxZoom: 14,
								clusterRadius: 50,
							});

							map_Main.addLayer({
								id: "clusters",
								type: "circle",
								source: "earthquakes",
								filter: ["has", "point_count"],
								paint: {
									"circle-color": [
										"step",
										["get", "point_count"],
										clusterColors[1],  // Color for up to 100 points
										100,
										clusterColors[2],  // Color for 100 to 749 points
										750,
										clusterColors[3],  // Color for 750+ points
									],
									"circle-radius": [
										"step",
										["get", "point_count"],
										20,
										100,
										30,
										750,
										40,
									],
								},
							});

							map_Main.addLayer({
								id: "cluster-count",
								type: "symbol",
								source: "earthquakes",
								filter: ["has", "point_count"],
								layout: {
									"text-field": ["get", "point_count_abbreviated"],
									"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
									"text-size": 12,
								},
							});

							map_Main.addLayer({
								id: "unclustered-point",
								type: "circle",
								source: "earthquakes",
								filter: ["!", ["has", "point_count"]],

								paint: {
									"circle-color": [
										"match",
										["get", "survey_type_id"],
										1, surveyTypeColors[1],
										2, surveyTypeColors[2],
										surveyTypeColors.default
									],
									"circle-radius": 8,
									"circle-stroke-width": 1,
									"circle-stroke-color": "#fff",
								},
							});
							

							// Inspect a cluster on click
							/*map_Main.on("click", "clusterspopup", function(e) {
								clearMap();
								const features = map_Main.queryRenderedFeatures(e.point, { layers: ["clusterspopup"] });
								const clusterId = features[0].properties.cluster_id;
								map_Main.getSource("earthquakes").getClusterExpansionZoom(clusterId, function(err, zoom) {
									if (err) return;
									map_Main.easeTo({
										center: features[0].geometry.coordinates,
										zoom: zoom,
									});
								});
							});*/

							// Open popup for each unclustered point
							map_Main.on("click", "unclustered-point", function(e) {
								const features = map_Main.queryRenderedFeatures(e.point, { layers: ["unclustered-point"] });
								features.forEach(function(feature) {
									/*const featureCoordinates = feature.geometry.coordinates;*/

									callSurveydetails(feature.properties.survey_id, feature.properties.survey_type_id);
									console.log(feature.properties.survey_id, feature.properties.survey_type_id);

								});

							});

							map_Main.on("mouseenter", "clusters", () => {
								map_Main.getCanvas().style.cursor = "pointer";
							});

							map_Main.on("mouseleave", "clusters", () => {
								map_Main.getCanvas().style.cursor = "";
							});
						},
						error: function(xhr, status, error) {
							// Handle error
						},
						complete: function() {
							$("#mapMainLoader").hide();
						}
					});
				},
				error: function(xhr, status, error) {
					// Handle error
				}
			});
		}
	}
	while (false);
});




$(document).ready(function() {
	//mapboxgl.accessToken = 'pk.eyJ1IjoiaW5kcmFuaWwtdnlvbWEiLCJhIjoiY2tnZ2t0eHI2MXJ1ZTJxcWFkdXJjdXB3dSJ9.lnMLM7Z5mAskoFJAUgr0gw';
	mapboxgl.accessToken = 'pk.eyJ1IjoicHJkdmJkcnMiLCJhIjoiY2x2eHN5dXFzMDN6NDJqcXlqa2hzZjNlYiJ9.xPMlj7e_BLsAgW3t3fYkIQ';
	map_Main = new mapboxgl.Map({
		container: 'map_Main', // container ID
		style: 'mapbox://styles/mapbox/satellite-v9', // style URL for Satellite
		projection: 'globe', // Display the map as a globe
		center: [88.3864, 22.4815], // starting position [lng, lat]
		zoom: 5, // starting zoom
		renderWorldCopies: false,
	});
	map_Main.addControl(new mapboxgl.FullscreenControl());
});

/*const popupContent = `<div class="mapbox-popup-content">
						<h4><strong>Environment Survey </strong></h4>
						<p><strong>District Name:</strong> ${feature.properties.district_name}</p>
						<p><strong>Block Name:</strong> ${feature.properties.block_name}</p>
								<p><strong>Gram Panchayet Name:</strong> ${feature.properties.gram_panchayet_name}</p>
								<p><strong>Gram Sansad Name:</strong> ${feature.properties.gram_sansad_name}</p>
								<p><strong>Para Name:</strong> ${feature.properties.para_name}</p>
								 <p><strong>Survey Possible?</strong> ${feature.properties.is_survey_possible}</p>
								<p><strong>Environment Survey Code:</strong> ${feature.properties.environment_survey_code}</p>
								<p><strong>Environment Survey Date:</strong> ${feature.properties.environment_survey_date}</p>
								<p><strong>Larvae Status</strong> ${feature.properties.larvae_status}</p>
								<p><strong>Owership:</strong> ${feature.properties.ownership}</p>
								<p><strong>Landmark Location:</strong> ${feature.properties.landmark_location}</p>
								<p><strong>Surveyor name:</strong> ${feature.properties.surveyor_name}</p>
								<p><strong>Surveyor contact no:</strong> ${feature.properties.surveyor_contact_no}</p>
				  
							 </div>`;*/


function toTitleCase(str) {
	return str.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}
function extractUniqueValues(data, property) {
	var values = [];
	data.forEach(function(feature) {
		var value = feature[property];
		if (values.indexOf(value) === -1) {
			values.push(value);
		}
	});
	return values;
}


function callSurveydetails(survey_id, survey_type_id) {
	$("#divLoader").show();
	$("#divLoading").addClass('show');
	var contextPath = document.getElementById("contextPath").value;
	survey_id = parseInt(survey_id);
	survey_type_id = parseInt(survey_type_id)
	/*console.log("x is" +x)
	console.log("y is" +y)*/
	console.log("survey_id is" + survey_id)
	var csrfHeader = $("meta[name='_csrf_header']").attr("content");
	var csrfToken = $("meta[name='_csrf']").attr("content");

	$.post
		({
			url: contextPath + '/getSurveytypeInfo',
			data:
			{
				survey_type_id: survey_type_id,
				survey_id: survey_id
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader(csrfHeader, csrfToken);
			},
			success: function(data) {
				$("#divLoader").hide();
				console.log(data)
				if (survey_type_id == 1) {

					// Declare currentPopup outside the event handler to ensure it can be accessed globally within the script
					let currentPopup = null;

					// Remove previous pop-up if it exists before opening a new one
					map_Main.off("click", "unclustered-point");

					map_Main.on("click", "unclustered-point", function(e) {
						const features = map_Main.queryRenderedFeatures(e.point, { layers: ["unclustered-point"] });

						features.forEach(function(feature) {
							const featureCoordinates = feature.geometry.coordinates;

							// Check if there is already an existing popup, and remove it
							if (currentPopup) {
								currentPopup.remove();  // Remove the previous pop-up
							}

							// Create new pop-up content
							const popupContent = `<div class="mapbox-popup-content">
            <h4><strong>House Survey</strong></h4>
            <p><strong>District Name:</strong> ${data.house.district_name}</p>
            <p><strong>Block Name:</strong> ${data.house.block_name}</p>
            <p><strong>Gram Panchayet Name:</strong> ${data.house.gram_panchayet_name}</p>
            <p><strong>Gram Sansad Name:</strong> ${data.house.gram_sansad_name}</p>
            <p><strong>Para Name:</strong> ${data.house.para_name}</p>
            <p><strong>Survey Possible ?</strong> ${data.house.is_survey_possible}</p>
            <p><strong>Survey Date:</strong> ${data.house.house_survey_date}</p>
            <p><strong>Family Head Name:</strong> ${data.house.family_head_name}</p>
            <p><strong>Family Head Contact No:</strong> ${data.house.hh_contact_no}</p>
            <p><strong>Total Family Member:</strong> ${data.house.total_family_member}</p>
            <p><strong>Surveyor Name:</strong> ${data.house.surveyor_name}</p>
            <p><strong>Surveyor Contact No:</strong> ${data.house.surveyor_contact_no}</p>
        </div>`;

							// Create new pop-up
							currentPopup = new mapboxgl.Popup()
								.setLngLat(featureCoordinates)
								.setHTML(popupContent)
								.addTo(map_Main);

							// Get the close button element from the pop-up
							var closeButton = currentPopup._content.querySelector('.mapboxgl-popup-close-button');

							// Function to close the popup programmatically
							function closePopup() {
								currentPopup.remove();
							}

							// Bind close button to the closePopup function
							$(closeButton).on('click', closePopup);

							// Apply custom styles to the close button
							closeButton.style.background = 'red';
							closeButton.style.zIndex = '99999';
							closeButton.style.width = '30px';
							closeButton.style.height = '30px';
							closeButton.style.fontSize = '24px';
						});
					});

				}
				else {
					// Declare currentPopup outside the event handler to ensure it can be accessed globally within the script
					let currentPopup = null;

					// Remove previous pop-up if it exists before opening a new one
					map_Main.off("click", "unclustered-point");

					map_Main.on("click", "unclustered-point", function(e) {
						const features = map_Main.queryRenderedFeatures(e.point, { layers: ["unclustered-point"] });

						features.forEach(function(feature) {
							const featureCoordinates = feature.geometry.coordinates;

							// Check if there is already an existing popup, and remove it
							if (currentPopup) {
								currentPopup.remove();  // Remove the previous pop-up
							}

							// Create new pop-up content
							const popupContent = `<div class="mapbox-popup-content">
				  	<h4><strong>Environment Survey </strong></h4>
				  	<p><strong>District Name:</strong> ${feature.properties.district_name}</p>
				  	<p><strong>Block Name:</strong> ${feature.properties.block_name}</p>
			                    <p><strong>Gram Panchayet Name:</strong> ${feature.properties.gram_panchayet_name}</p>
			                    <p><strong>Gram Sansad Name:</strong> ${feature.properties.gram_sansad_name}</p>
			                    <p><strong>Para Name:</strong> ${feature.properties.para_name}</p>
			                     <p><strong>Survey Possible?</strong> ${feature.properties.is_survey_possible}</p>
			                    <p><strong>Environment Survey Code:</strong> ${feature.properties.environment_survey_code}</p>
			                    <p><strong>Environment Survey Date:</strong> ${feature.properties.environment_survey_date}</p>
			                    <p><strong>Larvae Status</strong> ${feature.properties.larvae_status}</p>
			                    <p><strong>Owership:</strong> ${feature.properties.ownership}</p>
			                    <p><strong>Landmark Location:</strong> ${feature.properties.landmark_location}</p>
			                    <p><strong>Surveyor name:</strong> ${feature.properties.surveyor_name}</p>
			                    <p><strong>Surveyor contact no:</strong> ${feature.properties.surveyor_contact_no}</p>
                  
               		 </div>`;

							// Create new pop-up
							currentPopup = new mapboxgl.Popup()
								.setLngLat(featureCoordinates)
								.setHTML(popupContent)
								.addTo(map_Main);

							// Get the close button element from the pop-up
							var closeButton = currentPopup._content.querySelector('.mapboxgl-popup-close-button');

							// Function to close the popup programmatically
							function closePopup() {
								currentPopup.remove();
							}

							// Bind close button to the closePopup function
							$(closeButton).on('click', closePopup);

							// Apply custom styles to the close button
							closeButton.style.background = 'red';
							closeButton.style.zIndex = '99999';
							closeButton.style.width = '30px';
							closeButton.style.height = '30px';
							closeButton.style.fontSize = '24px';
						});
					});

				}


			},
			error: function(xhr, status, error) {
				console.error("Request failed: " + status + ", " + error);
				// Handle the failure case here, e.g., show an error message
			}
		});
}






$(document).ready(function() {
	debugger
	var contextPath = document.getElementById("contextPath").value;
	var boundaryLevelID = document.getElementById("boundaryLevelID").value;
	console.log(boundaryLevelID)
	if (boundaryLevelID == 6) {
		$("#divLoader").show();
		$("#divLoading").addClass('show');

		var csrfHeader = $("meta[name='_csrf_header']").attr("content");
		var csrfToken = $("meta[name='_csrf']").attr("content");
		var contextPath = document.getElementById("contextPath").value;
		function clearMap() {
			const layers = ['DistrictBoundary-layer-line', 'clusters', 'cluster-count', 'unclustered-point'];
			const sources = ['DistrictBoundary', 'earthquakes'];

			layers.forEach((layer) => {
				if (map_Main.getLayer(layer)) {
					map_Main.removeLayer(layer);
				}
			});

			sources.forEach((source) => {
				if (map_Main.getSource(source)) {
					map_Main.removeSource(source);
				}
			});
		}

		//clearMap();

		$.get({
			url: contextPath + '/getBlockBoundaryDetails',
			data: {},
			beforeSend: function(xhr) {
				xhr.setRequestHeader(csrfHeader, csrfToken);
			},
			success: function(data) {
				$("#divLoader").hide();


				const stateBoundaryObject = JSON.parse(data);

				map_Main.addSource("DistrictBoundary", {
					type: "geojson",
					lineMetrics: true,
					data: stateBoundaryObject,
				});

				map_Main.addLayer({
					id: "DistrictBoundary-layer-line",
					type: "line",
					source: "DistrictBoundary",
					paint: {
						"line-color": "#F3E754",
						"line-width": 2,
					},
				});

				map_Main.on("click", "DistrictBoundary-layer", function(e) {
					var lngLat = e.lngLat;
					if (e.features.length > 0) {
						if (hoveredStateId) {
							map_Main.setFeatureState(
								{ source: "DistrictBoundary", id: hoveredStateId },
								{ hover: false }
							);
						}
						hoveredStateId = e.features[0].id;
						map_Main.setFeatureState(
							{ source: "DistrictBoundary", id: hoveredStateId },
							{ hover: true }
						);

						var htmltxt =
							'<div class="info-box">' +
							'<span class="info-box-icon bg-success"><i class="fa fa-map-marker"></i></span>' +
							'<div class="info-box-content">' +
							'<span class="info-box-text map-popup-txt">District Name</span>' +
							'<span class="info-box-number map-popup-txt">' +
							e.features[0].properties.DIST_NAME +
							"</span>" +
							"</div></div>";
						currentPopup = new mapboxgl.Popup()
							.setLngLat(lngLat)
							.setHTML(htmltxt)
							.addTo(map_Main);
					}
				});

				setTimeout(function() {
				}, 2000);

				$.get({
					url: contextPath + '/getGeoJsonDetails',


					data: {
						BoundaryID: 0,
						BoundaryLevelID: 0
					},
					beforeSend: function(xhr) {
						xhr.setRequestHeader(csrfHeader, csrfToken);
					},
					success: function(data) {
						const jsonObject = JSON.parse(data.geoJson);
						console.log(jsonObject)

						// Function to get CSS variable value
						function getCssVariableValue(className, variableName) {
							const tempElement = document.createElement('div');
							tempElement.className = className;
							document.body.appendChild(tempElement);
							const value = getComputedStyle(tempElement).getPropertyValue(variableName);
							document.body.removeChild(tempElement);
							return value.trim();
						}
						// Extract colors from CSS classes
						const clusterColors = {
							1: getCssVariableValue('color-cluster-1', '--color'),
							2: getCssVariableValue('color-cluster-2', '--color'),
							3: getCssVariableValue('color-cluster-3', '--color')
						};

						// Extract colors from CSS classes
						const surveyTypeColors = {
							1: getCssVariableValue('color-survey-type-1', '--color'),
							2: getCssVariableValue('color-survey-type-2', '--color'),
							default: getCssVariableValue('color-default', '--color')
						};

						map_Main.addSource("earthquakes", {
							type: "geojson",
							data: jsonObject,
							cluster: true,
							clusterMaxZoom: 14,
							clusterRadius: 50,
						});

						map_Main.addLayer({
							id: "clusters",
							type: "circle",
							source: "earthquakes",
							filter: ["has", "point_count"],
							paint: {
								"circle-color": [
									"step",
									["get", "point_count"],
									clusterColors[1],  // Color for up to 100 points
									100,
									clusterColors[2],  // Color for 100 to 749 points
									750,
									clusterColors[3],  // Color for 750+ points
								],
								"circle-radius": [
									"step",
									["get", "point_count"],
									20,
									100,
									30,
									750,
									40,
								],
							},
						});

						map_Main.addLayer({
							id: "cluster-count",
							type: "symbol",
							source: "earthquakes",
							filter: ["has", "point_count"],
							layout: {
								"text-field": ["get", "point_count_abbreviated"],
								"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
								"text-size": 12,
							},
						});

						map_Main.addLayer({
							id: "unclustered-point",
							type: "circle",
							source: "earthquakes",
							filter: ["!", ["has", "point_count"]],

							paint: {
								"circle-color": [
									"match",
									["get", "survey_type_id"],
									1, surveyTypeColors[1],
									2, surveyTypeColors[2],
									surveyTypeColors.default
								],
								"circle-radius": 8,
								"circle-stroke-width": 1,
								"circle-stroke-color": "#fff",
							},
						});




						// Inspect a cluster on click
						map_Main.on("click", "clusters", function(e) {
							const features = map_Main.queryRenderedFeatures(e.point, { layers: ["clusters"] });
							const clusterId = features[0].properties.cluster_id;
							map_Main.getSource("earthquakes").getClusterExpansionZoom(clusterId, function(err, zoom) {
								if (err) return;
								map_Main.easeTo({
									center: features[0].geometry.coordinates,
									zoom: zoom,
								});
							});
						});

						// Open popup for each unclustered point
						map_Main.on("click", "unclustered-point", function(e) {
							const features = map_Main.queryRenderedFeatures(e.point, { layers: ["unclustered-point"] });
							features.forEach(function(feature) {
								/*const featureCoordinates = feature.geometry.coordinates;*/

								callSurveydetails(feature.properties.survey_id, feature.properties.survey_type_id);
								console.log(feature.properties.survey_id, feature.properties.survey_type_id);

							});

						});

						map_Main.on("mouseenter", "clusters", () => {
							map_Main.getCanvas().style.cursor = "pointer";
						});

						map_Main.on("mouseleave", "clusters", () => {
							map_Main.getCanvas().style.cursor = "";
						});
					},
					error: function(xhr, status, error) {
						// Handle error
					},
					complete: function() {
						$("#mapMainLoader").hide();
					}
				});
			},
			error: function(xhr, status, error) {
				// Handle error
			}
		});
	}
});
