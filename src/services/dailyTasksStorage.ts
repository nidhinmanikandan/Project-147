import AsyncStorage from "@react-native-async-storage/async-storage";

import type { DailyTask } from "../types/dailyTask";

const DAILY_TASKS_KEY = "@recall/daily-tasks";

async function readDailyTasks(): Promise<DailyTask[]> {
  try {
    const storedTasks = await AsyncStorage.getItem(DAILY_TASKS_KEY);

    if (!storedTasks) {
      return [];
    }

    const parsedTasks: unknown = JSON.parse(storedTasks);
    return Array.isArray(parsedTasks) ? (parsedTasks as DailyTask[]) : [];
  } catch {
    return [];
  }
}

async function writeDailyTasks(tasks: DailyTask[]): Promise<boolean> {
  try {
    await AsyncStorage.setItem(DAILY_TASKS_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}

export async function getDailyTasks(): Promise<DailyTask[]> {
  return readDailyTasks();
}

export async function saveDailyTask(task: DailyTask): Promise<boolean> {
  const tasks = await readDailyTasks();
  return writeDailyTasks([...tasks, task]);
}

export async function updateDailyTask(task: DailyTask): Promise<boolean> {
  const tasks = await readDailyTasks();
  const taskExists = tasks.some((storedTask) => storedTask.id === task.id);
  const updatedTasks = taskExists
    ? tasks.map((storedTask) => (storedTask.id === task.id ? task : storedTask))
    : [...tasks, task];

  return writeDailyTasks(updatedTasks);
}

export async function deleteDailyTask(id: string): Promise<boolean> {
  const tasks = await readDailyTasks();
  return writeDailyTasks(tasks.filter((task) => task.id !== id));
}
