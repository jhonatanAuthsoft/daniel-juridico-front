import Svg, { Path, type SvgProps } from 'react-native-svg';

type CheckIconProps = SvgProps & {
  color?: string;
};

export function CheckIcon({ color = '#22C55E', ...props }: CheckIconProps) {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.416 3.37595C12.7607 3.60571 12.8538 4.07137 12.624 4.41601L7.62404 11.916C7.4994 12.103 7.2975 12.2242 7.0739 12.2463C6.8503 12.2685 6.62855 12.1892 6.46967 12.0303L3.46967 9.03032C3.17678 8.73742 3.17678 8.26255 3.46967 7.96966C3.76256 7.67676 4.23744 7.67676 4.53033 7.96966L6.88343 10.3228L11.376 3.58396C11.6057 3.23932 12.0714 3.14619 12.416 3.37595Z"
        fill={color}
      />
    </Svg>
  );
}
