import { Href, Link } from 'expo-router';
import { ComponentProps } from 'react';
import { Linking } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

/** @deprecated Mantido para compatibilidade; não faz parte das rotas atuais. */
export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={(event) => {
        event.preventDefault();
        void Linking.openURL(href);
      }}
    />
  );
}
