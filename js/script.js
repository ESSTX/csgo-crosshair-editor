var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

function fixCanvas(){
	canvas.width  = $("#myCanvas").width();
	canvas.height = $("#myCanvas").height();
}

function drawLine(x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.moveTo(x1+0.5, y1+0.5); //+0.5 cuz this stupid canvas..
  ctx.lineTo(x2+0.5, y2+0.5);
  ctx.stroke();
}

function drawRect(x, y, w, h, color) {
	ctx.fillStyle = color;
	ctx.rect(x, y, w, h);
	ctx.fill();
}

function lerp(a, b, n) {
	return (b - a) * n + a;
}

var lineLength = 3;
const distanceInternal = 5;

var tcrosshair = false;

var centerDot = true;

var distanceEdit = 1;
var gap = distanceInternal + distanceEdit;
var thickness = 0;

var outline_enabled = true;
var outline_size = 0;

var r = 255;
var g = 255;
var b = 255;
var a = 1;

var animGapSize = 0;

function makeConsoleCommands(gap, alpha, size){
	let cl_crosshairgap = 'cl_crosshairgap "'+gap+'";';
	let cl_crosshaircolor_r = 'cl_crosshaircolor_r "'+r+'";';
	let cl_crosshaircolor_g = 'cl_crosshaircolor_g "'+g+'";';
	let cl_crosshaircolor_b = 'cl_crosshaircolor_b "'+b+'";';
	let cl_crosshairalpha = 'cl_crosshairalpha "'+Math.floor(alpha*255)+'";';
	let cl_crosshairsize = 'cl_crosshairsize "'+size+'";'; 
	let cl_crosshairthickness = 'cl_crosshairthickness "'+thickness+'";';
	let cl_crosshair_outlinethickness = 'cl_crosshair_outlinethickness "'+outline_size+'";';
	$("#result-output").text( cl_crosshairgap +" "+ cl_crosshaircolor_r +" "+ cl_crosshaircolor_g +" "+ cl_crosshaircolor_b +" "+ cl_crosshairalpha +" "+ cl_crosshairsize +" "+ cl_crosshairthickness +" "+ cl_crosshair_outlinethickness );
}
let crosshairSize = 100;
let crosshairThick = thickness + 4;
let animtime = 10;
function updateDrawCrosshair(delta){
    "use strict";
	// This is the distance of the line from the center
	
	//let crosshairSize = lineLength * 3;
	
	// Now its lerped :D
	crosshairSize = lerp(crosshairSize, lineLength * 3, animtime * delta)
	//console.log(crosshairSize);
	
	crosshairThick = lerp(crosshairThick, thickness + 1, animtime * delta)
	//console.log(crosshairThick);
	
	gap = lerp(gap, distanceInternal + distanceEdit + (crosshairThick*1.5) - 3, animtime * delta)
	
	//let crosshairThick = thickness + 1;
	//let crosshairOutThick = outline_size + 1;
	//gap = distanceInternal + distanceEdit + (crosshairThick*1.5) - 3;

	// Draw something on the canvas
	ctx.fillStyle = '#fff';

	// Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
  
	let centerx = Number(canvas.width/2);
	let centery = Number(canvas.height/2);
	
	let color = "rgba("+r+","+g+","+b+","+a+")";
	let blackcolor = "rgba(0,0,0,0.8)";


	if(outline_enabled){
		//drawRect(centerx - crosshairSize - gap - (outline_size/2), centery-(crosshairThick/2) - (outline_size/2), crosshairSize+1+outline_size, crosshairThick+2+outline_size, "rgba(0,0,0,0.8)")
		drawLine(centerx - crosshairSize - gap - outline_size, centery, centerx - gap + outline_size, centery, blackcolor, (crosshairThick*3)-2 + outline_size + 2);
		drawLine(centerx + gap - outline_size, centery, centerx + crosshairSize + gap + outline_size, centery, blackcolor, (crosshairThick*3)-2 + outline_size + 2);
		if(!tcrosshair){ drawLine(centerx, centery - crosshairSize - gap - outline_size, centerx, centery - gap + outline_size, blackcolor, (crosshairThick*3)-2 + outline_size + 2); }
		drawLine(centerx, centery + gap - outline_size, centerx, centery + crosshairSize + gap + outline_size, blackcolor, (crosshairThick*3)-2 + outline_size + 2);
	}

	// Left
	drawLine(centerx - crosshairSize - gap, centery, centerx - gap, centery, color, (crosshairThick*3)-2);
	// Right
	drawLine(centerx + gap, centery, centerx + gap + crosshairSize, centery, color, (crosshairThick*3)-2);
	// Top
	if(!tcrosshair){ drawLine(centerx, centery - crosshairSize - gap, centerx, centery - gap, color, (crosshairThick*3)-2); }
	// Bottom
	drawLine(centerx, centery + gap, centerx, centery + gap + crosshairSize, color, (crosshairThick*3)-2);
	
	if(centerDot){
		//drawRect(centerx-crosshairThick/2, centery-crosshairThick/2, crosshairThick*2, crosshairThick*2, color)
	}
	
	makeConsoleCommands(distanceEdit, a, lineLength);
}

var lastTime;
var requiredElapsed = 1000 / 60; // desired interval is 10fps

requestAnimationFrame(loop);

function animGap(delta){
	if(animGapSize > 0){
		animGapSize -= 10 * delta;
	}
}

var fpsLag = 0;
var fps = 0;


function loop(now) {
    requestAnimationFrame(loop);
    
    if (!lastTime) { lastTime = now; }
    var elapsed = now - lastTime;

    if (elapsed > requiredElapsed) {
		
		delta = (now - lastTime) / 1000;
		
        updateDrawCrosshair(delta);

		if(fpsLag>=10){
			fps = Math.floor(1 /delta);
			fpsLag=0;
		}
		fpsLag++;
		
		ctx.font = "12px JetBrainsMonoNL-Regular";
		ctx.fillText("fps "+fps, 20, 20);
		
		//animGap(delta);
		
		//console.log(1/delta);
        lastTime = now;
    }
    
}
animGapSize = 20;
////////////////////////////////////////
//
// Bind colors
//
////////////////////////////////////////
var sliderSettingsRed = document.getElementById("settingsRed");
sliderSettingsRed.addEventListener("input", function() {
	r = Number(sliderSettingsRed.value);
	console.log(a);
	//updateDrawCrosshair();
});
var sliderSettingsGreen = document.getElementById("settingsGreen");
sliderSettingsGreen.addEventListener("input", function() {
	g = Number(sliderSettingsGreen.value);
	console.log(a);
	//updateDrawCrosshair();
});
var sliderSettingsBlue = document.getElementById("settingsBlue");
sliderSettingsBlue.addEventListener("input", function() {
	b = Number(sliderSettingsBlue.value);
	console.log(a);
	//updateDrawCrosshair();
});
var sliderSettingsAlpha = document.getElementById("settingsAlpha");
sliderSettingsAlpha.addEventListener("input", function() {
	a = Number(sliderSettingsAlpha.value);
	console.log(a);
	//updateDrawCrosshair();
});
////////////////////////////////////////
//
// Bind Other
//
////////////////////////////////////////
var sliderSettingsGap = document.getElementById("settingsGap");
sliderSettingsGap.addEventListener("input", function() {
	distanceEdit = Number(sliderSettingsGap.value);
	//updateDrawCrosshair();
});

var sliderSettingsLen = document.getElementById("settingsLen");
sliderSettingsLen.addEventListener("input", function() {
	lineLength = Number(sliderSettingsLen.value);
	//updateDrawCrosshair();
});

var sliderSettingsThick = document.getElementById("settingsThick");
sliderSettingsThick.addEventListener("input", function() {
	thickness = Number(sliderSettingsThick.value);
	//updateDrawCrosshair();
});

var sliderSettingsOutlineSize = document.getElementById("settingsOutlineSize");
sliderSettingsOutlineSize.addEventListener("input", function() {
	outline_size = Number(sliderSettingsOutlineSize.value);
	//updateDrawCrosshair();
});

$("#btnCrosshairDot").on("click", function(){
	centerDot = !centerDot;
});
$("#btnCrosshairTShape").on("click", function(){
	tcrosshair = !tcrosshair;
});

function onresize() {
	fixCanvas();
	//updateDrawCrosshair()
	console.log("lox")
}
window.addEventListener("resize", onresize);
fixCanvas();
//updateDrawCrosshair()

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})