/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const yellow = '#FFD600'; // Danfo yellow
const black = '#111111'; // Deep black
const green = '#4caf50'; // Verified badge green
const darkGray = '#222831';
const lightGray = '#f5f5f5';

export const Colors = {
  light: {
    text: black,
    background: yellow,
    tint: black,
    icon: green,
    tabIconDefault: black,
    tabIconSelected: green,
    primary: yellow,
    secondary: black,
    accent: green,
    surface: lightGray,
  },
  dark: {
    text: yellow,
    background: black,
    tint: yellow,
    icon: green,
    tabIconDefault: yellow,
    tabIconSelected: green,
    primary: black,
    secondary: yellow,
    accent: green,
    surface: darkGray,
  },
};
