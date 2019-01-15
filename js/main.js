/// <reference path="state.js" />

//Startup
var GameState;
(function () {
    GameState = new State();
    GameState.RawCanvas = document.getElementById("ColorDeathSquare");
    GameState.Canvas = GameState.RawCanvas.getContext("2d");
    GameState.ExtraRawCanvas = document.getElementById("ColorDeathSquareExtra");
    GameState.Ready();
    GameState.Update();
    GameState.Draw();
})();

//HTML events
function KeyPress(event) {
    //alert(event.key);
    GameState.KeyStates[event.key.toString().toLowerCase()] = true;
}

function KeyUp(event) {
    GameState.KeyStates[event.key.toLowerCase()] = false;
}

function MouseMove(event) {
    if (GameState != undefined) {
        var CanvasLocation = GameState.RawCanvas.getBoundingClientRect();
        GameState.MouseX = Math.round((event.clientX - CanvasLocation.left) * 1280 / CanvasLocation.width);
        GameState.MouseY = Math.round((event.clientY - CanvasLocation.top) * 720 / CanvasLocation.height);
    }
}

function Clicked(event) {
    GameState.Clicked();
}