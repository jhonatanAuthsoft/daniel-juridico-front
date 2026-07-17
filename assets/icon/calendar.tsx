import Svg, { Path, Rect, type SvgProps } from 'react-native-svg';

type CalendarIconProps = SvgProps & {
  color?: string;
};

export function CalendarIcon({ color = '#FFFFFF', ...props }: CalendarIconProps) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <Rect
        x={2}
        y={3}
        width={12}
        height={11}
        rx={2}
        stroke={color}
        strokeWidth={1.3}
      />
      <Path d="M2 6.5h12" stroke={color} strokeWidth={1.3} strokeLinecap="round" />
      <Path
        d="M5.5 2v2.5M10.5 2v2.5"
        stroke={color}
        strokeWidth={1.3}
        strokeLinecap="round"
      />
      <Path
        d="M5 9h.01M8 9h.01M11 9h.01M5 11.5h.01M8 11.5h.01M11 11.5h.01"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </Svg>
  );
}
