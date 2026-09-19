import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { BodyText } from "@/components/ui/BodyText";
import { BaseButton } from "@/components/ui/BaseButton";
import { IconButton } from "@/components/ui/IconButton";
import { MutedText } from "@/components/ui/MutedText";
import { ScreenTitle } from "@/components/ui/ScreenTitle";
import {
  borderWidths,
  colors,
  hardShadow,
  radius,
  Spacing,
  typography,
} from "@/constants/theme";
import {
  deleteDailyTask,
  getDailyTasks,
  saveDailyTask,
  updateDailyTask,
} from "@/services/dailyTasksStorage";
import type { DailyTask } from "@/types/dailyTask";

function createTaskId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DailyTasksScreen() {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [title, setTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const today = getTodayKey();

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      getDailyTasks().then((storedTasks) => {
        if (isMounted) {
          setTasks(storedTasks);
        }
      });

      return () => {
        isMounted = false;
      };
    }, []),
  );

  async function handleSave() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage("Add a task name first.");
      return;
    }

    const existingTask = tasks.find((task) => task.id === editingTaskId);
    const task: DailyTask = existingTask
      ? { ...existingTask, title: trimmedTitle }
      : {
          id: createTaskId(),
          title: trimmedTitle,
          completedOn: null,
          createdAt: new Date().toISOString(),
        };
    const saved = existingTask
      ? await updateDailyTask(task)
      : await saveDailyTask(task);

    if (!saved) {
      setErrorMessage("Unable to save this task. Please try again.");
      return;
    }

    setTasks((currentTasks) =>
      existingTask
        ? currentTasks.map((currentTask) =>
            currentTask.id === task.id ? task : currentTask,
          )
        : [...currentTasks, task],
    );
    setTitle("");
    setEditingTaskId(null);
    setErrorMessage("");
  }

  function startEditing(task: DailyTask) {
    setTitle(task.title);
    setEditingTaskId(task.id);
    setErrorMessage("");
  }

  async function toggleTask(task: DailyTask) {
    const updatedTask = {
      ...task,
      completedOn: task.completedOn === today ? null : today,
    };
    const saved = await updateDailyTask(updatedTask);

    if (!saved) {
      setErrorMessage("Unable to update this task. Please try again.");
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === task.id ? updatedTask : currentTask,
      ),
    );
  }

  async function handleDelete(id: string) {
    const deleted = await deleteDailyTask(id);

    if (!deleted) {
      setErrorMessage("Unable to delete this task. Please try again.");
      return;
    }

    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    if (editingTaskId === id) {
      setTitle("");
      setEditingTaskId(null);
    }
  }

  function confirmDelete(task: DailyTask) {
    Alert.alert("Delete this daily task?", task.title, [
      { text: "CANCEL", style: "cancel" },
      {
        text: "DELETE",
        style: "destructive",
        onPress: () => void handleDelete(task.id),
      },
    ]);
  }

  const completedCount = tasks.filter(
    (task) => task.completedOn === today,
  ).length;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenTitle style={styles.title}>DAILY TASKS</ScreenTitle>
        <MutedText style={styles.intro}>
          Small promises you want to keep every day.
        </MutedText>

        <View style={styles.progressRow}>
          <Text style={styles.progressNumber}>{completedCount}</Text>
          <MutedText>of {tasks.length} complete today</MutedText>
        </View>

        <View style={styles.editor}>
          <TextInput
            accessibilityLabel="Daily task name"
            onChangeText={setTitle}
            onSubmitEditing={() => void handleSave()}
            placeholder="What needs doing every day?"
            placeholderTextColor={colors.mutedText}
            returnKeyType="done"
            style={styles.input}
            value={title}
          />
          <BaseButton
            title={editingTaskId ? "SAVE CHANGES" : "ADD TASK"}
            onPress={() => void handleSave()}
            variant="yellow"
          />
          {editingTaskId ? (
            <Pressable
              onPress={() => {
                setTitle("");
                setEditingTaskId(null);
              }}
            >
              <MutedText style={styles.cancel}>Cancel editing</MutedText>
            </Pressable>
          ) : null}
        </View>
        {errorMessage ? <MutedText>{errorMessage}</MutedText> : null}

        <View style={styles.list}>
          {tasks.length > 0 ? (
            tasks.map((task) => {
              const isComplete = task.completedOn === today;

              return (
                <View key={task.id} style={styles.taskRow}>
                  <Pressable
                    accessibilityLabel={`${isComplete ? "Uncomplete" : "Complete"} ${task.title}`}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isComplete }}
                    onPress={() => void toggleTask(task)}
                    style={[styles.checkbox, isComplete && styles.checked]}
                  >
                    {isComplete ? (
                      <Text style={styles.checkmark}>OK</Text>
                    ) : null}
                  </Pressable>
                  <Pressable
                    onPress={() => startEditing(task)}
                    style={styles.taskTitle}
                  >
                    <BodyText
                      style={isComplete ? styles.completedTitle : undefined}
                    >
                      {task.title}
                    </BodyText>
                  </Pressable>
                  <IconButton
                    accessibilityLabel={`Delete ${task.title}`}
                    icon={{ ios: "trash", android: "delete", web: "delete" }}
                    onPress={() => confirmDelete(task)}
                  />
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <BodyText>No daily tasks yet.</BodyText>
              <MutedText>Add the first one above.</MutedText>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  title: { marginTop: 64, marginBottom: Spacing.sm },
  intro: { marginBottom: Spacing.xxl },
  progressRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  progressNumber: {
    color: colors.text,
    fontFamily: typography.heading.fontFamily,
    fontSize: 32,
    fontWeight: typography.heading.fontWeight,
  },
  editor: { gap: Spacing.md, marginBottom: Spacing.lg },
  input: {
    minHeight: 54,
    paddingHorizontal: Spacing.md,
    borderWidth: borderWidths.default,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    color: colors.text,
    fontFamily: typography.body.fontFamily,
    fontSize: 16,
  },
  cancel: { textAlign: "center", textDecorationLine: "underline" },
  list: { gap: Spacing.md },
  taskRow: {
    ...hardShadow,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    minHeight: 76,
    padding: Spacing.md,
    borderWidth: borderWidths.default,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  checkbox: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: borderWidths.default,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  checked: { backgroundColor: colors.electricGreen },
  checkmark: {
    color: colors.text,
    fontFamily: typography.label.fontFamily,
    fontSize: 10,
  },
  taskTitle: { flex: 1 },
  completedTitle: {
    color: colors.mutedText,
    textDecorationLine: "line-through",
  },
  emptyState: { alignItems: "center", gap: Spacing.sm, padding: Spacing.xxl },
});
