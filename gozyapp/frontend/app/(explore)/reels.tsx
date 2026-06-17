import { useEffect } from 'react';
import { router } from 'expo-router';

export default function ReelsRedirectScreen() {
  useEffect(() => {
    router.replace('/(reels)/reels');
  }, []);

  return null;
}
