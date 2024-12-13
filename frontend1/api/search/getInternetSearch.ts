import axiosInstance from "@/utils/axiosInstance";
import qs from "qs";

export const getInternetSearch = async (params: any = {}) => {
  try {
    const response = await axiosInstance.get(
      `/knowledgebase/internet_search?${qs.stringify(params)}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch internet search:", error);
    throw error;
  }
};
