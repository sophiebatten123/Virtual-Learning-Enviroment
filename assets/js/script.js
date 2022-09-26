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
let ShapeBoundingBox = new ShapeBoundingBox(0,0,0,0);
let mouseDown = new MouseDownPos(0,0);
let loc = new Location(0,0);

// Calls a function to set up the canvas when ever the page loads.
document.addEventListener('DOMContentLoaded', setupCanvas);

function setupCanvas(){
    canvas = document.getElementById('my-canvas');
    // Provides all of the functions for working with the canvas.
    ctx = canvas.getContext('2d')
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = line_Width;
}