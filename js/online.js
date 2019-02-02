class TryConnectMenu extends Menu {
    constructor() {
        super();

        this.DrawBasicMenuBackground();
        this.Boxes = [new Box(80, 80, 1120, 560, "#ff00ff", "Connecting...", true)];
        this.Buttons = [new Button(480, 480, 320, 80, "#ff0000", "#ffaaaa", "Cancel", 1)];
        this.WrittenCode = [];
        GameState.Socket = new WebSocket("wss://color-death-square.herokuapp.com/");
        this.JoinType = "keyboard";

        GameState.Socket.onopen = () => {
            this.Boxes = [new Box(80, 80, 1120, 560, "#ff00ff", "", true)];
            this.Buttons = [new Button(500, 160, 280, 240, "#ffff00", "#ffffaa", "Join with keyboard only", 2), new Button(160, 160, 280, 240, "#00ffff", "#aaffff", "Join", 7), new Button(840, 160, 280, 240, "#00ff00", "#aaffaa", "Host", 3), new Button(480, 480, 320, 80, "#ff0000", "#ffaaaa", "Back to menu", 1)];
        }

        GameState.Socket.onerror = (error) => {
            this.Boxes = [new Box(80, 80, 1120, 560, "#ff00ff", "Failed to connect!", true)];
            this.Buttons = [new Button(480, 480, 320, 80, "#ff0000", "#ffaaaa", "Back to menu", 1)];
        }
    }
    ClickedButton(id) {
        switch (id) {
            case 1:
                GameState.LoadedMenu = new MainMenu();
                break;
            case 2:
                this.WrittenCode = [];
                this.Boxes = [new Box(80, 80, 1120, 560, "#ff00ff", "Enter room code", "TopCenter"), new Box(160, 120, 940, 80, "#ffffff", "", false)];
                this.Buttons = [new Button(160, 480, 180, 80, "#ff0000", "#ffaaaa", "Cancel", 1),
                    new Button(420, 480, 180, 80, "#ff8000", GameState.WhitenColor(GameState.GetColor(3), 0.7), "Reset", 4),
                    new Button(940, 480, 180, 80, "#70d070", "#70d070", "Join", 5),
                    new Button(680, 480, 180, 80, "#E0BB00", "#E0BB00", "Delete", 6)];
                for (let i = 0; i < 10; i++) {
                    this.Boxes.push(new Box(250 + i * 80, 130, 60, 60, "#ffffff", "", true));
                }
                for (let i = 0; i < 6; i++) {
                    this.Buttons.push(new Button(160 + i * 160 + Math.floor(i / 3) * 80, 320, 80, 80, GameState.CreateColorString(GameState.GetColor(i)), GameState.WhitenColor(GameState.GetColor(i), 0.7), (i + 1), 100 + i));
                }
                break;
            case 3:
                this.Boxes = [new Box(80, 80, 1120, 560, "#ff00ff", "Creating room...", true)];
                this.Buttons = [new Button(480, 480, 320, 80, "#ff0000", "#ffaaaa", "Cancel", 1)];
                GameState.Socket.send("create room");
                GameState.Socket.onmessage = (e) => {
                    let message = e.data;
                    if (message.startsWith("ID:")) {
                        GameState.ConnectionCode = [];
                        message = message.substring(3);
                        for (let i = 0; i < 10; i++) {
                            GameState.ConnectionCode.push(Number(message.substring(i * 2, i * 2 + 1)));
                        }
                        GameState.LoadedMenu = new MainMenu();
                        GameState.Socket.onmessage = (e) => {
                            let message = e.data;
                            if (message.startsWith("Player:")) {
                                let senderID = Number(message.substring(7, message.indexOf(",")));
                                for (let i = 0; i < GameState.Players.length; i++) {
                                    if (GameState.Players[i] instanceof ConnectedPlayer && senderID == GameState.Players[i].ConnectionID) {
                                        message = message.substring(message.indexOf(",") + 1);
                                        if (message == "left") {
                                            GameState.Players.splice(i, 1);
                                            if (GameState.LoadedMenu instanceof PlayerScreen) {
                                                GameState.LoadedMenu.LoadButtons();
                                            }
                                        } else {
                                            GameState.Players[i].DoCommand(message);
                                        }
                                        break;
                                    }
                                }
                            } else if (message.startsWith("New:")) {
                                let newID = Number(message.substring(4));
                                GameState.Players.push(new ConnectedPlayer(0, newID));
                                if (GameState.LoadedMenu instanceof PlayerScreen) {
                                    GameState.LoadedMenu.LoadButtons();
                                }
                            }
                        }
                    } else {
                        this.Boxes = [new Box(80, 80, 1120, 560, "#ff00ff", "Failed to host: " + message, true)];
                        this.Buttons = [new Button(480, 480, 320, 80, "#ff0000", "#ffaaaa", "Back to menu", 1)];
                    }
                }
                break;
            case 4:
                this.WrittenCode = [];
                for (let i = 0; i < 10; i++) {
                    this.Boxes[i + 2].Color = "#ffffff";
                    this.Boxes[i + 2].Text = "";
                }
                this.Buttons[2].Color = "#70d070";
                this.Buttons[2].HoverColor = "#70d070";
                this.Buttons[3].Color = "#E0BB00";
                this.Buttons[3].HoverColor = "#E0BB00";
                break;
            case 5:
                if (this.WrittenCode.length == 10) {
                    this.Boxes = [new Box(80, 80, 1120, 560, "#ff00ff", "Connecting to room...", true)];
                    this.Buttons = [new Button(480, 480, 320, 80, "#ff0000", "#ffaaaa", "Cancel", 1)];
                    GameState.Socket.send("Join:" + this.WrittenCode);
                    GameState.Socket.onmessage = (e) => {
                        let message = e.data;
                        if (message.startsWith("Connected")) {
                            GameState.ConnectionID = Number(message.substring(message.indexOf(":") + 1));
                            if (this.JoinType == "keyboard") {
                                GameState.LoadedMenu = new ConnectedMenu();
                            } else {
                                GameState.LoadedMenu = new ConnectedScreenMenu();
                            }
                        } else {
                            this.Boxes = [new Box(80, 80, 1120, 560, "#ff00ff", "Failed to join room: " + message, true)];
                            this.Buttons = [new Button(160, 480, 320, 80, "#ff0000", "#ffaaaa", "Back to menu", 1), new Button(800, 480, 320, 80, "#00ff00", "#aaffaa", "Try other code", 2)];
                        }
                    }
                }
                break;
            case 6:
                if (this.WrittenCode.length >= 1) {
                    this.Boxes[this.WrittenCode.length + 1].Color = "#ffffff";
                    this.Boxes[this.WrittenCode.length + 1].Text = "";
                    this.WrittenCode.splice(this.WrittenCode.length - 1, 1);
                    this.Buttons[2].Color = "#70d070";
                    this.Buttons[2].HoverColor = "#70d070";
                    if (this.WrittenCode.length == 0) {
                        this.Buttons[3].Color = "#E0BB00";
                        this.Buttons[3].HoverColor = "#E0BB00";
                    }
                }
                break;
            case 7:
                this.JoinType = "screen";
                this.ClickedButton(2);
                break;
            default:
                if (id >= 100 && id <= 106 && this.WrittenCode.length < 10) {
                    if (this.WrittenCode.length == 0) {
                        this.Buttons[3].Color = "#ffff00";
                        this.Buttons[3].HoverColor = "#ffffaa";
                    }
                    let button = id - 100;
                    this.WrittenCode.push(button);
                    this.Boxes[this.WrittenCode.length + 1].Color = GameState.CreateColorString(GameState.GetColor(button));
                    this.Boxes[this.WrittenCode.length + 1].Text = button + 1;
                    if (this.WrittenCode.length >= 10) {
                        this.Buttons[2].Color = "#00ff00";
                        this.Buttons[2].HoverColor = "#aaffaa";
                    }
                }
                break;
        }
    }

    UpdateExtra() {
        if (this.Boxes.length >= 7) {
            for (let i = 0; i < 6; i++) {
                if (GameState.KeyStates[(i + 1).toString()] === true) {
                    this.ClickedButton(100 + i);
                    GameState.KeyStates[(i + 1).toString()] = false;
                }
            }

            if (GameState.KeyStates["backspace"] === true) {
                this.ClickedButton(6);
                GameState.KeyStates["backspace"] = false;
            }

            if (GameState.KeyStates["enter"] === true) {
                this.ClickedButton(5);
                GameState.KeyStates["enter"] = false;
            }
        }
    }
}

class ConnectedMenu extends Menu {
    constructor() {
        super();
        this.DrawBasicMenuBackground();
        this.Boxes = [];
        this.Color = [0, 255, 255];

        this.HoldButtons = [false, false, false, false, false];
        this.Controls = ["arrowup", "arrowleft", "arrowdown", "arrowright", " "];
        this.Powering = 0;
        this.Alive = false;

        let lockedColor = GameState.WhitenColor(this.Color, 0.9);
        this.Buttons = [new Button(400, 80, 240, 240, lockedColor, lockedColor, "^", 1),
            new Button(720, 400, 240, 240, lockedColor, lockedColor, ">", 4),
            new Button(80, 400, 240, 240, lockedColor, lockedColor, "<", 2),
            new Button(400, 400, 240, 240, lockedColor, lockedColor, "V", 3),
            new Button(1040, 80, 160, 240, lockedColor, lockedColor, "Trap", 5),
            new Button(1040, 400, 160, 240, lockedColor, lockedColor, "Shield", 6),
            new Button(80, 80, 160, 160, "#ff0000", "#ffaaaa", "Exit", 7)];

        GameState.Socket.onmessage = (e) => { this.SocketMessage(e) };
    }

    SocketMessage(e) {
        let message = e.data;
        let buttonColor = GameState.CreateColorString(this.Color);
        let hoverColor = GameState.WhitenColor(this.Color, 0.7);
        let lockedColor = GameState.WhitenColor(this.Color, 0.9);
        if (message.startsWith("New game")) {
            this.Buttons = [new Button(400, 80, 240, 240, buttonColor, hoverColor, "^", 1),
            new Button(720, 400, 240, 240, buttonColor, hoverColor, ">", 4),
            new Button(80, 400, 240, 240, buttonColor, hoverColor, "<", 2),
            new Button(400, 400, 240, 240, buttonColor, hoverColor, "V", 3),
            new Button(1040, 80, 160, 240, buttonColor, hoverColor, "Trap", 5),
            new Button(1040, 400, 160, 240, buttonColor, hoverColor, "Shield", 6),
            new Button(80, 80, 160, 160, "#ff0000", "#ffaaaa", "Exit", 7)];
            this.Alive = true;
        } else if (message == "dead") {
            this.Buttons = [new Button(400, 80, 240, 240, lockedColor, lockedColor, "^", 1),
            new Button(720, 400, 240, 240, lockedColor, lockedColor, ">", 4),
            new Button(80, 400, 240, 240, lockedColor, lockedColor, "<", 2),
            new Button(400, 400, 240, 240, lockedColor, lockedColor, "V", 3),
            new Button(1040, 80, 160, 240, lockedColor, lockedColor, "Trap", 5),
            new Button(1040, 400, 160, 240, lockedColor, lockedColor, "Shield", 6),
            new Button(80, 80, 160, 160, "#ff0000", "#ffaaaa", "Exit", 7)];
            this.Alive = false;
        } else if (message == "kick") {
            this.ClickedButton(7);
        } else if (message.startsWith("color")) {
            message = message.substring(message.indexOf(",") + 1);
            this.Color = JSON.parse("[" + message + "]");
            if (this.Alive) {
                this.SocketMessage({ data: "alive" });
            } else {
                this.SocketMessage({ data: "dead" });
            }
        }
    }

    ClickedButton(id) {
        if (this.Alive) {
            switch (id) {
                case 5:
                    GameState.Socket.send("Move:trap");
                    break;
                case 6:
                    GameState.Socket.send("Move:shield");
                    break;
                default:
                    if (id <= 4) {
                        GameState.Socket.send("Move:s" + (id - 1));
                    }
                    break;
            }
        }

        if (id == 7) {
            GameState.Socket.close();
            GameState.Socket = null;
            GameState.LoadedMenu = new MainMenu();
        }
    }

    UpdateExtra() {
        if (this.Alive) {
            for (let i = 0; i < 5; i++) {
                if (GameState.KeyStates[this.Controls[i]] === true) {
                    if (!this.HoldButtons[i] && i < 4) {
                        GameState.Socket.send("Move:s" + i);
                    }
                    if (i == 4) {
                        this.Powering++;
                        if (this.Powering == 4) {
                            GameState.Socket.send("Move:shield");
                        }
                    }
                    this.HoldButtons[i] = true;
                } else {
                    if (this.HoldButtons[i]) {
                        this.HoldButtons[i] = false;
                        if (i < 4) {
                            GameState.Socket.send("Move:e" + i);
                        } else {
                            if (this.Powering <= 3) {
                                GameState.Socket.send("Move:trap");
                            }
                        }
                    }
                    if (i == 4) {
                        this.Powering = 0;
                    }
                }
            }
        }
    }

    UnclickedButton(id) {
        if (this.Alive) {
            if (id <= 4) {
                GameState.Socket.send("Move:e" + (id - 1));
            }
        }
    }
}

class ConnectedScreenMenu extends GameMenu {
    constructor() {
        super();
        let tileSize = Math.floor((720 - GameState.WallSizeOption * 3) / Math.max(10, 10));
        let walls = [];
        for (let i = 0; i < 180; i++) {
            walls.push(false);
        }
        this.Map = new Map(10, 10, tileSize, walls);
        this.MapOffsetX = Math.floor((1280 - this.Map.Width * this.Map.TileSize - 4) / 2);
        this.MapOffsetY = Math.floor((720 - this.Map.Height * this.Map.TileSize - 4) / 2);
        GameState.Players = [new ThisConnectedPlayer(["arrowup", "arrowleft", "arrowdown", "arrowright", " "], 0)];
        this.Buttons[0].Text = "Exit";
        this.Buttons[1].Text = "Exit";

        GameState.Socket.onmessage = (e) => { this.SocketMessage(e) };
    }

    SocketMessage(e) {
        let message = e.data;
        if (message.startsWith("New game")) {
            GameState.Players.splice(1, GameState.Players.length - 1);
            let gameParts = message.split(",");
            let state = "w";
            let width = gameParts[1];
            let height = gameParts[2];
            let walls = [];
            let playerCoords = [{X:0,Y:0}];
            for (let i = 3; i < gameParts.length; i++) {
                if (state == "w" && gameParts[i] != "p") {
                    //wall format:
                    //iswall,iswall,iswall,iswall...
                    walls.push(gameParts[i] == "1");
                } else if (gameParts[i] == "p") {
                    state = "p";

                } else if (state == "p") {
                    //player format:
                    //playerID,spawnX,spawnY,id
                    if (GameState.ConnectionID != gameParts[i]) {
                        GameState.Players.push(new ShellPlayer(Number(gameParts[i + 3]), Number(gameParts[i])));
                        playerCoords.push({ X: Number(gameParts[i + 1]), Y: Number(gameParts[i + 2]) });
                    } else {
                        playerCoords[0] = { X: Number(gameParts[i + 1]), Y: Number(gameParts[i + 2]) };
                        GameState.Players[0].ID = Number(gameParts[i + 3]);
                        GameState.Players[0].Color = GameState.GetColor(GameState.Players[0].ID);
                    }
                    i += 3;
                }
            }
            this.StartGame(width, height, walls, playerCoords);
        } else if (message == "kick") {
            this.ClickedButton(1);
        }
    }

    ClickedButton(id) {
        switch (id) {
            case 1:
                GameState.Socket.close();
                GameState.Socket = null;
                GameState.LoadedMenu = new MainMenu();
                GameState.Players = [new Player(["arrowup", "arrowleft", "arrowdown", "arrowright", " "], 0)];
                break;
        }
    }

    StartGame(width, height, wallsArray,playerCoords) {
        if (wallsArray != undefined) {
            GameState.Canvas.clearRect(0, 0, 1280, 720);
            let tileSize = Math.floor((720 - GameState.WallSizeOption * 3) / Math.max(width, height));
            this.Map = new Map(width, height, tileSize, wallsArray);
            this.MapOffsetX = Math.floor((1280 - this.Map.Width * this.Map.TileSize - 4) / 2);
            this.MapOffsetY = Math.floor((720 - this.Map.Height * this.Map.TileSize - 4) / 2);
            for (let i = 0; i < playerCoords.length; i++) {
                GameState.Players[i].Reset();
                GameState.Players[i].X = playerCoords[i].X * 1000;
                GameState.Players[i].Y = playerCoords[i].Y * 1000;
                this.Map.ColorTile(playerCoords[i].X, playerCoords[i].Y, GameState.Players[i].ID);
            }
        }
    }

    UpdateExtra() {
        for (let i = 0; i < this.Particles.length; i++) {
            if (this.Particles[i].Update()) {
                this.Particles.splice(i, 1);
                i--;
            }
        }

        for (let i = 0; i < GameState.Players.length; i++) {
            if (!GameState.Players[i].Dead) {
                GameState.Players[i].Update();
            }
        }
    }
}

class ConnectedPlayer extends Player {
    constructor(id, connectionID) {
        super([], id);
        this.ConnectionID = connectionID;
        this.Dead = true;
        this.MoveIn = -1;
    }

    ExtraReset() {
        this.Holding = [false, false, false, false];
    }

    DoCommand(command) {
        switch (command) {
            case "move,s0":
            case "move,s1":
            case "move,s2":
            case "move,s3":
                this.Holding[Number(command.substring(6))] = true;
                break;
            case "move,e0":
            case "move,e1":
            case "move,e2":
            case "move,e3":
                this.Holding[Number(command.substring(6))] = false;
                break;
            case "move,trap":
                this.PlaceTrap(Math.round(this.X / 1000), Math.round(this.Y / 1000), false);
                break;
            case "move,shield":
                this.UseShield();
                break;
            case "move,0":
            case "move,1":
            case "move,2":
            case "move,3":
                this.MoveIn = Number(command.substring(5));
                break;
        }
    }

    Move() {
        let overrideAble = false;
        for (let i = 0; i < 4; i++) {
            if (this.Holding[i] && (!this.Moving() || overrideAble) && this.CanMove(i)) {
                if (this.LastDirection === i) {
                    overrideAble = true;
                }
                this.MovingIn(i);
            }
            if (this.MoveIn == i && this.CanMove(i) && !this.Moving()) {
                this.MovingIn(i);
                this.MoveIn = -1;
            }
        }
    }

    Power() {

    }

    ExtraKill() {
        GameState.Socket.send("Player:" + this.ConnectionID + ",dead");
    }
}

class ThisConnectedPlayer extends Player {
    constructor(keys, id) {
        super(keys, id);
    }

    Move() {
        let moved = -1;
        let overrideAble = false;
        for (let i = 0; i < 4; i++) {
            if (GameState.KeyStates[this.Keys[i]] === true && (!this.Moving() || overrideAble) && this.CanMove(i)) {
                if (this.LastDirection === i) {
                    overrideAble = true;
                }
                this.MovingIn(i);
                moved = i;
            }
        }
        if (moved != -1) {
            GameState.Socket.send("Move:" + moved);
        }
    }

    Power() {
        if (GameState.KeyStates[this.Keys[4]] === true) {
            this.PowerPress += 1;
        }

        if (GameState.KeyStates[this.Keys[4]] === false && this.PowerPress <= 3 && this.PowerPress >= 1) {
            GameState.Socket.send("Move:trap");
        }

        if (this.PowerPress == 4) {
            GameState.Socket.send("Move:shield");
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
}

class ShellPlayer extends Player {
    constructor(id,playerID) {
        super([], id);
        this.ConnectionID = playerID;
    }

    Move() {

    }

    Power() {

    }

    Update() {
        this.UpdateMovement();
    }
}


