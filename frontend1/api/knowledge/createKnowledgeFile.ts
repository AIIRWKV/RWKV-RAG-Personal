import axiosInstance from "@/utils/axiosInstance";

export const createKnowledgeFile = async (params: any = {}) => {
  try {
    const response = await axiosInstance.post(
      "/knowledgebase/archive_file",
      params
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
