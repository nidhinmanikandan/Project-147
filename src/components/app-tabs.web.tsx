import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import { Colors, Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icon="house">Home</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton icon="square.grid.2x2">Explore</TabButton>
          </TabTrigger>
          <TabTrigger name="daily-tasks" href="/daily-tasks" asChild>
            <TabButton icon="checklist">Daily Tasks</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

type TabIcon = 'house' | 'square.grid.2x2' | 'checklist';

export function TabButton({ children, icon, isFocused, ...props }: TabTriggerSlotProps & { icon: TabIcon }) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
  const symbol =
    icon === 'house'
      ? ({ ios: 'house', web: 'home' } as const)
      : icon === 'square.grid.2x2'
        ? ({ ios: 'square.grid.2x2', web: 'apps' } as const)
        : ({ ios: 'checklist', web: 'checklist' } as const);

  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      <SymbolView
        name={symbol}
        tintColor={isFocused ? colors.text : colors.textSecondary}
        size={22}
      />
      <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <ThemedView type="background" style={styles.innerContainer}>
        {props.children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#E5E3DC',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 520,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    minWidth: 88,
    paddingVertical: Spacing.xs,
  },
  pressed: {
    opacity: 0.7,
  },
});
