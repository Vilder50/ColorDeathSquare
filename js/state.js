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
        this.RobotOption = false;
        this.TrapOption = false;
        this.ExtraColors = {};

        this.Wins = { };
        this.Kills = { };

        this.Socket = null;
        this.ConnectionCode = null;
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
        this.Wins[colorID] = this.Wins[colorID] == undefined ? 0 : this.Wins[colorID];
        this.Kills[colorID] = this.Kills[colorID] == undefined ? 0 : this.Kills[colorID];
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
            default:
                if (this.ExtraColors["c" + (colorID - 6)] == undefined) {
                    this.ExtraColors["c" + (colorID - 6)] = [Math.floor(Math.random() * 128) + 128];
                    this.ExtraColors["c" + (colorID - 6)].splice(Math.floor(Math.random() * 2), 0, Math.floor(Math.random() * 256));
                    this.ExtraColors["c" + (colorID - 6)].splice(Math.floor(Math.random() * 3), 0, 0);
                    this.ExtraColors["c" + (colorID - 6)] = this.WhitenColor(this.ExtraColors["c" + (colorID - 6)], Math.random() * 1.25 - 0.5, true);
                }
                return this.ExtraColors["c" + (colorID - 6)];
        }
    }

    CreateColorString(rawColor) {
        return "rgb(" + rawColor[0] + "," + rawColor[1] + "," + rawColor[2] + ")";
    }

    WhitenColor(rawColor, whitenPercent, returnData) {
        let newColor = rawColor.slice();
        if (whitenPercent >= 0) {
            for (let j = 0; j < 3; j++) {
                newColor[j] = newColor[j] + (255 - newColor[j]) * whitenPercent;
            }
        } else {
            whitenPercent += 1;
            for (let j = 0; j < 3; j++) {
                newColor[j] = newColor[j] * whitenPercent;
            }
        }
        if (returnData == undefined) {
            return this.CreateColorString(newColor);
        } else {
            return newColor;
        }
    }

    Update() {
        GameState.UpdateNow();
        setTimeout(GameState.Update, 40);
    }
    UpdateNow() {
        this.LoadedMenu.Update(this.MouseX, this.MouseY);
    }

    Clicked() {
        this.LoadedMenu.Click(this.MouseX, this.MouseY);
    }

    Unclicked() {
        this.LoadedMenu.Unclick(this.MouseX, this.MouseY);
    }

    Draw() {
        GameState.DrawNow();
        setTimeout(GameState.Draw, 40);
    }
    DrawNow() {
        this.LoadedMenu.Draw(this.MouseX, this.MouseY);
    }
}