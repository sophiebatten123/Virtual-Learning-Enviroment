let canvas;
let ctx;
let savedImageData;
let dragging = false;
let strokeColor = 'black';
let fillColor = 'black';
let line_Width = 2;
let polygonSides = 6;
let currentTool = 'brush';
let canvasWidth = 600;
let canvasHeight = 600;

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

// Calls a function to set up the canvas when ever the page loads.
document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas(){
    canvas = document.getElementById('my-canvas');
    // Provides all of the functions for working with the canvas, below are part of the canvas context.
    ctx = canvas.getContext('2d')
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = line_Width;
    // Adds an event listener for each of the interactions users can have with the canvas.
    canvas.addEventListener('mousedown', ReactToMouseDown);
    canvas.addEventListener('mousemove', ReactToMouseMove);
    canvas.addEventListener('mouseup', ReactToMouseUp);
}

// Awaits for the function below to be ran, a string has been passed in within the HTML code to distinguish the tool type.
function ChangeTool(toolClicked){
    // Resets the selected class name from the tools to start with.
    document.getElementById('open').className = "";
    document.getElementById('save').className = "";
    document.getElementById('brush').className = "";
    document.getElementById('line').className = "";
    document.getElementById('rectangle').className = "";
    document.getElementById('circle').className = "";
    document.getElementById('ellipse').className = "";
    document.getElementById('polygon').className = "";
    // Highlights the last selected tool in the toolbar and stores the current tool within the variable defined at the top.
    document.getElementById(toolClicked).className = "selected";
    currentTool = toolClicked;
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
    ctx.putImageData(savedImageData);
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
function getAngleUsingXAndY(mouselocX, mouselocY) {
    // X = Adjacent
    let adjacent = mousedown.x - mouselocX;
    // Y = Opposite
    let opposite = mousedown.y - mouselocY;
    // Returns the angle created by the shape
    return radiansToDegrees(Math.atan2(opposite/adjacent));
}
    
// Concert from radians to degrees.
function radiansToDegrees(rad) {
    return (rad * (180 / Math.PI)).toFixed(2);

// Convert from degrees to radians.
function degreesToRadians(degrees) {
    return degrees * (Math.PI)/180;
}

// Draw the rubber band shape.

// Update the rubber band on movement.

// ReactToMouseDown which takes the event information in as a parameter e.
function ReactToMouseDown(e){
    canvas.style.cursor = "crosshair";
    // Stores the location for the mouse and the values of x and y
    loc = GetMousePosition(e.clientX, e.clientY);
    // Saves the content that is already on the canvas before drawing something new on the page.
    SaveCanvasImage();
    mousedown.x = loc.x;
    mousedown.y = loc.y;
    dragging = true;

    // HANDLE BRUSH
}

// React to mouse move

// React to mouse up

// Save Image

// Open Image