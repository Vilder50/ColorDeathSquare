/// <reference path="state.js" />

//Startup
var GameState;
(function () {
    GameState = new State();
    GameState.RawCanvas = document.getElementById("ColorDeathSquare");
    GameState.Canvas = GameState.RawCanvas.getContext("2d");
    GameState.ExtraRawCanvas = document.getElementById("ColorDeathSquareExtra");
    //GameState.Players.push(new Player(["w", "a", "s", "d", "r"], 0));
    GameState.Players.push(new Player(["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", " "], 0));
    GameState.Players.push(new Robot(1));
    //GameState.Players.push(new Player(["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", "0"], 1));
    //GameState.Players.push(new Player(["i", "j", "k", "l", "p"], 2));
    //GameState.Players.push(new Player(["t", "f", "g", "h", "u"], 3));
    GameState.Players.push(new Robot(3));
    GameState.LoadedMenu.StartGame();
    GameState.Update();
    GameState.Draw();
})();

//HTML events
function KeyPress(event) {
    //alert(event.key);
    GameState.KeyStates[event.key + ""] = true;
}

function KeyUp(event) {
    GameState.KeyStates[event.key + ""] = false;
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