import { PropsWithChildren, ReactElement } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/ThemedView';

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

/** @deprecated Mantido para compatibilidade; as telas atuais usam ScrollView diretamente. */
export default function ParallaxScrollView({ children, headerImage }: Props) {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {headerImage}
        {children}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, gap: 16 },
});
