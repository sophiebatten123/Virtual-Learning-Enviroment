let canvas;
let ctx;
let savedImageData;
let dragging = false;
let stroke_color = 'black';
let fillColor = 'black';
let line_Width = 2;
let polygonSides = 6;
let currentTool = 'brush';
let canvasWidth = 600;
let canvasHeight = 600;

// Brush features
let usingBrush = false;
// Stores all of the points as they are dragged as an array for the brush feature.
let brushXPoints = new Array();
let brushYPoints = new Array();
let brushDownPos = new Array();
let brushColour = new Array();
let brush_index = -1;

// Stores all of the interactions made with the canvas
let interactions = [];
let index = -1;

// Postition bounds for moving images within the canvas
class ShapeBoundingBox {
    constructor(left, top, width, height){
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }
}

// Tracks the mouse on the canvas when it is clicked.
class MouseDownPos {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

// Tracks the location of the mouse.
class Location {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

// Tracks the points of the polygon.
class PolygonPoint {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

// Creates an inital position.
let shapeBoundingBox = new ShapeBoundingBox(0,0,0,0);
// Mouse position when the mouse was clicked down.
let mousedown = new MouseDownPos(0,0);
// Current mouse position on the canvas.
let loc = new Location(0,0);

selectColour();

// Calls a function to set up the canvas when ever the page loads.
document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas(){
    canvas = document.getElementById('my-canvas');
    // Provides all of the functions for working with the canvas, below are part of the canvas context.
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = stroke_color;
    ctx.lineWidth = line_Width;
    // Adds an event listener for each of the interactions users can have with the canvas.
    canvas.addEventListener('mousedown', ReactToMouseDown);
    canvas.addEventListener('mousemove', ReactToMouseMove);
    canvas.addEventListener('mouseup', ReactToMouseUp);
}

// Awaits for the function below to be ran, a string has been passed in within the HTML code to distinguish the tool type.
function ChangeTool(toolClicked){
    // Resets the selected class name from the tools to start with.
    document.getElementById('save').className = "";
    document.getElementById('undo').className = "";
    document.getElementById('bin').className = "";
    document.getElementById('brush').className = "";
    document.getElementById('line').className = "";
    document.getElementById('rectangle').className = "";
    document.getElementById('circle').className = "";
    document.getElementById('ellipse').className = "";
    document.getElementById('polygon').className = "";
    document.getElementById('text').className = "";
    // Highlights the last selected tool in the toolbar and stores the current tool within the variable defined at the top.
    document.getElementById(toolClicked).className = "selected";
    currentTool = toolClicked;
}

function selectColour(){
    blue = document.getElementById('blue');
    red = document.getElementById('red');
    green = document.getElementById('green');
    black = document.getElementById('black');

    blue.addEventListener('click', function(){
        stroke_color = 'blue';
        console.log(stroke_color);
    });
    red.addEventListener('click', function(){
        stroke_color = 'red';
        console.log(stroke_color);
    });
    green.addEventListener('click', function(){
        stroke_color = 'green';
        console.log(stroke_color);
    });
    black.addEventListener('click', function(){
        stroke_color = 'black';
        console.log(stroke_color);
    });
}

// Get the current mouse position.
function GetMousePosition(x,y){
    // Determine the canvas size and its position within the webpage.
    let canvasSizeData = canvas.getBoundingClientRect();
    // Provides the mouses position inside the canvas.
    return {x: (x - canvasSizeData.left) * (canvas.width / canvasSizeData.width),
    y: (y - canvasSizeData.top) * (canvas.height / canvasSizeData.height)};
}

// Save the canvas image.
function SaveCanvasImage() {
    savedImageData = ctx.getImageData(0,0,canvas.width,canvas.height);
}

// Redraw the canvas image.
function RedrawCanvasImage() {
    ctx.putImageData(savedImageData,0,0);
}

// Update the rubber band size data for shapes, mouse position has been passed in as a variable.
function UpdateRubberbandSizeData(loc) {
    // Find out the width of the shape based on where they clicked (mousedown) and the current position on screen (loc).
    shapeBoundingBox.width = Math.abs(loc.x - mousedown.x);
    // Find out the height of the shape based on where they clicked (mousedown) and the current position on screen (loc).
    shapeBoundingBox.height = Math.abs(loc.y - mousedown.y);

    // This determines which is the left point of the shape based on whether you drag left or right on the screen.
    if (loc.x > mousedown.x) {
        shapeBoundingBox.left = mousedown.x;
    } else {
        shapeBoundingBox.left = loc.x;
    }

    // This determines which is the top point of the shape based on whether you drag it up or down on the screen.
    if (loc.y > mousedown.y) {
        shapeBoundingBox.top = mousedown.y;
    } else {
        shapeBoundingBox.top = loc.y;
    }
}


// Use trigonometry to determine x and y positions.
function getAngleUsingXAndY(mouselocX, mouselocY){
    // X = Adjacent
    let adjacent = mousedown.x - mouselocX;
    // Y = Opposite
    let opposite = mousedown.y - mouselocY;
    // Returns the angle created by the shape
    return radiansToDegrees(Math.atan2(opposite, adjacent));
}
    
// Concert from radians to degrees.
function radiansToDegrees(rad) {
    return (rad * (180 / Math.PI)).toFixed(2);
}

// Convert from degrees to radians.
function degreesToRadians(degrees) {
    return degrees * (Math.PI)/180;
}

// Create a polygon and hold its points, each will be found by breaking the polygon into triangles and using trigonometry.
function getPolygonPoints(){
    let angle = degreesToRadians(getAngleUsingXAndY(loc.x, loc.y));
    let radiusX = shapeBoundingBox.width;
    let radiusY = shapeBoundingBox.height;
    let polygonPoints = [];
    // X coordinate = mouseloc.x + radiusX * Sin(angle)
    // Y coordinate = mouseloc.y - radiusY * Cos(angle)
    for(let i = 0; i < polygonSides; i++){
        polygonPoints.push(new PolygonPoint(loc.x + radiusX * Math.sin(angle), 
        loc.y - radiusY * Math.cos(angle)));
        // As 2 * PI is 360 degrees.
        angle += 2 * Math.PI / polygonSides;
    }
    return polygonPoints;
}

// Function to enable the polygon draw function to work.
function getPolygon(){
    let polygonPoints = getPolygonPoints();
    ctx.beginPath();
    ctx.moveTo(polygonPoints[0].x, polygonPoints[0].y);
    for(let i = 1; i < polygonSides; i++){
        ctx.lineTo(polygonPoints[i].x, polygonPoints[i].y);
    }
    ctx.closePath();
}

// Update the rubber band on movement.
function drawRubberbandShape(loc) {
    ctx.strokeStyle = stroke_color;
    ctx.fillColor = fillColor;

    if(currentTool === "brush") {
        DrawBrush();
    } else if (currentTool === "line") {
        ctx.beginPath();
        ctx.moveTo(mousedown.x, mousedown.y);
        ctx.lineTo(loc.x, loc.y);
        ctx.stroke();
    } else if (currentTool === "text") {
        Question();
    } else if (currentTool === "rectangle") {
        ctx.strokeRect(shapeBoundingBox.left, shapeBoundingBox.top,
        shapeBoundingBox.width, shapeBoundingBox.height);
    } else if (currentTool === "circle") {
        let radius = shapeBoundingBox.width;
        ctx.beginPath();
        ctx.arc(mousedown.x, mousedown.y, radius, 0, Math.PI * 2);
        ctx.stroke();
    } else if (currentTool === "ellipse") {
        let radiusX = shapeBoundingBox.width / 2;
        let radiusY = shapeBoundingBox.height / 2;
        ctx.beginPath();
        ctx.ellipse(mousedown.x, mousedown.y, radiusX, radiusY, Math.PI / 4, 0, Math.PI * 2);
        ctx.stroke();
    } else if (currentTool === "polygon") {
        getPolygon();
        ctx.stroke();
    }
}

// Draw the rubber band shape.
function UpdateRubberbandOnMove(loc) {
    UpdateRubberbandSizeData(loc);
    drawRubberbandShape(loc);
}

function AddText(q) {
    ClearCanvas()
    document.body.style.cursor = "text";
    ctx.font = "10px Arial";
    ctx.fillText(q, 30, 30);
    document.getElementById('question').style.display = 'none';
}

function Question(){
    document.getElementById('question').style.display = 'block';
    var q = document.getElementById('textarea').value;
    var add = document.getElementById('add');
    add.addEventListener('click', function(){
        AddText(q);
        document.getElementById('textarea').value = '';
    })
}

function AddBrushPoint(x, y, mouseDown){
    brushXPoints.push(x);
    brushYPoints.push(y);
    brushDownPos.push(mouseDown);
    brush_index += 1;
}

function DrawBrush() {
    for(let i = 1; i < brushXPoints.length; i++) {
        ctx.beginPath();

        if(brushDownPos[i]){
            ctx.moveTo(brushXPoints[i-1], brushYPoints[i-1], brushColour[i]);
        } else {
            ctx.moveTo(brushXPoints[i]-1, brushYPoints[i], brushColour[i]);
        }
        ctx.lineTo(brushXPoints[i], brushYPoints[i]);
        ctx.closePath();
        ctx.stroke();
    }
}

// ReactToMouseDown which takes the event information in as a parameter e.
function ReactToMouseDown(e) {
    canvas.style.cursor = "crosshair";
    ctx.strokeStyle = stroke_color;
    // Stores the location for the mouse and the values of x and y
    loc = GetMousePosition(e.clientX, e.clientY);
    // Saves the content that is already on the canvas before drawing something new on the page.
    SaveCanvasImage();
    mousedown.x = loc.x;
    mousedown.y = loc.y;
    dragging = true;

    if(currentTool === 'brush') {
        usingBrush = true;
        AddBrushPoint(loc.x, loc.y);
    }
}

// ReactToMouseMove which takes the event infromation as a parameter e.
function ReactToMouseMove(e) {
    canvas.style.cursor = "crosshair";
    loc = GetMousePosition(e.clientX, e.clientY);

    if(currentTool === 'brush' && dragging && usingBrush){
       if(loc.x > 0 && loc.x < canvasWidth && loc.y > 0 && loc.y < canvasHeight){
        AddBrushPoint(loc.x, loc.y, true);
       }
        RedrawCanvasImage();
        DrawBrush();
    } else {
        if(dragging){
            RedrawCanvasImage();
            UpdateRubberbandOnMove(loc);
        }
    };
}

// ReactToMouseUp whish takes the event information as a parameter e.
function ReactToMouseUp(e){
    canvas.style.cursor = "crosshair";
    loc = GetMousePosition(e.clientX, e.clientY);
    RedrawCanvasImage();
    UpdateRubberbandOnMove(loc);
    dragging = false;
    usingBrush = false;

    if (e.type != "mousedown") {
        interactions.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        index += 1;
    }
}

// SaveImage
function SaveImage(){
    var imageFile = document.getElementById('img-file');
    imageFile.setAttribute('download', 'image.png');
    imageFile.setAttribute('href', canvas.toDataURL());
}

// OpenImage
function OpenImage() {
    let img = new Image();
    img.onload = function(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.drawImage(img,0,0);
    }
    img.src = 'image.png';
}

// Clears information from the canvas completely
function ClearCanvas(){
    ctx.fillColor = "white";
    ctx.clearRect(0,0,canvas.width,canvas.height)
    for (let i=0; i < brushXPoints.length; i++) {
        delete brushXPoints[i];
        delete brushYPoints[i];
        delete brushDownPos[i];
    }
    interactions = [];
    index = -1;
}

function UndoCanvas(){
    if (index <= 0) {
        ClearCanvas();
    } else {
        if (currentTool === 'brush') {
            for (let i=0; i < brushXPoints.length; i++) {
                delete brushXPoints[i];
                delete brushYPoints[i];
                delete brushDownPos[i];
            }
            index -= 1;
            interactions.pop();
            ctx.putImageData(interactions[index], 0, 0);
        } else {
            index -= 1;
            interactions.pop();
            ctx.putImageData(interactions[index], 0, 0);
        }
    }
}
