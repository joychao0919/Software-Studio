// initialize

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var tempCanvas = document.getElementById("image_temp");
var tempContext = tempCanvas.getContext("2d");

canvas.width = 800; 
canvas.height = 500;

var mouse = false;
ctx.lineJoin = "round";
ctx.lineCap = "round";

var positionX, positionY;

// get elements

var brush = document.getElementById("brush");
var eraser = document.getElementById("eraser");
var color = document.getElementById("myColor");
var size = document.getElementById("myRange");
var reset = document.getElementById("reset");
var saveLink = document.getElementById("saveLink");
var undo = document.getElementById("undo");
var redo = document.getElementById("redo");
var uploadLink = document.getElementById("uploadLink");
var circle = document.getElementById("circle");
var rectangle = document.getElementById("rectangle");
var triangle = document.getElementById("triangle");
var circle_fill = document.getElementById("circle_fill");
var rectangle_fill = document.getElementById("rectangle_fill");
var triangle_fill = document.getElementById("triangle_fill");
var textBox = document.getElementById("textPic");



// initial color

var myColor = color.value;
ctx.strokeStyle = myColor;

// initial size

var mySize = size.value;
ctx.lineWidth = mySize;

var fontSize

function getFontSize() {
    fontSize = document.getElementById("fontSize").value;
}



document.addEventListener("keydown", function(e) {
    if(fontSize==12) {
        ctx.font = "12px Arial";
    }
    if(fontSize==14) {
        ctx.font = "14px Arial";
    }
    if(fontSize==16) {
        ctx.font = "16px Arial";
    }
    if(fontSize==18) {
        ctx.font = "18px Arial";
    }
    if(fontSize==20) {
        ctx.font = "20px Arial";
    }
    if(fontSize==24) {
        ctx.font = "24px Arial";
    }
    if(fontSize==28) {
        ctx.font = "28px Arial";
    }
    if(fontSize==32) {
        ctx.font = "32px Arial";
    }
    if(fontSize==36) {
        ctx.font = "36px Arial";
    }
    
    console.log(fontSize);
    //context.font = "16px Arial";
    //context.fillText(e.key, mouseX, mouseY);

    var textColor = document.getElementById("myColor");
    ctx.fillStyle = textColor.value;
    //tempContext.font = "16px Arial";
    
    if(e.keyCode===8) {
        cUndo();
    }

    else if(e.keyCode===13) {
        mouseX = startingX;
        mouseY += 20;
    } 
    else {
        //tempContext.fillText(e.key, mouseX, mouseY);
        ctx.fillText(e.key, mouseX, mouseY);
        //context.fillText(e.key, mouseX, mouseY);
        mouseX += ctx.measureText(e.key).width;
    }

    
    console.log("type");
    
}, false);

document.addEventListener("keyup", function(e) {
    console.log("keyup");
    cPush();
})


canvas.addEventListener("mousedown", mouseDown, false);
canvas.addEventListener("mousemove", mouseXY, false);
canvas.addEventListener("mouseup", mouseUp, false);

/*
canvas.addEventListener("mousedown", brushDown, false);
canvas.addEventListener("mousemove", brushMove, false);
canvas.addEventListener("mouseup", brushUp, false);
*/

// color

function colorChange() {
    myColor = color.value;
    ctx.strokeStyle = myColor;
}

// size

function sizeChange() {
    mySize = size.value;
    ctx.lineWidth = mySize;
}

// brush

function getCoordinates(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

// variables

var isPen = true;
var isEraser = false;
var isRect = false;
var isCircle = false;
var isTri = false;
var isRectFill = false;
var isCircleFill = false;
var isTriFill = false;
var isText = false;
var hue;

function brushDraw(canvas, positionX, positionY) {
    if(mouse) {
        ctx.lineTo(positionX, positionY);
        ctx.stroke();
        if(isEraser) {
            document.body.style.cursor = 'url("icon.png"),auto';
        }
        else {
            document.body.style.cursor = 'url("brush_cursor.png"),auto';
        } 
    }
}

var tool = 1;

var context;
var undoCanvas, undoCtx;
var startX, endX, startY, endY;
var mouseIsDown = 0;

var mouseX = 0;
var mouseY = 0;
var startingX = 0;
var recentWords = [];
var undoList = [];



    context = canvas.getContext("2d");
    var ctx = canvas.getContext("2d");

    
    // canvas must be filled
    context.fillStyle = '#FFF';
    context.fillRect(0, 0, canvas.width, canvas.height);



    tempCanvas.width = 800;
    tempCanvas.height = 500;

    tempCanvas.addEventListener("mousedown", mouseDown, false);
    tempCanvas.addEventListener("mousemove", mouseXY, false);
    tempCanvas.addEventListener("mouseup", mouseUp, false);


    function mouseDown(eve) {
        if(isPen) {
            mouse = true;
            var coordinates = getCoordinates(canvas, eve);
            document.body.style.cursor = 'url("brush_cursor.png"),auto';
            positionX = coordinates.x;
            positionY = coordinates.y;
            ctx.beginPath();
            ctx.moveTo(positionX, positionY);
            ctx.lineTo(positionX, positionY);
            ctx.stroke();
        }
        else if(isEraser) {
            mouse = true;
            var coordinates = getCoordinates(canvas, eve);
            document.body.style.cursor = 'url("icon.png"),auto';
            positionX = coordinates.x;
            positionY = coordinates.y;
            ctx.beginPath();
            ctx.moveTo(positionX, positionY);
            ctx.lineTo(positionX, positionY);
            ctx.stroke();
        }
        else if(isText) {
            document.body.style.cursor = 'text';
            mouseX = eve.pageX - canvas.offsetLeft;
            mouseY = eve.pageY - canvas.offsetTop;
            startingX = mouseX;
        }
        else {
            mouseIsDown = 1;
            var pos = getMousePos(canvas, eve);
            startX = endX = pos.x;
            startY = endY = pos.y;
            draw(false); //update
            console.log("shape");
        }
    }



function mouseUp(eve) {
    if(isPen || isEraser) {
        mouse = false;
        cPush();
        bIsDrawing = false;
    }
    else {
        if (mouseIsDown !== 0) {
            mouseIsDown = 0;
            var pos = getMousePos(canvas, eve);
            endX = pos.x;
            endY = pos.y;
            draw(true); 
            cPush();
        }
    }
    
}



function mouseXY(eve) {
    if(isPen) {
        var coordinates = getCoordinates(canvas, eve);
        positionX = coordinates.x;
        positionY = coordinates.y;
        //document.body.style.cursor = 'url("brush_cursor.png"),auto';
        brushDraw(canvas, positionX, positionY);
    }
    else if(isEraser) {
        var coordinates = getCoordinates(canvas, eve);
        positionX = coordinates.x;
        positionY = coordinates.y;
        //document.body.style.cursor = 'url("icon.png"),auto';
        brushDraw(canvas, positionX, positionY);
    }
    else if (mouseIsDown !== 0) {
        var pos = getMousePos(canvas, eve);
        endX = pos.x;
        endY = pos.y;
        draw(false);
    }
}


function draw(final) {
    var brushColor = document.getElementById("myColor");
    ctx = final ? context : tempContext;
    ctx.strokeStyle = brushColor.value;
    context.strokeStyle = brushColor.value;
    tempContext.strokeStyle = brushColor.value;
    ctx.fillStyle = brushColor.value;
    context.fillStyle = brushColor.value;
    tempContext.fillStyle = brushColor.value;
    var mySize = size.value;
    // final draw
    if (final == true) {
        // clear temp canvas
        tempContext.clearRect(0, 0, canvas.width, canvas.height);
    }
    // temporary draw
    if (final == false) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    // creating a square
    var w = endX - startX;
    var h = endY - startY;
    var offsetX = (w < 0) ? w : 0;
    var offsetY = (h < 0) ? h : 0;
    var width = Math.abs(w);
    var height = Math.abs(h);
    var radius = Math.sqrt(Math.pow((startX - endX), 2) + Math.pow((startY - endY), 2))

    if(isCircle) {
        ctx.beginPath();
        ctx.arc(startX + offsetX, startY + offsetY, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.lineWidth = mySize;
        ctx.stroke();
    }

    if(isRect) {
        ctx.beginPath();
        ctx.rect(startX, startY , w, h);
        ctx.closePath();
        ctx.lineWidth = mySize;
        ctx.stroke();
    }
    
    if(isTri) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + w, startY + h);
        ctx.lineTo(startX - w, startY + h);
        ctx.closePath();
        ctx.lineWidth = mySize;
        ctx.stroke();
    }

    if(isCircleFill) {
        ctx.beginPath();
        ctx.arc(startX + offsetX, startY + offsetY, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }

    if(isRectFill) {
        ctx.beginPath();
        ctx.rect(startX, startY , w, h);
        ctx.closePath();
        ctx.fill();
    }
    
    if(isTriFill) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(startX + w, startY + h);
        ctx.lineTo(startX - w, startY + h);
        ctx.closePath();
        ctx.fill();
    }
    console.log("here");
}

function cancelTempDraw() {
    tempContext.clearRect(0, 0, canvas.width, canvas.height);
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}


/*
function brushDown(e) {
    mouse = true;
    var coordinates = getCoordinates(canvas, e);
    if(isCircle) {
        nStartX = e.clientX;
        nStartY = e.clientY;
        bIsDrawing = true;
        radius = 0;
        var brushColor = document.getElementById("myColor");
        ctx.fillStyle = brushColor.value;
    }
    else if(isRect) {
        nStartX = e.clientX;
        nStartY = e.clientY;
        bIsDrawing = true;
        var brushColor = document.getElementById("myColor");
        ctx.fillStyle = brushColor.value;
    }
    else if(isTri) {
        nStartX = e.clientX;
        nStartY = e.clientY;
        bIsDrawing = true;
        var brushColor = document.getElementById("myColor");
        ctx.fillStyle = brushColor.value;
    }
    else if(isEraser) {
        document.body.style.cursor = 'url("icon.png"),auto';
        positionX = coordinates.x;
        positionY = coordinates.y;
        ctx.beginPath();
        ctx.moveTo(positionX, positionY);
        ctx.lineTo(positionX, positionY);
        ctx.stroke();
    }
    else {
        document.body.style.cursor = 'url("brush_cursor.png"),auto';
        positionX = coordinates.x;
        positionY = coordinates.y;
        ctx.beginPath();
        ctx.moveTo(positionX, positionY);
        ctx.lineTo(positionX, positionY);
        ctx.stroke();
    } 
    
}

function brushMove(e) {
    var coordinates = getCoordinates(canvas, e);
    positionX = coordinates.x;
    positionY = coordinates.y;
    if(isCircle) {
        if(!bIsDrawing)
            return;
        var nDeltaX = nStartX - e.clientX;
        var nDeltaY = nStartY - e.clientY;
        radius = Math.sqrt(nDeltaX * nDeltaX + nDeltaY * nDeltaY);

        
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
        ctx.clearRect(0, 0, 800, 500);

        ctx.beginPath();
        ctx.arc(nStartX, nStartY, radius, 0, Math.PI*2);
        ctx.fill();
    }
    else if(isRect) {
        if(!bIsDrawing)
            return;
        var rectX = e.clientX - nStartX;
        var rectY = e.clientY - nStartY;


        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
        ctx.clearRect(0, 0, 800, 500);

        ctx.beginPath();
        ctx.rect(nStartX, nStartY, rectX, rectY);
        ctx.fill();
    }
    else if(isTri) {
        if(!bIsDrawing)
            return;
        var triX = e.clientX - nStartX;
        var triY = e.clientY - nStartY;

        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
        ctx.clearRect(0, 0, 800, 500);

        ctx.beginPath();
        ctx.moveTo(nStartX, nStartY);
        ctx.lineTo(nStartX + triX, nStartY + triY);
        ctx.lineTo(nStartX - triX, nStartY + triY);
        ctx.closePath();
        ctx.fill();
    }
    else if(isEraser) {
        document.body.style.cursor = 'url("icon.png"),auto';
        brushDraw(canvas, positionX, positionY);
    }

    else {
        document.body.style.cursor = 'url("brush_cursor.png"),auto';
        brushDraw(canvas, positionX, positionY);
    } 
    
}

function brushUp() {
    mouse = false;
    cPush();
    bIsDrawing = false;
}
*/

function brushClick() {
    isPen = true;
    isEraser = false;
    isCircle = false;
    isRect = false;
    isTri = false;
    isRectFill = false;
    isCircleFill = false;
    isTriFill = false;
    isText = false;

    var brushColor = document.getElementById("myColor");
    ctx.strokeStyle = brushColor.value;
    
    console.log(brushColor);


    document.body.style.cursor = 'url("brush_cursor.png"),auto';


    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mousemove", mouseXY, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    
    /*
    canvas.addEventListener("mousedown", brushDown, false);
    canvas.addEventListener("mousemove", brushMove, false);
    canvas.addEventListener("mouseup", brushUp, false);
    */
}

// eraser

function eraserClick() {
    
    isPen = false;
    isEraser = true;
    isCircle = false;
    isRect = false;
    isTri = false;
    isRectFill = false;
    isCircleFill = false;
    isTriFill = false;
    isText = false;

    ctx.strokeStyle = "white";
    document.body.style.cursor = 'url("icon.png"),auto';

    console.log("eraser here");

    

    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mousemove", mouseXY, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    
    /*
    canvas.addEventListener("mousedown", brushDown, false);
    canvas.addEventListener("mousemove", brushMove, false);
    canvas.addEventListener("mouseup", brushUp, false);
    */
}

// reset

function resetClick() {
    ctx.clearRect(0, 0, 800, 500);
    cPush.length = 0;
    cPush();
    cStep = -1;
}

// save

function saveClick() {
	var data = canvas.toDataURL(); //encodes image information into a base 64 format
	console.log(data);
	saveLink.href = data;
	saveLink.download = "myImage.png";
}


// upload

function uploadClick(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);    
    
}

// undo

var cPushArray = new Array();
var cStep = -1;
	
function cPush() {
    cStep++;
    if (cStep < cPushArray.length) { cPushArray.length = cStep; }
    cPushArray.push(document.getElementById('canvas').toDataURL());
}

function cUndo() {
    if (cStep > 0) {
        cStep--;
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        ctx.clearRect(0, 0, 800, 500);
        canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
        
    }
    else if (cStep == 0) {
        ctx.clearRect(0, 0, 800, 500);
        cStep--;
    }
}

function cRedo() {
    if (cStep < cPushArray.length-1) {
        cStep++;
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function () { ctx.drawImage(canvasPic, 0, 0); }
    }
}

// Shapes

var radius = 50;
var nStartX = 0;
var nStartY = 0;
var bIsDrawing = false;

// circle

function drawCircle() {
    isPen = false;
    isEraser = false;
    isCircle = true;
    isRect = false;
    isTri = false;
    isRectFill = false;
    isCircleFill = false;
    isTriFill = false;
    isText = false;
    var brushColor = document.getElementById("myColor");
    ctx.strokeStyle = brushColor.value;
    context.strokeStyle = brushColor.value;
    tempContext.strokeStyle = brushColor.value;
}

function drawCircleFill() {
    isPen = false;
    isEraser = false;
    isCircle = false;
    isRect = false;
    isTri = false;
    isRectFill = false;
    isCircleFill = true;
    isTriFill = false;
    isText = false;
    var brushColor = document.getElementById("myColor");
    ctx.fillStyle = brushColor.value;
    context.fillStyle = brushColor.value;
    tempContext.fillStyle = brushColor.value;
}

// rectangle

function drawRect() {
    isPen = false;
    isEraser = false;
    isCircle = false;
    isRect = true;
    isTri = false;
    isRectFill = false;
    isCircleFill = false;
    isTriFill = false;
    isText = false;
    var brushColor = document.getElementById("myColor");
    ctx.strokeStyle = brushColor.value;
    context.strokeStyle = brushColor.value;
    tempContext.strokeStyle = brushColor.value;
}

function drawRectFill() {
    isPen = false;
    isEraser = false;
    isCircle = false;
    isRect = false;
    isTri = false;
    isRectFill = true;
    isCircleFill = false;
    isTriFill = false;
    isText = false;
    var brushColor = document.getElementById("myColor");
    ctx.fillStyle = brushColor.value;
    context.fillStyle = brushColor.value;
    tempContext.fillStyle = brushColor.value;
}

// triangle

function drawTri() {
    isPen = false;
    isEraser = false;
    isCircle = false;
    isRect = false;
    isTri = true;
    isRectFill = false;
    isCircleFill = false;
    isTriFill = false;
    isText = false;
    var brushColor = document.getElementById("myColor");
    ctx.strokeStyle = brushColor.value;
    context.strokeStyle = brushColor.value;
    tempContext.strokeStyle = brushColor.value;
}

function drawTriFill() {
    isPen = false;
    isEraser = false;
    isCircle = false;
    isRect = false;
    isTri = false;
    isRectFill = false;
    isCircleFill = false;
    isTriFill = true;
    isText = false;
    var brushColor = document.getElementById("myColor");
    ctx.fillStyle = brushColor.value;
    context.fillStyle = brushColor.value;
    tempContext.fillStyle = brushColor.value;
}

// text

function textClick() {
    isPen = false;
    isEraser = false;
    isCircle = false;
    isRect = false;
    isTri = false;
    isRectFill = false;
    isCircleFill = false;
    isTriFill = false;
    isText = true;
    document.body.style.cursor = 'text';
}



brush.addEventListener("click", brushClick); //Brush click event 
eraser.addEventListener("click", eraserClick); //Eraser click event
color.addEventListener("change", colorChange); //Color change event 
size.addEventListener("change", sizeChange); //Size change event 
reset.addEventListener("click", resetClick); //Reset click event 
saveLink.addEventListener("click", saveClick); //Save click event 
undo.addEventListener("click", cUndo);
redo.addEventListener("click", cRedo);
uploadLink.addEventListener("change", uploadClick, false);
circle.addEventListener("click", drawCircle);
rectangle.addEventListener("click", drawRect);
triangle.addEventListener("click", drawTri);
circle_fill.addEventListener("click", drawCircleFill);
rectangle_fill.addEventListener("click", drawRectFill);
triangle_fill.addEventListener("click", drawTriFill);
textBox.addEventListener("click", textClick); 