import { World } from 'koota';
import { Input, Movement, Time, Transform } from '../traits';

export function convertInputToMovement(world: World) {
	// Get the delta time from the world clock
	const { delta } = world.get(Time)!;

	// Query entities with input, transform, and movement components
	const results = world.query(Input, Transform, Movement);

	// Update each entity's velocity and rotation
	results.updateEach(([input, transform, movement]) => {
		const { velocity, thrust } = movement;
		const { rotation } = transform;

		// Apply thrust in the input direction
		const thrustForce = thrust * delta * 100;
		velocity.x += input.x * thrustForce;
		velocity.y += input.y * thrustForce;

		// Rotate to face the direction of movement
		const normalizedVelocity = velocity.clone().normalize();
		const angle = Math.atan2(normalizedVelocity.y, normalizedVelocity.x);
		rotation.z = angle;
	});
}
