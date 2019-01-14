/// <reference path="map.js" />

class State {
    constructor() {
        this.Canvas = null;
        this.RawCanvas = null;
        this.ExtraRawCanvas = null;
        this.Map = null;

        this.Players = [];
        this.KeyStates = [];
        this.Particles = [];
        this.MapOffsetX = 0;
        this.MapOffsetY = 0;
        this.FrameUpdate = 0;
        this.State = 0;
        this.MouseX = 0;
        this.MouseY = 0;
        this.ResetTimer = 0;
    }

    StartGame() {
        this.Canvas.clearRect(0, 0, 1280, 720);
        let totalSize = this.Players.length * 20;
        let around = Math.round(Math.sqrt(totalSize));
        let randomness = Math.floor(totalSize / 15);
        let width = around + Math.floor(Math.random() * randomness - randomness / 2);
        let height = Math.round(totalSize / width);
        let tileSize = Math.floor((720 - 4) / Math.max(width, height));

        this.State = 1;
        this.Particles = [];

        this.Map = new Map(width, height, tileSize);
        this.MapOffsetX = Math.floor((1280 - GameState.Map.Width * GameState.Map.TileSize - 4) / 2);
        this.MapOffsetY = Math.floor((720 - GameState.Map.Height * GameState.Map.TileSize - 4) / 2);
        for (let i = 0; i < this.Players.length; i++) {
            this.Players[i].X = Math.floor(Math.random() * width) * 1000;
            this.Players[i].Y = Math.floor(Math.random() * height) * 1000;
            this.Players[i].Reset();
            this.Map.ColorTile(this.Players[i].X / 1000, this.Players[i].Y / 1000, this.Players[i].ID)
        }
    }

    PlayerAt(thisID,x,y,power) {
        for (let j = 0; j < GameState.Players.length; j++) {
            if (GameState.Players[j].ID != thisID) {
                let exactLocationX = Math.round(GameState.Players[j].X / 1000);
                let exactLocationY = Math.round(GameState.Players[j].Y / 1000);
                if (x == exactLocationX && y == exactLocationY && GameState.Players[j].Points >= power && !GameState.Players[j].Dead) {
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
                return [0, 255, 255];
            case 5:
                return [255, 0, 255];
        }
    }

    Update() {
        setTimeout(GameState.Update, 50);
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
                            GameState.Particles.push(new TrapParticle(x, y, true));
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

    Clicked() {
        //alert(this.MouseX + "," + this.MouseY);
    }

    Draw() {
        setTimeout(GameState.Draw, 40);

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
}