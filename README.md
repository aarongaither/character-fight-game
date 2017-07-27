# Character Fight Game

### Overview

This app is a simple interactive browser game highlighting jquery's ability to dynamically update HTML.  

### Code

The only library used in this app is jQuery. All styling, animations, and logic utilize no helper tools, libraries, or frameworks.

### Gameplay

	* When the game starts, the player will choose a character by clicking on the fighter's picture. The player will fight as that character for the rest of the game.
	* The player must then defeat all of the remaining fighters.
	* The player chooses an opponent by clicking on an enemy's picture.
	* The player will now be able to click the `attack` button.
	* Whenever the player clicks `attack`, their character damages the defender. The opponent will lose `HP` (health points). These points are displayed at the bottom of the defender's picture. 
	* The opponent character will instantly counter the attack. When that happens, the player's character will lose some of their `HP`. These points are shown at the bottom of the player character's picture.
	*The player wins the game by defeating all enemy characters. The player loses the game the game if their character's `HP` falls to zero or below.

### Game Design Notes

	* Each character in the game has 3 attributes: `Health Points`, `Attack Power` and `Counter Attack Power`.
	* Each time the player attacks, their character's Attack Power increases by its base Attack Power. 
	  * For example, if the base Attack Power is 6, each attack will increase the Attack Power by 6 (12, 18, 24, 30 and so on).
	* The enemy character only has `Counter Attack Power`. 
	  * Unlike the player's `Attack Points`, `Counter Attack Power` never changes.

	* The `Health Points`, `Attack Power` and `Counter Attack Power` of each character must differ.
	* No characters in the game can heal or recover Health Points. 
	  * A winning player must pick their characters wisely by first fighting an enemy with low `Counter Attack Power`. This will allow them to grind `Attack Power` and to take on enemies before they lose all of their `Health Points`.

	* Players are able to win and lose the game no matter what character they choose. The challenge comes from picking the right enemies, not choosing the strongest player.