import axiosInstance from "@/utils/axiosInstance";

export const createKnowledgeBase = async (params: any = {}) => {
  try {
    const response = await axiosInstance.post("/knowledgebase/add", params);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
