import Svg, { Path, type SvgProps } from 'react-native-svg';

type MapPinIconProps = SvgProps & {
  color?: string;
};

export function MapPinIcon({ color = '#FFFFFF', ...props }: MapPinIconProps) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <Path
        d="M8 8.75a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        stroke={color}
        strokeWidth={1.3}
      />
      <Path
        d="M12.5 6.75c0 3.2-3.4 6.35-4.2 7.05a.5.5 0 0 1-.6 0C6.9 13.1 3.5 9.95 3.5 6.75a4.5 4.5 0 1 1 9 0Z"
        stroke={color}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
