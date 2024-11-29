import axiosInstance from "@/utils/axiosInstance";

export const deleteSearchHistory = async (params: any = {}) => {
  try {
    const response = await axiosInstance.post(
      `/knowledgebase/search_history_delete`,
      params
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch knowledge list:", error);
    throw error;
  }
};
