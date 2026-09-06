import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";

SplashScreen.preventAutoHideAsync();

const Poppins_400Regular = require("@expo-google-fonts/poppins/400Regular/Poppins_400Regular.ttf");
const Poppins_500Medium = require("@expo-google-fonts/poppins/500Medium/Poppins_500Medium.ttf");
const Poppins_700Bold = require("@expo-google-fonts/poppins/700Bold/Poppins_700Bold.ttf");
const Poppins_800ExtraBold = require("@expo-google-fonts/poppins/800ExtraBold/Poppins_800ExtraBold.ttf");

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
