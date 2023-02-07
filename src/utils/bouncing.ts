import type { Animation } from 'react-native-reanimated';
import { defineAnimation } from 'react-native-reanimated';
import { VecFromAngle } from './svg';
export const GenerateVelocity = () =>
	VecFromAngle([1, 2 * Math.PI * Math.random()]);

export const CruiseVelocity = 0.2;
export const DeaccelConstant = 0.1;

// Deaccel calculation
export const CalcDeaccel = (vel: number, ratio = 1) => {
	'worklet';
	if (Math.abs(vel) < CruiseVelocity * ratio) return vel;
	return (0.99) * vel;
};

interface BounceAnimation extends Animation<BounceAnimation> {
	lastTimestamp: number
	direction: number
	velocity: number
}

// const withCustomAnimation = (
// 	animationParam: AnimationParameter,
// ) => {
// 	'worklet';
// 	return defineAnimation(() => {
// 		'worklet';
// 		return animationParameter(animationParam);
// 	});
// };

export const generateBounceEngine = (lowerBound: number, upperBound: number) =>
	(_nextAnimation: any, position: number, initialVel: number, radius: number, totalVel: number) => {
		// whoops so radius is actually diameter :/
		'worklet';
		const ratio = initialVel / totalVel;
		return defineAnimation<BounceAnimation>(_nextAnimation, () => {
			'worklet';
			const nextAnimation: BounceAnimation
				= typeof _nextAnimation === 'function' ? _nextAnimation() : _nextAnimation;
			const onFrame: Animation<BounceAnimation>['onFrame'] = (state, now) => {
				'worklet';
				const { direction, velocity } = state;

				state.current = direction * velocity + (typeof state.current === 'number' ? state.current : 0);
				state.velocity = CalcDeaccel(velocity, ratio);

				if (state.current >= upperBound - radius)
					state.direction = Math.abs(state.direction) * Math.sign(velocity) * -1;
				else if (state.current <= lowerBound)
					state.direction = Math.abs(state.direction) * Math.sign(velocity);

				state.lastTimestamp = now;
				return false;
			};
			const onStart: Animation<BounceAnimation>['onStart'] = (state, value, now, previousState) => {
				'worklet';
				state.current = position;
				state.velocity = initialVel;
				state.lastTimestamp = now;
				state.direction = 1;
				nextAnimation.onStart(nextAnimation, value, now, previousState);
			};
			const callback = (finished?: boolean): void => {
				if (nextAnimation.callback)
					nextAnimation.callback(finished);
			};
			return {
				onFrame,
				onStart,
				callback,
				isHigherOrder: true,
				current: nextAnimation?.current,
				previousAnimation: null,
				lastTimestamp: 0,
				direction: 1,
				velocity: 0,
			};
		});
	};
// export const withBouncing = (_nextAnimation: any, position: number, initialVel: number, lowerBound: number, upperBound: number, isPaused: Readonly<Animated.SharedValue<boolean>>) => {
// 	'worklet';
// 	return defineAnimation<BounceAnimation>(() => {
// 		'worklet';
// 		const onFrame: Animation<BounceAnimation>['onFrame'] = (state, now) => {
// 			'worklet';
// 			if (isPaused.value) {
// 				state.lastTimestamp = now;
// 				// console.log({ paused: true });
// 				return false;
// 			}
// 			const { direction, velocity } = state;

// 			state.current += direction * velocity;
// 			state.velocity = CalcDeaccel(velocity);

// 			if (state.current >= upperBound)
// 				state.direction = Math.abs(state.direction) * Math.sign(velocity) * -1;
// 			else if (state.current <= lowerBound)
// 				state.direction = Math.abs(state.direction) * Math.sign(velocity);

// 			state.lastTimestamp = now;
// 			return false;
// 		};
// 		const onStart: Animation<BounceAnimation>['onStart'] = (state, _, now) => {
// 			'worklet';
// 			state.current = position;
// 			state.velocity = initialVel;
// 			state.lastTimestamp = now;
// 			state.direction = 1;
// 		};
// 		const callback = () => {
// 			// Calls once the animation ends.
// 			'worklet';
// 		};
// 		return {
// 			onFrame,
// 			onStart,
// 			callback,
// 		};
// 	});
// };

// export const bounceGenerator = (lowerBound: number, upperBound: number) => (initialVelocity: number, radius: number) => {
// 	'worklet';
// 	// const randomPosition = mix(Math.random(), lowerBound + radius, upperBound - radius);
// 	//   return withBouncing(randomPosition, initialVelocity, radius, lo);

// 	return defineAnimation<BounceAnimation, BounceAnimation>(() => {
// 		'worklet';
// 		const onFrame: Animation<BounceAnimation>['onFrame'] = (state, now) => {
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
// 		const onStart: Animation<BounceAnimation>['onStart'] = (state, _, now) => {
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
