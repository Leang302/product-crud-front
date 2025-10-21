"use server";

import { DepartmentService } from "@/services/departmentService";
import { revalidateTag } from "next/cache";

export const getAllDepartmentsAction = async () => {
  try {
    const departments = await DepartmentService.list();
    return departments;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch departments");
  }
};

export const getDepartmentByIdAction = async (id: string) => {
  try {
    const department = await DepartmentService.getById(id);
    return department;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch department");
  }
};

export const createDepartmentAction = async (formData: FormData) => {
  try {
    const departmentData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };

    const department = await DepartmentService.create(departmentData);
    revalidateTag("departments");
    return { success: true, data: department };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create department",
    };
  }
};

export const updateDepartmentAction = async (
  id: string,
  formData: FormData
) => {
  try {
    const departmentData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
    };

    const department = await DepartmentService.update(id, departmentData);
    revalidateTag("departments");
    return { success: true, data: department };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update department",
    };
  }
};

export const deleteDepartmentAction = async (id: string) => {
  try {
    await DepartmentService.remove(id);
    revalidateTag("departments");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete department",
    };
  }
};
