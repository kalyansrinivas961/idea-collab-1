import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

const AIChatBox = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // Hide AI Chatbox on messages page to avoid overlap with chat input
  if (window.location.pathname.startsWith('/messages')) return null;

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hi! I'm your IdeaCollab AI assistant. How can I help you today?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: inputText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    try {
      // Prepare history for Gemini (alternating user/model roles)
      const formattedHistory = chatHistory.slice(-10); // Keep last 10 exchanges

      const { data } = await api.post("/ai/chat", { 
        message: userMessage.text,
        history: formattedHistory
      });
      
      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.response,
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      // Update history for next exchange
      setChatHistory(prev => [
        ...prev,
        { role: "user", parts: [{ text: userMessage.text }] },
        { role: "model", parts: [{ text: data.response }] }
      ]);

    } catch (err) {
      console.error("AI Chat error:", err);
      const errorMsg = err.response?.data?.details || err.response?.data?.message || "Sorry, I encountered an error processing your request. Please try again later.";
      const errorMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: `**Error:** ${errorMsg}`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed right-6 md:right-8 z-50 flex flex-col items-end transition-all duration-300 ${
      user ? "bottom-20 md:bottom-8" : "bottom-6 md:bottom-8"
    }`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 w-[calc(100vw-48px)] sm:w-96 h-[500px] max-h-[70vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 mb-4 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">AI Assistant</h3>
                <p className="text-indigo-100 text-[10px] uppercase tracking-wider font-medium">Powered by Groq</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none prose prose-slate prose-sm dark:prose-invert"
                  }`}
                >
                  {msg.sender === "ai" ? (
                    <ReactMarkdown className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-slate-800">
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full bg-slate-100 dark:bg-slate-800 border-0 dark:border dark:border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-700 transition-all placeholder:text-slate-400 dark:text-white"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || loading}
                className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all shadow-sm active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
          isOpen 
            ? "bg-slate-800 dark:bg-slate-700 text-white rotate-90" 
            : "bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 text-white"
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-indigo-600 rounded-full animate-pulse"></span>
          </div>
        )}
      </button>
    </div>
  );
};

export default AIChatBox;
