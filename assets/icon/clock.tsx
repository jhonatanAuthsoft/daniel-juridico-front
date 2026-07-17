import Svg, { Circle, Path, type SvgProps } from 'react-native-svg';

type ClockIconProps = SvgProps & {
  color?: string;
};

export function ClockIcon({ color = '#FFFFFF', ...props }: ClockIconProps) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <Circle cx={8} cy={8} r={5.35} stroke={color} strokeWidth={1.3} />
      <Path
        d="M8 5.5V8l1.75 1.25"
        stroke={color}
        strokeWidth={1.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
