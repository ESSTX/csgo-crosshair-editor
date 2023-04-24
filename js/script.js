var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

const distanceInternal = 5;
var lineLength = 3;

	tcrosshair = false;
	centerDot = false;

	distanceEdit = 1;
	gap = distanceInternal + distanceEdit;
	gapShoot = 0;
	gapShootMax = 20;
	thickness = 0;

	outline_enabled = true;
	outline_size = 0;

	r = 255;
	g = 255;
	b = 255;
	a = 1;
	
	crosshairSize = 100;
	crosshairThick = thickness + 4;
	animtime = 10;
	
	lastTime = 0;
	targetFPS = 60;
	requiredElapsed = 1000 / targetFPS;
	fpsLag = 0;
	fps = 0;
	timeLine = new Array(32).fill(null).map(()=> ({enabled: false, played: false}));
	
	mouseDown = false;
	mouseDownPrev = false;
	nextFire = 0;


function fixCanvas(){
	canvas.width  = $("#canvas").width();
	canvas.height = $("#canvas").height();
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
	ctx.fillRect(x, y, w, h);
}
function lerp(a, b, n) {
	return (b - a) * n + a;
}

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

function updateDrawCrosshair(delta, time){

	crosshairSize = lerp(crosshairSize, lineLength * 3, animtime * delta)
	crosshairThick = lerp(crosshairThick, thickness + 1, animtime * delta)
	gap = lerp(gap, distanceInternal + distanceEdit + (crosshairThick*1.5) - 3 + gapShoot, animtime * delta)

	ctx.fillStyle = '#fff';

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
		drawRect(centerx-crosshairThick/2, centery-crosshairThick/2, crosshairThick*2, crosshairThick*2, color)
	}
	
	if(mouseDown){
		if(!mouseDownPrev){
			mouseDownPrev = true;
			nextFire = time;
			gapShoot = 6;
		}
	}else{mouseDownPrev = false;gapShoot = 0;}
	
	if(mouseDownPrev){

		if(time > nextFire){
			gap = gap + gapShoot;
			nextFire = time + 100;
			if(gapShoot < gapShootMax){
				gapShoot += 2;
			}
		}
	}
	
	console.log(nextFire);
}

requestAnimationFrame(loop);

function loop(now) {
    requestAnimationFrame(loop);
    
    if (!lastTime) { lastTime = now; }
    var elapsed = now - lastTime;

    if (elapsed > requiredElapsed) {
		
		delta = (now - lastTime) / 1000;
		
        updateDrawCrosshair(delta, now);

		if(fpsLag>=10){
			fps = Math.floor(1 /delta);
			fpsLag=0;
		}
		fpsLag++;
		
		ctx.font = "12px JetBrainsMonoNL-Regular";
		ctx.fillText("fps "+fps, 20, 34);
		
        lastTime = now;
    }
    
}

////////////////////////////////////////
//
// Bind colors
//
////////////////////////////////////////
$("#settingsColor").on("input", function(){
	const inputVal = $(this).val();

	r = parseInt(inputVal.substring(1, 3), 16);
	g = parseInt(inputVal.substring(3, 5), 16);
	b = parseInt(inputVal.substring(5, 7), 16);
});
var sliderSettingsAlpha = document.getElementById("settingsAlpha");
sliderSettingsAlpha.addEventListener("input", function() {
	a = Number(sliderSettingsAlpha.value);
	makeConsoleCommands(distanceEdit, a, lineLength);
});
////////////////////////////////////////
//
// Bind Other
//
////////////////////////////////////////
var sliderSettingsGap = document.getElementById("settingsGap");
sliderSettingsGap.addEventListener("input", function() {
	distanceEdit = Number(sliderSettingsGap.value);
	makeConsoleCommands(distanceEdit, a, lineLength);
});

var sliderSettingsLen = document.getElementById("settingsLen");
sliderSettingsLen.addEventListener("input", function() {
	lineLength = Number(sliderSettingsLen.value);
	makeConsoleCommands(distanceEdit, a, lineLength);
});

var sliderSettingsThick = document.getElementById("settingsThick");
sliderSettingsThick.addEventListener("input", function() {
	thickness = Number(sliderSettingsThick.value);
	makeConsoleCommands(distanceEdit, a, lineLength);
});

var sliderSettingsOutlineSize = document.getElementById("settingsOutlineSize");
sliderSettingsOutlineSize.addEventListener("input", function() {
	outline_size = Number(sliderSettingsOutlineSize.value);
	makeConsoleCommands(distanceEdit, a, lineLength);
});

$("#btnCrosshairDot").on("click", function(){
	centerDot = !centerDot;
});
$("#btnCrosshairTShape").on("click", function(){
	tcrosshair = !tcrosshair;
});

$("#btn60fps").on("click", function(){
	targetFPS = 60;
	requiredElapsed = 1000 / targetFPS;
});
$("#btn165fps").on("click", function(){
	targetFPS = 165;
	requiredElapsed = 1000 / targetFPS;
});

$("#canvas").on("mousedown", function(){
	mouseDown = true;
});

$("#canvas").on("mouseup", function(){
	mouseDown = false;
});

function onresize() {
	fixCanvas();
	console.log("lox")
}

window.addEventListener("resize", onresize);
fixCanvas();
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})

makeConsoleCommands(distanceEdit, a, lineLength);