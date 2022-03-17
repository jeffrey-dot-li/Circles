import React from 'react';
import Animated, { useAnimatedProps, useDerivedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
// import Circle from './Circle';
import type { Color } from '~/utils/color';
import { rgba } from '~/utils/color';

// import Circle from './Circle';
import { Viewbox } from '~/utils/svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
interface Props {
	color: Color
	active?: boolean
}
const ColorSelect = ({ color, active }: Props) => {
	const animatedProps = useAnimatedProps(() => {
		'worklet';
		return {
			r: withSpring(active ? 16 : 12),
		};
	});
	return (

		<Animated.View>
			<Svg height={36} width={36} viewBox={Viewbox([36, 36])}>
				<Circle cx={18} cy={18} r={16} stroke={rgba(color)} strokeWidth={3} />
				<AnimatedCircle cx={18} cy={18} fill={rgba(color)} animatedProps={animatedProps}/>
			</Svg>
		</Animated.View>
	);
};

export default ColorSelect;
