/// <reference path="map.js" />

class State {
    constructor() {
        this.Canvas = null;
        this.RawCanvas = null;
        this.ExtraRawCanvas = null;

        this.Players = [];
        this.KeyStates = [];
        this.MouseX = 0;
        this.MouseY = 0;
        this.LoadedMenu = null;

        this.MazeSizeOption = 2;
        this.WallSizeOption = 1;
        this.RobotOption = true;
        this.TrapOption = false;
    }

    Ready() {
        this.Players = [new Player(["arrowup", "arrowleft", "arrowdown", "arrowright", " "], 0), new Robot(1), new Robot(2)];
        this.LoadedMenu = new MainMenu();
    }

    PlayerAt(thisID,x,y,power,checkShield) {
        for (let j = 0; j < GameState.Players.length; j++) {
            if (GameState.Players[j].ID != thisID) {
                let exactLocationX = Math.round(GameState.Players[j].X / 1000);
                let exactLocationY = Math.round(GameState.Players[j].Y / 1000);
                if (x == exactLocationX && y == exactLocationY && GameState.Players[j].Points >= power && (GameState.Players[j].Shielding == 0 || !checkShield) && !this.Players[j].Dead) {
                    return true;
                }
            }
        }

        return false;
    }

    GetColor(colorID) {
        switch (colorID) {
            case 0:
                return [0, 255, 255];
            case 1:
                return [0, 255, 0];
            case 2:
                return [255, 255, 0];
            case 3:
                return [255, 127, 0];
            case 4:
                return [255, 0, 0];
            case 5:
                return [255, 0, 255];
        }
    }

    CreateColorString(rawColor) {
        return "rgb(" + rawColor[0] + "," + rawColor[1] + "," + rawColor[2] + ")";
    }

    WhitenColor(rawColor, whitenPercent) {
        for (let j = 0; j < 3; j++) {
            rawColor[j] = rawColor[j] + (255 - rawColor[j]) * whitenPercent;
        }

        return this.CreateColorString(rawColor);
    }

    Update() {
        GameState.UpdateNow();
        setTimeout(GameState.Update, 50);
    }
    UpdateNow() {
        this.LoadedMenu.Update(this.MouseX, this.MouseY);
    }

    Clicked() {
        this.LoadedMenu.Click(this.MouseX, this.MouseY);
    }

    Draw() {
        GameState.DrawNow();
        setTimeout(GameState.Draw, 40);
    }
    DrawNow() {
        this.LoadedMenu.Draw(this.MouseX, this.MouseY);
    }
}