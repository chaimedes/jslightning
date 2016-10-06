var showChannels = false;
var outputDiv = document.getElementById("outbox");
var charges = new Array();
var diminishing = true;

// Divisions of the canvas
var hChannels = 50;
var vChannels = 50;
TS_recharge();

// Set up the context, colors, etc.
function TS_create() {
	
	var drawingCanvas = document.getElementById("canvas1");
	if (drawingCanvas.getContext) {
		// Initaliase a 2-dimensional drawing context
		var context = drawingCanvas.getContext('2d');
		context.strokeStyle="#FFFFFF";
		context.fillStyle="#000000";
		context.shadowBlur=15;
		context.shadowColor="#FFD700";
	}
}

function TS_showChannels(element) {
	if (element.checked) {
		showChannels = true;
	}
	else {
		showChannels = false;
	}
}

function TS_diminishing(element) {
	if (element.checked) {
		diminishing = true;
	}
	else {
		diminishing = false;
	}
}

function TS_recharge() {
	for (var i = 0; i < 50; i++) {
		charges[i] = new Array();
		for (var j = 0; j < 50; j++) {
			charges[i][j] = Math.floor(Math.random()*100);
		}
	}
}

function TS_draw_offshoot(x, y, context, recur, charges, direction) {
	var recurCount = recur+1;
	//var charges = TS_recharge();
	context.beginPath();
	curCharge = 50;
	var newLocX = x;
	var newLocY = y;
	context.moveTo(newLocX*10,newLocY*10);
	var markx = 0;
	var marky = 0;
	while (newLocY < y+10 && newLocY < 50) {
		if (charges[newLocX][newLocY] >= 5) {
			if (diminishing) {
				charges[newLocX][newLocY] -= 5;
			}
			var diffCharge1 = new Array();
			var diffCharge3 = new Array();
			for (var a = 0; a < 5; a++) {
				if (newLocX - a >= 0) { diffCharge1[a] = charges[newLocX-a][newLocY+1] - (curCharge+10-a); }
				diffCharge3[a] = charges[newLocX+a][newLocY+1] - (curCharge+10-a);
				if (direction == 0 && diffCharge3[a] > diffCharge1[a] && newLocX-x<10) {
					newLocX += a+1;
					context.lineTo((newLocX)*10,newLocY*10);
					a = 5;
				}
				if (direction == 1 && diffCharge1[a] > diffCharge3[a] && x-newLocX<10) {
					newLocX -= a+1;
					context.lineTo((newLocX)*10,newLocY*10);
					//TS_log(0,newLocX,newLocY);
					a = 5;
				}
			}
			newLocY = newLocY+1;
			if (Math.floor(Math.random()*10) == 0) {
				markx = newLocX;
				marky = newLocY;
			}
		}
		else {
			newLocY = 50;
		}
	}
	context.stroke();
	context.strokeStyle="#2222FF";
	context.stroke();
	context.strokeStyle="#FFFFFF";
	context.shadowBlur=5;
	context.shadowColor="#FFD700";
	if (recurCount < 3 && markx != 0 && marky != 0) {
		TS_draw_offshoot(markx, marky, context, recurCount, charges, Math.floor(Math.random()*2));
	}
}

/*
TS_draw() 
Draws a lightning strike.
Finds its way through a lightning "channel", seeking the overall path
of highest charge within moving distance (1 step to left, right, or directly downward).
*/
function TS_draw() {
	var recurCount = 3;
	var markx = new Array();
	var marky = new Array();
	for (var go=0; go < 4; go++) {
		markx[go] = 0;
		marky[go] = 0;
	}
	
	// Get canvas ready
	var drawingCanvas = document.getElementById("canvas1");
	var context = drawingCanvas.getContext('2d');
	
	context.fillStyle="#000000";
	context.fillRect(0,0,500,500);
	context.font="6px Arial";
	context.shadowBlur=0;
	context.fillStyle="#FFFFFF";
	
	// Draw the clouds above
	var cloud = context.createLinearGradient(document.getElementById("canvas1").width/2, 0, document.getElementById("canvas1").width/2, 20);
	cloud.addColorStop(0, '#2233FF');
	cloud.addColorStop(0.3, '#AABBDD');
	cloud.addColorStop(0.6, '#5533FF');
	cloud.addColorStop(0.7, '#442299');
	cloud.addColorStop(1, '#000000');
	context.fillStyle=cloud;
	context.fillRect(0,0,document.getElementById("canvas1").width,20);
	context.fill();
	
	// If show channels is marked...
	if (showChannels) {
		// For each horiz channel...
		for (y = 0; y < hChannels; y++) {
			// For each vert channel...
			for (z = 0; z < vChannels; z++) {
				// Show the channel charge.
				context.fillStyle = "#FFFFFF";
				context.fillText(charges[y][z],y*10,z*10);
			}
		}
	} // End of if show channels is marked
	
	context.shadowBlur=5;
	context.beginPath();
	
	curCharge = 50; // Set the starting charge for the strike
	var curLocX = Math.ceil(Math.random()*hChannels-1); // Find a random spot on the ground
	var curLocY = 2 // Start at the top
	context.moveTo(curLocX*10,curLocY*10); // Locate drawing start
	while (curLocY < 50) { // For each channel...
		// If there is sufficient charge to move
		//if (charges[curLocX] == null) { alert(curLocX) }
		if (charges[curLocX][curLocY] >= 10) {
			if (diminishing) { // Decrease charge if "diminishing" is true.
				charges[curLocX][curLocY] -= 10;
			}
			// Find the difference in charge between current spot and three possibilities below.
			if (curLocX > 0) { diffCharge1 = charges[curLocX-1][curLocY+1] - curCharge; }
			diffCharge2 = charges[curLocX][curLocY+1] - curCharge;
			diffCharge3 = charges[curLocX+1][curLocY+1] - curCharge;
			// Move down no matter what.
			curLocY += 1;
			// If charge to the right is greater, move to that rightward channel.
			if (diffCharge3 >= diffCharge2 && diffCharge3 >= diffCharge1) {
			curLocX += 1;
			}
			// If charge to the left is greater, move to the leftward channel.
			if (diffCharge1 >= diffCharge2 && diffCharge1 >= diffCharge3) {
			curLocX -= 1;
			}
			// Draw line to follow movement
			context.lineTo(curLocX*10,curLocY*10);
			document.getElementById("marking").textContent="false";
			document.getElementById("markx").textContent = "N/A";
			document.getElementById("marky").textContent = "N/A";
			for (var go=0; go < 4; go++) {
				if (Math.floor(Math.random()*10) == 0 && (markx[go]==0 || marky[go]==0)) {
					markx[go] = curLocX;
					marky[go] = curLocY;
					document.getElementById("marking").textContent="true";
					document.getElementById("markx").textContent = markx[go];
					document.getElementById("marky").textContent = marky[go];
				}
			}
			//context.moveTo(curLocX*10,curLocY*10);
		}
		else {
			curLocY = 50;
		}
	}
	context.stroke();
	context.strokeStyle="#2222FF";
	context.stroke();
	context.strokeStyle="#FFFFFF";
	context.shadowBlur=5;
	context.shadowColor="#FFD700";
	
	// To show impact point -- under construction.
	/* 
	context.beginPath();
	//context.moveTo(curLocX*10, curLocY*10);
	context.arc(curLocX*10, document.getElementById("canvas1").height+3, 10, 0, 1*Math.PI, true);
	//alert(curLocX + "," + curLocY);
	var grd = context.createRadialGradient(curLocX*10, document.getElementById("canvas1").height, 0, curLocX*10, document.getElementById("canvas1").height, 10);
    grd.addColorStop(0, '#8ED6FF');
    grd.addColorStop(1, '#004CB3');
	context.fillStyle = grd;
	//context.fillStyle = "rgb(255, 0, 0)";
    context.fill();
	*/
	
	for (var done = 0; done < 4; done++) {
		if (markx[done] != 0 && marky[done] != 0) {
			TS_draw_offshoot(markx[done], marky[done], context, recurCount, charges, Math.floor(Math.random()*2));
		}
	}
}