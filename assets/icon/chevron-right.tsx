import Svg, { Path, type SvgProps } from 'react-native-svg';

type ChevronRightIconProps = SvgProps & {
  color?: string;
};

export function ChevronRightIcon({ color = '#FFFFFF', ...props }: ChevronRightIconProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M7.5 4.5 12.5 10 7.5 15.5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
