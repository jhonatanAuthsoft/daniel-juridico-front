import Svg, { Path, type SvgProps } from 'react-native-svg';

type PaperPlaneIconProps = SvgProps & {
  color?: string;
};

export function PaperPlaneIcon({ color = '#FFFFFF', ...props }: PaperPlaneIconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        d="M21.44 2.56a1.5 1.5 0 0 0-1.52-.27L3.3 9.1a1.5 1.5 0 0 0 .08 2.82l6.45 1.87 1.87 6.45a1.5 1.5 0 0 0 2.82.08l6.81-16.62a1.5 1.5 0 0 0-.89-1.14Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Path
        d="m10.9 13.1 3.8-3.8"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}
