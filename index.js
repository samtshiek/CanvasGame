// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;
document.body.appendChild(canvas);



// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/football-field.jpg";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
//heroImage.src = "images/hero.png";

heroImage.src = "images/ball-small.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};

monsterImage.src = "images/angry-referee-small.png";


var netReady = false;
var netImage = new Image();
netImage.onload = function () {
	netReady = true;
};

var soundFx = document.getElementById("audioElement");;
var winSound = "sounds/crowd-chant.wav";
var loseSound = "sounds/crowd-angry.wav";

//monsterImage.src = "images/monster.png";
netImage.src = "images/net-small.png";

// Game objects
var hero = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0
};
var monster = {
	x: 0,
	y: 0
};

var net = {
	x:360,
	y:0,
	score: 0
};


var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {}; // object were we add up to 4 properties when keys go down
                // and then delete them when the key goes up

addEventListener("keydown", function (e) {
	console.log(e.keyCode + " down")
	console.log("X coordinate: " + hero.x);
	console.log("Y coordinate: " + hero.y);
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	console.log(e.keyCode + " up")
	console.log("X coordinate: " + hero.x);
	console.log("Y coordinate: " + hero.y);
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	//Place the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 400));
	monster.y = 32 + (Math.random() * (canvas.height - 200));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
		if ((hero.y < ( 32) && hero.x < 353) || (hero.y < ( 32) && hero.x > 453)) {
			hero.y = 32;
		}

		if ((hero.y < ( 32) && hero.x > 353) && (hero.y < ( 32) && hero.x < 453)) {
			hero.y = 17;
		}

	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
		if (hero.y > (1000 - ( 81) )) {
			hero.y = 1000 - 81;
		}
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
		if (hero.x < ( 70) ) {
			hero.x = 70;
		}
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
		if (hero.x > ( 800 - (32 +55 ) ) ) {
			hero.x = 800 - (32 +55 );
		}
	}
	//Are you scoring a goal?
	if((hero.y < ( 32) && hero.x > 353) && (hero.y < ( 32) && hero.x < 453)) {
		++net.score;
		soundFx.src = winSound;
		soundFx.play();
		reset();
	}

	// Are they touching?
	//55 w  60 h
	// station 83 w 81 h
	if (
		hero.x+5 <= (monster.x + 200)
		&& monster.x <= (hero.x + 55)
		&& hero.y <= (monster.y + 180)
		&& monster.y <= (hero.y + 52)
	) {
		++monstersCaught;
		reset();
	}
  };

// Draw everything
var render = function () {

	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (netReady) {
		ctx.drawImage(netImage, net.x, net.y);
	}


	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);

	}
	

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	
	if (net.score === 3) {
		ctx.fillText("You've got this! 2 more! ", 32, 32);
	}
	else {
	ctx.fillText("Goals Scored: " + net.score, 32, 32);
	}
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	render();
	then = now;

	if(net.score == 5) {
		alert("you won!!");
	}

	else if (monstersCaught < 2) {
	//  Request to do this again ASAP
	requestAnimationFrame(main);
	}

	else {
		soundFx.src = loseSound;
		soundFx.play();
		alert("you lost...");
		}
};

// Cross-browser support for requestAnimationFrame
//var w = window;
//requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();