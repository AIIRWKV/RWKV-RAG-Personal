"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Sidebar } from "@/components/chat/Sidebar";
import { toast } from "@/hooks/use-toast";
import { Chat, Message } from "@/types/chat";
import { getSearchHistoryList } from "@/api/chat/getSearchHistoryList";
import { deleteSearchHistory } from "@/api/chat/deleteSearchHistory";
import { getRecallInfo } from "@/api/chat/getRecallInfo";
import { getChatInfo } from "@/api/chat/getChatInfo";
import { createKnowledgeRecall } from "@/api/chat/createKnowledgeRecall";
import { Recall } from "@/types/recall";
import { llmGenerate } from "@/api/llm/llmGenerate";
import { RecallFormValues } from "@/components/chat/ChatRecallForm";

interface KnowledgeBase {
  id: string;
  name: string;
}

const thinkingTexts = ["思考中", "思考中.", "思考中..", "思考中..."];

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [recallResults, setRecallResults] = useState<Recall | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] =
    useState<KnowledgeBase | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [createChatLoading, setCreateChatLoading] = useState(false);
  const [getChatsLoading, setGetChatsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatRecallDialogOpen, setIsChatRecallDialogOpen] = useState(false);

  useEffect(() => {
    const _kbs = JSON.parse(
      window.localStorage.getItem("knowledge_bases") || "[]"
    );
    setKnowledgeBases(_kbs);
    setSelectedKnowledgeBase(_kbs[0]);
    handleGetSearchHistoryList(_kbs[0]?.name);
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now(),
      content: input,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);

    const thinkingId = Date.now() + 1;
    setMessages((prev) => [
      ...prev,
      {
        id: thinkingId,
        content: thinkingTexts[0],
        role: "assistant",
        isThinking: true,
      },
    ]);

    setInput("");

    let thinkingIndex = 0;
    const thinkingInterval = setInterval(() => {
      thinkingIndex = (thinkingIndex + 1) % thinkingTexts.length;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === thinkingId
            ? { ...msg, content: thinkingTexts[thinkingIndex] }
            : msg
        )
      );
    }, 500);

    try {
      const params = {
        search_id: selectedChat?.search_id,
        instruction: input,
        text: recallResults?.match_best,
      };

      const response = await llmGenerate(params);
      const text = response.data || "抱歉，我没有找到合适的回答";
      clearInterval(thinkingInterval);

      const assistantMessageId = Date.now() + 2;

      setMessages((prev) => {
        const filteredMessages = prev.filter((msg) => msg.id !== thinkingId);
        return [
          ...filteredMessages,
          {
            id: assistantMessageId,
            content: "",
            role: "assistant",
          },
        ];
      });

      const streamText = async () => {
        let currentText = "";
        const chunkSize = 2;
        const delay = 30;

        for (let i = 0; i < text.length; i += chunkSize) {
          await new Promise((resolve) => setTimeout(resolve, delay));

          currentText += text.slice(i, i + chunkSize);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: currentText }
                : msg
            )
          );
        }
      };

      await streamText();
    } catch (error) {
      clearInterval(thinkingInterval);
      setMessages((prev) => {
        const filteredMessages = prev.filter((msg) => msg.id !== thinkingId);
        return [
          ...filteredMessages,
          {
            id: Date.now() + 2,
            content: "抱歉，发生了一些错误，请稍后重试。",
            role: "assistant",
            isError: true,
          },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, recallResults]);

  const handleGetSearchHistoryList = useCallback((name: string) => {
    setGetChatsLoading(true);
    getSearchHistoryList({ name })
      .then((res) => {
        if (res.code === 200) {
          setChats(res.data);
        } else {
          toast({
            title: "获取聊天列表失败",
            description: res.msg,
          });
        }
      })
      .finally(() => {
        setGetChatsLoading(false);
      });
  }, []);

  const handleChatClick = useCallback((chat: Chat) => {
    setSelectedChat(chat);
    handleGetRecallInfo(chat.search_id);
    handleGetChatInfo(chat.search_id);
  }, []);

  const handleDeleteChat = useCallback(
    (chat: Chat) => {
      deleteSearchHistory({ name: chat.collection_name, query: chat.query })
        .then((res) => {
          if (res.code === 200) {
            toast({
              title: "删除聊天成功",
              description: res.msg,
            });
          } else {
            toast({
              title: "删除聊天失败",
              description: res.msg,
            });
          }
        })
        .finally(() => {
          handleGetSearchHistoryList(chat.collection_name);
        });
    },
    [handleGetSearchHistoryList]
  );

  const handleRecallChat = useCallback((chat: Chat) => {
    createKnowledgeRecall({
      name: chat.collection_name,
      query: chat.query,
      is_new: true,
    }).then((res) => {
      if (res.code === 200) {
        setRecallResults(res.data);
        toast({
          title: "重新召回成功",
          description: res.msg,
        });
      } else {
        toast({
          title: "重新召回失败",
          description: res.msg,
        });
      }
    });
  }, []);

  const handleGetChatInfo = useCallback((searchId: number) => {
    getChatInfo({ search_id: searchId }).then((res) => {
      if (res.code === 200) {
        const allMessages = res.data.reduce(
          (acc: Message[], curr: { chat: Message[] }) => {
            return [...acc, ...curr.chat];
          },
          []
        );
        setMessages(allMessages);
      } else {
        toast({
          title: "获取聊天信息失败",
          description: res.msg,
        });
      }
    });
  }, []);

  const handleGetRecallInfo = useCallback((searchId: number) => {
    getRecallInfo({ search_id: searchId, page: 1, page_size: 20 }).then(
      (res) => {
        if (res.code === 200) {
          setRecallResults(res.data);
        } else {
          toast({
            title: "获取召回信息失败",
            description: res.msg,
          });
        }
      }
    );
  }, []);

  const handleSelectKnowledgeBase = useCallback(
    (knowledgeBase: KnowledgeBase) => {
      setSelectedKnowledgeBase(knowledgeBase);
      handleGetSearchHistoryList(knowledgeBase.name);
    },
    [handleGetSearchHistoryList]
  );

  const handleCreateChat = useCallback(
    (values: RecallFormValues) => {
      setCreateChatLoading(true);
      createKnowledgeRecall({
        name: selectedKnowledgeBase?.name,
        query: values.value,
      })
        .then((res) => {
          if (res.code === 200) {
            toast({
              title: "创建成功",
              description: "创建成功",
            });
            handleGetSearchHistoryList(selectedKnowledgeBase?.name || "");
            handleGetRecallInfo(res.data.search_id);
            handleGetChatInfo(res.data.search_id);
            setSelectedChat(res.data);
            setIsChatRecallDialogOpen(false);
          } else {
            toast({
              title: "创建失败",
              description: res.msg,
            });
          }
        })
        .finally(() => {
          setCreateChatLoading(false);
        });
    },
    [
      selectedKnowledgeBase,
      handleGetSearchHistoryList,
      handleGetRecallInfo,
      handleGetChatInfo,
    ]
  );

  return (
    <div className="flex h-full">
      <Sidebar
        knowledgeBases={knowledgeBases}
        chats={chats}
        createChatLoading={createChatLoading}
        getChatsLoading={getChatsLoading}
        selectedKnowledgeBase={selectedKnowledgeBase}
        selectedChat={selectedChat}
        onSelectKnowledgeBase={handleSelectKnowledgeBase}
        onChatClick={handleChatClick}
        onDeleteChat={handleDeleteChat}
        onRecallChat={handleRecallChat}
        onCreateChat={handleCreateChat}
        isChatRecallDialogOpen={isChatRecallDialogOpen}
        setIsChatRecallDialogOpen={setIsChatRecallDialogOpen}
      />
      <main className="flex-1 overflow-hidden">
        <ChatWindow
          messages={messages}
          input={input}
          onInputChange={setInput}
          onSend={sendMessage}
          recallResults={recallResults}
          selectedCard={selectedCard}
          setSelectedCard={setSelectedCard}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
