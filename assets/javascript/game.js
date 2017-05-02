function Character (name, hp, ap, cap) {
	this.name = name;
	this.healthPoints = hp;
	this.startAttackPower = ap;
	this.attackPower = ap;
	this.counterAttackPower = cap;
	this.dead = false;
	this.attack = function (target) {
		target.healthPoints -= this.attackPower;
		this.attackPower += this.startAttackPower;
	};
	this.counter = function (attacker) {
		attacker.healthPoints -= this.counterAttackPower;
	};
	this.checkDead = function () {
		if (this.healthPoints <= 0){
			this.dead = true;
		}
	};
}

function makeFighters (list) {
	//add our li elemts to rep our fighters, add onclick event for selection
	for (let item of list) {
		elem = $("<div>").addClass("fighter").attr("id", item[0]).text(item[0]);
		subElem = $("<div>").text(item[1]);
		elem.append(subElem);
		elem.click(function () {selectFighter(this.id);});
		$("#fighterSelect").append(elem);
		go.fighters[item[0]] = new Character(item[0], item[1], item[2], item[3])
	}
}

let go = {
	//game Object, holds errythang
	fighters : {},
	playerFighter : "",
	currentTarget : "",
	state : "selectPlayer",
	attackCycle : function () {
		if (this.state === "attack") {
			let player = this.fighters[this.playerFighter];
			let defender = this.fighters[this.currentTarget];
			this.log(`${player.name} attacks ${defender.name} for ${player.attackPower}!`);
			player.attack(defender);
			this.updateHP(defender);
			defender.checkDead();
			if (defender.dead) {
				if (this.checkForWin()){
					$("#"+defender.name).remove();
					this.log("You've won!");
					this.state = "win";
				} else {				
					this.log(`${defender.name} is defeated! Choose another character to attack.`);
					$("#"+defender.name).remove();
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
	checkForWin : function () {
		let win = true;
		$.each(this.fighters, function (fighter, thisFighter) {
			if (thisFighter.name != go.playerFighter && !thisFighter.dead) {
				win = false;
			}
		});
		return win;
	},
	log : function (msg) {
		$("#log").prepend(msg+'<br>');
	},
	updateHP : function (char) {
		$("#"+char.name).children("div").text(char.healthPoints);
	}
}

//2d array for fighter construction
let fightersList = [["Arnav", 90, 5, 7], 
				["Chris", 140, 2, 10], 
				["Corey", 120, 3, 9], 
				["Ryan", 100, 4, 8]];


function selectFighter (fighter) {
	if (go.state === "selectPlayer" || go.state === "selectDefender"){
		function moveFighter () {
			go.log(fighter + " selected.")
			$("#"+fighter).appendTo("#battleZone");
		}
		if (go.state === "selectPlayer") {
			go.playerFighter = fighter;
			go.state = "selectDefender";
			moveFighter();
		} else if (go.state === "selectDefender") {
			if (fighter != go.playerFighter){
				go.currentTarget = fighter;
				go.state = "attack";
				moveFighter();
			} else {
				go.log("You can't battle yourself...")
			}
		}		
	}
}

//attack button that triggers an entire game loop
$("#attack").click(function() {go.attackCycle();});

//construct our fighters into 
makeFighters(fightersList);

$("#log").text("Select a character to play as.");