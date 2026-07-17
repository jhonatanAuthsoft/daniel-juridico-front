import Svg, { Circle, Path, type SvgProps } from 'react-native-svg';

type SearchIconProps = SvgProps & {
  color?: string;
};

export function SearchIcon({ color = '#FFFFFF', ...props }: SearchIconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Circle cx={11} cy={11} r={6.25} stroke={color} strokeWidth={1.5} />
      <Path
        d="M16.5 16.5 20 20"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}
