import Svg, { Path, type SvgProps } from 'react-native-svg';

type BellIconProps = SvgProps & {
  color?: string;
};

export function BellIcon({ color = '#FFFFFF', ...props }: BellIconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M6.2 9.8a5.8 5.8 0 0 1 11.6 0c0 3.1.8 4.3 1.5 5.2.3.4 0 1-.5 1H5.2c-.5 0-.8-.6-.5-1 .7-.9 1.5-2.1 1.5-5.2Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Path
        d="M10 18.5a2 2 0 0 0 4 0"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}
