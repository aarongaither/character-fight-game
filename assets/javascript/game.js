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
		attacker.checkDead();
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
		elem.click(function () {selectFighter(this.innerHTML);});
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
			console.log(player.name + " attacks " + defender.name + " for " + player.attackPower + "!");
			player.attack(defender);	
			console.log(defender.name + " HP: " + defender.healthPoints);
			defender.checkDead();
			if (defender.dead) {
				console.log(defender.name + " is defeated! Choose another character to attack.");
				$("#"+defender.name).remove();
				this.state = "selectDefender";
			} else {
				defender.counter(player);
				console.log(defender.name + " counter attacks for " + defender.counterAttackPower + "!");
				console.log(player.name +" HP: " + player.healthPoints);
				player.checkDead();
				if (player.dead) {
					console.log("You lost.")
					this.state = "Lose";
				}
			}
		} else if (this.state === "selectPlayer" || this.state === "selectDefender") {
			console.log("Need to select attacker and defender before attacking!")
		}
	}
}

//2d array for fighter construction
let fightersList = [["Arnav", 50, 5, 3], 
				["Chris", 100, 2, 10], 
				["Tats", 80, 3, 8], 
				["Ryan", 70, 4, 7]];


function selectFighter (fighter) {
	if (go.state === "selectPlayer" || go.state === "selectDefender"){
		function moveFighter () {
			console.log("selecting player...", fighter)
			let elem = $("#"+fighter);
			$("#battleZone").append(elem);
		}
		if (go.state === "selectPlayer") {
			go.playerFighter = fighter;
			go.state = "selectDefender";
			moveFighter();
		} else if (go.state === "selectDefender") {
			go.currentTarget = fighter;
			go.state = "attack";
			moveFighter();
		}		
	}
}

//attack button that triggers an entire game loop
$("#attack").click(function() {go.attackCycle();});

//construct our fighters into 
makeFighters(fightersList);