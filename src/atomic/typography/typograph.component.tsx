import { Text, type TextProps, type TextStyle } from 'react-native';

import {
  FontLineHeight,
  FontSize,
  FontWeight,
  InterFontFamily,
  type InterFontWeight,
  resolveLineHeight,
} from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type TypographProps = TextProps & {
  color?: string;
  bold?: boolean;
};

type TypographStyleConfig = {
  size: number;
  weight: InterFontWeight;
  lineHeight: number;
};

function createTypographStyle({ size, weight, lineHeight }: TypographStyleConfig): TextStyle {
  return {
    fontFamily: InterFontFamily[weight],
    fontSize: size,
    lineHeight: resolveLineHeight(size, lineHeight),
  };
}

function TypographBase({
  style,
  color,
  bold: _bold,
  config,
  ...rest
}: TypographProps & { config: TypographStyleConfig }) {
  const theme = useTheme();

  return (
    <Text style={[{ color: color ?? theme.text }, createTypographStyle(config), style]} {...rest} />
  );
}

export function Display(props: TypographProps) {
  return (
    <TypographBase
      {...props}
      config={{
        size: FontSize.large,
        weight: FontWeight.bold,
        lineHeight: FontLineHeight.medium,
      }}
    />
  );
}

export function Heading1(props: TypographProps) {
  return (
    <TypographBase
      {...props}
      config={{
        size: FontSize.medium,
        weight: FontWeight.semiBold,
        lineHeight: FontLineHeight.medium,
      }}
    />
  );
}

export function Heading2(props: TypographProps) {
  return (
    <TypographBase
      {...props}
      config={{
        size: FontSize.small,
        weight: FontWeight.bold,
        lineHeight: FontLineHeight.medium,
      }}
    />
  );
}

export function Heading3(props: TypographProps) {
  return (
    <TypographBase
      {...props}
      config={{
        size: FontSize.xSmall,
        weight: FontWeight.medium,
        lineHeight: FontLineHeight.medium,
      }}
    />
  );
}

export function Heading4(props: TypographProps) {
  return (
    <TypographBase
      {...props}
      config={{
        size: FontSize.xxSmall,
        weight: FontWeight.bold,
        lineHeight: FontLineHeight.medium,
      }}
    />
  );
}

export function Body1({ bold = false, ...props }: TypographProps) {
  return (
    <TypographBase
      {...props}
      config={{
        size: FontSize.small,
        weight: bold ? FontWeight.bold : FontWeight.medium,
        lineHeight: FontLineHeight.large,
      }}
    />
  );
}

export function Body2({ bold = false, ...props }: TypographProps) {
  return (
    <TypographBase
      {...props}
      config={{
        size: FontSize.xSmall,
        weight: bold ? FontWeight.bold : FontWeight.medium,
        lineHeight: FontLineHeight.large,
      }}
    />
  );
}

export function Link(props: TypographProps) {
  return (
    <TypographBase
      {...props}
      config={{
        size: FontSize.xSmall,
        weight: FontWeight.medium,
        lineHeight: FontLineHeight.large,
      }}
    />
  );
}

export function LinkSmall(props: TypographProps) {
  return (
    <TypographBase
      {...props}
      config={{
        size: FontSize.xxSmall,
        weight: FontWeight.medium,
        lineHeight: FontLineHeight.large,
      }}
    />
  );
}

export function InputLabel(props: TypographProps) {
  return (
    <TypographBase
      {...props}
      config={{
        size: FontSize.xSmall,
        weight: FontWeight.medium,
        lineHeight: FontLineHeight.medium,
      }}
    />
  );
}

export function InputValue(props: TypographProps) {
  return (
    <TypographBase
      {...props}
      config={{
        size: FontSize.xSmall,
        weight: FontWeight.medium,
        lineHeight: FontLineHeight.medium,
      }}
    />
  );
}

export function InputCaption(props: TypographProps) {
  return (
    <TypographBase
      {...props}
      config={{
        size: FontSize.xxxSmall,
        weight: FontWeight.medium,
        lineHeight: FontLineHeight.medium,
      }}
    />
  );
}
