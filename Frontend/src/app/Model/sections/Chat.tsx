"use client";

import React, { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* --------- Disable console.error globally (silent mode) --------- */
if (typeof window !== "undefined") {
  console.error = () => { };
}

/* ---------------- Typing Animation ---------------- */
function TypingAnimation({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    try {
      setDisplayedText("");
      indexRef.current = 0;

      const interval = setInterval(() => {
        if (text && indexRef.current < text.length) {
          setDisplayedText((prev) => prev + text[indexRef.current]);
          indexRef.current++;
        } else {
          clearInterval(interval);
        }
      }, 20);

      return () => clearInterval(interval);
    } catch { }
  }, [text]);

  return (
    <div className="whitespace-pre-wrap leading-relaxed font-mono">
      {displayedText}
      <span className="inline-block w-2 h-5 bg-gray-500 dark:bg-gray-300 animate-pulse ml-1 rounded-sm" />
    </div>
  );
}

/* ---------------- Loading Animation ---------------- */
function LoadingAnimation() {
  return (
    <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl px-4 py-3 animate-pulse">
      <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
      <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
      <p className="text-sm text-gray-600 dark:text-gray-300 italic">
        AI is thinking...
      </p>
    </div>
  );
}

export type Message = {
  query: string;
  reply: string;
  image?: string;
  isNew?: boolean;
};

export interface ChatProps {
  model: string;
  modelFamily: string;
  messages: Message[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onCollapse: () => void;
  enabled: boolean;
  onToggleEnabled: () => void;
}

/* ---------------- CodeBlock ---------------- */
function CodeBlock({ language, code }: { language: string; code: string }) {
  const safeCopy = () => {
    try {
      navigator.clipboard.writeText(code);
    } catch { }
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg my-2">
      <div className="flex justify-between items-center px-3 py-2 bg-gray-800 text-gray-200 text-sm">
        <span className="font-medium">{language?.toUpperCase() || "CODE"}</span>
        <button
          onClick={safeCopy}
          className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded"
        >
          Copy
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0, padding: "1rem", fontSize: "0.9rem" }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

/* ---------------- Download Helper ---------------- */
function downloadImage(url: string) {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous"; // agar CORS allow ho
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "minismartAi.png"; // original resolution me hoga
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }, "image/png");
    };

    img.onerror = () => {
      alert("Image download failed. Server may block direct access.");
    };
  } catch (e) {
    console.error("Error downloading image:", e);
  }
}


/* ---------------- Main Chat ---------------- */
export default function Chat({
  model,
  modelFamily,
  messages,
  isExpanded,
  onToggleExpand,
  onCollapse,
  enabled = true,
  onToggleEnabled,
}: ChatProps) {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    } catch { }
  }, [messages]);

  return (
    <div className={`relative ${isExpanded ? "w-full" : "w-[500px]"}`}>
      <div
        ref={chatContainerRef}
        className={`chat-scrollbar relative ${isExpanded ? "w-full" : "w-[500px]"} shrink-0 overflow-y-auto h-[80vh] border-x border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-inner transition-all duration-300`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 py-3 px-4 flex justify-between">
          <h2 className="text-lg font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">
            {modelFamily || "AI Model"}
          </h2>
          <div className="flex gap-3 items-center">
            {isExpanded ? (
              <AiOutlineFullscreenExit
                className="text-blue-500 cursor-pointer"
                onClick={() => {
                  try {
                    onCollapse();
                  } catch { }
                }}
              />
            ) : (
              <AiOutlineFullscreen
                className="text-blue-500 cursor-pointer"
                onClick={() => {
                  try {
                    onToggleExpand();
                  } catch { }
                }}
              />
            )}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => {
                  try {
                    onToggleEnabled();
                  } catch { }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-all duration-300"></div>
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition-all duration-300 shadow-md"></div>
            </label>
          </div>
        </div>

        {/* Messages */}
        <div className="p-4 flex flex-col gap-4 opacity-100">
          {messages?.length > 0 ? (
            messages.map((msg, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                {/* User Query */}
                <div className="self-start max-w-[85%] bg-gray-100 text-black px-4 py-2 rounded-2xl rounded-bl-none shadow-md text-sm sm:text-base">
                  {msg.query || ""}
                </div>

                {/* Bot Reply */}
                <div className="self-start max-w-[85%] text-gray-800 dark:text-gray-100 px-4 py-3 rounded-2xl rounded-br-none text-sm sm:text-base flex flex-col gap-2">
                  {/* Loader */}
                  {msg.isNew && !msg.reply && !msg.image && <LoadingAnimation />}

                  {/* Image */}
                  {msg.image && (
                    <div className="relative group w-fit">
                      <img
                        src={
                          msg.image.startsWith("data:image")
                            ? msg.image
                            : `data:image/png;base64,${msg.image}`
                        }
                        alt="Generated"
                        className="rounded-lg max-w-full border border-gray-400 dark:border-gray-600"
                      />
                      <button
                        onClick={() => {
                          try {
                            msg.image &&
                              downloadImage(
                                msg.image.startsWith("data:image")
                                  ? msg.image
                                  : `data:image/png;base64,${msg.image}`
                              );
                          } catch { }
                        }}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white text-xs px-2 py-2 rounded flex items-center gap-1 transition"
                      >
                        <FiDownload className="text-2xl" />
                      </button>
                    </div>
                  )}


                  {/* Reply */}
                  {msg.reply && (
                    <div className="prose dark:prose-invert whitespace-pre-wrap">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: (props) => {
                            const { children, className, inline, ...rest } = props as {
                              children: React.ReactNode;
                              className?: string;
                              inline?: boolean;
                            };

                            const match = /language-(\w+)/.exec(className || "");

                            if (!inline && match) {
                              return (
                                <CodeBlock language={match[1]} code={String(children)} />
                              );
                            }

                            return (
                              <code
                                className="bg-gray-200 dark:bg-gray-700 px-1 rounded"
                                {...rest}
                              >
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg.reply}
                      </ReactMarkdown>

                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 italic text-center mt-20">
              No messages yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
