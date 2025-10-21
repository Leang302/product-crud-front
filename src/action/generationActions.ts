"use server";

import { GenerationService } from "@/services/GenerationService";
import { revalidateTag } from "next/cache";

export const getAllGenerationsAction = async () => {
  try {
    const generations = await GenerationService.getAllGenerations();
    return generations;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch generations");
  }
};

export const getGenerationByIdAction = async (id: string) => {
  try {
    const generation = await GenerationService.getGenerationById(id);
    return generation;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch generation");
  }
};

export const createGenerationAction = async (formData: FormData) => {
  try {
    const generationData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      startYear: formData.get("startYear") as string,
      endYear: formData.get("endYear") as string,
    };

    const generation = await GenerationService.createGeneration(generationData);
    revalidateTag("generations");
    return { success: true, data: generation };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create generation",
    };
  }
};

export const updateGenerationAction = async (
  id: string,
  formData: FormData
) => {
  try {
    const generationData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      startYear: formData.get("startYear") as string,
      endYear: formData.get("endYear") as string,
    };

    const generation = await GenerationService.updateGeneration(
      id,
      generationData
    );
    revalidateTag("generations");
    return { success: true, data: generation };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update generation",
    };
  }
};

export const deleteGenerationAction = async (id: string) => {
  try {
    await GenerationService.deleteGeneration(id);
    revalidateTag("generations");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete generation",
    };
  }
};
