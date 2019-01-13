/// <reference path="player.js" />
class Robot extends Player {
    constructor(id) {
        super([], id);
    }

    Power() {
        if (this.Points >= 40) {
            this.Points -= 20;
            GameState.Map.ColorTile(Math.round(this.X / 1000), Math.round(this.Y / 1000), this.ID);
            GameState.Map.PlaceTrap(Math.round(this.X / 1000), Math.round(this.Y / 1000));
        }
    }

    Move() {
        if (!this.Moving()) {
            let spreadedMap = [];
            let spreads = [];
            for (let x = 0; x < GameState.Map.Width; x++) {
                spreadedMap.push([]);
                for (let y = 0; y < GameState.Map.Height; y++) {
                    spreadedMap[x].push(false);
                }
            }
            let locationX = this.X / 1000;
            let locationY = this.Y / 1000;
            spreadedMap[locationX][locationY] = true;

            for (let i = 0; i < 4; i++) {
                if (this.CanMove(i)) {
                    let location = this.AddDirection(locationX, locationY, i);
                    spreads.push(new Spread(location[0], location[1], i))
                    spreadedMap[location[0]][location[1]] = true;
                }
            }

            let possibleDirection = [];
            let newSpreads = [];
            let distance = 0;
            let trapOut = false;
            while (possibleDirection.length == 0 && distance <= 10) {
                distance++;
                for (let i = 0; i < spreads.length; i++) {
                    if (this.Shielding == 0 && GameState.TrapPlayerAt(this.ID, spreads[i].X, spreads[i].Y)) {
                        trapOut = true;
                        continue;
                    }
                    if (!(GameState.Map.Tiles[spreads[i].X][spreads[i].Y].From === this.ID)) {
                        if (GameState.Map.Tiles[spreads[i].X][spreads[i].Y].State == 1 && this.Shielding == 0) {
                            trapOut = true;
                            continue;
                        }
                        possibleDirection.push(spreads[i].Direction);
                    } else if (possibleDirection.length == 0) {
                        for (let j = 0; j < 4; j++) {
                            if (this.CanMove(j, spreads[i].X, spreads[i].Y)) {
                                let location = this.AddDirection(spreads[i].X, spreads[i].Y, j);
                                newSpreads.push(new Spread(location[0], location[1], spreads[i].Direction))
                                spreadedMap[location[0]][location[1]] = true;
                            }
                        }
                    }
                }

                if (possibleDirection.length == 0) {
                    spreads = newSpreads.slice();
                    newSpreads = [];
                }
            }

            if (distance > 10) {
                if (trapOut && this.Points >= 30) {
                    this.Points -= 30;
                    this.Shielding = 4000;
                    return;
                }
                let randomDirection = Math.floor(Math.random() * 4);
                if (this.CanMove(randomDirection)) {
                    let location = this.AddDirection(locationX, locationY, randomDirection);
                    if (!(!(GameState.Map.Tiles[location[0]][location[1]].From === this.ID) && GameState.Map.Tiles[location[0]][location[1]].State == 1)) {
                        if (this.Shielding != 0 && GameState.TrapPlayerAt(GameState.Players[j].ID, location[0], location[1])) {
                            this.MovingIn(randomDirection);
                        }
                    }
                }
            } else {
                this.MovingIn(possibleDirection[Math.floor(Math.random() * possibleDirection.length)]);
            }
        }
    }

    AddDirection(x, y, direction) {
        switch (direction) {
            case 0:
                return [x, y - 1];
            case 1:
                return [x - 1, y];
            case 2:
                return [x, y + 1];
            case 3:
                return [x + 1, y];
        }
    }
}

class Spread {
    constructor(x,y,direction) {
        this.X = x;
        this.Y = y;
        this.Direction = direction;
    }
}