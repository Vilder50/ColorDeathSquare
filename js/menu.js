class Button {
    constructor(x, y, width, height, color, hoverColor, text, id) {
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
        this.Color = color;
        this.HoverColor = hoverColor;
        this.Text = text;
        this.ID = id;
        this.Hover = false;
    }

    Hovering(x, y) {
        return (this.X <= x && this.X + this.Width > x && this.Y <= y && this.Y + this.Height > y);
    }

    Draw() {
        GameState.Canvas.fillStyle = this.Hover ? this.HoverColor : this.Color;
        GameState.Canvas.fillRect(this.X, this.Y, this.Width, this.Height);
        GameState.Canvas.lineWidth = 4;
        GameState.Canvas.strokeRect(this.X, this.Y, this.Width - 2, this.Height - 2);
        GameState.Canvas.font = "20px Arial";
        GameState.Canvas.fillStyle = "#000000";
        GameState.Canvas.textAlign = "center";
        GameState.Canvas.fillText(this.Text, this.X + this.Width / 2, this.Y + this.Height / 2 + 5);
    }
}

class Menu {
    constructor() {
        this.Buttons = [];
    }

    Click(x,y) {
        for (let i = 0; i < this.Buttons.length; i++) {
            if (this.Buttons[i].Hovering(x, y)) {
                this.ClickedButton(this.Buttons[i].ID);
            }
        }
    }

    ClickedButton(id) {

    }

    Update(x,y) {
        for (let i = 0; i < this.Buttons.length; i++) {
            this.Buttons[i].Hover = (this.Buttons[i].Hovering(x, y));
        }

        this.UpdateExtra();
    }

    UpdateExtra() {

    }

    Draw() {
        for (let i = 0; i < this.Buttons.length; i++) {
            this.Buttons[i].Draw();
        }

        this.DrawExtra();
    }

    DrawExtra() {

    }
}

class MainMenu extends Menu {
    constructor() {
        super();

        this.Buttons = [new Button(500, 30, 200, 70, "#00ff00", "#aaffaa", "To the game", 1)]
    }

    ClickedButton(id) {
        switch (id) {
            case 1:
                GameState.LoadedMenu = new GameMenu();
                break;
        }
    }
}

class GameMenu extends Menu {
    constructor() {
        super();

        this.Map = null;
        this.Particles = [];
        this.MapOffsetX = 0;
        this.MapOffsetY = 0;
        this.ResetTimer = 0;
        this.Buttons = [new Button(1180, 30, 70, 70, "#ff0000", "#ffaaaa", "Menu", 1)];
        this.StartGame();
    }

    ClickedButton(id) {
        switch (id) {
            case 1:
                GameState.LoadedMenu = new MainMenu();
                break;
        }
    }

    StartGame() {
        GameState.Canvas.clearRect(0, 0, 1280, 720);
        let totalSize = GameState.Players.length * 20;
        let around = Math.round(Math.sqrt(totalSize));
        let randomness = Math.floor(totalSize / 15);
        let width = around + Math.floor(Math.random() * randomness - randomness / 2);
        let height = Math.round(totalSize / width);
        let tileSize = Math.floor((720 - 4) / Math.max(width, height));

        this.Particles = [];

        this.Map = new Map(width, height, tileSize);
        this.MapOffsetX = Math.floor((1280 - this.Map.Width * this.Map.TileSize - 4) / 2);
        this.MapOffsetY = Math.floor((720 - this.Map.Height * this.Map.TileSize - 4) / 2);
        for (let i = 0; i < GameState.Players.length; i++) {
            GameState.Players[i].X = Math.floor(Math.random() * width) * 1000;
            GameState.Players[i].Y = Math.floor(Math.random() * height) * 1000;
            GameState.Players[i].Reset();
            this.Map.ColorTile(GameState.Players[i].X / 1000, GameState.Players[i].Y / 1000, GameState.Players[i].ID)
        }
    }

    UpdateExtra() {
        let playersAlive = 0;
        for (let i = 0; i < GameState.Players.length; i++) {
            if (!GameState.Players[i].Dead) {
                GameState.Players[i].Update();
                playersAlive++;
            }
        }
        for (let i = 0; i < this.Particles.length; i++) {
            if (this.Particles[i].Update()) {
                this.Particles.splice(i, 1);
                i--;
            }
        }

        if (playersAlive <= 1) {
            if (this.ResetTimer == 0) {
                for (let x = 0; x < this.Map.Width; x++) {
                    for (let y = 0; y < this.Map.Height; y++) {
                        if (this.Map.Tiles[x][y].State == 1) {
                            this.Particles.push(new TrapParticle(x, y, true));
                        }
                    }
                }
            }
            this.ResetTimer += 40;
            if (this.ResetTimer >= 5000) {
                this.StartGame();
                this.ResetTimer = 0;
            }
        }
    }

    DrawExtra() {
        this.Map.Draw();
        for (let i = 0; i < this.Particles.length; i++) {
            this.Particles[i].Draw();
        }
        for (let i = 0; i < GameState.Players.length; i++) {
            if (!GameState.Players[i].Dead) {
                GameState.Players[i].Draw();
            }
        }
    }
}