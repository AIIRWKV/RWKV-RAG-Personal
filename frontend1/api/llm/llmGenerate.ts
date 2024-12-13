import axiosInstance from "@/utils/axiosInstance";
import qs from "qs";

export const llmGenerate = async (params: any = {}) => {
  try {
    const response = await axiosInstance.post(`/llm/generate`, params);
    return response.data;
  } catch (error) {
    console.error("Failed to generate llm:", error);
    throw error;
  }
};
