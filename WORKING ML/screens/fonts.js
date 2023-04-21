import { useFonts } from 'expo-font';

export const useCustomFonts = () => {
  return useFonts({
    'CalifornianFB-Bold': require('./../assets/fonts/CalifornianFB-Bold.ttf'),
  });
};
