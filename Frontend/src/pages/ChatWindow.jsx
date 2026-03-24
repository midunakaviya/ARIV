import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Send,
  Paperclip,
  RefreshCw,
  Sun,
  Moon,
  Calendar as CalendarIcon,
  Star,
  CheckCircle,
  ShoppingBag,
  Truck,
  Headphones,
  MessageSquare,
  MoreVertical,
  ArrowRight,
  Plane,
  Info,
  AlertCircle,
  CornerDownLeft,
  MessageCircle,
  SendHorizontal,
  ArrowUp,
  Navigation,
  User,
} from "lucide-react";

const sendIconOptions = [
  { value: "send", icon: Send, label: "Send" },
  { value: "arrowright", icon: ArrowRight, label: "Right Arrow" },
  { value: "plane", icon: Plane, label: "Paper Plane" },
  { value: "cornerdown", icon: CornerDownLeft, label: "Enter Key" },
  { value: "messagecircle", icon: MessageCircle, label: "Chat Bubble" },
  { value: "sendhorizontal", icon: SendHorizontal, label: "Horizontal Send" },
  { value: "arrowup", icon: ArrowUp, label: "Up Arrow" },
  { value: "navigation", icon: Navigation, label: "Pointer" },
];

const defaultAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face",
];

export default function ChatWindow() {
  const { id } = useParams();
  const [chatbot, setChatbot] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [showProductCarousel, setShowProductCarousel] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const [userAvatar] = useState(
  defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)]
);


  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Load/save dark mode preference per chatbot
  useEffect(() => {
    const saved = localStorage.getItem(`darkMode_${id}`);
    if (saved !== null) setDarkMode(JSON.parse(saved));
  }, [id]);

  useEffect(() => {
    if (chatbot) {
      localStorage.setItem(`darkMode_${id}`, JSON.stringify(darkMode));
    }
  }, [darkMode, id, chatbot]);

  // ────────────────────────────────────────────────
  // FETCH WITH CACHE BUST + MORE CONFIG FIELDS
  // ────────────────────────────────────────────────
  const fetchChatbot = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/chatbots/public/${id}?_=${Date.now()}`,
      );
      if (!res.ok) throw new Error("Failed to load chatbot - is it public?");
      const data = await res.json();
      const cfg = data.config || {};

      const loadedChatbot = {
        name: data.name || "Chatbot",
        agentRole: cfg.agentRole || "",
        avatar: data.avatar_url || defaultAvatars[0],
        greetingMessage: cfg.greetingMessage || "Hello! How can I help?",
        headerColor: cfg.headerColor || "#8b5cf6",
        headerTextColor: cfg.headerTextColor || "#ffffff",
        botBubbleColor: cfg.botBubbleColor || "#e0e7ff",
        botTextColor: cfg.botTextColor || "#4f46e5",
        sendButtonColor: cfg.sendButtonColor || "#8b5cf6",
        chatBackground: cfg.chatBackground || "#f8fafc",
        avatarRadius: cfg.avatarRadius ?? 50,
        bubbleRadius: cfg.bubbleRadius ?? 24,
        bubbleVariant: cfg.bubbleVariant || "round",
        showQuickReplies: cfg.showQuickReplies ?? true,
        quickReplyVariant: cfg.quickReplyVariant || "round",
        quickReplyAlignment: cfg.quickReplyAlignment || "left",
        quickActions: cfg.quickActions || [],
        showOnlineStatus: !!cfg.showOnlineStatus,
        onlineStatusText: cfg.onlineStatusText || "Online",
        showResetButton: !!cfg.showResetButton,
        showTimestamps: !!cfg.showTimestamps,
        darkMode: !!cfg.darkMode,
        botFontSize: cfg.botFontSize || 16,
        userFontSize: cfg.userFontSize || 16,
        template: cfg.template || null,
        showPersistentMenu: !!cfg.showPersistentMenu,
        typingIndicatorStyle: cfg.typingIndicatorStyle || "dots",         
        sendButtonIcon: cfg.sendButtonIcon || "send",
        typingIndicatorColor: cfg.typingIndicatorColor || "#9ca3af",
        typingIndicatorSize:   cfg.typingIndicatorSize   || 8,
      };

      setChatbot(loadedChatbot);
      setDarkMode(!!cfg.darkMode);

      setMessages([
  {
    text: cfg.greetingMessage || "Hello! How can I help?",
    sender: "bot",
    avatar: loadedChatbot.avatar,
    timestamp: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
]);

    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchChatbot();
  }, [id]);

  // ────────────────────────────────────────────────
  // Helpers for styling quick replies & bubbles
  // ────────────────────────────────────────────────
  const __SHARP = 6;

  const bubbleVariant = chatbot?.bubbleVariant || "round";
  const showQuickReplies = chatbot?.showQuickReplies ?? true;
  const quickReplyVariant = chatbot?.quickReplyVariant || "round";
  const quickReplyAlignment = chatbot?.quickReplyAlignment || "left";
  const bubbleRadius = chatbot?.bubbleRadius ?? 24;
  const botFontSize = chatbot?.botFontSize || 16;
  const userFontSize = chatbot?.userFontSize || 16;

  const getBubbleBorderRadius = (sender) => {
    const r = bubbleRadius;
    const v = bubbleVariant;

    if (v === "round") return `${r}px`;
    if (v === "angular") return `${__SHARP}px`;

    if (v === "angularBottom") {
      return sender === "bot"
        ? `${r}px ${r}px ${__SHARP}px ${__SHARP}px`
        : `${r}px`;
    }
    if (v === "angularTop") {
      return sender === "bot"
        ? `${__SHARP}px ${__SHARP}px ${r}px ${r}px`
        : `${r}px`;
    }
    if (v === "angularAndRound") {
      return sender === "bot" ? `${__SHARP}px` : `${r}px`;
    }

    return `${r}px`;
  };

  const getQuickReplyAlignClass = () => {
    if (quickReplyAlignment === "right") return "justify-end";
    if (quickReplyAlignment === "center") return "justify-center";
    return "justify-start";
  };

  const handleUserInput = (text) => {
    // Safety guard: skip rules if text is not a valid string
    if (typeof text !== "string" || !text.trim()) {
      return false;
    }

    const lower = text.toLowerCase().trim();

    // Rule 1: Booking / appointment
    if (
      lower.includes("book") ||
      lower.includes("appointment") ||
      lower.includes("schedule") ||
      lower.includes("reserve") ||
      lower.includes("booking")
    ) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Great! Let's book it. Please select a date:",
            sender: "bot",
            avatar: chatbot.avatar,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }, 800);
      return true;
    }

    // Rule 2: Track / order / delivery
    if (
      lower.includes("track") ||
      lower.includes("order") ||
      lower.includes("delivery") ||
      lower.includes("where is my") ||
      lower.includes("tracking")
    ) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Please provide your order number or tracking ID:",
            sender: "bot",
            avatar: chatbot.avatar,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }, 800);
      return true;
    }

    // Rule 3: Rate / review / feedback
    if (
      lower.includes("rate") ||
      lower.includes("rating") ||
      lower.includes("review") ||
      lower.includes("feedback") ||
      lower.includes("experience") ||
      lower.includes("how was")
    ) {
      setSelectedRating(0);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "How would you rate your experience?",
            sender: "bot",
            avatar: chatbot.avatar,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }, 800);
      return true;
    }

    // Rule 4: Shop / product / buy
    if (
      lower.includes("shop") ||
      lower.includes("product") ||
      lower.includes("products") ||
      lower.includes("buy") ||
      lower.includes("cart") ||
      lower.includes("recommend") ||
      lower.includes("show me")
    ) {
      setShowProductCarousel(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Here are some featured items you might like:",
            sender: "bot",
            avatar: chatbot.avatar,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }, 800);
      return true;
    }

    // Rule 5: Help / support
    if (
      lower.includes("help") ||
      lower.includes("support") ||
      lower.includes("assist") ||
      lower.includes("question") ||
      lower.includes("issue") ||
      lower.includes("problem") ||
      lower.includes("contact")
    ) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "I'm here to help! Please describe your question or issue:",
            sender: "bot",
            avatar: chatbot.avatar,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }, 800);
      return true;
    }

    return false;
  };

  const callLLM = async (userMessage) => {
    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

      const payload = {
        provider: "groq",
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      };

      console.log("[LLM] Sending payload:", payload);

      const res = await fetch(`${backendUrl}/llm/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("[LLM] Backend error:", res.status, errText);
        throw new Error(`Backend returned ${res.status}`);
      }

      const data = await res.json();
      console.log("[LLM] Raw reply:", data);

      const reply =
        data.reply ||
        data.response ||
        data.content ||
        data.message ||
        "No reply received";

      if (typeof reply !== "string") {
        console.warn("[LLM] Reply not string:", reply);
        return "Sorry, the assistant returned an invalid response.";
      }

      return reply.trim() || "I don't have an answer for that right now.";
    } catch (err) {
      console.error("[LLM] Call failed:", err);
      return "Sorry the assistant is currently unavailable.";
    }
  };

//   const sendMessage = async (text = input.trim()) => {
//     if (!text) return;

//     const timestamp = new Date().toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//     const safeText = typeof text === "string" ? text : String(text || "");

//     const newMsg = {
//   text: safeText,
//   sender: "user",
//   avatar: userAvatar,
//   timestamp,
// };

  //   setMessages((prev) => [...prev, newMsg]);
  //   setInput("");
  //   setIsTyping(true);

  //   const flowTriggered = handleUserInput(safeText);

  //   if (flowTriggered) {
  //     setTimeout(() => setIsTyping(false), 1600);
  //   } else {
  //     const botReply = await callLLM(safeText);

  //     const botTimestamp = new Date().toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     });

  //     const safeReply =
  //       typeof botReply === "string"
  //         ? botReply
  //         : "Sorry, something went wrong.";

  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         text: safeReply,
  //         sender: "bot",
  //         avatar: chatbot.avatar,
  //         timestamp: botTimestamp,
  //       },
  //     ]);
  //     setIsTyping(false);
  //   }
  // };

  const sendMessage = async (text = input.trim()) => {
  if (!text) return;

  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const safeText = text.trim();

  // Add user message immediately
  setMessages((prev) => [
    ...prev,
    {
      text: safeText,
      sender: "user",
      avatar: userAvatar,
      timestamp,
    },
  ]);

  setInput("");
  setIsTyping(true);

  // 1. Try your existing keyword-based flows first (good for structured flows)
  const flowTriggered = handleUserInput(safeText);

  if (flowTriggered) {
    setTimeout(() => setIsTyping(false), 1600);
    return;
  }

  // 2. Call the hybrid backend endpoint
  try {
    const res = await fetch(`http://localhost:8000/chatbots/${id}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: safeText }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Server error ${res.status}`);
    }

    const data = await res.json();

    const botTimestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      {
        text: data.text || "Sorry, I couldn't process that.",
        sender: "bot",
        avatar: chatbot.avatar,
        timestamp: botTimestamp,
        source: data.source || "unknown",          // "knowledge", "llm", "knowledge_only", "error"
        confidence: data.confidence,               // number like 85
      },
    ]);
  } catch (err) {
    console.error("Chat error:", err);
    setMessages((prev) => [
      ...prev,
      {
        text: "Sorry, the assistant is having trouble right now...",
        sender: "bot",
        avatar: chatbot.avatar,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        source: "error",
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};

  const handleQuickAction = (label) => {
    sendMessage(label);
  };

  const resetChat = () => {
    setMessages([
      {
        text: chatbot?.greetingMessage || "Hello!",
        sender: "bot",
        avatar: chatbot.avatar,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedRating(0);
    setShowProductCarousel(false);
    setInput("");
  };

  const renderCalendar = () => (
    <div className="bg-white p-6 rounded-xl mt-4 border shadow-sm">
      <p className="font-semibold mb-4 flex items-center gap-2">
        <CalendarIcon size={20} /> Select Date (February 2026)
      </p>
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
          <button
            key={day}
            onClick={() => {
              setSelectedDate(`Feb ${day}, 2026`);
              setMessages((prev) => [
                ...prev,
                { text: `Selected: Feb ${day}, 2026`, sender: "user" },
              ]);
              setTimeout(() => {
                setMessages((prev) => [
                  ...prev,
                  { text: "Now choose a time slot:", sender: "bot" },
                ]);
              }, 500);
            }}
            className="p-3 rounded-lg hover:bg-blue-50 transition"
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );

  const renderTimeSlots = () => (
    <div className="bg-white p-6 rounded-xl mt-4 border shadow-sm">
      <p className="font-semibold mb-4">Available times for {selectedDate}</p>
      {["09:00", "11:00", "14:00", "16:00"].map((time) => (
        <button
          key={time}
          onClick={() => {
            setSelectedTime(time);
            setMessages((prev) => [...prev, { text: time, sender: "user" }]);
            setTimeout(() => {
              setMessages((prev) => [
                ...prev,
                {
                  text: `✓ Appointment confirmed for ${selectedDate} at ${time}!`,
                  sender: "bot",
                  avatar: chatbot.avatar,
                },
              ]);
            }, 800);
          }}
          className="block w-full py-3 my-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {time}
        </button>
      ))}
    </div>
  );

  const renderRating = () => (
    <div className="bg-white p-6 rounded-xl mt-4 border shadow-sm text-center">
      <p className="font-semibold mb-4">How would you rate your experience?</p>
      <div className="flex justify-center gap-3 text-3xl">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`cursor-pointer transition-transform hover:scale-110 ${selectedRating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            onClick={() => {
              setSelectedRating(star);
              setMessages((prev) => [
                ...prev,
                { text: `Rated ${star} stars`, sender: "user" },
              ]);
              setTimeout(() => {
                setMessages((prev) => [
                  ...prev,
                  { text: "Thank you for your feedback! ❤️", sender: "bot" },
                ]);
              }, 800);
            }}
          />
        ))}
      </div>
    </div>
  );

  const renderProductCarousel = () => (
    <div className="mt-6">
      <p className="font-semibold mb-3 text-center">Featured Products</p>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-xl border shadow-sm text-center"
          >
            <div className="bg-gray-200 h-32 rounded-lg mb-3" />
            <p className="font-medium">Product {i}</p>
            <p className="text-sm text-gray-600">$49.99</p>
          </div>
        ))}
      </div>
    </div>
  );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 p-10">
        {error}
      </div>
    );

  if (!chatbot)
    return (
      <div className="min-h-screen flex items-center justify-center p-10">
        Loading chatbot...
      </div>
    );

  const SelectedSendIcon = 
  sendIconOptions.find(opt => opt.value === chatbot?.sendButtonIcon)?.icon || Send;

  const isDark = darkMode;
  const widgetBg = isDark ? "#1e293b" : "white";
  const widgetText = isDark ? "#f1f5f9" : "#111827";

  // Quick actions block – now respects alignment & variant
  const quickActionsBlock = messages.length === 1 &&
    showQuickReplies &&
    chatbot?.quickActions?.length > 0 && (
      <div className="mt-8">
        <div className={`flex ${getQuickReplyAlignClass()}`}>
          <div
            className={`grid gap-4 max-w-lg ${
              quickReplyVariant === "list" ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {chatbot.quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => handleQuickAction(action.label)}
                className="py-5 px-6 bg-white border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all font-medium text-gray-800 flex flex-col items-center gap-2"
                style={{
                  borderRadius:
                    quickReplyVariant === "round"
                      ? "9999px"
                      : quickReplyVariant === "angular"
                        ? `${__SHARP}px`
                        : "16px",
                }}
              >
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div
        className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
        style={{ backgroundColor: widgetBg, color: widgetText }}
      >
        {/* Header */}
        <div
          className="p-6 flex items-center justify-between"
          style={{ backgroundColor: chatbot.headerColor }}
        >
          <div className="flex items-center gap-4">
            <img
              src={chatbot.avatar}
              alt={chatbot.name}
              className="w-14 h-14 rounded-full border-4 border-white shadow-lg object-cover"
              style={{ borderRadius: `${chatbot.avatarRadius}%` }}
            />
            <div>
              <h3
                className="font-bold text-xl"
                style={{ color: chatbot.headerTextColor }}
              >
                {chatbot.name}
              </h3>
              {chatbot.showOnlineStatus && (
                <p
                  className="text-sm flex items-center gap-2"
                  style={{ color: chatbot.headerTextColor }}
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  {chatbot.onlineStatusText}
                </p>
              )}
              <p
                className="text-sm opacity-90"
                style={{ color: chatbot.headerTextColor }}
              >
                {chatbot.agentRole}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-white/25 dark:hover:bg-black/25 transition-colors"
              style={{ color: chatbot.headerTextColor }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {chatbot.showResetButton && (
              <button
                onClick={resetChat}
                className="p-2 rounded-full hover:bg-white/25 dark:hover:bg-black/25 transition-colors"
                style={{ color: chatbot.headerTextColor }}
                aria-label="Reset conversation"
              >
                <RefreshCw size={20} />
              </button>
            )}

            {chatbot.showPersistentMenu && (
              <button
                className="p-2 rounded-full hover:bg-white/25 dark:hover:bg-black/25 transition-colors"
                style={{ color: chatbot.headerTextColor }}
                aria-label="More options"
              >
                <MoreVertical size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-5">
          {messages.map((m, i) => (
  <div
    key={i}
    className={`flex items-end gap-3 ${
      m.sender === "user" ? "justify-end" : "justify-start"
    }`}
  >
    {/* BOT AVATAR */}
    {m.sender === "bot" && (
      <img
        src={m.avatar || chatbot.avatar}
        className="w-10 h-10 rounded-full object-cover shrink-0"
        alt="bot"
      />
    )}

    {/* MESSAGE */}
    {/* <div
      className="max-w-[75%] p-4 rounded-2xl shadow-sm"
      style={{
        backgroundColor:
          m.sender === "user"
            ? isDark
              ? "#334155"
              : "#e0e7ff"
            : chatbot.botBubbleColor,
        color:
          m.sender === "user"
            ? isDark
              ? "#f1f5f9"
              : "#1e293b"
            : chatbot.botTextColor,
      }}
    >
      {m.text}
      {chatbot.showTimestamps && m.timestamp && (
        <p className="text-xs opacity-60 mt-1 text-right">
          {m.timestamp}
        </p>
      )}
    </div> */}
    <div
  className="max-w-[75%] p-4 rounded-2xl shadow-sm relative"
  style={{
    backgroundColor:
      m.sender === "user"
        ? isDark
          ? "#334155"
          : "#e0e7ff"
        : chatbot.botBubbleColor,
    color:
      m.sender === "user"
        ? isDark
          ? "#f1f5f9"
          : "#1e293b"
        : chatbot.botTextColor,
  }}
>
  <p className="break-words leading-relaxed">{m.text}</p>

  {chatbot.showTimestamps && m.timestamp && (
    <p className="text-xs opacity-60 mt-2 text-right">{m.timestamp}</p>
  )}
</div>

    {/* USER AVATAR */}
    {m.sender === "user" && (
  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
    <User size={20} className="text-gray-500" />
  </div>
)}

  </div>
))}


          {quickActionsBlock}

          {messages.some(
            (m) =>
              typeof m.text === "string" &&
              (m.text.toLowerCase().includes("select date") ||
                m.text.toLowerCase().includes("book it")),
          ) &&
            !selectedDate &&
            renderCalendar()}

          {selectedDate && !selectedTime && renderTimeSlots()}

          {messages.some(
            (m) =>
              typeof m.text === "string" &&
              (m.text.toLowerCase().includes("rate") ||
                m.text.toLowerCase().includes("experience")),
          ) &&
            selectedRating === 0 &&
            renderRating()}

          {showProductCarousel && renderProductCarousel()}

          {isTyping && (
  <div 
    className={`
      flex items-center gap-3 px-4 py-3 rounded-2xl max-w-[75%]
      ${darkMode ? 'bg-gray-700/60 text-gray-200' : 'bg-gray-200/80 text-gray-700'}
    `}
  >
    {(() => {
      const style = chatbot?.typingIndicatorStyle || "dots";

      if (style === "dots") {
        return (
          <div className="flex gap-1.5">
            {[0, 0.2, 0.4].map((delay, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 bg-current rounded-full animate-bounce"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        );
      }

      if (style === "wave") {
        return (
          <div className="flex gap-1 items-end h-6">
            {[0, 0.2, 0.4, 0.6].map((delay, i) => (
              <div
                key={i}
                className="w-2.5 bg-current rounded-t-md animate-wave"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        );
      }

      if (style === "typing") {
        return <span className="italic">typing...</span>;
      }

      if (style === "voice-wave") {
        return <span className="tracking-widest">~ ~ ~</span>;
      }

      if (style === "spinner") {
        return (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        );
      }

      if (style === "bounce-text") {
        return <span className="animate-bounce">Typing ↑</span>;
      }

      if (style === "ellipsis" || style === "grow") {
        return (
          <div className="flex gap-1 text-lg tracking-widest">
            <span className="animate-pulse">.</span>
            <span className="animate-pulse" style={{ animationDelay: "0.3s" }}>.</span>
            <span className="animate-pulse" style={{ animationDelay: "0.6s" }}>.</span>
          </div>
        );
      }

      if (style === "bars") {
        return (
          <div className="flex gap-1 items-end h-6">
            {[0, 0.15, 0.3].map((d, i) => (
              <div
                key={i}
                className="w-2 bg-current rounded animate-bars"
                style={{ animationDelay: `${d}s` }}
              />
            ))}
          </div>
        );
      }

      if (style === "glow-dots") {
        return (
          <div className="flex gap-2">
            {[0, 0.2, 0.4].map((d, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-current rounded-full animate-pulse shadow-lg shadow-current/60"
                style={{ animationDelay: `${d}s` }}
              />
            ))}
          </div>
        );
      }

      // fallback = classic dots
      return (
        <div className="flex gap-1.5">
          {[0, 0.2, 0.4].map((delay, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-current rounded-full animate-bounce"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
      );
    })()}
  </div>
)}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-3">
            <button className="p-3 hover:bg-gray-100 rounded-full transition">
              <Paperclip size={20} className="text-gray-600" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
              placeholder="Type your message..."
              className="flex-1 px-5 py-3 rounded-full border focus:outline-none focus:border-purple-500"
            />
           <button
  onClick={sendMessage}
  className="p-3 rounded-full text-white shadow-md transition-all hover:scale-105 hover:brightness-110 active:scale-95"
  style={{ backgroundColor: chatbot.sendButtonColor }}
>
  <SelectedSendIcon size={20} />
</button>
          </div>
        </div>
      </div>
    </div>
  );
}
