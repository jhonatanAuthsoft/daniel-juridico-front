import Svg, { Path, type SvgProps } from 'react-native-svg';

import { BrandColors } from '@/constants/theme';

type SolicitationIconProps = SvgProps & {
  color?: string;
};

export function SolicitationIcon({
  color = BrandColors.neutral.xlight,
  ...props
}: SolicitationIconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.4952 5.90782C23.4744 3.16611 20.8271 0.518831 18.0854 1.49801L3.57991 6.67856C0.56574 7.75505 0.514493 11.9993 3.50179 13.1483L7.99619 14.8769C8.51125 15.075 8.91829 15.482 9.1164 15.9971L10.845 20.4915C11.994 23.4788 16.2382 23.4275 17.3147 20.4133L22.4952 5.90782ZM18.5899 2.91062C20.1397 2.35713 21.6361 3.85354 21.0826 5.40332L15.9021 19.9088C15.2936 21.6126 12.8945 21.6416 12.245 19.953L10.5164 15.4586C10.4335 15.243 10.3298 15.038 10.2079 14.8462L14.6896 10.3645C14.9825 10.0716 14.9825 9.59669 14.6896 9.30379C14.3967 9.0109 13.9218 9.0109 13.6289 9.30379L9.14725 13.7855C8.95534 13.6635 8.75035 13.5598 8.53465 13.4768L4.04026 11.7482C2.35166 11.0988 2.38063 8.69967 4.08442 8.09117L18.5899 2.91062Z"
        fill={color}
      />
    </Svg>
  );
}
