import AsyncStorage from "@react-native-async-storage/async-storage";

import type { LearningItem } from "../types/learning";

const LEARNING_ITEMS_KEY = "@recall/learning-items";
const USER_NAME_KEY = "@recall/user-name";

async function readLearningItems(): Promise<LearningItem[]> {
  try {
    const storedItems = await AsyncStorage.getItem(LEARNING_ITEMS_KEY);

    if (!storedItems) {
      return [];
    }

    const parsedItems: unknown = JSON.parse(storedItems);
    return Array.isArray(parsedItems) ? (parsedItems as LearningItem[]) : [];
  } catch {
    return [];
  }
}

async function writeLearningItems(items: LearningItem[]): Promise<boolean> {
  try {
    await AsyncStorage.setItem(LEARNING_ITEMS_KEY, JSON.stringify(items));
    return true;
  } catch {}

  return false;
}

export async function getLearningItems(): Promise<LearningItem[]> {
  return readLearningItems();
}

export async function saveLearningItem(item: LearningItem): Promise<boolean> {
  const items = await readLearningItems();
  return writeLearningItems([...items, item]);
}

export async function updateLearningItem(item: LearningItem): Promise<boolean> {
  const items = await readLearningItems();
  const itemExists = items.some((storedItem) => storedItem.id === item.id);
  const updatedItems = itemExists
    ? items.map((storedItem) => (storedItem.id === item.id ? item : storedItem))
    : [...items, item];

  return writeLearningItems(updatedItems);
}

export async function deleteLearningItem(id: string): Promise<boolean> {
  const items = await readLearningItems();
  return writeLearningItems(items.filter((item) => item.id !== id));
}

export async function getUserName(): Promise<string | null> {
  try {
    const userName = await AsyncStorage.getItem(USER_NAME_KEY);
    return userName?.trim() || null;
  } catch {
    return null;
  }
}

export async function saveUserName(userName: string): Promise<boolean> {
  const trimmedName = userName.trim();

  if (!trimmedName) {
    return false;
  }

  try {
    await AsyncStorage.setItem(USER_NAME_KEY, trimmedName);
    return true;
  } catch {
    return false;
  }
}
