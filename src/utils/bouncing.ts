import { defineAnimation, mix } from 'react-native-redash';
import type { Animation, AnimationState } from 'react-native-redash';
import type Animated from 'react-native-reanimated';
import { withDecay } from 'react-native-reanimated';
import { Vec, VecFromAngle } from './svg';

export const GenerateVelocity = () =>
	VecFromAngle([1, 2 * Math.PI * Math.random()]);

export const CruiseVelocity = 0.2;
export const DeaccelConstant = 0.1;

// Deaccel calculation
export const CalcDeaccel = (vel: number) => {
	'worklet';
	if (Math.abs(vel) < CruiseVelocity) return vel;
	return (0.99) * vel;
};

interface BounceAnimationState extends AnimationState {
	lastTimestamp: number
	direction: number
	velocity: number
}

export const withBouncing = (position: number, initialVel: number, lowerBound: number, upperBound: number, isPaused: Readonly<Animated.SharedValue<boolean>>) => {
	'worklet';
	return defineAnimation<BounceAnimationState, BounceAnimationState>(() => {
		'worklet';
		const onFrame: Animation<BounceAnimationState>['onFrame'] = (state, now) => {
			'worklet';
			if (isPaused.value) {
				state.lastTimestamp = now;
				// console.log({ paused: true });
				return false;
			}
			const { direction, velocity } = state;

			state.current += direction * velocity;
			state.velocity = CalcDeaccel(velocity);

			if (state.current >= upperBound)
				state.direction = Math.abs(state.direction) * Math.sign(velocity) * -1;
			else if (state.current <= lowerBound)
				state.direction = Math.abs(state.direction) * Math.sign(velocity);

			state.lastTimestamp = now;
			return false;
		};
		const onStart: Animation<BounceAnimationState>['onStart'] = (state, _, now) => {
			'worklet';
			state.current = position;
			state.velocity = initialVel;
			state.lastTimestamp = now;
			state.direction = 1;
		};
		const callback = () => {
			// Calls once the animation ends.
			'worklet';
		};
		return {
			onFrame,
			onStart,
			callback,
		};
	});
};

// export const bounceGenerator = (lowerBound: number, upperBound: number) => (initialVelocity: number, radius: number) => {
// 	'worklet';
// 	// const randomPosition = mix(Math.random(), lowerBound + radius, upperBound - radius);
// 	//   return withBouncing(randomPosition, initialVelocity, radius, lo);

// 	return defineAnimation<BounceAnimationState, BounceAnimationState>(() => {
// 		'worklet';
// 		const onFrame: Animation<BounceAnimationState>['onFrame'] = (state, now) => {
// 			'worklet';
// 			const { direction, velocity } = state;
// 			state.current += direction * velocity;
// 			state.velocity = CalcDeaccel(velocity);

// 			if (state.current + radius >= upperBound)
// 				state.direction = Math.abs(state.direction) * -1;
// 			else if (state.current - radius <= lowerBound)
// 				state.direction = Math.abs(state.direction);
// 			state.lastTimestamp = now;
// 			return false;
// 		};
// 		const onStart: Animation<BounceAnimationState>['onStart'] = (state, _, now) => {
// 			'worklet';
// 			state.current = mix(Math.random(), lowerBound + radius, upperBound - radius);
// 			state.lastTimestamp = now;
// 			state.velocity = initialVelocity;
// 			state.direction = 1;
// 		};
// 		return {
// 			onFrame,
// 			onStart,
// 		};
// 	});
// };
