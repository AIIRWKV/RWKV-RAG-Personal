import axiosInstance from "@/utils/axiosInstance";
import qs from "qs";

export const getFileListCount = async (params: any = {}) => {
  try {
    const response = await axiosInstance.get(
      `/knowledgebase/file_list_count?${qs.stringify(params)}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch knowledge list:", error);
    throw error;
  }
};
