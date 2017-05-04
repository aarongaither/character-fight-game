function Character(name, hp, ap, cap) {
    this.name = name;
    this.healthPoints = hp;
    this.startAttackPower = ap;
    this.attackPower = ap;
    this.counterAttackPower = cap;
    this.dead = false;
}

Character.prototype = {
    attack: function(target) {
        target.healthPoints -= this.attackPower;
        this.attackPower += this.startAttackPower;
    },
    counter: function(target) {
        target.healthPoints -= this.counterAttackPower;
    },
    checkDead: function() {
        if (this.healthPoints <= 0) {
            this.dead = true;
        }
    }
};

function makeFighters(list) {
    //add our li elemts to rep our fighters, add onclick event for selection
    for (let item of list) {
        elem = $("<div>").addClass("fighter").attr("id", item[0]);
        hpElem = $("<div>").addClass("hp").text(item[1]);
        nameElem = $("<div>").addClass("name").text(item[0]);
        imgElem = $("<img>").attr('src', "assets/images/" + go.portraits[item[0]].toLowerCase());
        elem.append(nameElem);
        elem.append(imgElem);
        elem.append(hpElem);
        elem.click(function() { selectFighter(this.id); });
        $("#fighterSelect").append(elem);
        go.fighters[item[0]] = new Character(item[0], item[1], item[2], item[3])
    }
}

let go = {
    //game Object, holds errythang
    fighters: {},
    playerFighter: "",
    currentTarget: "",
    state: "selectPlayer",
    portraits: {
        "Ryan": "Ryan.jpg",
        "Chris": "Chris.jpg",
        "Arnav": "Arnav.jpg",
        "Corey": "Corey.png"
    },
    attackCycle: function() {
        if (this.state === "attack") {
            let player = this.fighters[this.playerFighter];
            let defender = this.fighters[this.currentTarget];
            this.log(`${player.name} attacks ${defender.name} for ${player.attackPower}!`);
            player.attack(defender);
            this.updateHP(defender);
            defender.checkDead();
            if (defender.dead) {
                if (this.checkForWin()) {
                    $("#" + defender.name).remove();
                    this.log("You've won!");
                    this.state = "win";
                } else {
                    this.log(`${defender.name} is defeated! Choose another character to attack.`);
                    $("#" + defender.name).remove();
                    this.state = "selectDefender";
                }
            } else {
                defender.counter(player);
                this.log(`${defender.name} counter attacks for ${defender.counterAttackPower}!`);
                this.updateHP(player);
                player.checkDead();
                if (player.dead) {
                    this.log("You lost.");
                    this.state = "Lose";
                }
            }
        } else if (this.state === "selectPlayer" || this.state === "selectDefender") {
            this.log("Need to select attacker and defender before attacking!")
        }
    },
    checkForWin: function() {
        let win = true;
        $.each(this.fighters, function(fighter, thisFighter) {
            if (thisFighter.name != go.playerFighter && !thisFighter.dead) {
                win = false;
            }
        });
        return win;
    },
    log: function(msg) {
        $("#log").prepend(msg + '<br>');
    },
    updateHP: function(char) {
        $("#" + char.name).children("div.hp").text(char.healthPoints);
    }
}

//2d array for fighter construction
let fightersList = [
    ["Arnav", 90, 5, 7],
    ["Chris", 150, 2, 10],
    ["Corey", 130, 3, 9],
    ["Ryan", 110, 4, 8]
];


function selectFighter(fighter) {
    if (go.state === "selectPlayer" || go.state === "selectDefender") {
        function moveFighter(type) {
            go.log(fighter + " selected as " + type + ".")
            $("#" + fighter).appendTo("#battleZone");
            $("#" + fighter).addClass(type);
        }
        if (go.state === "selectPlayer") {
            go.playerFighter = fighter;
            go.state = "selectDefender";
            moveFighter("player");
        } else if (go.state === "selectDefender") {
            if (fighter != go.playerFighter) {
                go.currentTarget = fighter;
                go.state = "attack";
                moveFighter("target");
            } else {
                go.log("You can't battle yourself...")
            }
        }
    }
}

//attack button that triggers an entire game loop
$("#attack").click(function() { go.attackCycle(); });

//construct our fighters into 
makeFighters(fightersList);

$("#log").text("Select a character to play as.");
