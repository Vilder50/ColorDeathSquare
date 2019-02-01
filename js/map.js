/// <reference path="state.js" />

class Map {

    constructor(width, height, tileSize, wallArray) {
        this.Width = width;
        this.Height = height;
        this.Tiles = [];
        this.Walls = [];
        this.TileImage = null;
        this.TileSize = tileSize;

        width = width * 2 - 1;
        height = height * 2 - 1;

        if (wallArray == undefined) {

            //Ready up Tiles array
            for (let x = 0; x < width; x++) {
                this.Tiles.push(new Array());
                for (let y = 0; y < height; y++) {
                    this.Tiles[x].push(new Tile());
                }
            }

            //Create maze
            let x = 0;
            let y = 0;
            let directions;
            let backwards = false;
            this.Tiles[0][0].State = 1;
            while (true) {
                directions = [];
                //Finds ways the maze can go
                if (y % 2 == 0) {
                    if (x != width - 1 && this.Tiles[x + 1][y].State == 0 && (x >= width - 2 || this.Tiles[x + 2][y].State == 0)) {
                        directions.push(0);
                    }
                    if (x != 0 && this.Tiles[x - 1][y].State == 0 && (x < 2 || this.Tiles[x - 2][y].State == 0)) {
                        directions.push(2);
                    }
                }
                if (x % 2 == 0) {
                    if (y != height - 1 && this.Tiles[x][y + 1].State == 0 && (y >= height - 2 || this.Tiles[x][y + 2].State == 0)) {
                        directions.push(1);
                    }
                    if (y != 0 && this.Tiles[x][y - 1].State == 0 && (y < 2 || this.Tiles[x][y - 2].State == 0)) {
                        directions.push(3);
                    }
                }
                if (backwards) {
                    //Moving backwards to find a new place to split
                    this.Tiles[x][y].State = 2;
                    if (directions.length >= 1) {
                        backwards = false;
                    } else {
                        switch (this.Tiles[x][y].From) {
                            case 0:
                                x++;
                                break;
                            case 2:
                                x--;
                                break;
                            case 1:
                                y++;
                                break;
                            case 3:
                                y--;
                                break;
                        }
                    }
                }
                if (!backwards) {
                    //Moving randomly and creates the maze
                    if (directions.length == 0) {
                        backwards = true;
                        continue;
                    }
                    let moveIn = directions[Math.floor(Math.random() * directions.length)];
                    switch (moveIn) {
                        case 0:
                            x++;
                            break;
                        case 2:
                            x--;
                            break;
                        case 1:
                            y++;
                            break;
                        case 3:
                            y--;
                            break;
                    }
                    this.Tiles[x][y].From = moveIn - 2;
                    if (this.Tiles[x][y].From < 0) {
                        this.Tiles[x][y].From += 4;
                    }
                    this.Tiles[x][y].State = 1;
                }

                if (x == 0 && y == 0) {
                    break;
                }
            }

            //Adds all walls to the walls array
            for (let y = 0; y < height; y++) {
                if (y % 2 == 0) {
                    //Adds an extra wall for easier access to the array's indexes
                    this.Walls.push(null);
                }
                for (let x = (y % 2 == 0 ? 1 : 0); x < width; x += 2) {
                    this.Walls.push(this.Tiles[x][y].State == 0);
                }
            }

            //Removes random walls from the maze
            let removeWalls = width * height / 10;
            for (let i = 0; i < removeWalls; i++) {
                var removing = Math.floor(Math.random() * this.Walls.length);
                if (this.Walls[removing] === true) {
                    this.Walls[removing] = false;
                }
            }
        } else {
            this.Walls = wallArray;
        }

        //Creates the correct Tiles array
        this.Tiles = [];
        for (let x = 0; x < this.Width; x++) {
            this.Tiles.push(new Array());
            for (let y = 0; y < this.Height; y++) {
                this.Tiles[x].push(new Tile());
            }
        }

        this.DrawMap();
    }

    DrawMap() {
        let drawOn = GameState.ExtraRawCanvas.getContext("2d");
        drawOn.clearRect(0, 0, this.TileSize * this.Width, this.TileSize * this.Height);
        for (let x = 0; x < this.Width; x++) {
            for (let y = 0; y < this.Height; y++) {
                if ((y + x) % 2 == 0) {
                    drawOn.fillStyle = "#dddddd";
                }
                else {
                    drawOn.fillStyle = "#ffffff";
                }
                drawOn.fillRect(x * this.TileSize, y * this.TileSize, this.TileSize, this.TileSize);
            }
        }
        this.TileImage = drawOn.getImageData(0, 0, this.TileSize * this.Width, this.TileSize * this.Height);
        drawOn.clearRect(0, 0, this.TileSize * this.Width, this.TileSize * this.Height);

        let realWallSize = GameState.WallSizeOption + 1;
        drawOn.fillStyle = "#555555";
        drawOn.lineWidth = realWallSize * 2;
        drawOn.strokeRect(realWallSize, realWallSize, this.TileSize * this.Width, this.TileSize * this.Height);
        drawOn.beginPath();
        for (let i = 0; i < this.Walls.length; i++) {
            if (this.Walls[i] === true) {
                let y = Math.floor(i / this.Width);
                let x = i % this.Width;

                if (y % 2 == 0) {
                    drawOn.moveTo(x * this.TileSize + realWallSize, Math.floor(y / 2) * this.TileSize);
                    drawOn.lineTo(x * this.TileSize + realWallSize, Math.floor(y / 2 + 1) * this.TileSize + realWallSize * 2);
                }
                if (y % 2 == 1) {
                    drawOn.moveTo(x * this.TileSize, Math.floor((y + 1) / 2) * this.TileSize + realWallSize);
                    drawOn.lineTo((x + 1) * this.TileSize + realWallSize * 2, Math.floor((y + 1) / 2) * this.TileSize + realWallSize);
                }
            }
        }
        drawOn.stroke();
    }

    Draw() {
        let realWallSize = GameState.WallSizeOption + 1;
        GameState.Canvas.putImageData(this.TileImage, GameState.LoadedMenu.MapOffsetX + realWallSize, GameState.LoadedMenu.MapOffsetY + realWallSize);
        GameState.Canvas.drawImage(GameState.ExtraRawCanvas, 0, 0, this.TileSize * this.Width + realWallSize * 2, this.TileSize * this.Height + realWallSize * 2, GameState.LoadedMenu.MapOffsetX, GameState.LoadedMenu.MapOffsetY, this.TileSize * this.Width + (GameState.WallSizeOption + 1) * 2, this.TileSize * this.Height + (GameState.WallSizeOption + 1) * 2)
    }

    ColorTile(locationX, locationY, colorID) {
        this.Tiles[locationX][locationY].From = colorID;
        let data = this.TileImage.data;
        let color = [0, 0, 0];
        let toColor = GameState.GetColor(colorID)
        if ((locationX + locationY) % 2 == 1) {
            for (let i = 0; i < 3; i++) {
                color[i] = toColor[i] + (255 - toColor[i]) * 0.3;
            }
        } else {
            for (let i = 0; i < 3; i++) {
                color[i] = toColor[i] * 0.9;
            }
        }
        for (let x = 0; x < this.TileSize; x++) {
            for (let y = 0; y < this.TileSize; y++) {
                data[(locationX * this.TileSize + locationY * this.Width * this.TileSize * this.TileSize + x + y * this.Width * this.TileSize) * 4] = color[0];
                data[(locationX * this.TileSize + locationY * this.Width * this.TileSize * this.TileSize + x + y * this.Width * this.TileSize) * 4 + 1] = color[1];
                data[(locationX * this.TileSize + locationY * this.Width * this.TileSize * this.TileSize + x + y * this.Width * this.TileSize) * 4 + 2] = color[2];
            }
        }
    }

    PlaceTrap(x, y) {
        this.Tiles[x][y].State = 1;
        GameState.LoadedMenu.Particles.push(new TrapParticle(x, y));
        for (let i = 0; i < GameState.Players.length; i++) {
            if (GameState.Players[i] instanceof Robot) {
                GameState.Players[i].RememberedTraps[x][y] = new TrappedLocation();
            }
        }
    }
}

class Tile {
    constructor() {
        this.From = null;
        this.State = 0;
    }
}
