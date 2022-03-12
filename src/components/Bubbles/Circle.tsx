import React from 'react';
import { Path } from 'react-native-svg';
import type { ComposeProps } from '~/types/utils';
import type { PathProps } from '~/utils/svg';

type OptionalProps =
{
	cx: number
	cy: number
} & PathProps;

interface RequiredProps {
	r: number
}

type Props = ComposeProps<OptionalProps, RequiredProps>;
const Circle = ({ cx: cx_, cy: cy_, r, ...pathProps }: Props) => {
	const cx = cx_ || r;
	const cy = cy_ || r;
	const circlePath = [
		`M ${cx - r} ${cy}`,
		`a ${r} ${r} 0        0               1         ${2 * r} 0`,
		'Z',
	].join(' ');
	return (
		<Path {...pathProps} d={circlePath}/>
	);
};

export default Circle;
