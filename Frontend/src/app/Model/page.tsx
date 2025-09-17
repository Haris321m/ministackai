'use client';

import Sidebar from './sections/Sidebar';
import Chat from './sections/Chat';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/ContextAPI';
import { IoImageOutline } from 'react-icons/io5';
import { GoArrowUp } from 'react-icons/go';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function safeLog(message: string, error?: unknown) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(message, error);
  } else {
    console.log(message);
  }
}

interface Model {
  Id: number;
  Name: string;
  Provider: string;
  Type: 'chat' | 'image generation';
  ModelFamily: string;
}

interface PlanMessage {
  query: string;
  reply: string;
  image?: string;
  isNew?: boolean;
}

interface PlanModel {
  Models: Model;
  messages?: PlanMessage[];
}

interface Plan {
  PlanModels: PlanModel[];
}

interface UserPlan {
  Plan: Plan;
}

interface Conversation {
  Id: number;
  Title: string;
  UserId: number;
  isNew?: boolean;
  CreatedAt: string;
}

export default function Page() {
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [query, setQuery] = useState('');
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [enabledModels, setEnabledModels] = useState<{ [key: string]: boolean }>({});
  const [isImageRequest, setIsImageRequest] = useState(false);
  const [expandedModelId, setExpandedModelId] = useState<number | null>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; 

    if (user === null) { 
      router.push('/Login');
      return;
    }

    if (!user?.id) return;
    (async () => {
      try {
        const token = Cookies.get('token');
        const res = await fetch(`${API_URL}/userplans/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        
        if (!res.ok) {
          router.push('/Pricing');
          return;
        }

        const data: UserPlan = await res.json();
        console.log(data)
        if (!data?.Plan?.PlanModels) return;
        console.log(data)
        setPlan({ Plan: { PlanModels: data.Plan.PlanModels } });
        const initialState: { [key: string]: boolean } = {};
        data.Plan.PlanModels.forEach((pm) => {
          initialState[pm.Models.Id] = true;
        });
        setEnabledModels(initialState);
      } catch (error) {
        safeLog('Error fetching plan:', error);
      }
    })();
  }, [user, router]);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const token = Cookies.get('token');
        const res = await fetch(`${API_URL}/conservations/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Failed to fetch conversations: ${res.status}`);
        const data = await res.json();
        setConversations(Array.isArray(data) ? data : []);
      } catch (error) {
        safeLog('Error fetching conversations:', error);
        setConversations([]);
      }
    })();
  }, [user]);

useEffect(() => {
  if (!activeConversation) return;
  (async () => {
    try {
      const token = Cookies.get('token');
      const res = await fetch(`${API_URL}/chats/${activeConversation.Id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch chat history: ${res.status}`);
      const history = await res.json();
      if (!Array.isArray(history)) return;

      const messageMap: { [modelId: number]: PlanMessage[] } = {};
      history.forEach((h: any) => {
        const model = plan?.Plan.PlanModels.find((pm) => pm.Models.Id === h.CurrentModelId);
        if (!model) return;
        if (!messageMap[model.Models.Id]) messageMap[model.Models.Id] = [];
        messageMap[model.Models.Id].push({
          query: h.UserQuestion,
          reply: h.BotAnswer,
          image: h.BotImages || undefined,
          isNew: false,
        });
      });

      setPlan((prevPlan) => {
        if (!prevPlan) return prevPlan;
        return {
          ...prevPlan,
          Plan: {
            PlanModels: prevPlan.Plan.PlanModels.map((pm) => ({
              ...pm,
              messages: messageMap[pm.Models.Id] || [],
            })),
          },
        };
      });
    } catch (error) {
      safeLog('Error fetching chat history:', error);
    }
  })();
}, [activeConversation]);


  /** Add New Message */
  const addMessage = (modelId: number, newMessage: PlanMessage) => {
    setPlan((prevPlan) => {
      if (!prevPlan) return prevPlan;
      return {
        ...prevPlan,
        Plan: {
          PlanModels: prevPlan.Plan.PlanModels.map((pm) => {
            if (pm.Models.Id === modelId) {
              return {
                ...pm,
                messages: [...(pm.messages || []), newMessage],
              };
            }
            return pm;
          }),
        },
      };
    });
  };

  const createNewConversation = async (customTitle?: string) => {
    try {
      const token = Cookies.get('token');
      const res = await fetch(`${API_URL}/conservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user?.id, Title: customTitle || 'New chat' }),
      });
      if (!res.ok) throw new Error('Failed to create conversation');
      const data: Conversation = await res.json();
      const newConv = { ...data, isNew: true };
      setActiveConversation(newConv);
      setConversations((prev) => [...prev, newConv]);
      return data;
    } catch (error) {
      safeLog('Error creating conversation:', error);
      alert('Failed to create conversation. Try again later.');
      return null;
    }
  };

  /** Handle Send */
  const handleSend = async () => {
    if (!query.trim() || !plan) return;

    let conversation = activeConversation;
    try {
      if (!conversation) {
        const firstWords = query.split(" ").slice(0, 6).join(" ");
        conversation = await createNewConversation(firstWords);
        if (!conversation) return;

        const token = Cookies.get("token");
        await fetch(`${API_URL}/conservations/${conversation.Id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ Title: firstWords }),
        });

        setConversations((prev) =>
          prev.map((c) =>
            c.Id === conversation!.Id ? { ...c, Title: firstWords } : c
          )
        );
      }

      let activeModels = plan.Plan.PlanModels
        .filter((pm) => enabledModels[pm.Models.Id])
        .filter(
          (pm) =>
            pm.Models.Type === (isImageRequest ? "image generation" : "chat")
        );

      if (expandedModelId !== null) {
        activeModels = activeModels.filter(
          (pm) => pm.Models.Id === expandedModelId
        );
      }

      if (activeModels.length === 0) return;

      setPlan((prevPlan) => ({
        ...prevPlan!,
        Plan: {
          PlanModels: prevPlan!.Plan.PlanModels.map((pm) => {
            if (!activeModels.some((m) => m.Models.Id === pm.Models.Id)) return pm;
            return {
              ...pm,
              messages: [...(pm.messages || []), { query, reply: "", isNew: true }],
            };
          }),
        },
      }));

      const sentQuery = query;
      setQuery("");

      const token = Cookies.get("token");
      const res = await fetch(`${API_URL}/chatcompletions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user?.id,
          modelid: activeModels.map((m) => m.Models.Id),
          messages: [{ role: "user", content: sentQuery }],
          conversationId: conversation.Id,
          chatname: conversation.Title,
          type: isImageRequest ? "image" : "chat",
          prompt: sentQuery,
        }),
      });

      if (!res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value || new Uint8Array(), { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() || "";

        for (const ev of events) {
          if (!ev.trim()) continue;
          const [eventLine, dataLine] = ev.split("\n");
          if (!eventLine?.startsWith("event:") || !dataLine?.startsWith("data:"))
            continue;

          const eventType = eventLine.replace("event:", "").trim();
          const jsonStr = dataLine.replace("data:", "").trim();

          if (eventType === "reply") {
            try {
              const parsed = JSON.parse(jsonStr);

              setPlan((prevPlan) => {
                if (!prevPlan) return prevPlan;
                return {
                  ...prevPlan,
                  Plan: {
                    PlanModels: prevPlan.Plan.PlanModels.map((pm) => {
                      if (pm.Models.Name !== parsed.model) return pm;
                      const updatedMessages = (pm.messages || []).map((msg) =>
                        msg.isNew
                          ? {
                            ...msg,
                            reply: parsed.message.reply,
                            image: parsed.message.image || undefined,
                            isNew: false,
                          }
                          : msg
                      );
                      return { ...pm, messages: updatedMessages };
                    }),
                  },
                };
              });
            } catch (e) {
              safeLog("JSON parse error:", e);
            }
          } else if (eventType === "error") {
            safeLog("Model error:", jsonStr);
          }
        }
      }

      setPlan((prevPlan) => {
        if (!prevPlan) return prevPlan;
        return {
          ...prevPlan,
          Plan: {
            PlanModels: prevPlan.Plan.PlanModels.map((pm) => ({
              ...pm,
              messages: (pm.messages || []).map((msg) => ({
                ...msg,
                isNew: false,
              })),
            })),
          },
        };
      });
    } catch (error) {
      safeLog("Error during send:", error);
      alert("Failed to send message. Try again later.");
    }
  };

  /** Handle Enhance */
const handleEnhance = async () => {
  if (!query.trim()) return;
  try {
    const token = Cookies.get('token');
    const res = await fetch(`${API_URL}/chatcompletions/enhance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: user?.id,
        modelid: plan?.Plan.PlanModels.filter(
          (pm) => enabledModels[pm.Models.Id]
        )
          .filter((pm) => pm.Models.Type === 'chat')
          .map((m) => m.Models.Id),
        messages: [
          {
            role: 'system',
            content:
              'You are a prompt enhancer. Rewrite ONLY the user prompt to make it more detailed, clear, and effective. Do not add greetings, explanations, or any extra conversation. Return only the enhanced prompt as plain text.',
          },
          { role: 'user', content: query },
        ],
        type: 'enhance',
        prompt: query,
      }),
    });
    if (!res.ok) throw new Error('Enhance request failed');
    const data = await res.json();
    if (data?.message?.BotAnswer) setQuery(data.message.BotAnswer);
  } catch (err) {
    safeLog('Error enhancing prompt:', err);
  }
};



  const handleUpdateConversation = (conversation: Conversation) => {
    const newTitle = window.prompt('Enter new chat title:', conversation.Title);
    if (!newTitle?.trim()) return;
    const token = Cookies.get('token');
    fetch(`${API_URL}/conservations/${conversation.Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ Title: newTitle }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update conversation');
        return res.json();
      })
      .then((updated) => {
        setConversations((prev) => prev.map((c) => (c.Id === updated.Id ? updated : c)));
      })
      .catch((error) => {
        safeLog('Error updating conversation:', error);
        alert('Failed to update chat title.');
      });
  };

  const handleDeleteConversation = async (id: number) => {
    try {
      if (!window.confirm('Are you sure you want to delete this conversation?')) return;
      const token = Cookies.get('token');
      const res = await fetch(`${API_URL}/conservations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete conversation');
      setConversations((prev) => prev.filter((c) => c.Id !== id));
      setActiveConversation((prev) => (prev && prev.Id === id ? null : prev));
    } catch (error) {
      safeLog('Error deleting conversation:', error);
      alert('Failed to delete conversation. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar
        conversations={conversations}
        onSelectConversation={c => setActiveConversation(c)}
        onNewChat={createNewConversation}
        onUpdateConversation={handleUpdateConversation}
        onDeleteConversation={handleDeleteConversation}
        activeConversationId={activeConversation?.Id}
      />

      <div className="relative flex flex-col overflow-y-auto w-full">
        <div className="flex overflow-x-auto w-full shrink-0 chat-scrollbar">
          {plan?.Plan.PlanModels
            .filter(model =>
              expandedModelId === null
                ? (isImageRequest ? model.Models.Type === "image generation" : model.Models.Type === "chat")
                : model.Models.Id === expandedModelId
            )
            .map(model => (
              <Chat
                key={model.Models.Id}
                model={model.Models.Name}
                modelFamily={model.Models.ModelFamily}
                messages={model.messages || []}
                isExpanded={expandedModelId === model.Models.Id}
                onToggleExpand={() =>
                  setExpandedModelId(prev => (prev === model.Models.Id ? null : model.Models.Id))
                }
                onCollapse={() => setExpandedModelId(null)}
                enabled={enabledModels[model.Models.Id]}
                onToggleEnabled={() => setEnabledModels(prev => ({
                  ...prev,
                  [model.Models.Id]: !prev[model.Models.Id]
                }))}
              />
            ))}
        </div>

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 w-full flex justify-center shadow-md">
          <div className="flex flex-col w-full sm:w-md md:w-xl lg:w-xl xl:w-3xl bg-white dark:bg-gray-800 p-2 mb-2 rounded-lg overflow-hidden">
            <div className="flex w-full items-end gap-3 p-2 rounded-2xl transition-all duration-300">
              <textarea
                value={query}
                onChange={e => setQuery(e.target.value)}
                onInput={e => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  requestAnimationFrame(() => {
                    target.style.height = Math.min(target.scrollHeight, 200) + "px";
                  });
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                placeholder="Type your message..."
                className="flex-1 p-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none shadow-inner focus:shadow-[0_0_10px_rgba(59,130,246,0.4)]"
              />

              {/* Send Button */}
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-3 py-3 rounded-full font-semibold shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 ease-in-out"
              >
                <GoArrowUp className='text-4xl font-bold' />
              </button>
            </div>
            <div className='flex justify-between'>
              <button
                onClick={() => setIsImageRequest(prev => !prev)}
                className={`ml-4 py-2 px-5 rounded-full flex items-center gap-2 font-medium shadow-md transition-all duration-300 ease-in-out transform dark:text-white hover:scale-105 active:scale-95 hover:cursor-pointer
                  ${isImageRequest ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                <IoImageOutline className={`text-xl ${isImageRequest ? 'rotate-12 scale-110' : ''}`} />
                <span>{isImageRequest ? 'Image Mode' : 'Text Mode'}</span>
              </button>
              <button
                onClick={handleEnhance}
                className="bg-gray-300 dark:bg-gray-900 mr-20 text-white px-4 py-2 rounded-full font-medium shadow-md hover:scale-105 active:scale-95 transition-transform duration-200 ease-in-out"
              >
                ✨
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
