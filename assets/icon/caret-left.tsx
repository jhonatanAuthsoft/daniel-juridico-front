import Svg, { Path, type SvgProps } from 'react-native-svg';

export type CaretDirection = 'left' | 'right' | 'up' | 'down';

type CaretLeftIconProps = SvgProps & {
  color?: string;
  /** Base glyph points left; rotate for other sides. */
  direction?: CaretDirection;
};

const ROTATION_DEG: Record<CaretDirection, `${number}deg`> = {
  left: '0deg',
  up: '90deg',
  right: '180deg',
  down: '270deg',
};

export function CaretLeftIcon({
  color = '#FDFDFD',
  direction = 'left',
  style,
  ...props
}: CaretLeftIconProps) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
      style={[{ transform: [{ rotate: ROTATION_DEG[direction] }] }, style]}>
      <Path
        d="M15.5302 4.53033C15.8231 4.23744 15.8231 3.76256 15.5302 3.46967C15.2373 3.17678 14.7624 3.17678 14.4696 3.46967L9.29798 8.64125C7.44299 10.4962 7.44299 13.5038 9.29798 15.3588L14.4696 20.5303C14.7624 20.8232 15.2373 20.8232 15.5302 20.5303C15.8231 20.2374 15.8231 19.7626 15.5302 19.4697L10.3586 14.2981C9.08944 13.0289 9.08944 10.9711 10.3586 9.70191L15.5302 4.53033Z"
        fill={color}
      />
    </Svg>
  );
}
