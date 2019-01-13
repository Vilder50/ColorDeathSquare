/// <reference path="map.js" />

class State {
    constructor() {
        this.Canvas = null;
        this.ExtraRawCanvas = null;
        this.Map = null;

        this.Players = [];
        this.KeyStates = [];
        this.Particles = [];
        this.MapOffsetX = 0;
        this.MapOffsetY = 0;
        this.FrameUpdate = 0;
        this.State = 0;
    }

    StartGame() {
        this.Canvas.clearRect(0, 0, 1120, 630);
        let totalSize = this.Players.length * 20;
        let around = Math.round(Math.sqrt(totalSize));
        let randomness = Math.floor(totalSize / 15);
        let width = around + Math.floor(Math.random() * randomness - randomness / 2);
        let height = Math.round(totalSize / width);
        let tileSize = Math.floor(626 / Math.max(width, height));

        this.State = 1;
        this.Particles = [];

        this.Map = new Map(width, height, tileSize);
        this.MapOffsetX = Math.floor((1120 - GameState.Map.Width * GameState.Map.TileSize - 4) / 2);
        this.MapOffsetY = Math.floor((630 - GameState.Map.Height * GameState.Map.TileSize - 4) / 2);
        for (let i = 0; i < this.Players.length; i++) {
            this.Players[i].X = Math.floor(Math.random() * width) * 1000;
            this.Players[i].Y = Math.floor(Math.random() * height) * 1000;
            this.Players[i].Reset();
            this.Map.ColorTile(this.Players[i].X / 1000, this.Players[i].Y / 1000, this.Players[i].ID)
        }
    }
}