import axiosInstance from "@/utils/axiosInstance";

export const createKnowledgeText = async (params: any = {}) => {
  try {
    const response = await axiosInstance.post(
      "/knowledgebase/archive_text",
      params
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
