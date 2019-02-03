/// <reference path="state.js" />

//Startup
var GameState;
(function () {
    GameState = new State();
    GameState.RawCanvas = document.getElementById("ColorDeathSquare");
    GameState.Canvas = GameState.RawCanvas.getContext("2d");
    GameState.ExtraRawCanvas = document.getElementById("ColorDeathSquareExtra");
    if (window.location.search.startsWith("?key=")) {
        let roomKey = window.location.search.substring(5, 15);
        let roomKeyArray = [];
        for (let i = 0; i < 10; i++) {
            roomKeyArray.push(Number(roomKey.substring(i, i + 1)));
        }
        this.Players = [new Player(["arrowup", "arrowleft", "arrowdown", "arrowright", " "], 0), new Robot(1), new Robot(2)];
        GameState.LoadedMenu = new TryConnectMenu(roomKeyArray);
    } else {
        GameState.Ready();
    }

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

function Unclicked(event) {
    GameState.Unclicked();
}