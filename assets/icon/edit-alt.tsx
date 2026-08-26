import Svg, { Path, type SvgProps } from 'react-native-svg';

import { BrandColors } from '@/constants/theme';

type EditAltIconProps = SvgProps & {
  color?: string;
  size?: number;
};

export function EditAltIcon({
  color = BrandColors.neutral.xlight,
  size = 24,
  width,
  height,
  ...props
}: EditAltIconProps) {
  const resolvedWidth = width ?? size;
  const resolvedHeight = height ?? size;

  return (
    <Svg
      width={resolvedWidth}
      height={resolvedHeight}
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.29289 15.7075L13.5 5.50038C14.8807 4.11967 17.1193 4.11967 18.5 5.50038C19.8807 6.88109 19.8807 9.11967 18.5 10.5004L8.29289 20.7075C8.10536 20.895 7.851 21.0004 7.58579 21.0004H4C3.44772 21.0004 3 20.5527 3 20.0004V16.4146C3 16.1494 3.10536 15.895 3.29289 15.7075ZM4.5 19.5004V16.6217L14.5607 6.56104C15.3556 5.76611 16.6444 5.76611 17.4393 6.56104C18.2343 7.35596 18.2343 8.64479 17.4393 9.43972L7.37868 19.5004H4.5Z"
        fill={color}
      />
      <Path
        d="M12 19.2504C11.5858 19.2504 11.25 19.5862 11.25 20.0004C11.25 20.4146 11.5858 20.7504 12 20.7504H19C19.4142 20.7504 19.75 20.4146 19.75 20.0004C19.75 19.5862 19.75 19.2504 19 19.2504H12Z"
        fill={color}
      />
    </Svg>
  );
}
