"use server";

import { GroupService } from "@/services/GroupService";
import { revalidateTag } from "next/cache";

export const getAllGroupsAction = async () => {
  try {
    const groups = await GroupService.getAllGroups();
    return groups;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch groups");
  }
};

export const getGroupByIdAction = async (id: string) => {
  try {
    const group = await GroupService.getGroupById(id);
    return group;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch group");
  }
};

export const createGroupAction = async (formData: FormData) => {
  try {
    const groupData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      maxMembers: Number.parseInt(formData.get("maxMembers") as string),
      generationId: formData.get("generationId") as string,
    };

    const group = await GroupService.createGroup(groupData);
    revalidateTag("groups");
    return { success: true, data: group };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create group",
    };
  }
};

export const updateGroupAction = async (id: string, formData: FormData) => {
  try {
    const groupData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      maxMembers: Number.parseInt(formData.get("maxMembers") as string),
      generationId: formData.get("generationId") as string,
    };

    const group = await GroupService.updateGroup(id, groupData);
    revalidateTag("groups");
    return { success: true, data: group };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update group",
    };
  }
};

export const deleteGroupAction = async (id: string) => {
  try {
    await GroupService.deleteGroup(id);
    revalidateTag("groups");
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete group",
    };
  }
};
