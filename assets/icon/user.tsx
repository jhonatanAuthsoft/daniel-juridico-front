import Svg, { Circle, Ellipse, type SvgProps } from 'react-native-svg';

type UserIconProps = SvgProps & {
  color?: string;
};

export function UserIcon({ color = '#FDFDFD', ...props }: UserIconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Circle cx={12} cy={7} r={3.25} stroke={color} strokeWidth={1.5} />
      <Ellipse
        cx={12}
        cy={17.25}
        rx={6.25}
        ry={3.5}
        stroke={color}
        strokeWidth={1.5}
      />
    </Svg>
  );
}
