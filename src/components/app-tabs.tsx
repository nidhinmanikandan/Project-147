import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "unspecified" ? "light" : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      iconColor={{ default: colors.textSecondary, selected: colors.text }}
      labelStyle={{
        default: { color: colors.textSecondary },
        selected: { color: colors.text },
      }}
      disableIndicator
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "house", selected: "house.fill" }}
          md={{ default: "home", selected: "home" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "square.grid.2x2", selected: "square.grid.2x2.fill" }}
          md={{ default: "explore", selected: "explore" }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="daily-tasks">
        <NativeTabs.Trigger.Label>Daily Tasks</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "checklist", selected: "checklist" }}
          md={{ default: "checklist", selected: "checklist" }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
