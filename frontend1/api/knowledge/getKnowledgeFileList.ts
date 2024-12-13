import axiosInstance from "@/utils/axiosInstance";
import qs from "qs";

interface FileListParams {
  name?: string;
  page?: number;
  page_size?: number;
}

export const getKnowledgeFileList = async (params: FileListParams) => {
  try {
    const response = await axiosInstance.get<any>(
      `/knowledgebase/file_list?${qs.stringify(params)}`
    );
    return response.data; // 直接返回数据部分
  } catch (error) {
    console.error("Failed to fetch knowledge file list:", error);
    throw error;
  }
};