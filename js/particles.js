class ColorParticle {
    constructor(x,y,endX,endY,time,color,size) {
        this.X = x;
        this.Y = y;
        this.EndX = endX;
        this.EndY = endY;
        this.Color = color;
        this.Time = 0;
        this.FullTime = time;
        this.TimeDifference = time;
        this.TimePercent = 0;
        this.Rotation = Math.random() * 90;
        this.Size = size;
    }

    Update() {
        this.Time += 0.04;
        this.TimeDifference = this.FullTime - this.Time;
        this.TimePercent = this.Time / this.FullTime;
        if ((this.EndX > 0 && this.EndY > 0) || (this.EndX < 0 && this.EndY < 0)) {
            this.Rotation += Math.min(this.TimeDifference * 10 + 3, 20);
        } else {
            this.Rotation -= Math.min(this.TimeDifference * 10 + 3, 20);
        }
        return (this.Time >= this.FullTime);
    }

    Draw() {
        let size = this.Size - this.Size * Math.pow(this.TimePercent, 2);
        let movementLocation = Math.pow(1 - this.TimePercent, 2);
        let middleX = GameState.MapOffsetX + 2 + Math.min(GameState.Map.Width * GameState.Map.TileSize - size,Math.max(size, (this.X + (this.EndX - this.EndX * movementLocation)) * GameState.Map.TileSize + GameState.Map.TileSize / 2));
        let middleY = GameState.MapOffsetY + 2 + Math.min(GameState.Map.Height * GameState.Map.TileSize - size,Math.max(size,(this.Y + (this.EndY - this.EndY * movementLocation)) * GameState.Map.TileSize + GameState.Map.TileSize / 2));
        GameState.Canvas.translate(middleX, middleY);
        GameState.Canvas.rotate(this.Rotation * Math.PI / 180);
        GameState.Canvas.fillStyle = this.Color;
        GameState.Canvas.fillRect(size / -2, size / -2, size, size);

        GameState.Canvas.setTransform(1, 0, 0, 1, 0, 0);
    }
}

class TrapParticle {
    constructor(x, y, unspawnable) {
        this.X = x;
        this.Y = y;
        this.Time = 1500;
        this.Unspawnable = unspawnable;
    }

    Update() {
        if ((this.Unspawnable && this.Time > 500) || !this.Unspawnable) {
            this.Time -= 40;
        }
        if (GameState.Map.Tiles[this.X][this.Y].State != 1) {
            return true;
        }
        return this.Time <= 0;
    }

    Draw() {
        let size = GameState.Map.TileSize / 2 * Math.min(1, (1500 - this.Time) / 100) * (this.Time > 200 ? 1 : this.Time / 150);
        let middleX = GameState.MapOffsetX + 2 + this.X * GameState.Map.TileSize + GameState.Map.TileSize / 2;
        let middleY = GameState.MapOffsetY + 2 + this.Y * GameState.Map.TileSize + GameState.Map.TileSize / 2;
        GameState.Canvas.translate(middleX, middleY);
        GameState.Canvas.fillStyle = "#505050";
        GameState.Canvas.fillRect(size / -2, size / -2, size, size);
        GameState.Canvas.fillStyle = "#000000";
        GameState.Canvas.lineWidth = 2;
        GameState.Canvas.strokeRect(size / -2, size / -2, size, size);
        GameState.Canvas.setTransform(1, 0, 0, 1, 0, 0);
    }
}

class DeathMarker {
    constructor(x, y, color, killer) {
        this.X = x;
        this.Y = y;
        this.Color = color;
        this.Killer = killer;
    }

    Update() {
        return false;
    }

    Draw() {
        let size = GameState.Map.TileSize / 4;
        let middleX = GameState.MapOffsetX + 2 + this.X * GameState.Map.TileSize + GameState.Map.TileSize / 2;
        let middleY = GameState.MapOffsetY + 2 + this.Y * GameState.Map.TileSize + GameState.Map.TileSize / 2;
        GameState.Canvas.translate(middleX, middleY);
        GameState.Canvas.strokeStyle = "#000000";
        if (this.Killer != undefined) {
            GameState.Canvas.rotate(Math.PI / 4);
            GameState.Canvas.fillStyle = this.Killer;
            GameState.Canvas.fillRect(size / -1.5, size / -1.5, size * 1.35, size * 1.35);
            GameState.Canvas.strokeRect(size / -1.5, size / -1.5, size * 1.35, size * 1.35);
            GameState.Canvas.rotate(Math.PI / -4);
        }
        GameState.Canvas.fillStyle = this.Color;
        GameState.Canvas.fillRect(size / -2, size / -2, size, size);
        GameState.Canvas.lineWidth = 2;
        GameState.Canvas.strokeRect(size / -2, size / -2, size, size);
        GameState.Canvas.setTransform(1, 0, 0, 1, 0, 0);
    }
}