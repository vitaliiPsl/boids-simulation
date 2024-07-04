export function distance(a, b) {
	return Math.sqrt(
		(a.position.x - b.position.x) ** 2 + (a.position.y - b.position.y) ** 2
	)
}

export function magnitude(vector) {
	return Math.sqrt(vector.x ** 2 + vector.y ** 2)
}

export function normalize(vector) {
	const mag = magnitude(vector)
	return { x: vector.x / mag, y: vector.y / mag }
}

export function setMagnitude(vector, mag) {
	const norm = normalize(vector)
	return { x: norm.x * mag, y: norm.y * mag }
}

export class Boid {
	constructor(canvas, x, y, config) {
		this.canvas = canvas
		this.ctx = canvas.getContext('2d')

		this.position = { x, y }
		this.velocity = { x: Math.random() * 10 - 5, y: Math.random() * 10 - 5 }

		this.maxSpeed = config.maxSpeed
		this.minSpeed = config.minSpeed

		this.visualRange = config.visualRange
		this.protectedRange = config.protectedRange

		this.cohesionFactor = config.cohesionFactor
		this.alignmentFactor = config.alignmentFactor
		this.separationFactor = config.separationFactor
	}

	update(boids) {
		this.applyBehaviors(boids)

		this.limitSpeed()
		this.limitBoundaries()

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}

	applyBehaviors(boids) {
		const cohesion = this.cohesion(boids)
		const separation = this.separation(boids)
		const alignment = this.alignment(boids)

		this.velocity.x += cohesion.x + separation.x + alignment.x
		this.velocity.y += cohesion.y + separation.y + alignment.y
	}

	cohesion(boids) {
		let pX = 0
		let pY = 0
		let count = 0

		boids.forEach((other) => {
			if (other !== this && distance(this, other) < this.visualRange) {
				pX += other.position.x
				pY += other.position.y
				count += 1
			}
		})

		if (count) {
			pX = pX / count
			pY = pY / count

			const steer = { x: pX - this.position.x, y: pY - this.position.y }
			steer.x *= this.cohesionFactor
			steer.y *= this.cohesionFactor

			return steer
		}

		return { x: 0, y: 0 }
	}

	separation(boids) {
		let vX = 0
		let vY = 0
		let count = 0

		boids.forEach((other) => {
			if (other !== this && distance(this, other) < this.protectedRange) {
				vX += this.position.x - other.position.x
				vY += this.position.y - other.position.y
				count++
			}
		})

		if (count) {
			vX /= count
			vY /= count
		}

		vX *= this.separationFactor
		vY *= this.separationFactor

		return { x: vX, y: vY }
	}

	alignment(boids) {
		let vX = 0
		let vY = 0
		let count = 0

		boids.forEach((other) => {
			if (other !== this && distance(this, other) < this.visualRange) {
				vX += other.velocity.x
				vY += other.velocity.y
				count += 1
			}
		})

		if (count) {
			vX = vX / count
			vY = vY / count

			const steer = { x: vX - this.velocity.x, y: vY - this.velocity.y }
			steer.x *= this.alignmentFactor
			steer.y *= this.alignmentFactor

			return steer
		}

		return { x: 0, y: 0 }
	}

	limitSpeed() {
		let speed = magnitude(this.velocity)

		if (speed > this.maxSpeed) {
			this.velocity = setMagnitude(this.velocity, this.maxSpeed)
		}

		if (speed < this.minSpeed) {
			this.velocity = setMagnitude(this.velocity, this.minSpeed)
		}
	}

	limitBoundaries() {
		const margin = 100
		const turnFactor = 1

		if (this.position.x < margin) {
			this.velocity.x += turnFactor
		}
		if (this.position.x > this.canvas.width - margin) {
			this.velocity.x -= turnFactor
		}
		if (this.position.y < margin) {
			this.velocity.y += turnFactor
		}
		if (this.position.y > this.canvas.height - margin) {
			this.velocity.y -= turnFactor
		}
	}

	draw() {
		this.ctx.beginPath()
		this.ctx.arc(this.position.x, this.position.y, 3, 0, Math.PI * 2)
		this.ctx.fillStyle = '#000'
		this.ctx.fill()
		this.ctx.closePath()
	}
}
