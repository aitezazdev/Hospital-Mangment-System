import React, { useState, useRef, useEffect } from "react";
import api from "../../apis/axios";
import { Sparkles, Send, User, Bot, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const AiAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text || text.trim() === "") return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/ai/symptom-checker", { symptoms: text });
      if (response.data.success) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: response.data.response },
        ]);
      } else {
        toast.error("Failed to get response from AI");
      }
    } catch (error) {
      console.error("AI assistant error:", error);
      toast.error(error.response?.data?.message || "An error occurred. Check backend logs.");
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "⚠️ Sorry, I encountered an issue connecting to the symptom checker. Please check that the backend is running and the Gemini API key is configured correctly in the `.env` file.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="py-2">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col h-[85vh]">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-slate-900 shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">AI Health Assistant</h2>
              <p className="text-xs text-teal-400 font-semibold tracking-wide">Gemini-Powered Diagnosis Recommender</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" /> General Guidance Only
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="bg-amber-50 text-amber-900 px-6 py-3 border-b border-amber-100 flex items-center gap-2 text-xs sm:text-sm font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>This is an AI assistant, not a doctor. If you're feeling unwell, please book an appointment with our doctors for a proper checkup.</span>
        </div>

        {/* Message Panel */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 max-w-[85%] ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
                  msg.sender === "user"
                    ? "bg-slate-100 text-slate-700 border-slate-200"
                    : "bg-teal-50 text-teal-600 border-teal-100"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Box */}
              <div
                className={`rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-gradient-to-tr from-teal-600 to-emerald-600 text-white rounded-tr-none shadow-md shadow-teal-500/10"
                    : "bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none"
                }`}
              >
                {/* Parse Markdown-like bullet items simply */}
                {msg.text}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-start gap-3 max-w-[85%]">
              <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 text-teal-600">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-none px-5 py-4 flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-bounce delay-100" />
                <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-bounce delay-200" />
                <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>



        {/* Input Panel */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
          <input
            type="text"
            placeholder={loading ? "Analyzing symptoms..." : "Describe your symptoms here..."}
            className="flex-1 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-teal-500 outline-none rounded-xl px-5 py-3 text-sm text-slate-700 transition-colors"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className={`p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-md transition-all flex items-center justify-center shrink-0 cursor-pointer ${
              (loading || !input.trim()) && "bg-teal-300 cursor-not-allowed shadow-none"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
