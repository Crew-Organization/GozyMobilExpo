import { useEffect } from 'react';
import { router } from 'expo-router';

export default function ChatRedirectScreen() {
  useEffect(() => {
    router.replace('/(chat)/chat');
  }, []);

  return null;
}
