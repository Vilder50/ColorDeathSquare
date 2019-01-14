/// <reference path="state.js" />

//Startup
var GameState;
var ResetTimer = 0;
(function () {
    GameState = new State();
    GameState.Canvas = document.getElementById("ColorDeathSquare").getContext("2d");
    GameState.ExtraRawCanvas = document.getElementById("ColorDeathSquareExtra");
    //GameState.Players.push(new Player(["w", "a", "s", "d", "r"], 0));
    GameState.Players.push(new Player(["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", " "], 0));
    GameState.Players.push(new Robot(1));
    //GameState.Players.push(new Player(["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight", "0"], 1));
    //GameState.Players.push(new Player(["i", "j", "k", "l", "p"], 2));
    //GameState.Players.push(new Player(["t", "f", "g", "h", "u"], 3));
    GameState.Players.push(new Robot(3));
    GameState.StartGame();
    Tick();
    Draw();
})();

//Keys
function KeyPress(event) {
    //alert(event.key);
    GameState.KeyStates[event.key + ""] = true;
}

function KeyUp(event) {
    GameState.KeyStates[event.key + ""] = false;
}

//Game logic
function Tick() {
    setTimeout(Tick, 40);
    let playersAlive = 0;
    for (let i = 0; i < GameState.Players.length; i++) {
        if (!GameState.Players[i].Dead) {
            GameState.Players[i].Update();
            playersAlive++;
        }
    }
    for (let i = 0; i < GameState.Particles.length; i++) {
        if (GameState.Particles[i].Update()) {
            GameState.Particles.splice(i, 1);
            i--;
        }
    }

    if (playersAlive <= 1) {
        if (ResetTimer == 0) {
            for (let x = 0; x < GameState.Map.Width; x++) {
                for (let y = 0; y < GameState.Map.Height; y++) {
                    if (GameState.Map.Tiles[x][y].State == 1) {
                        GameState.Particles.push(new TrapParticle(x, y,true));
                    }
                }
            }
        }
        ResetTimer += 40;
        if (ResetTimer >= 5000) {
            GameState.StartGame();
            ResetTimer = 0;
        }
    }
}

function Draw() {
    setTimeout(Draw, 40);
    GameState.Map.Draw();
    for (let i = 0; i < GameState.Particles.length; i++) {
        GameState.Particles[i].Draw();
    }
    for (let i = 0; i < GameState.Players.length; i++) {
        if (!GameState.Players[i].Dead) {
            GameState.Players[i].Draw();
        }
    }
}

function GetColor(colorID) {
    switch (colorID) {
        case 0:
            return [255, 0, 0];
        case 1:
            return [0, 255, 0];
        case 2:
            return [0, 0, 255];
        case 3:
            return [255, 255, 0];
        case 4:
            return [0, 255, 255];
        case 5:
            return [255, 0, 255];
    }
}