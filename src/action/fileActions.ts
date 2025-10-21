"use server";

import { FileService } from "@/services/FileService";

export const uploadFileAction = async (formData: FormData) => {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return {
        success: false,
        message: "No file provided",
      };
    }

    const response = await FileService.uploadFile(file);
    return { success: true, data: response };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to upload file",
    };
  }
};
