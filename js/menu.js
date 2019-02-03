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
        GameState.Canvas.strokeRect(this.X + 2, this.Y + 2, this.Width - 4, this.Height - 4);
        GameState.Canvas.font = "20px Arial";
        GameState.Canvas.fillStyle = "#000000";
        GameState.Canvas.textAlign = "center";
        GameState.Canvas.fillText(this.Text, this.X + this.Width / 2, this.Y + this.Height / 2 + 5);
    }
}

class Box {
    constructor(x, y, width, height, color, text, center) {
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
        this.Color = color;
        this.Text = text;
        this.Center = center;
    }

    Draw() {
        GameState.Canvas.fillStyle = this.Color;
        GameState.Canvas.fillRect(this.X, this.Y, this.Width, this.Height);
        GameState.Canvas.lineWidth = 4;
        GameState.Canvas.strokeRect(this.X + 2, this.Y + 2, this.Width - 4, this.Height - 4);
        GameState.Canvas.font = "20px Arial";
        GameState.Canvas.fillStyle = "#000000";
        if (this.Center == "TopCenter") {
            GameState.Canvas.textAlign = "center";
            GameState.Canvas.fillText(this.Text, this.X + this.Width / 2, this.Y + 30);
        } else if (this.Center) {
            GameState.Canvas.textAlign = "center";
            GameState.Canvas.fillText(this.Text, this.X + this.Width / 2, this.Y + this.Height / 2 + 5);
        } else {
            GameState.Canvas.textAlign = "start";
            GameState.Canvas.fillText(this.Text, this.X + 30, this.Y + this.Height / 2 + 5);
        }
    }
}

class Menu {
    constructor() {
        GameState.Canvas.clearRect(0, 0, 1280, 720);
        this.Buttons = [];
        this.Boxes = [];
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 9; y++) {
                if ((y + x) % 2 == 0) {
                    GameState.Canvas.fillStyle = "#dddddd";
                }
                else {
                    GameState.Canvas.fillStyle = "#ffffff";
                }
                GameState.Canvas.fillRect(x * 80, y * 80, 80, 80);
            }
        }
        GameState.Canvas.lineWidth = 4;
        GameState.Canvas.strokeRect(2, 2, GameState.RawCanvas.width - 4, GameState.RawCanvas.height - 4);
        this.Background = GameState.Canvas.getImageData(0, 0, 1280, 720);
        GameState.Canvas.clearRect(0, 0, 1280, 720)
    }

    Click(x,y) {
        for (let i = 0; i < this.Buttons.length; i++) {
            if (this.Buttons[i].Hovering(x, y)) {
                this.ClickedButton(this.Buttons[i].ID);
                return;
            }
        }
    }

    Unclick(x, y) {
        for (let i = 0; i < this.Buttons.length; i++) {
            if (this.Buttons[i].Hovering(x, y)) {
                this.UnclickedButton(this.Buttons[i].ID);
                return;
            }
        }
    }

    UnclickedButton(id) {

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
        this.DrawExtra();

        for (let i = 0; i < this.Boxes.length; i++) {
            if (this.Boxes[i] != null) {
                this.Boxes[i].Draw();
            }
        }

        for (let i = 0; i < this.Buttons.length; i++) {
            this.Buttons[i].Draw();
        }

        this.DrawExtraLast();
    }

    DrawExtra() {

    }

    DrawExtraLast() {

    }

    DrawBasicMenuBackground() {
        GameState.Canvas.putImageData(this.Background, 0, 0);
    }
}

class MainMenu extends Menu {
    constructor() {
        super();

        this.Buttons = [new Button(480, 400, 320, 80, "#00ff00", "#aaffaa", "Play", 1),
            new Button(400, 560, 160, 80, "#ffff00", "#ffffaa", "Players", 2),
            new Button(720, 560, 160, 80, "#ff0000", "#ffaaaa", "Options", 3),
            new Button(1040, 560, 160, 80, "#00ffff", "#aaffff", "Help", 4)];

        if (GameState.ConnectionCode != null) {
            this.Boxes = [new Box(80, 80, 1120, 80, "#ffffff", "Room:", false)];
            for (let i = 0; i < 10; i++) {
                this.Boxes.push(new Box(250 + i * 80, 90, 60, 60, GameState.CreateColorString(GameState.GetColor(GameState.ConnectionCode[i])), (GameState.ConnectionCode[i] + 1), true));
            }
            this.Buttons.push(new Button(80, 560, 160, 80, "#ff00ff", "#ffaaff", "End Room", 6));
            this.Buttons.push(new Button(1130, 90, 60, 60, "#dddddd", "#ffffff", "Copy", 7));
        } else {
            this.Buttons.push(new Button(80, 560, 160, 80, "#ff00ff", "#ffaaff", "Online", 5));
        }
        this.DrawBasicMenuBackground();
    }

    ClickedButton(id) {
        switch (id) {
            case 1:
                GameState.LoadedMenu = new GameMenu();
                GameState.LoadedMenu.StartGame();
                break;
            case 2:
                GameState.LoadedMenu = new PlayerScreen();
                break;
            case 3:
                GameState.LoadedMenu = new OptionMenu();
                break;
            case 4:
                GameState.LoadedMenu = new HelpMenu();
                break;
            case 5:
                GameState.LoadedMenu = new TryConnectMenu();
                break;
            case 6:
                GameState.ConnectionCode = null;
                GameState.Socket.send('close');
                GameState.Socket.close();
                GameState.Socket = null;
                for (let i = 0; i < GameState.Players.length; i++) {
                    if (GameState.Players[i] instanceof ConnectedPlayer) {
                        GameState.Players.splice(i, 1)
                        i--;
                    }
                }
                GameState.LoadedMenu = new MainMenu();
                break;
            case 7:
                let linkHolder = document.createElement("textarea");
                linkHolder.value = window.location.protocol + "//" + window.location.host + "/" + window.location.pathname + "?key=" + GameState.ConnectionCode.toString().replace(/[,]*/g,"");
                document.body.appendChild(linkHolder);
                linkHolder.select();
                document.execCommand("copy");
                document.body.removeChild(linkHolder);
                break;
        }
    }
}

class PlayerScreen extends Menu {
    constructor() {
        super();

        this.SelectedPlayer = -1;
        this.SelectedButton = -1;
        this.RemvoingPlayer = false;
        this.ShownPage = 0;

        this.LoadButtons();
    }

    ClickedButton(id) {
        switch (id) {
            case -2:
                this.ShownPage++;
                this.LoadButtons();
                break;
            case -1:
                this.ShownPage--;
                this.LoadButtons();
                break;
            case 1:
                GameState.LoadedMenu = new MainMenu();
                break;
            case 2:
                if (this.SelectedPlayer == -1) {
                    this.RemvoingPlayer = !this.RemvoingPlayer;
                    this.Buttons[1].Text = this.RemvoingPlayer ? "Removing..." : "Remove Player";
                } else {
                    if (GameState.Players[this.SelectedPlayer] instanceof ConnectedPlayer) {
                        GameState.Socket.send("Player:" + GameState.Players[this.SelectedPlayer].ConnectionID + ",kick");
                    }
                    GameState.Players.splice(this.SelectedPlayer, 1);
                    this.DeselectPlayer();
                }
                break;
            case 3:
                this.RemvoingPlayer = false;
                GameState.Players.push(new Player(["arrowup", "arrowleft", "arrowdown", "arrowright", " "], GameState.GetNextID()));
                this.ShownPage = Math.floor((GameState.Players.length - 1) / 6);
                this.LoadButtons();
                this.DeselectPlayer();
                break;
            case 4:
                this.RemvoingPlayer = false;
                GameState.Players.push(new Robot(GameState.GetNextID()));
                this.ShownPage = Math.floor((GameState.Players.length - 1) / 6);
                this.LoadButtons();
                this.DeselectPlayer();
                break;
            default:
                if (id >= 100) {
                    let playerLocation = id - 100;
                    if (this.RemvoingPlayer) {
                        if (GameState.Players[playerLocation] instanceof ConnectedPlayer) {
                            GameState.Socket.send("Player:" + GameState.Players[playerLocation].ConnectionID + ",kick");
                        }
                        GameState.Players.splice(playerLocation, 1);
                        this.LoadButtons();
                    } else {
                        this.SelectedPlayer = playerLocation;
                        this.SelectedButton = -1;
                        this.LoadButtons();
                    }
                    break;
                }

                if (id >= 5 && id <= 10) {
                    GameState.Players[this.SelectedPlayer].ID = id - 5;
                    GameState.Players[this.SelectedPlayer].Color = GameState.GetColor(GameState.Players[this.SelectedPlayer].ID);
                    if (GameState.Players[this.SelectedPlayer] instanceof ConnectedPlayer) {
                        GameState.Socket.send("Player:" + GameState.Players[this.SelectedPlayer].ConnectionID + ",color," + GameState.Players[this.SelectedPlayer].Color);
                    }
                    this.LoadButtons();
                    break;
                }
                if (id >= 11 && id <= 15) {
                    this.SelectedButton = id - 11;
                    this.LoadButtons();
                    break;
                }
                if (id >= 16 && id <= 20) {
                    GameState.Players[this.SelectedPlayer].Difficulty = id - 16;
                    this.LoadButtons();
                    break;
                }
                break;
        }
    }

    DeselectPlayer() {
        this.SelectedPlayer = -1;
        this.SelectedButton = -1;
        this.Boxes = [];
        this.LoadButtons();
    }

    LoadButtons() {
        this.Buttons = [new Button(80, 560, 160, 80, "#00ff00", "#aaffaa", "Menu", 1)];

        if (GameState.Players.length > 1) {
            this.Buttons.push(new Button(320, 560, 160, 80, "#ff0000", "#ffaaaa", this.RemvoingPlayer ? "Removing..." : "Remove Player", 2));
        } else {
            this.RemvoingPlayer = false;
        }

        this.Buttons.push(new Button(800, 560, 160, 80, "#ffff00", "#ffffaa", "Add Player", 3));
        this.Buttons.push(new Button(1040, 560, 160, 80, "#ff00ff", "#ffaaff", "Add Robot", 4));

        if (this.ShownPage != 0) {
            this.Buttons.push(new Button(90, 90, 60, 60, "#ff8000", GameState.WhitenColor(GameState.GetColor(3), 0.7), "<", -1));
        }

        if ((this.ShownPage + 1) * 6 < GameState.Players.length) {
            this.Buttons.push(new Button(1130, 90, 60, 60, "#00ffff", "#aaffff", ">", -2));
        }

        for (let i = this.ShownPage * 6; i < Math.min(GameState.Players.length, this.ShownPage * 6 + 6); i++) {
            let color = GameState.CreateColorString(GameState.GetColor(GameState.Players[i].ID));
            let hoverColor = GameState.WhitenColor(GameState.GetColor(GameState.Players[i].ID), 0.7);
            this.Buttons.push(new Button(160 + (i % 6) * 160 + Math.floor((i % 6) / 3) * 80, 80, 80, 80, color, hoverColor, (GameState.Players[i] instanceof Robot) ? "[*_*]" : ((GameState.Players[i] instanceof ConnectedPlayer) ? "{@_@}" : "(o_o)"), 100 + i));
        }

        if (this.SelectedPlayer != -1) {
            this.Boxes = [new Box(320, 240, 640, 240, GameState.CreateColorString(GameState.GetColor(GameState.Players[this.SelectedPlayer].ID)), "", false)];

            for (let i = 0; i < 6; i++) {
                let color = GameState.CreateColorString(GameState.GetColor(i));
                let hoverColor = GameState.WhitenColor(GameState.GetColor(i), 0.7);
                this.Buttons.push(new Button(330 + (i % 2) * 80, 250 + Math.floor(i / 2) * 80, 60, 60, color, hoverColor, "", 5 + i));
            }
            let player = GameState.Players[this.SelectedPlayer];

            if (!(player instanceof Robot)) {
                if (!(player instanceof ConnectedPlayer)) {
                    this.Buttons.push(new Button(800, 330, 60, 60, this.SelectedButton == 0 ? "#cccccc" : "#909090", "#dddddd", this.KeyText(player.Keys[0]), 11));
                    for (let i = 0; i < 3; i++) {
                        this.Buttons.push(new Button(720 + i * 80, 410, 60, 60, this.SelectedButton == 1 + i ? "#cccccc" : "#909090", "#dddddd", this.KeyText(player.Keys[i + 1]), 12 + i));
                    }
                    this.Buttons.push(new Button(560, 410, 140, 60, this.SelectedButton == 4 ? "#cccccc" : "#909090", "#dddddd", this.KeyText(player.Keys[4]), 15));
                }
            } else {
                for (let i = 0; i < 5; i++) {
                    this.Buttons.push(new Button(560 + i * 80, 330, 70, 60, player.Difficulty == i ? GameState.CreateColorString(GameState.GetColor(i)) : "#909090", player.Difficulty == i ? GameState.WhitenColor(GameState.GetColor(i), 0.7) : "#dddddd", (i + 1), 16 + i));
                }
            }
        }
    }

    KeyText(text) {
        text = text.toUpperCase();
        switch (text) {
            case "ARROWUP":
                return "^"
                break;
            case "ARROWRIGHT":
                return ">"
                break;
            case "ARROWLEFT":
                return "<"
                break;
            case "ARROWDOWN":
                return "V"
                break;
            case " ":
                return "[S]"
                break;
            case "ENTER":
                return "[E]"
                break;
            case "BACKSPACE":
                return "[B]"
                break;
            case "CONTROL":
                return "[C]"
                break;
            case "CAPSLOCK":
                return "[CL]"
                break;
            case "CAPSLOCK":
                return "[CL]"
                break;
            case "ESCAPE":
                return "[E]"
                break;
            case "META":
                return "[M]"
                break;
            case "CONTEXTMENU":
                return "[CM]"
                break;
            case "DELETE":
                return "[D]"
                break;
            case "INSERT":
                return "[I]"
                break;
            case "PAGEUP":
                return "[PU]"
                break;
            case "PAGEDOWN":
                return "[PD]"
                break;
            case "NUMLOCK":
                return "[NL]"
                break;
            case "SCROLLLOCK":
                return "[SL]"
                break;
            case "PAUSE":
                return "[P]"
                break;
        }
        return text;
    }

    UpdateExtra() {
        if (this.SelectedButton != -1) {
            let size = 0;
            let key;
            for (key in GameState.KeyStates) {
                if (GameState.KeyStates.hasOwnProperty(key)) {
                    if (GameState.KeyStates[key]) {
                        GameState.Players[this.SelectedPlayer].Keys[this.SelectedButton] = key;
                        this.SelectedButton = -1;
                        this.LoadButtons();
                        return;
                    }
                }
            }
        }
    }

    DrawExtra() {
        this.DrawBasicMenuBackground();
    }
}

class GameMenu extends Menu {
    constructor() {
        super();

        this.UpdatesList = new GameUpdates();
        this.Map = null;
        this.Particles = [];
        this.MapOffsetX = 0;
        this.MapOffsetY = 0;
        this.ResetTimer = 0;
        this.Buttons = [new Button(40, 620, 80, 80, "#ff0000", "#ffaaaa", "Menu", 1), new Button(1160, 620, 80, 80, "#ff0000", "#ffaaaa", "Menu", 1)];
        this.Boxes = [new Box(0, 0, 160, 720, "#dddddd", "Wins", "TopCenter"), new Box(1120, 0, 160, 720, "#dddddd", "Kills", "TopCenter"), null, null, null, null, null, null, null, null, null, null, null, null];
        this.UpdateWinScores();
        this.UpdateKillScores();
    }

    ClickedButton(id) {
        switch (id) {
            case 1:
                GameState.LoadedMenu = new MainMenu();
                if (GameState.Socket != null) {
                    GameState.Socket.send("End game");
                }
                break;
        }
    }

    StartGame() {
        GameState.Canvas.clearRect(0, 0, 1280, 720);
        let totalSize = GameState.Players.length * (GameState.MazeSizeOption + 1) * 7;
        let around = Math.round(Math.sqrt(totalSize));
        let randomness = Math.floor(around / 3);
        let width = around + Math.floor(Math.random() * randomness - randomness / 2);
        let height = Math.round(totalSize / width);
        let tileSize = Math.floor(Math.min((900 - GameState.WallSizeOption * 3) / width, (720 - GameState.WallSizeOption * 3) / height));

        this.Particles = [];

        this.Map = new Map(width, height, tileSize);
        this.MapOffsetX = Math.floor((1280 - this.Map.Width * this.Map.TileSize - 4) / 2);
        this.MapOffsetY = Math.floor((720 - this.Map.Height * this.Map.TileSize - 4) / 2);
        for (let i = 0; i < GameState.Players.length; i++) {
            GameState.Players[i].X = Math.floor(Math.random() * width) * 1000;
            GameState.Players[i].Y = Math.floor(Math.random() * height) * 1000;
            GameState.Players[i].Reset();
            this.Map.ColorTile(GameState.Players[i].X / 1000, GameState.Players[i].Y / 1000, GameState.Players[i].ID);
            if (GameState.Players[i] instanceof Robot) {
                GameState.Players[i].RememberedTraps = [];
                for (let x = 0; x < width; x++) {
                    GameState.Players[i].RememberedTraps.push([]);
                    for (let y = 0; y < height; y++) {
                        GameState.Players[i].RememberedTraps[x].push(null);
                    }
                }
            }
        }

        if (GameState.Socket != null) {
            let wallString = "";
            for (let i = 0; i < this.Map.Walls.length; i++) {
                if (this.Map.Walls[i] === true) {
                    wallString += "1,";
                } else {
                    wallString += "0,";
                }
            }

            let playerString = "";
            for (let i = 0; i < GameState.Players.length; i++) {
                if (GameState.Players[i] instanceof ConnectedPlayer) {
                    GameState.Players[i].PlayerID = GameState.Players[i].ConnectionID;
                } else {
                    GameState.Players[i].PlayerID = i + 10000;
                }

                playerString += "," + GameState.Players[i].PlayerID + "," + GameState.Players[i].X / 1000 + "," + GameState.Players[i].Y / 1000 + "," + GameState.Players[i].ID;
                if (i != GameState.Players.length - 1) {
                }
            }

            GameState.Socket.send("New game," + this.Map.Width + "," + this.Map.Height + "," + wallString  + "p" + playerString);
        }
        this.UpdateWinScores();
        this.UpdateKillScores();
    }

    UpdateExtra() {
        for (let i = 0; i < this.Particles.length; i++) {
            if (this.Particles[i].Update()) {
                this.Particles.splice(i, 1);
                i--;
            }
        }

        let teamsAlive = 0;
        let teams = [];
        let realPlayers = 0;
        for (let i = 0; i < GameState.Players.length; i++) {
            if (!GameState.Players[i].Dead) {
                GameState.Players[i].Update();
                if (!teams.includes(GameState.Players[i].ID)) {
                    teamsAlive++;
                    teams.push(GameState.Players[i].ID);
                }
                if (!(GameState.Players[i] instanceof Robot)) {
                    realPlayers++;
                }
            }
        }

        if (teamsAlive <= 1 || (realPlayers == 0 && GameState.RobotOption)) {
            if (this.ResetTimer == 0) {
                if (!GameState.TrapOption) {
                    for (let x = 0; x < this.Map.Width; x++) {
                        for (let y = 0; y < this.Map.Height; y++) {
                            if (this.Map.Tiles[x][y].State == 1) {
                                this.Particles.push(new TrapParticle(x, y, true));
                            }
                        }
                    }
                }

                if (teams.length >= 1) {
                    let winner = teams[Math.floor(Math.random() * teams.length)];
                    GameState.Wins[winner]++;
                    this.UpdatesList.WinnerUpdate = "," + winner;
                    this.Boxes[0].Color = GameState.CreateColorString(GameState.GetColor(winner));
                    this.Boxes[1].Color = this.Boxes[0].Color;
                    this.UpdateWinScores();
                    for (let i = 0; i < GameState.Players.length; i++) {
                        if (GameState.Players[i].ID == winner) {
                            GameState.Players[i].Shielding = 10000;
                            GameState.Players[i].AddMoving = 10000;
                        }
                    }
                }
            }
            this.ResetTimer += 40;
            if (this.ResetTimer >= 2500) {
                this.StartGame();
                this.ResetTimer = 0;
            }
        }

        this.UpdatesList.SendUpdates();
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

    UpdateWinScores() {
        let sortedWins = [];
        for (let index in GameState.Wins) {
            if (isNaN(index) || !this.ColorIsIngame(index)) {
                continue;
            }
            let sorted = false;
            let value = GameState.Wins[index];
            for (let i = 0; i < sortedWins.length; i++) {
                if (i >= 7) {
                    sorted = true;
                    break;
                }
                if (value > sortedWins[i].Amount) {
                    sorted = true;
                    sortedWins.splice(i, 0, { ID: index, Amount: value });
                    break;
                }
            }
            if (!sorted) {
                sortedWins.push({ ID: index, Amount: value });
            }
        }
        let updateString = "";
        for (let i = 0; i < 6; i++) {
            if (i < sortedWins.length) {
                this.Boxes[i + 2] = new Box(40, 40 + i * 90, 80, 80, GameState.CreateColorString(GameState.GetColor(Number(sortedWins[i].ID))), sortedWins[i].Amount, true);
                updateString += "," + sortedWins[i].ID + "," + sortedWins[i].Amount;
            } else {
                this.Boxes[i + 2] = null;
            }
        }
        this.UpdatesList.WinScoresUpdate = updateString;
    }

    UpdateKillScores() {
        let sortedKills = [];
        for (let index in GameState.Kills) {
            if (isNaN(index) || !this.ColorIsIngame(index)) {
                continue;
            }
            let sorted = false;
            let value = GameState.Kills[index];
            for (let i = 0; i < sortedKills.length; i++) {
                if (i >= 7) {
                    sorted = true;
                    break;
                }
                if (value > sortedKills[i].Amount) {
                    sorted = true;
                    sortedKills.splice(i, 0, { ID: index, Amount: value });
                    break;
                }
            }
            if (!sorted) {
                sortedKills.push({ ID: index, Amount: value });
            }
        }
        let updateString = "";
        for (let i = 0; i < 6; i++) {
            if (i < sortedKills.length) {
                this.Boxes[i + 8] = new Box(1160, 40 + i * 90, 80, 80, GameState.CreateColorString(GameState.GetColor(Number(sortedKills[i].ID))), sortedKills[i].Amount, true);
                updateString += "," + sortedKills[i].ID + "," + sortedKills[i].Amount;
            } else {
                this.Boxes[i + 8] = null;
            }
        }
        this.UpdatesList.KillScoresUpdate = updateString;
    }

    ColorIsIngame(id) {
        for (let i = 0; i < GameState.Players.length; i++) {
            if (GameState.Players[i].ID == id) {
                return true;
            }
        }

        return false;
    }
}

class OptionMenu extends Menu {
    constructor() {
        super();

        this.LoadButtons();
        this.DrawBasicMenuBackground();
        this.Boxes = [new Box(480, 80, 720, 80, "#ff8000", "Map size:", false), new Box(480, 240, 720, 80, "#ff0000", "Wall display size:", false), new Box(480, 400, 720, 80, "#ffff00", "End if only robots are left:", false), new Box(480, 560, 720, 80, "#00ffff", "Traps visible for forever:", false)];
    }

    LoadButtons() {
        this.Buttons = [new Button(80, 240, 240, 240, "#00ff00", "#aaffaa", "Menu", 1), new Button(80, 560, 240, 80, "#ff00ff", "#ffaaff", "Default", 2)];

        for (let i = 0; i < 5; i++) {
            this.Buttons.push(new Button(810 + i * 80, 90, 60, 60, GameState.MazeSizeOption == i ? GameState.CreateColorString(GameState.GetColor(i)) : "#909090", GameState.MazeSizeOption == i ? GameState.WhitenColor(GameState.GetColor(i), 0.7) : "#dddddd", i + 1, 3 + i));
            this.Buttons.push(new Button(810 + i * 80, 250, 60, 60, GameState.WallSizeOption == i ? GameState.CreateColorString(GameState.GetColor(i)) : "#909090", GameState.WallSizeOption == i ? GameState.WhitenColor(GameState.GetColor(i), 0.7) : "#dddddd", i + 1, 8 + i));
        }
        this.Buttons.push(new Button(810, 410, 140, 60, GameState.RobotOption ?  "#00ff00" : "#909090", GameState.RobotOption ? "#aaffaa" : "#dddddd", "ON", 13));
        this.Buttons.push(new Button(1050, 410, 140, 60, !GameState.RobotOption ?  "#ff0000" : "#909090", !GameState.RobotOption ? "#ffaaaa" : "#dddddd", "OFF", 14));
        this.Buttons.push(new Button(810, 570, 140, 60, GameState.TrapOption ? "#00ff00" : "#909090", GameState.TrapOption ? "#aaffaa" : "#dddddd", "ON", 15));
        this.Buttons.push(new Button(1050, 570, 140, 60, !GameState.TrapOption ? "#ff0000" : "#909090", !GameState.TrapOption ? "#ffaaaa" : "#dddddd", "OFF", 16));
        this.Buttons.push(new Button(80, 80, 240, 80, "#ff0000", "#ffaaaa", "Fullscreen", 17));
    }

    ClickedButton(id) {
        switch (id) {
            case 1:
                GameState.LoadedMenu = new MainMenu();
                break;
            case 2:
                GameState.MazeSizeOption = 2;
                GameState.WallSizeOption = 1;
                GameState.RobotOption = false;
                GameState.TrapOption = false;
                this.LoadButtons();
                break;
            case 13:
                this.ChangeRobotOption(true);
                break;
            case 14:
                this.ChangeRobotOption(false);
                break;
            case 15:
                this.ChangeTrapOption(true);
                break;
            case 16:
                this.ChangeTrapOption(false);
                break;
            case 17:
                if (1 >= outerHeight - innerHeight) {
                    document.exitFullscreen();
                } else {
                    GameState.RawCanvas.requestFullscreen();
                }
                break;
            default:
                if (id >= 3 && id <= 7) {
                    this.ChangeMazeSizeOption(id - 3);
                } else if (id >= 8 && id <= 14) {
                    this.ChangeWallSizeOption(id - 8);
                }
                break;
       }
    }

    ChangeRobotOption(newState) {
        GameState.RobotOption = newState;
        this.LoadButtons();
    }

    ChangeTrapOption(newState) {
        GameState.TrapOption = newState;
        this.LoadButtons();
    }

    ChangeMazeSizeOption(newState) {
        GameState.MazeSizeOption = newState;
        this.LoadButtons();
    }

    ChangeWallSizeOption(newState) {
        GameState.WallSizeOption = newState;
        this.LoadButtons();
    }
}

class HelpMenu extends Menu {
    constructor() {
        super();

        this.DrawBasicMenuBackground();
        this.Buttons = [new Button(480, 560, 320, 80, "#00ff00", "#aaffaa", "Menu", 1)];
        this.Boxes = [new Box(80, 80, 1120, 400, "#ffffff", "", "TopCenter")]
    }

    ClickedButton(id) {
        switch (id) {
            case 1:
                GameState.LoadedMenu = new MainMenu();
                break;
        }
    }

    DrawExtraLast() {
        GameState.Canvas.font = "20px Arial";
        GameState.Canvas.fillStyle = "#000000";
        GameState.Canvas.textAlign = "center";

        let offset = 50;
        GameState.Canvas.fillText("Move onto other player's colors to get points.", 640, 120 + offset);
        GameState.Canvas.fillText("When at 20 points your square will get another square inside. Press button to place trap and lose 20 points.", 640, 150 + offset);
        GameState.Canvas.fillText("Traps turns invisible after some time. Stepping on a trap you don't own and you are out.", 640, 180 + offset);
        GameState.Canvas.fillText("When at 30 points your sqaure will get a rotated square inside. Hold button to get shield for some time and lose 30 points.", 640, 210 + offset);
        GameState.Canvas.fillText("When you have a shield you can't be killed by traps and you will disarm the ones you move over.", 640, 240 + offset);
        GameState.Canvas.fillText("After 10 seconds of not getting any points you will die.", 640, 270 + offset);
        GameState.Canvas.fillText("Last player/team alive wins.", 640, 330 + offset);
        GameState.Canvas.fillText("Good Luck!", 640, 360 + offset);
    }
}