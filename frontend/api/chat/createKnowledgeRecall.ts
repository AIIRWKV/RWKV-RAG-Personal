import axiosInstance from "@/utils/axiosInstance";
import qs from "qs";

interface DeleteKnowledgeFileParams {
  name: string;
  file_path: string;
}

export const deleteKnowledgeFile = async (
  params: DeleteKnowledgeFileParams
) => {
  try {
    const response = await axiosInstance.post(
      "/knowledge/delete_by_file",
      params
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete knowledge file:", error);
    throw error;
  }
};

export const reloadKnowledgeFile = async (
  params: DeleteKnowledgeFileParams
) => {
  try {
    const response = await axiosInstance.post(
      "/knowledgebase/archive_file_reload",
      params
    );
    return response.data;
  } catch (error) {
    console.error("Failed to reload knowledge file:", error);
    throw error;
  }
};

export const createKnowledgeRecall = async (params: any = {}) => {
  try {
    const response = await axiosInstance.get(
      `/knowledgebase/recall?${qs.stringify(params)}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch knowledge list:", error);
    throw error;
  }
};
