import { Boid } from './boid.js'

export class BoidSimulation {
	constructor(canvas, config, numBoids) {
		this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')

		this.config = config
		this.numBoids = numBoids
		this.boids = []

		this.resizeCanvas()
		window.addEventListener('resize', this.resizeCanvas.bind(this), false)

		this.initBoids()
	}

	resizeCanvas() {
		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
	}

	initBoids() {
		for (let i = 0; i < this.numBoids; i++) {
			this.boids.push(
				new Boid(
					this.canvas,
					Math.random() * this.canvas.width,
					Math.random() * this.canvas.height,
					this.config
				)
			)
		}
	}

	animate() {
		this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

		this.boids.forEach((boid) => {
			boid.update(this.boids)
			boid.draw()
		})

		requestAnimationFrame(this.animate.bind(this))
	}
}
