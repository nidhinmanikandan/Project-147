import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

import { getUserName } from "@/services/learningStorage";

export default function EntryScreen() {
  const [userName, setUserName] = useState<string | null | undefined>(
    undefined,
  );

  useEffect(() => {
    getUserName().then(setUserName);
  }, []);

  if (userName === undefined) {
    return <View />;
  }

  return <Redirect href={userName ? "/(tabs)" : "/onboarding"} />;
}
