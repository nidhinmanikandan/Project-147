import AsyncStorage from "@react-native-async-storage/async-storage";

import type { LearningItem } from "../types/learning";

const LEARNING_ITEMS_KEY = "@recall/learning-items";

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

async function writeLearningItems(items: LearningItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(LEARNING_ITEMS_KEY, JSON.stringify(items));
  } catch {}
}

export async function getLearningItems(): Promise<LearningItem[]> {
  return readLearningItems();
}

export async function saveLearningItem(item: LearningItem): Promise<void> {
  const items = await readLearningItems();
  await writeLearningItems([...items, item]);
}

export async function updateLearningItem(item: LearningItem): Promise<void> {
  const items = await readLearningItems();
  const itemExists = items.some((storedItem) => storedItem.id === item.id);
  const updatedItems = itemExists
    ? items.map((storedItem) => (storedItem.id === item.id ? item : storedItem))
    : [...items, item];

  await writeLearningItems(updatedItems);
}

export async function deleteLearningItem(id: string): Promise<void> {
  const items = await readLearningItems();
  await writeLearningItems(items.filter((item) => item.id !== id));
}
