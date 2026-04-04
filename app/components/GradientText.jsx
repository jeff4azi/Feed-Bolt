import { Text } from 'react-native';

// Fallback: plain purple text if MaskedView not available
export default function GradientText({ text, style, className }) {
  return (
    <Text style={style} className={className}>
      {text}
    </Text>
  );
}
