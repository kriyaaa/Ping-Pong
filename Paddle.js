export default class Paddle {
	constructor(paddle) {
		this.paddle = paddle;
		this.reset();
	}
	reset() {
		this.positionX = 42;
	}
	get rect() {
		return this.paddle.getBoundingClientRect();
	}
	get positionX() {
		return parseFloat(
			getComputedStyle(this.paddle).getPropertyValue("--paddle-position")
		);
	}
	set positionX(value) {
		this.paddle.style.setProperty("--paddle-position", value);
	}
}

