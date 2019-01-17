class Player {
    constructor(keys, id) {
        this.Keys = keys;
        this.Color = GameState.GetColor(id);
        this.ID = id;
        this.X = 0;
        this.Y = 0;

        this.Reset();
    }

    Moving() {
        return this.MotionX != 0 || this.MotionY != 0
    }

    Power() {
        if (GameState.KeyStates[this.Keys[4]] === true) {
            if (this.PowerPress == 0) {
                this.PowerX = Math.round(this.X / 1000);
                this.PowerY = Math.round(this.Y / 1000);
            }
            this.PowerPress += 1;
        }

        if (GameState.KeyStates[this.Keys[4]] === false && this.PowerPress <= 3 && this.PowerPress >= 1) {
            if (this.Trapped(this.PowerX, this.PowerY)) {
                return;
            }
        }

        if (GameState.KeyStates[this.Keys[4]] === false && this.PowerPress <= 3 && this.PowerPress >= 1 && this.Points >= 20) {
            this.Points -= 20;
            if (GameState.LoadedMenu.Map.Tiles[this.PowerX][this.PowerY].From === this.ID) {
                GameState.LoadedMenu.Map.PlaceTrap(this.PowerX, this.PowerY);
            } else {
                GameState.LoadedMenu.Map.ColorTile(Math.round(this.X / 1000), Math.round(this.Y / 1000), this.ID);
                GameState.LoadedMenu.Map.PlaceTrap(Math.round(this.X / 1000), Math.round(this.Y / 1000));
            }
        }

        if (this.PowerPress == 4 && this.Points >= 30 && this.Shielding == 0) {
            this.Points -= 30;
            this.Shielding = 3000;
        }

        if (this.PowerPress == 4) {
            if (this.Trapped(this.PowerX, this.PowerY)) {
                this.PowerPress = 1;
            }
        }

        if (GameState.KeyStates[this.Keys[4]] === false) {
            this.PowerPress = 0;
        }
    }

    Move() {
        let overrideAble = false
        for (let i = 0; i < 4; i++) {
            if (GameState.KeyStates[this.Keys[i]] === true && (!this.Moving() || overrideAble) && this.CanMove(i)) {
                if (this.LastDirection === i) {
                    overrideAble = true;
                }
                this.MovingIn(i);
            }
        }
    }

    MovingIn(direction) {
        switch (direction) {
            case 0:
                this.MotionY = 1000;
                this.MotionX = 0;
                switch (this.LastDirection) {
                    case 1:
                        this.Rotation = -180000
                        break;
                    case 3:
                        this.Rotation = 180000
                        break;
                }
                break;
            case 2:
                this.MotionY = -1000;
                this.MotionX = 0;
                switch (this.LastDirection) {
                    case 1:
                        this.Rotation = 180000
                        break;
                    case 3:
                        this.Rotation = -180000
                        break;
                }
                break;
            case 1:
                this.MotionX = 1000;
                this.MotionY = 0;
                switch (this.LastDirection) {
                    case 0:
                        this.Rotation = 180000
                        break;
                    case 2:
                        this.Rotation = -180000
                        break;
                }
                break;
            case 3:
                this.MotionX = -1000;
                this.MotionY = 0;
                switch (this.LastDirection) {
                    case 0:
                        this.Rotation = -180000
                        break;
                    case 2:
                        this.Rotation = 180000
                        break;
                }
                break;
        }
        this.LastDirection = direction;
    }

    CanMove(direction, x, y) {
        let locationX = x;
        let locationY = y;
        if (x == undefined || y == undefined) {
            locationX = this.X / 1000;
            locationY = this.Y / 1000;
        }
        switch (direction) {
            case 0:
                if (locationY < 1) { return false; }
                break;
            case 1:
                if (locationX < 1) { return false; }
                break;
            case 2:
                if (locationY >= GameState.LoadedMenu.Map.Height - 1) { return false; }
                break;
            case 3:
                if (locationX >= GameState.LoadedMenu.Map.Width - 1) { return false; }
                break;
        }

        switch (direction) {
            case 0:
                return !GameState.LoadedMenu.Map.Walls[(locationY * 2 - 1) * GameState.LoadedMenu.Map.Width + locationX];
            case 2:
                return !GameState.LoadedMenu.Map.Walls[(locationY * 2 + 1) * GameState.LoadedMenu.Map.Width + locationX];
            case 1:
                return !GameState.LoadedMenu.Map.Walls[locationY * GameState.LoadedMenu.Map.Width * 2 + locationX];
            case 3:
                return !GameState.LoadedMenu.Map.Walls[locationY * GameState.LoadedMenu.Map.Width * 2 + locationX + 1];
        }

        return true;
    }

    ColorNow() {
        let color = [this.Color[0] + (255 - this.Color[0]) * (10000 - this.NotMoving) / 10000, this.Color[1] + (255 - this.Color[1]) * (10000 - this.NotMoving) / 10000, this.Color[2] + (255 - this.Color[2]) * (10000 - this.NotMoving) / 10000];
        if (this.Shielding == 0) {
            return GameState.CreateColorString(color);
        } else {
            let colorAdder = (this.Shielding % 300) / 300 * 255;
            return "rgb(" + Math.max(0, Math.min(255, color[0] + colorAdder)) + "," + Math.max(0, Math.min(255, color[1] + colorAdder)) + "," + Math.max(0, Math.min(255, color[2] + colorAdder)) + ")";
        }
    }

    Update() {
        //Moving
        this.Move();
        this.Power();

        if (this.MotionX > 0) {
            this.MotionX -= 200;
            this.X -= 200;
            GameState.LoadedMenu.Particles.push(new ColorParticle(this.X / 1000, this.Y / 1000, 1, Math.random() * 0.8 - 0.4, 0.2 + Math.random() * 0.2, this.ColorNow(), GameState.LoadedMenu.Map.TileSize / 2.5 + Math.random() * 0.8));
        } else if (this.MotionX < 0) {
            this.MotionX += 200;
            this.X += 200;
            GameState.LoadedMenu.Particles.push(new ColorParticle(this.X / 1000, this.Y / 1000, -1, Math.random() * 0.8 - 0.4, 0.2 + Math.random() * 0.2, this.ColorNow(), GameState.LoadedMenu.Map.TileSize / 2.5 + Math.random() * 0.8));
        }
        if (this.MotionY > 0) {
            this.MotionY -= 200;
            this.Y -= 200;
            GameState.LoadedMenu.Particles.push(new ColorParticle(this.X / 1000, this.Y / 1000, Math.random() * 0.8 - 0.4, 1, 0.2 + Math.random() * 0.2, this.ColorNow(), GameState.LoadedMenu.Map.TileSize / 2.5 + Math.random() * 0.8));
        } else if (this.MotionY < 0) {
            this.MotionY += 200;
            this.Y += 200;
            GameState.LoadedMenu.Particles.push(new ColorParticle(this.X / 1000, this.Y / 1000, Math.random() * 0.8 - 0.4, -1, 0.2 + Math.random() * 0.2, this.ColorNow(), GameState.LoadedMenu.Map.TileSize / 2.5 + Math.random() * 0.8));
        }

        if (this.Rotation > 0) {
            this.Rotation -= 60000;
        } else if (this.Rotation < 0) {
            this.Rotation += 60000;
        }

        let locationX = Math.round(this.X / 1000);
        let locationY = Math.round(this.Y / 1000);
        if (this.PowerPress == 0 || this.PowerPress >= 4) {
            if (this.Trapped(locationX, locationY)) {
                return;
            }
        }

        //Points
        if (this.Moving()) {
            if (!(GameState.LoadedMenu.Map.Tiles[locationX][locationY].From === this.ID)) {
                GameState.LoadedMenu.Map.ColorTile(locationX,locationY,this.ID)
                this.AddMoving = 10000
                this.Points += 1;
            }
        }

        if (Math.floor(this.Points / 20) > this.Layers) {
            this.Layers = Math.floor(this.Points / 20);
            this.LayerAddAnimation = 500;
        } else if (Math.floor(this.Points / 20) < this.Layers) {
            this.Layers = Math.floor(this.Points / 20);
            this.LayerRemoveAnimation = 500;
        }

        this.LayerAddAnimation = Math.max(0, this.LayerAddAnimation - 40);
        this.LayerRemoveAnimation = Math.max(0, this.LayerRemoveAnimation - 40);

        if (this.Points < 30 || this.Shielding != 0) {
            this.ShieldAnimation = Math.max(this.ShieldAnimation - 40, 0);
        } else {
            this.ShieldAnimation = Math.min(this.ShieldAnimation + 40, 500);
        }

        this.Shielding = Math.max(0, this.Shielding - 40);

        //Color fading
        if (this.AddMoving <= 0) {
            this.NotMoving -= 40;
            if (this.NotMoving <= 0) {
                this.Kill();
            }
        } else {
            this.NotMoving = Math.min(160 + this.NotMoving, 10000);
            this.AddMoving -= 320;
        }

    }

    Trapped(x, y) {
        let tile = GameState.LoadedMenu.Map.Tiles[x][y];
        if (!(tile.From === this.ID) && tile.State == 1) {
            GameState.LoadedMenu.Map.Tiles[x][y].State = 0;  
            for (let i = 0; i < 20; i++) {
                let useColor = null;
                if (i % 2 == 0) {
                    useColor = "#000000";
                } else {
                    useColor = "#505050";
                }
                let direction = Math.random() * Math.PI * 2;
                GameState.LoadedMenu.Particles.push(new ColorParticle(this.X / 1000, this.Y / 1000, Math.cos(direction) * (Math.random() * 1.5), Math.sin(direction) * (Math.random() * 1.5), 1 + Math.random() * 0.4, useColor, GameState.LoadedMenu.Map.TileSize / 4 + Math.random() * 2));
            }
            if (this.Shielding == 0) {
                GameState.Kills[tile.From]++;
                GameState.LoadedMenu.UpdateKillScores();
                this.Kill(GameState.CreateColorString(GameState.GetColor(tile.From)));
                return true;
            }
        }
        return false;
    }

    Kill(killer) {
        this.Dead = true;
        let locationX = Math.round(this.X / 1000);
        let locationY = Math.round(this.Y / 1000);
        GameState.LoadedMenu.Particles.push(new DeathMarker(locationX, locationY, "rgb(" + this.Color[0] + "," + this.Color[1] + "," + this.Color[2] + ")", killer));
        for (let i = 0; i < 50; i++) {
            let useColor = null;
            if (i % 2 == 0) {
                useColor = this.ColorNow();
            } else {
                useColor = "rgb(" + this.Color[0] + "," + this.Color[1] + "," + this.Color[2] + ")";
            }
            let direction = Math.random() * Math.PI * 2;
            GameState.LoadedMenu.Particles.push(new ColorParticle(this.X / 1000, this.Y / 1000, Math.cos(direction) * (Math.random() * 0.5 + 2.5), Math.sin(direction) * (Math.random() * 0.5 + 2.5), 0.2 + Math.random() * 0.2, useColor, GameState.LoadedMenu.Map.TileSize / 2.5 + Math.random() * 0.8));
        }
    }

    Reset() {
        this.MotionX = 0;
        this.MotionY = 0;
        this.Rotation = 0;
        this.LastDirection = null;
        this.NotMoving = 10000;
        this.AddMoving = 0;
        this.Dead = false;
        this.Points = 0;
        this.LayerAddAnimation = 0;
        this.LayerRemoveAnimation = 0;
        this.ShieldAnimation = 0;
        this.Layers = 0;
        this.PowerPress = 0;
        this.Shielding = 300;
        this.PowerX = 0;
        this.PowerY = 0;
    }

    Draw() {
        GameState.Canvas.fillStyle = this.ColorNow();
        GameState.Canvas.lineWidth = 2;
        let playerSize = GameState.LoadedMenu.Map.TileSize / 1.5;
        let middleX = GameState.LoadedMenu.MapOffsetX + 2 + (this.X / 1000) * GameState.LoadedMenu.Map.TileSize + GameState.LoadedMenu.Map.TileSize / 2;
        let middleY = GameState.LoadedMenu.MapOffsetY + 2 + (this.Y / 1000) * GameState.LoadedMenu.Map.TileSize + GameState.LoadedMenu.Map.TileSize / 2;
        GameState.Canvas.translate(middleX, middleY);
        GameState.Canvas.rotate(this.Rotation * Math.PI / 360000);
        GameState.Canvas.fillRect(playerSize / -2, playerSize / -2, playerSize, playerSize);
        GameState.Canvas.fillStyle = "#000000";
        GameState.Canvas.strokeRect(playerSize / -2, playerSize / -2, playerSize, playerSize);
        for (let i = 0; i <= this.Layers || (i == 0 && this.LayerRemoveAnimation != 0); i++) {
            let baseSize = i - 1 + (500 - this.LayerAddAnimation) / 500 + 1 * this.LayerRemoveAnimation / 500;
            if (playerSize / -2 + baseSize * 4 > 0) {
                break;
            }
            if (i != 0 || (i == 0 && this.LayerRemoveAnimation != 0)) {
                GameState.Canvas.strokeRect(playerSize / -2 + baseSize * 4, playerSize / -2 + baseSize * 4, playerSize - baseSize * 8, playerSize - baseSize * 8);
            }
        }
        if (this.Points >= 30 || this.ShieldAnimation != 0) {
            GameState.Canvas.rotate(Math.PI / 4 * Math.pow(this.ShieldAnimation / 500, 2));
            GameState.Canvas.strokeRect(playerSize / (-2 - 1 * (this.ShieldAnimation / 500)), playerSize / (-2 - 1 * (this.ShieldAnimation / 500)), playerSize / (1 + 0.5 * (this.ShieldAnimation / 500)), playerSize / (1 + 0.5 * (this.ShieldAnimation / 500)));
        }

        GameState.Canvas.setTransform(1, 0, 0, 1, 0, 0);
    }
}