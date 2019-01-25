/// <reference path="player.js" />
class Robot extends Player {
    constructor(id) {
        super([], id);
        this.Difficulty = 2;
        this.MovementDelay = 0;
    }

    Power() {
        let locationX = Math.round(this.X / 1000);
        let locationY = Math.round(this.Y / 1000);
        if (this.Difficulty == 4 && this.Points >= 20 && GameState.PlayerAt(this.ID, locationX, locationY, 0, true)) {
            this.PlaceTrap(locationX, locationY, false);
        }

        if ((this.Points >= 50 && this.Difficulty == 4) || (this.Points >= 40 && this.Difficulty <= 3) || (this.Points >= 25 && this.Difficulty == 0)) {
            this.PlaceTrap(locationX, locationY, false);
        }
    }

    Move() {
        if (!this.Moving()) {
            let locationX = this.X / 1000;
            let locationY = this.Y / 1000;
            if (this.GoingPath.length >= 1) {
                let location = this.AddDirection(locationX, locationY, this.GoingPath[0]);
                if (!(!(GameState.LoadedMenu.Map.Tiles[location[0]][location[1]].From === this.ID) && this.RememberedTraps[location[0]][location[1]] != undefined && GameState.LoadedMenu.Map.Tiles[location[0]][location[1]].State == 1 && this.Shielding == 0)) {
                    let playerThere = GameState.PlayerAt(this.ID, location[0], location[1], 20, false);
                    if ((this.Shielding != 0 && playerThere) || !playerThere || this.Difficulty <= 3) {
                        this.MovingIn(this.GoingPath[0]);
                        this.GoingPath.splice(0, 1);
                        return;
                    }
                }
                this.GoingPath = [];
            } else {
                if (this.Difficulty <= 2) {
                    if (this.MovementDelay >= 0) {
                        this.MovementDelay -= 40;
                        return;
                    } else {
                        this.MovementDelay = Math.random() * (3 - this.Difficulty) * 15;
                    }
                }
                if (this.Difficulty <= 3) {
                    for (let x = 0; x < GameState.LoadedMenu.Map.Width; x++) {
                        for (let y = 0; y < GameState.LoadedMenu.Map.Height; y++) {
                            if (this.RememberedTraps[x][y] != null) {
                                if (this.RememberedTraps[x][y].Forgetting(Math.pow(5 - this.Difficulty, 2) * 50)) {
                                    this.RememberedTraps[x][y] = null;
                                }
                            }
                        }
                    }
                }
                let spreadedMap = [];
                let spreads = [];
                for (let x = 0; x < GameState.LoadedMenu.Map.Width; x++) {
                    spreadedMap.push([]);
                    for (let y = 0; y < GameState.LoadedMenu.Map.Height; y++) {
                        spreadedMap[x].push(false);
                    }
                }

                spreadedMap[locationX][locationY] = true;

                for (let i = 0; i < 4; i++) {
                    if (this.CanMove(i)) {
                        let location = this.AddDirection(locationX, locationY, i);
                        spreads.push(new Spread(location[0], location[1]));
                        spreads[spreads.length - 1].FullPath.push(i);
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
                        if (this.Difficulty >= 2 && this.Shielding == 0 && this.NotMoving >= 2000 && GameState.PlayerAt(this.ID, spreads[i].X, spreads[i].Y, 20, false)) {
                            trapOut = true;
                            continue;
                        }
                        if (!(GameState.LoadedMenu.Map.Tiles[spreads[i].X][spreads[i].Y].From === this.ID)) {
                            if (this.RememberedTraps[spreads[i].X][spreads[i].Y] != undefined && GameState.LoadedMenu.Map.Tiles[spreads[i].X][spreads[i].Y].State == 1 && this.Shielding == 0) {
                                trapOut = true;
                                continue;
                            }
                            possibleDirection.push(spreads[i].FullPath);
                        } else if (possibleDirection.length == 0) {
                            for (let j = 0; j < 4; j++) {
                                let location = this.AddDirection(spreads[i].X, spreads[i].Y, j);
                                if (this.CanMove(j, spreads[i].X, spreads[i].Y) && !spreadedMap[location[0]][location[1]]) {
                                    let location = this.AddDirection(spreads[i].X, spreads[i].Y, j);
                                    newSpreads.push(new Spread(location[0], location[1]));
                                    newSpreads[newSpreads.length - 1].FullPath = spreads[i].FullPath.slice();
                                    newSpreads[newSpreads.length - 1].FullPath.push(j);
                                    spreadedMap[location[0]][location[1]] = true;
                                }
                            }
                        }
                    }

                    spreads = newSpreads.slice();
                    newSpreads = [];
                }

                if (possibleDirection.length == 0) {
                    if (trapOut && this.UseShield()) {
                        return;
                    } else {
                        if (spreads.length == 0) {
                            let randomDirection = Math.floor(Math.random() * 4);
                            if (this.CanMove(randomDirection)) {
                                let location = this.AddDirection(locationX, locationY, randomDirection);
                                if (!(!(GameState.LoadedMenu.Map.Tiles[location[0]][location[1]].From === this.ID) && this.RememberedTraps[location[0]][location[1]] != undefined && GameState.LoadedMenu.Map.Tiles[location[0]][location[1]].State == 1)) {
                                    let playerThere = GameState.PlayerAt(this.ID, location[0], location[1], 20, false);
                                    if ((this.Shielding != 0 && playerThere) || !playerThere || this.Difficulty <= 3) {
                                        this.MovingIn(randomDirection);
                                    }
                                }
                            }
                        } else {
                            this.GoingPath = spreads[Math.floor(Math.random() * spreads.length)].FullPath;
                        }
                    }
                } else {
                    this.GoingPath = possibleDirection[Math.floor(Math.random() * possibleDirection.length)]
                    this.MovingIn(this.GoingPath[0]);
                    this.GoingPath.splice(0, 1);
                }
            }
        }
    }

    ExtraReset() {
        this.RememberedTraps = [];
        this.GoingPath = [];
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
    constructor(x,y) {
        this.X = x;
        this.Y = y;
        this.FullPath = [];
    }
}

class TrappedLocation {
    constructor() {
        this.ForgetTimer = 10000;
    }

    Forgetting(forgetAmount) {
        this.ForgetTimer -= Math.random() * forgetAmount;
        if (GameState.TrapOption) {
            return false;
        }
        return (this.ForgetTimer <= 0);
    }
}