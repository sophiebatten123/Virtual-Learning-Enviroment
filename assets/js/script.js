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
let mouseDown = new MouseDownPos(0,0);
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
    // Gets the canvas point in the upper left corners and multiplies it by the canvas width, which will be divided by the canvas size overall width.
    return {x: (x - canvasSizeData.left) * (canvas.width / canvasSizeData.width),
    y: (y - canvasSizeData.top) * (canvas.height / canvasSizeData.height)}
}

// Save the canvas image.

// Redraw the canvas image.

// Update the rubber band size data for shapes.

// Use trigonometry to determine x and y positions.

// Concert from radians to degrees.

// Convert from degrees to radians.

// Draw the rubber band shape.

// Update the rubber band on movement.

// React to mouse down

// React to mouse move

// React to mouse up

// Save Image

// Open Image