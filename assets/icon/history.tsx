import Svg, { Circle, Path, type SvgProps } from 'react-native-svg';

type HistoryIconProps = SvgProps & {
  color?: string;
};

export function HistoryIcon({ color = '#FFFFFF', ...props }: HistoryIconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M4.5 5.5v3.2h3.2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 8.5V12l2.2 1.4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={0.01} fill={color} />
    </Svg>
  );
}
