import Ball from "./Ball.js";
import Paddle from "./Paddle.js";

const ballElement = document.getElementById("ball");
const paddleTopElement = document.getElementsByClassName("paddle")[0];
const paddleBottomElement = document.getElementsByClassName("paddle")[1];
const paddleTopScoreElement = document.getElementById("rod1");
const paddleBottomScoreElement = document.getElementById("rod2");
const ball = new Ball(ballElement);
const paddleTop = new Paddle(paddleTopElement);
const paddleBottom = new Paddle(paddleBottomElement);

ball.score = [paddleTopScoreElement, paddleBottomScoreElement];

let maxScore;
let maxRod;
let whoWon = "";
let windowHeight = window.innerHeight;
let score = 0;

(function () {
	maxScore = localStorage.getItem("maxScore");
	maxRod = localStorage.getItem("maxRod");
	if (maxRod === null || maxScore === null) {
		alert(
			"This is the first time you are playing this game.\nLET'S START !!!"
		);
		maxScore = 0;
		maxRod = "Rod 1";
		return;
	} else {
		alert(`${maxRod} has maximum score of ${maxScore}`);
		return;
	}
})();

//Animation Update 
let previousTime;
let clearFrame,
	clearFrame2,
	animation = true;
let updateAnimationFrame = (currentTime) => {
	if (previousTime != null) {
		const delta = currentTime - previousTime;
		ball.updateAnimationFrame(delta, [paddleTop.rect, paddleBottom.rect]);
		const hue = parseFloat(
			getComputedStyle(document.documentElement).getPropertyValue("--hue")
		);
		document.documentElement.style.setProperty("--hue", hue + delta * 0.01);
		if (lost()) {
			ball.GAME_ON = false;
			animation = false;
		} else {
			ball.GAME_ON = true;
			animation = true;
		}
	}
	if (!animation) {
		window.cancelAnimationFrame(clearFrame);
		matchEnds();
		console.log("clearFrame1: ", clearFrame);
		const localScore = localStorage.getItem("maxScore");
		const localRod = localStorage.getItem("maxRod");
		alert(
			`${whoWon} wins with a score of ${score}\nMax Score is: ${localScore} by ${localRod}`
		);
	} else {
		previousTime = currentTime;
		clearFrame = window.requestAnimationFrame(updateAnimationFrame);
		console.log("RUNNING....");
	}
};

//If Match Lost Deciding
let lost = () => {
	const ballRect = ball.rect;
	if (ballRect.bottom >= windowHeight) {
		whoWon = "Rod 1";
		ball.paddleTopScore += 100;
	}
	else if (ballRect.top <= 0) {
		whoWon = "Rod 2";
		ball.paddleBottomScore += 100;
	}
	return ballRect.bottom >= windowHeight || ballRect.top <= 0;
};

//Local Storage 
let storeScore = (maxScore, score, whoWon) => {
	if (maxScore < score) {
		maxScore = score;
		maxRod = whoWon;
		localStorage.setItem("maxScore", maxScore);
		localStorage.setItem("maxRod", maxRod);
		console.log(maxScore, score, whoWon);
	}
};

//Handling the Match Lose
let matchEnds = () => {
	maxScore = localStorage.getItem("maxScore");
	if (maxScore === null) {
		maxScore = 0;
	}
	if (whoWon === "Rod 1") {
		score = ball.paddleTopScore;
	} else if (whoWon === "Rod 2") {
		score = ball.paddleBottomScore;
	}
	storeScore(maxScore, score, whoWon);
	ball.reset();
	paddleTop.reset();
	paddleBottom.reset();
	ball.paddleTopScoreElement.innerText = 0;
	ball.paddleBottomScoreElement.innerText = 0;
};

// D A ENTER - Keypress Events
window.addEventListener("keypress", (event) => {
	let paddlePositionX = paddleTop.positionX;
	if (event.keyCode === 100 && paddlePositionX < 86) {
		paddleTop.positionX = paddlePositionX + 2;
		paddleBottom.positionX = paddlePositionX + 2;
	}
	else if (event.keyCode === 97 && paddlePositionX > 0) {
		paddleTop.positionX = paddlePositionX - 2;
		paddleBottom.positionX = paddlePositionX - 2;
	}
	//Start the Game & Move the Ball
	else if (event.keyCode === 13 && ball.GAME_ON === false) {
		window.cancelAnimationFrame(clearFrame2);
		console.log("clearFrame2: ", clearFrame2);
		ball.GAME_ON = true;
		previousTime = null;
		animation = true;
		ball.reset();
		paddleTop.reset();
		paddleBottom.reset();
		paddleTopScoreElement.innerText = 0;
		paddleBottomScoreElement.innerText = 0;
		clearFrame2 = window.requestAnimationFrame(updateAnimationFrame);
	}
});

// <== ==> - Keydown Events
window.addEventListener("keydown", (event) => {
	let paddlePositionX = paddleTop.positionX;
	if (event.keyCode === 39 && paddlePositionX < 86) {
		paddleTop.positionX = paddlePositionX + 2;
		paddleBottom.positionX = paddlePositionX + 2;
	}
	else if (event.keyCode === 37 && paddlePositionX > 0) {
		paddleTop.positionX = paddlePositionX - 2;
		paddleBottom.positionX = paddlePositionX - 2;
	}
});
//--------------------------------------------------------------
