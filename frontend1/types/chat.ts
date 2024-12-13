export interface Chat {
  search_id: number;
  query: string;
  collection_name: string;
  create_time: string;
}

export interface Message {
  id?: number;
  content: string;
  role: string;
  isThinking?: boolean;
  isError?: boolean;
}
