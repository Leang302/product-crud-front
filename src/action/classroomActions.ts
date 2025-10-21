"use server";

import { ClassroomService } from "@/services/ClassroomService";
import { revalidateTag } from "next/cache";

export const getAllClassroomsAction = async () => {
  try {
    const classrooms = await ClassroomService.getAllClassrooms();
    return classrooms;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch classrooms");
  }
};

export const getClassroomByIdAction = async (id: string) => {
  try {
    const classroom = await ClassroomService.getClassroomById(id);
    return classroom;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch classroom");
  }
};

export const createClassroomAction = async (formData: FormData) => {
  try {
    const classroomData = {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      capacity: Number.parseInt(formData.get("capacity") as string),
      location: formData.get("location") as string,
    };

    const classroom = await ClassroomService.createClassroom(classroomData);
    revalidateTag("classrooms");
    return { success: true, data: classroom };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create classroom",
    };
  }
};

export const updateClassroomAction = async (id: string, formData: FormData) => {
  try {
    const classroomData = {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      description: formData.get("description") as string,
      capacity: Number.parseInt(formData.get("capacity") as string),
      location: formData.get("location") as string,
    };

    const classroom = await ClassroomService.updateClassroom(id, classroomData);
    revalidateTag("classrooms");
    return { success: true, data: classroom };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update classroom",
    };
  }
};

export const deleteClassroomAction = async (id: string) => {
  try {
    await ClassroomService.deleteClassroom(id);
    revalidateTag("classrooms");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete classroom",
    };
  }
};
