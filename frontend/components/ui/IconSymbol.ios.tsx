import { StyleProp, Text, TextStyle } from 'react-native';

type IconSymbolName = 'house.fill' | 'paperplane.fill' | 'chevron.left.forwardslash.chevron.right' | 'chevron.right';

const SYMBOLS: Record<IconSymbolName, string> = {
  'house.fill': '⌂',
  'paperplane.fill': '➤',
  'chevron.left.forwardslash.chevron.right': '‹/›',
  'chevron.right': '›',
};

/** @deprecated A navegação atual não usa símbolos de abas. */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>;
  weight?: string;
}) {
  return <Text style={[{ color, fontSize: size }, style]}>{SYMBOLS[name]}</Text>;
}
