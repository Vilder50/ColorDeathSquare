class TryConnectMenu extends Menu {
    constructor() {
        super();

        this.DrawBasicMenuBackground();
        this.Boxes = [new Box(80, 80, 1120, 560, "#ff00ff", "Connecting...", true)];
        this.Buttons = [new Button(480, 480, 320, 80, "#ff0000", "#ffaaaa", "Cancel", 1)];
        this.WrittenCode = [];
        GameState.Socket = new WebSocket("wss://color-death-square.herokuapp.com/");

        GameState.Socket.onopen = () => {
            this.Boxes = [new Box(80, 80, 1120, 560, "#ff00ff", "", true)];
            this.Buttons = [new Button(160, 160, 320, 240, "#ffff00", "#ffffaa", "Join", 2), new Button(800, 160, 320, 240, "#00ff00", "#aaffaa", "Host", 3), new Button(480, 480, 320, 80, "#ff0000", "#ffaaaa", "Back to menu", 1)];
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
                this.Boxes = [new Box(80, 80, 1120, 560, "#ff00ff", "Write room code", "TopCenter"), new Box(160, 120, 940, 80, "#ffffff", "", false)];
                this.Buttons = [new Button(160, 480, 240, 80, "#ff0000", "#ffaaaa", "Cancel", 1),
                    new Button(480, 480, 320, 80, "#ff8000", GameState.WhitenColor(GameState.GetColor(3), 0.7), "Reset", 4),
                    new Button(880, 480, 240, 80, "#70d070", "#70d070", "Enter", 5)];
                for (let i = 0; i < 10; i++) {
                    this.Boxes.push(new Box(250 + i * 80, 130, 60, 60, "#ffffff", "", false));
                }
                for (let i = 0; i < 6; i++) {
                    this.Buttons.push(new Button(160 + i * 160 + Math.floor(i / 3) * 80, 320, 80, 80, GameState.CreateColorString(GameState.GetColor(i)), GameState.WhitenColor(GameState.GetColor(i), 0.7), "", 100 + i));
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
                            console.log(message);
                            if (message.startsWith("Player:")) {
                                let senderID = Number(message.substring(7, message.indexOf(",")));
                                for (let i = 0; i < GameState.Players.length; i++) {
                                    if (GameState.Players[i] instanceof ConnectedPlayer && senderID == GameState.Players[i].ConnectionID) {
                                        message = message.substring(message.indexOf(",") + 1);
                                        if (message == "left") {
                                            GameState.Players.splice(i, 1);
                                        } else {
                                            GameState.Players[i].DoCommand(message);
                                        }
                                        break;
                                    }
                                }
                            } else if (message.startsWith("New:")) {
                                let newID = Number(message.substring(4));
                                GameState.Players.push(new ConnectedPlayer(0,newID));
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
                }
                this.Buttons[2].Color = "#70d070";
                this.Buttons[2].HoverColor = "#70d070";
                break;
            case 5:
                if (this.WrittenCode.length == 10) {
                    this.Boxes = [new Box(80, 80, 1120, 560, "#ff00ff", "Connecting to room...", true)];
                    this.Buttons = [new Button(480, 480, 320, 80, "#ff0000", "#ffaaaa", "Cancel", 1)];
                    GameState.Socket.send("Join:" + this.WrittenCode);
                    GameState.Socket.onmessage = (e) => {
                        let message = e.data;
                        if (message.startsWith("Connected")) {
                            GameState.LoadedMenu = new Connectedmenu();
                        } else {
                            this.Boxes = [new Box(80, 80, 1120, 560, "#ff00ff", "Failed to join room: " + message, true)];
                            this.Buttons = [new Button(160, 480, 320, 80, "#ff0000", "#ffaaaa", "Back to menu", 1), new Button(800, 480, 320, 80, "#00ff00", "#aaffaa", "Try other code", 2)];
                        }
                    }
                }
                break;
            default:
                if (id >= 100 && id <= 106 && this.WrittenCode.length < 10) {
                    let button = id - 100;
                    this.WrittenCode.push(button);
                    this.Boxes[this.WrittenCode.length + 1].Color = GameState.CreateColorString(GameState.GetColor(button));
                    if (this.WrittenCode.length >= 10) {
                        this.Buttons[2].Color = "#00ff00";
                        this.Buttons[2].HoverColor = "#aaffaa";
                    }
                }
                break;
        }
    }
}

class Connectedmenu extends Menu {
    constructor() {
        super();
        this.DrawBasicMenuBackground();
        this.Boxes = [];
        this.Color = [0, 255, 0];

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

        GameState.Socket.onmessage = (e) => {
            let message = e.data;
            console.log(message);
            let buttonColor = GameState.CreateColorString(this.Color);
            let hoverColor = GameState.WhitenColor(this.Color, 0.7);
            if (message == "alive") {
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

class ConnectedPlayer extends Player {
    constructor(id,connectionID) {
        super([], id);
        this.ConnectionID = connectionID;
        this.Dead = true;
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
        }
    }

    Power() {

    }

    ExtraKill() {
        GameState.Socket.send("Player:" + this.ConnectionID + ",dead");
    }
}