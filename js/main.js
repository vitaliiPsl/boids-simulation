import { BoidSimulation } from './simulation.js'

const canvas = document.getElementById('canvas')

const config = {
	maxSpeed: 4,
	minSpeed: 0.5,
	visualRange: 50,
	protectedRange: 30,
	cohesionFactor: 0.01,
	alignmentFactor: 0.5,
	separationFactor: 0.2,
}

const simulation = new BoidSimulation(canvas, config, 150)
simulation.animate()
