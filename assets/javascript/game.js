//constructor for our fighter 
function Character(name, hp, ap, cap) {
    this.name = name;
    this.healthPoints = hp;
    this.startAttackPower = ap;
    this.attackPower = ap;
    this.counterAttackPower = cap;
    this.dead = false;
}

//add common functions to constructor prototype for each new object to reference
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

//game Object, holds errythang
let go = {
    //2d array for fighter construction
    fightersList: [
        ["Arnav", 90, 8, 8],
        ["Derek", 150, 2, 15],
        ["Jeff", 130, 4, 12],
        ["Ryan", 110, 6, 10]
    ],
    fighters: {},
    playerFighter: "",
    currentTarget: "",
    //game state manager
    state: "selectPlayer",
    //images for our fighter divs
    portraits: {
        "Ryan": "Ryan.jpg",
        "Derek": "Derek.jpg",
        "Arnav": "Arnav.jpg",
        "Jeff": "Jeff.jpg"
    },
    mainLoop: function() {
        //check state, if not attack, send a msg to alert player
        if (this.state === "attack") {
            //temporarily block all interactions by switching to an unused state
            this.state = "transition";
            //alias vars
            let player = this.fighters[this.playerFighter];
            let defender = this.fighters[this.currentTarget];
            //log attack and run method
            this.log(`${player.name} attacks ${defender.name} for ${player.attackPower}!`);
            player.attack(defender);
            this.updateHP(defender);
            //update defender dead property, then check against it
            //if defender is dead, check if player has won, and update msg and state accordingly
            defender.checkDead();
            if (defender.dead) {
                let defenderElem = $("#" + defender.name);
                defenderElem.addClass("hide");
                setTimeout(function() {
                    if (go.checkForWin()) {
                        defenderElem.remove();
                        go.log("You've won!");
                        go.state = "win";
                    } else {
                        go.log(`${defender.name} is defeated! Choose another character to attack.`);
                        defenderElem.remove();
                        go.state = "selectDefender";
                    }
                },1000)
            } else {
                //since defender survived, counter attack then check if player is dead (lost)
                setTimeout(function() {
                    defender.counter(player);
                    go.log(`${defender.name} counter attacks for ${defender.counterAttackPower}!`);
                    go.updateHP(player);
                    player.checkDead();
                    if (player.dead) {
                        go.log("You lost.");
                        go.state = "Lose";
                        $("#" + player.name).addClass("hide");
                    } else {
                        go.state = "attack";
                    }
                }, 1000);
            }
        } else if (this.state === "selectPlayer" || this.state === "selectDefender") {
            this.log("Need to select attacker and defender before attacking!")
        }
    },
    //method to reset all game stats and states
    reset: function() {
        this.fighters = {};
        this.playerFighter = "";
        this.currentTarget = "";
        this.state = "selectPlayer";
        $(".fighter").remove();
        this.makeFighters();
        $("#log").text("Select a character to play as.");
    },
    //method to check if player has won, checks each other fighter obj for dead
    checkForWin: function() {
        let win = true;
        $.each(this.fighters, function(fighter, thisFighter) {
            if (thisFighter.name != go.playerFighter && !thisFighter.dead) {
                win = false;
            }
        });
        return win;
    },
    //method to update our scroll log
    log: function(msg) {
        $("#log").prepend(msg + '<br>');
    },
    //method to update hp display on character portraits, and jiggle with css animation
    updateHP: function(char) {
        let character = $("#" + char.name);
        character.addClass("hit");
        character.children("div.hp").text(char.healthPoints);
        setTimeout(function() {
            character.removeClass("hit");
        }, 500);
    },
    //method to create character elements, then charater objects
    makeFighters: function() {
        //add our li elemts to rep our fighters, add onclick event for selection, elements aliased for readability
        for (let item of this.fightersList) {
            elem = $("<div>").addClass("fighter").attr("id", item[0]);
            hpElem = $("<div>").addClass("hp").text(item[1]);
            nameElem = $("<div>").addClass("name").text(item[0]);
            imgElem = $("<img>").attr('src', "assets/images/" + this.portraits[item[0]].toLowerCase());
            elem.append(nameElem);
            elem.append(imgElem);
            elem.append(hpElem);
            elem.click(function() { selectFighter(this.id); });
            $("#fighterSelect").append(elem);
            //character objects here
            this.fighters[item[0]] = new Character(item[0], item[1], item[2], item[3])
        }
    }
}

function selectFighter(fighter) {
    //onclick function for selecting player and/or defender
    //check state, if player or defender select then move clicked elem
    if (go.state === "selectPlayer" || go.state === "selectDefender") {
        function moveFighter(type) {
            fighterElem = $("#" + fighter);
            go.log(fighter + " selected as " + type + ".")
            fighterElem.addClass("hide");
            setTimeout(function() {
                fighterElem.appendTo("#battleZone");
                fighterElem.addClass(type);
                setTimeout(function() {
                    fighterElem.removeClass("hide");
                }, 500);
            }, 1000);
        }
        if (go.state === "selectPlayer") {
            //temporarily block all interactions by switching to an unused state
            go.state = "transition";
            go.playerFighter = fighter;
            moveFighter("player");
            //delay new state change till after assignments are done
            setTimeout(function() {
                go.state = "selectDefender";
            }, 2200);
        } else if (go.state === "selectDefender") {
            if (fighter != go.playerFighter) {
                //temporarily block all interactions by switching to an unused state
                go.state = "transition";
                go.currentTarget = fighter;
                moveFighter("target");
                //delay new state change till after assignments are done
                setTimeout(function() {
                    go.state = "attack";
                }, 2200);
            } else {
                go.log("You can't battle yourself...")
            }
        }
    }
}

//attack button that triggers an entire game loop
$("#attack").click(function() { go.mainLoop(); });
$("#reset").click(function() { go.reset(); })


//start the game here
//construct our fighters into elements and objects
//each element has a click listener that will trigger all game events
go.makeFighters();

//set our initial text box
$("#log").text("Select a character to play as.");
