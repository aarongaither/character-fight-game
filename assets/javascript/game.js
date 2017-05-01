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
		if (!target.checkDead()) {
			this.healthPoints -= target.counterAttackPower;
			this.checkDead();
		}
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
	state : 0,
	attackCycle : function () {
		if (this.state === 2) {
			let plyr = this.fighters[this.playerFighter];
			let target = this.fighters[this.currentTarget];
			plyr.attack(target);
			console.log(plyr.name + " attacks " + target.name + " for " + plyr.attackPower + "!");
			if (target.dead) {
				$("#"+target.name).remove();
				this.state = 1;
			}
		} else {
			console.log("Need to select attacker and defender before attacking!")
		}
	}
}

// var Fighter1 = new Character("Fighter1", 50, 5, 5);
// var Fighter2 = new Character("Fighter2", 100, 2, 10);
// var Fighter3 = new Character("Fighter3", 80, 3, 4);
// var Fighter4 = new Character("Fighter4", 70, 4, 7);

let fighters = [["Fighter1", 50, 5, 5], 
				["Fighter2", 100, 2, 10], 
				["Fighter3", 80, 3, 4], 
				["Fighter4", 70, 4, 7]];


function selectFighter (fighter) {
	if (go.state === 0 || go.state === 1){
		function moveFighter () {
			console.log("selecting player...", fighter)
			let elem = $("#"+fighter);
			$("#battleZone").append(elem);
		}
		if (go.state === 0) {
			go.playerFighter = fighter;
			go.state = 1;
			moveFighter();
		} else if (go.state === 1) {
			go.currentTarget = fighter;
			go.state = 2;
			moveFighter();
		}		
	}
}

$("#attack").click(function() {go.attackCycle();});

makeFighters(fighters);