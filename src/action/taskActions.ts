"use server";

import { TaskService } from "@/services/TaskService";
import { revalidateTag } from "next/cache";

export const getAllTasksAction = async () => {
  try {
    const tasks = await TaskService.getAllTasks();
    return tasks;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch tasks");
  }
};

export const getTaskByIdAction = async (id: string) => {
  try {
    const task = await TaskService.getTaskById(id);
    return task;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch task");
  }
};

export const createTaskAction = async (formData: FormData) => {
  try {
    const taskData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
      deadline: formData.get("deadline") as string,
      instructions: formData.get("instructions") as string,
      submissionType: formData.get("submissionType") as string,
      language: formData.get("language") as string,
      startDate: formData.get("startDate") as string,
      dueDate: formData.get("dueDate") as string,
      classIds: formData.getAll("classIds") as string[],
      subjects: formData.get("subjects") as string,
      attachments: formData.get("attachments")
        ? JSON.parse(formData.get("attachments") as string)
        : [],
    };

    const task = await TaskService.createTask(taskData);
    revalidateTag("tasks");
    return { success: true, data: task };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create task",
    };
  }
};

export const updateTaskAction = async (id: string, formData: FormData) => {
  try {
    const taskData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
      deadline: formData.get("deadline") as string,
      instructions: formData.get("instructions") as string,
      submissionType: formData.get("submissionType") as string,
      language: formData.get("language") as string,
      startDate: formData.get("startDate") as string,
      dueDate: formData.get("dueDate") as string,
      classIds: formData.getAll("classIds") as string[],
      subjects: formData.get("subjects") as string,
    };

    const task = await TaskService.updateTask(id, taskData);
    revalidateTag("tasks");
    return { success: true, data: task };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update task",
    };
  }
};

export const deleteTaskAction = async (id: string) => {
  try {
    await TaskService.deleteTask(id);
    revalidateTag("tasks");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete task",
    };
  }
};
