const INITIAL_VELOCITY = 0.025;
const VELOCITY_INCREASE = 0.000001;

//Random Number Generator 
let randomNumberGenerator = (max, min) => {
	return Math.random() * (max - min) + min;
};

//Ball Class
export default class Ball {
	constructor(ball) {
		this.ball = ball;
		this.GAME_ON = false;
		this.reset();
	}
	//Get Ball X Position
	get positionX() {
		return parseFloat(
			getComputedStyle(this.ball).getPropertyValue("--ball-x-position")
		);
	}
	//Set Ball X Position 
	set positionX(value) {
		this.ball.style.setProperty("--ball-x-position", value);
	}
	//Get Ball Y Position 
	get positionY() {
		return parseFloat(
			getComputedStyle(this.ball).getPropertyValue("--ball-y-position")
		);
	}
	//Set Ball Y Position 
	set positionY(value) {
		this.ball.style.setProperty("--ball-y-position", value);
	}
	//Get Ball Rects
	get rect() {
		return this.ball.getBoundingClientRect();
	}
	//Move the Ball 
	move() {
		while (
			Math.abs(this.direction.x) <= 0.2 ||
			Math.abs(this.direction.x) >= 0.9
		) {
			const angle = randomNumberGenerator(0, 2 * Math.PI);
			this.direction = { x: Math.cos(angle), y: Math.sin(angle) };
		}
		this.velocity = INITIAL_VELOCITY;
	}
	//Get Score
	get score() {
		return "";
	}
	//Set Score 
	set score(value) {
		this.paddleTopScoreElement = value[0];
		this.paddleBottomScoreElement = value[1];
	}
	//Reset 
	reset() {
		this.positionX = 50;
		this.positionY = 50;
		this.GAME_ON = false;
		this.direction = { x: 0, y: 0 };
		this.move();
		this.paddleTopScore = 0;
		this.paddleBottomScore = 0;
	}
	//Check Collision 
	isCollision = (paddleRect, ballRect) => {
		const midPos = (ballRect.left + ballRect.right) / 2;
		if (
			paddleRect.left <= midPos &&
			paddleRect.right >= midPos &&
			paddleRect.top <= ballRect.bottom &&
			paddleRect.bottom >= ballRect.top
		) {
			if (paddleRect.top < 50) {
				this.paddleTopScore += 100;
				this.paddleTopScoreElement.innerText = this.paddleTopScore;
				return true;
			}
			else {
				this.paddleBottomScore += 100;
				this.paddleBottomScoreElement.innerText = this.paddleBottomScore;
				return true;
			}
		}
	};

	//Update Ball Animation Frame
	updateAnimationFrame(delta, paddleRects) {
		this.positionX += this.velocity * this.direction.x * delta;
		this.positionY += this.velocity * this.direction.y * delta;
		this.velocity += VELOCITY_INCREASE * delta;
		const ballRect = this.rect;
		if (ballRect.right >= window.innerWidth || ballRect.left <= 0) {
			this.direction.x *= -1;
		}
		if (
			paddleRects.some((paddleRect) =>
				this.isCollision(paddleRect, ballRect)
			)
		) {
			this.direction.y *= -1;
		}
	}
}