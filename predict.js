let imageLoaded = false;
$("#image-selector").change(function () {
	imageLoaded = false;
	let reader = new FileReader();
	reader.onload = function () {
		let dataURL = reader.result;
		$("#selected-image").attr("src", dataURL);
		$("#prediction-list").empty();
		imageLoaded = true;
	}
	
	let file = $("#image-selector").prop('files')[0];
	reader.readAsDataURL(file);
});

let model;
let modelLoaded = false;
$( document ).ready(async function () {
	modelLoaded = false;
	$('.progress-bar').show();
    console.log( "Loading model..." );
    model = await tf.loadLayersModel('model/model.json');
    console.log( "Model loaded." );
	$('.progress-bar').hide();
	modelLoaded = true;
});

$("#predict-button").click(async function () {
	if (!modelLoaded) { alert("The model must be loaded first"); return; }
	if (!imageLoaded) { alert("Please select an image first"); return; }
	
	let image = $('#selected-image').get(0);
	
	// Pre-process the image
	console.log( "Loading image..." );
	let tensor = tf.browser.fromPixels(image)
		.resizeNearestNeighbor([224, 224]) // change the image size
		.expandDims()
		.toFloat()
		.div(tf.scalar(255.0)); // RGB -> BGR
	let predictions = await model.predict(tensor).data();
	console.log(predictions);
	let top5 = Array.from(predictions)
		.map(function (p, i) { // this is Array.map
			return {
				probability: p,
				className: TARGET_CLASSES[i] // we are selecting the value from the obj
			};
		}).sort(function (a, b) {
			return b.probability - a.probability;
		}).slice(0, 1);

	$("#prediction-list").empty();
	top5.forEach(function (p) {
		$("#prediction-list").append(`<li>${p.className} : ${p.probability.toFixed(2)*100} %</li>`);
		});

	let text;
	if (`${p.className}` == 0) {
		text = "<a href='https://w3schools.com'>Hello</a>";
	} else if (`${p.className}` == 1) {
		text = "<a href='https://www.facebook.com'>a</a>";
	} else if (`${p.className}` == 2) {
		text = "<a href='https://w3schools.com'>b</a>";
	} else if (`${p.className}` == 3) {
		text ="<a href='https://w3schools.com'>Hello</a>";
	} else if (`${p.className}` == 4) {
		text = "<a href='https://www.facebook.com'>1</a>";
	} else if (`${p.className}` == 5) {
		text = "<a href='https://w3schools.com'>2</a>";
	} else if (`${p.className}` == 6) {
		text = "<a href='https://w3schools.com'>3</a>";
	}
	document.getElementById("penanganan").innerHTML = text;
	

});
