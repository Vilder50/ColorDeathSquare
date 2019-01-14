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
        this.LoadedMenu = new MainMenu();
    }


    PlayerAt(thisID,x,y,power) {
        for (let j = 0; j < GameState.Players.length; j++) {
            if (GameState.Players[j].ID != thisID) {
                let exactLocationX = Math.round(GameState.Players[j].X / 1000);
                let exactLocationY = Math.round(GameState.Players[j].Y / 1000);
                if (x == exactLocationX && y == exactLocationY && GameState.Players[j].Points >= power && !this.Players[j].Dead) {
                    return true;
                }
            }
        }

        return false;
    }

    GetColor(colorID) {
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
                return [255, 127, 0];
            case 5:
                return [255, 0, 255];
        }
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