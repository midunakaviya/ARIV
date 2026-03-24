import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Sparkles, Upload, Link2, FileText,
  Paperclip, Send, Eye, Palette, ChevronRight,
  Image as ImageIcon, Plus, Trash2,
  ArrowRight, Plane, CornerDownLeft,
  MessageCircle, SendHorizontal, ArrowUp, Navigation,
  Star, Package, Calendar, CheckCircle, Clock, HelpCircle, RefreshCw,
  Search, Truck, UserCircle, Headset,ExternalLink
} from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MoreVertical } from "lucide-react";

const API = import.meta.env.VITE_API_URL;


const addMessage = (text, sender) => {
  const timestamp = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  setMessages(prev => [...prev, { text, sender, timestamp }]);
};
const templates = [
  { 
    id: "support", 
    name: "Customer Support", 
    desc: "FAQs, tickets, live help", 
    color: "#3b82f6", 
    agentName: "Emma", 
    agentRole: "Customer Support Agent", 
    greeting: "Hello! I'm here to help you with any questions or issues you may have.",
    icon: Headset 
  },
  { 
    id: "ecommerce", 
    name: "E-commerce", 
    desc: "Shopping assistant, order tracking", 
    color: "#8b5cf6", 
    agentName: "Mila", 
    agentRole: "Shopping Assistant", 
    greeting: "Hey! I'm Mila, your personal shopping assistant. What are you looking for today?",
    icon: Package 
  },
  { 
    id: "appointment", 
    name: "Appointment", 
    desc: "Book meetings & consultations", 
    color: "#10b981", 
    agentName: "Sarah", 
    agentRole: "Scheduling Assistant", 
    greeting: "Hello! I'm Sarah, here to help you book appointments.",
    icon: Calendar 
  },
  { 
    id: "recruit", 
    name: "Recruitment", 
    desc: "Candidate screening & scheduling", 
    color: "#f59e0b", 
    agentName: "Alex", 
    agentRole: "Recruitment Specialist", 
    greeting: "Hi! I'm Alex from HR. I'd love to learn more about your experience.",
    icon: UserCircle 
  },
  { 
    id: "feedback", 
    name: "Feedback", 
    desc: "Collect reviews", 
    color: "#ec4899", 
    agentName: "Lily", 
    agentRole: "Feedback Assistant", 
    greeting: "Hi! I'm Lily. We’d love to hear your thoughts — it only takes 30 seconds!",
    icon: Star 
  },
];

const defaultQuickActions = {
  support: [
    { icon: Search, label: "FAQs" },
    { icon: Truck, label: "Track Order" },
    { icon: UserCircle, label: "Account" },
    { icon: Headset, label: "Support" },
  ],
  ecommerce: [
    { label: "Shop Products" },
    { label: "View Cart" },
    { label: "Track Order" },
    { label: "Cancel Order" },
    { label: "Contact Support" },
  ],
  appointment: [
    { label: "Book Appointment" },
    { label: "View Schedule" },
    { label: "Reschedule" },
  ],
  recruit: [
    { label: "Apply Now" },
    { label: "View Jobs" },
    { label: "Contact HR" },
  ],
  feedback: [
    { label: "Rate Experience" },
    { label: "Leave Review" },
    { label: "Contact Us" },
  ],
};


const defaultAvatars = [
  "https://api.dicebear.com/8.x/bottts/svg?seed=round1&backgroundColor=ffffff&baseColor=64748b",
  "https://api.dicebear.com/8.x/bottts/svg?seed=softbot4&backgroundColor=ffffff&baseColor=e5e7eb&accessoriesChance=0",
  "https://api.dicebear.com/8.x/bottts/svg?seed=clean4&backgroundColor=ffffff&baseColor=e5e7eb&accessoriesChance=0",
  "https://api.dicebear.com/8.x/bottts/svg?seed=clean6&backgroundColor=ffffff&baseColor=e5e7eb&accessoriesChance=0",
  "https://api.dicebear.com/8.x/bottts-neutral/svg?seed=smile2&backgroundColor=ffffff&baseColor=bfdbfe",
];


const productImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop";

// Compact UI toggle (set true to reduce overall sizing)
const COMPACT_UI = true;

// Helper classes
const ui = COMPACT_UI
  ? {
      card: "bg-white rounded-2xl shadow-xl p-6 space-y-7",
      h2: "text-2xl font-bold",
      h3: "text-lg font-bold",
      label: "text-sm font-semibold",
      select: "w-full px-4 py-3 rounded-xl border-2 text-sm focus:border-purple-500 outline-none",
      buttonPrimary: "flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold",
      buttonGhost: "px-6 py-3 border-2 rounded-xl font-medium",
      iconBtn: "p-2 hover:bg-gray-100 rounded-xl transition",
      stepWrap: "max-w-7xl mx-auto px-5 py-4 overflow-x-auto",
      stepDot: "w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all",
      gridGap: "gap-3",
    }
  : {
      card: "bg-white rounded-3xl shadow-2xl p-10 space-y-10",
      h2: "text-3xl font-bold",
      h3: "text-xl font-bold",
      label: "text-lg font-bold",
      select: "w-full px-6 py-4 rounded-2xl border-2 text-lg focus:border-purple-500 outline-none",
      buttonPrimary: "flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold",
      buttonGhost: "px-8 py-4 border-2 rounded-xl font-medium",
      iconBtn: "p-3 hover:bg-gray-100 rounded-xl transition",
      stepWrap: "max-w-7xl mx-auto px-6 py-5 overflow-x-auto",
      stepDot: "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
      gridGap: "gap-4",
    };

    const COMPACT = true;

const c = COMPACT
  ? {
      // header
      headerPad: "px-4 py-2",
      title: "text-xl font-bold",
      subPad: "px-4 py-2",
      stepDot: "w-8 h-8 text-[11px]",
      stepGap: "gap-4",
      stepText: "text-sm",
      pagePad: "px-4 py-4",
      gridGap: "gap-6",

      // layout
      pagePad: "px-5 py-6",
      gridGap: "gap-8",

      // cards
      card: "bg-white rounded-2xl shadow-xl p-6",
      cardTitle: "text-2xl font-bold",
      cardDesc: "text-sm text-gray-600",

      // inputs/buttons
      textarea: "w-full h-36 p-5 text-base rounded-2xl border-2 focus:border-purple-500 outline-none resize-none",
      btnBack: "px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition",
      btnNext: "flex-1 py-3 bg-purple-600 text-white rounded-xl text-sm font-bold",

      // preview
      previewHeader: "p-5",
      previewTitle: "text-2xl font-bold",
      previewDesc: "mt-2 text-sm text-white/90",
      previewBody: "p-6 bg-gray-50",
      toggleWrap: "rounded-xl p-1",
      toggleBtn: "px-7 py-2.5 text-sm rounded-lg font-semibold",
      desktopWidth: "w-[360px]",
    }
  : {
      headerPad: "px-6 py-4",
      title: "text-2xl font-bold",
      subPad: "px-6 py-5",
      stepDot: "w-10 h-10 text-sm",
      stepGap: "gap-8",
      stepText: "text-sm",

      pagePad: "px-6 py-10",
      gridGap: "gap-10",

      card: "bg-white rounded-3xl shadow-2xl p-10",
      cardTitle: "text-3xl font-bold",
      cardDesc: "text-gray-600",

      textarea: "w-full h-48 p-8 text-xl rounded-2xl border-2 focus:border-purple-500 outline-none resize-none",
      btnBack: "flex-1 sm:flex-none px-8 py-4 border-2 border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition",
      btnNext: "flex-1 py-4 bg-purple-600 text-white rounded-xl font-bold",

      previewHeader: "p-8",
      previewTitle: "text-3xl font-bold",
      previewDesc: "mt-3 text-lg text-white/90",
      previewBody: "p-10 bg-gray-50",
      toggleWrap: "rounded-xl p-1",
      toggleBtn: "px-10 py-4 rounded-lg font-semibold",
      desktopWidth: "w-[420px]",
    };

    function ToggleSwitch({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex items-center h-7 w-12 rounded-full transition-colors duration-200
        ${enabled ? "bg-purple-600" : "bg-gray-300"}
      `}
      aria-pressed={enabled}
    >
      <span
        className={`inline-block h-5 w-5 bg-white rounded-full shadow transform transition-transform duration-200
          ${enabled ? "translate-x-6" : "translate-x-1"}
        `}
      />
    </button>
  );
}


export default function ChatbotBuilder() {
  const navigate = useNavigate();
  const { chatbotId } = useParams(); // ← MOVE THIS TO THE TOP!
  
  const fileInputRef = useRef(null);

  const [step, setStep] = useState("template");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const [agentName, setAgentName] = useState("Mila");
  const [agentRole, setAgentRole] = useState("Shopping Assistant");
  const [conversationalTone, setConversationalTone] = useState("Friendly");
  const [responseStyle, setResponseStyle] = useState("Concise");
  const [personality, setPersonality] = useState("Helpful");

  const [agentAvatar, setAgentAvatar] = useState(defaultAvatars[1]);

  const [knowledgeText, setKnowledgeText] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [qaPairs, setQaPairs] = useState([{ question: "", answer: "" }]);

  const [headerColor, setHeaderColor] = useState("#8b5cf6");
  const [headerTextColor, setHeaderTextColor] = useState("#ffffff");
  const [botBubbleColor, setBotBubbleColor] = useState("#e0e7ff");
  const [botTextColor, setBotTextColor] = useState("#4f46e5");
  const [sendButtonColor, setSendButtonColor] = useState("#8b5cf6");
  const [chatBackground, setChatBackground] = useState("#f8fafc");
  const [shadowIntensity, setShadowIntensity] = useState(0.05);
  const [avatarRadius, setAvatarRadius] = useState(50);
  const [bubbleRadius, setBubbleRadius] = useState(24);
  const [buttonRadius, setButtonRadius] = useState(16);
  const [inputRadius, setInputRadius] = useState(20);

  const [darkMode, setDarkMode] = useState(false);
  const [sendButtonIcon, setSendButtonIcon] = useState("send");

  const [fontFamily, setFontFamily] = useState("system");
  const [botFontSize, setBotFontSize] = useState(16);
  const [userFontSize, setUserFontSize] = useState(16);
  const [fontWeight, setFontWeight] = useState(500);

  const [typingIndicatorColor, setTypingIndicatorColor] = useState("#9ca3af");
  const [typingIndicatorSize, setTypingIndicatorSize] = useState(8);
  const [typingAnimationSpeed, setTypingAnimationSpeed] = useState(0.8);
  const [showTypingIndicator, setShowTypingIndicator] = useState(true);

  const [bubbleVariant, setBubbleVariant] = useState("round");            // NEW
  const [showQuickReplies, setShowQuickReplies] = useState(true);         // NEW
  const [quickReplyVariant, setQuickReplyVariant] = useState("round");    // NEW: round | angular | list
  const [quickReplyAlignment, setQuickReplyAlignment] = useState("left"); // NEW: left | right | center
  const [showPersistentMenu, setShowPersistentMenu] = useState(false); 
  const [menuOpen, setMenuOpen] = useState(false);// NEW


  const [greetingMessage, setGreetingMessage] = useState("Hey! I'm Mila, your personal shopping assistant. What are you looking for today?");
  const [previewMode, setPreviewMode] = useState("desktop");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const [showCarousel, setShowCarousel] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [quickActions, setQuickActions] = useState([]);

  // Loading & saving states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  // Advanced features
const [showOnlineStatus, setShowOnlineStatus] = useState(true);
const [onlineStatusText, setOnlineStatusText] = useState("Online");

const [showResetButton, setShowResetButton] = useState(true);
const [showTimestamps, setShowTimestamps] = useState(true);

const [typingIndicatorStyle, setTypingIndicatorStyle] = useState("dots"); // "dots", "wave", "typing"

// Star rating customization
const [starSize, setStarSize] = useState(48);
const [starEmptyColor, setStarEmptyColor] = useState("#d1d5db");
const [starFilledColor, setStarFilledColor] = useState("#fbbf24");

// After other states, e.g. after const [greetingMessage, setGreetingMessage] = ...
const [isPublic, setIsPublic] = useState(false);

const [onlyKnowledge, setOnlyKnowledge] = useState(false);
// Add this near the top, with your other states
// Change this line:
const [localChatbotId, setLocalChatbotId] = useState(chatbotId || null);  // ← add || null


// Sync local state when URL param changes
useEffect(() => {
  setLocalChatbotId(chatbotId);
}, [chatbotId]);

  

  // Now useEffect can safely use chatbotId
  useEffect(() => {
    if (!chatbotId) return;

    setIsLoading(true);
    const token = localStorage.getItem("token");

    fetch(`${API}/chatbots/${chatbotId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then(data => {
        const cfg = data.config || {};

        setAgentName(cfg.agentName || "Assistant");
        setAgentRole(cfg.agentRole || "Helpful Assistant");
        setConversationalTone(cfg.conversationalTone || "Friendly");
        setResponseStyle(cfg.responseStyle || "Concise");
        setPersonality(cfg.personality || "Helpful");
        setGreetingMessage(cfg.greetingMessage || "Hello!");
        setAgentAvatar(data.avatar_url || defaultAvatars[0]);

        setHeaderColor(cfg.headerColor || "#8b5cf6");
        setBotBubbleColor(cfg.botBubbleColor || "#e0e7ff");
        setBotTextColor(cfg.botTextColor || "#4f46e5");
        setSendButtonColor(cfg.sendButtonColor || "#8b5cf6");
        setChatBackground(cfg.chatBackground || "#f8fafc");

        setDarkMode(cfg.darkMode || false);
        setFontFamily(cfg.fontFamily || "system");
        setSendButtonIcon(cfg.sendButtonIcon || "send");
        setQuickActions(cfg.quickActions || []);
        setSelectedTemplate(cfg.template || null);
        setIsPublic(!!cfg.isPublic);

        setBubbleVariant(cfg.bubbleVariant || "round");
        setShowQuickReplies(cfg.showQuickReplies ?? true);
        setQuickReplyVariant(cfg.quickReplyVariant || "round");
        setQuickReplyAlignment(cfg.quickReplyAlignment || "left");
        setShowPersistentMenu(cfg.showPersistentMenu ?? false);

        setIsLoading(false);
      })
      .catch(err => {
        alert("Could not load chatbot: " + err.message);
        setIsLoading(false);
      });
  }, [chatbotId]);

  // Show loading screen while fetching
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-purple-600 font-semibold">Loading your chatbot...</p>
        </div>
      </div>
    );
  }

  // ... rest of your code (effectiveChatBg, handlers, return JSX, etc.)

  const effectiveChatBg = darkMode ? "#0f172a" : chatBackground;
  const effectiveInputBg = darkMode ? "#1e293b" : "#ffffff";
  const effectiveUserBubbleBg = darkMode ? "#334155" : "#e0e7ff";
  const effectiveUserTextColor = darkMode ? "#f1f5f9" : "#4f46e5";

  const fontMap = {
    system: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    inter: "'Inter', sans-serif",
    poppins: "'Poppins', sans-serif",
    roboto: "'Roboto', sans-serif",
    outfit: "'Outfit', sans-serif",
    manrope: "'Manrope', sans-serif",
    satoshi: "'Satoshi', sans-serif",
    spacegrotesk: "'Space Grotesk', sans-serif",
  };

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

  const SelectedSendIcon = sendIconOptions.find(opt => opt.value === sendButtonIcon)?.icon || Send;

  const handleAvatarUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/upload/avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    setAgentAvatar(data.avatar_url);
  } catch (err) {
    alert("Uploaded");
    const reader = new FileReader();
    reader.onload = (ev) => setAgentAvatar(ev.target.result);
    reader.readAsDataURL(file);
  }
};

  const handleKnowledgeUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + " KB" }))]);
  };

  const addQAPair = () => setQaPairs(prev => [...prev, { question: "", answer: "" }]);
  const updateQAPair = (i, field, val) => setQaPairs(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));
  const removeQAPair = (i) => setQaPairs(prev => prev.filter((_, idx) => idx !== i));

  const sendMessage = () => {
  if (!input.trim()) return;
  
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  setMessages(prev => [...prev, { text: input, sender: "user", timestamp }]);
  setInput("");
  setIsTyping(true);
  setTimeout(() => {
    const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { text: "Thanks! This is a live preview.", sender: "bot", timestamp: botTimestamp }]);
    setIsTyping(false);
  }, 1200);
};

  

  const handleOptionClick = (text) => {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  setMessages(prev => [...prev, { text, sender: "user", timestamp }]);
  setIsTyping(true);
  setTimeout(() => {
    const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { text: "Great choice! How else can I help?", sender: "bot", timestamp: botTimestamp }]);
    setIsTyping(false);
  }, 1000);

  // Reset all special flows first
  setShowCarousel(false);
  setSelectedDate("");
  setSelectedTime("");
  setSelectedRating(0);

  // Then trigger specific ones
  if (selectedTemplate === "ecommerce" && (text === "Shop Products" || text === "View Cart")) {
    setShowCarousel(true);
  }
};

  const handleRatingClick = (rating) => {
  setSelectedRating(rating);
  const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  setMessages(prev => [...prev, { text: `You rated ${rating} stars`, sender: "user", timestamp: ts }]);
  setIsTyping(true);
  setTimeout(() => {
    const botTs = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { text: "Thank you for your rating!", sender: "bot", timestamp: botTs }]);
    setIsTyping(false);
  }, 1200);
};

// ✅ 3) HELPERS (inside ChatbotBuilder, ABOVE `const ChatbotPreview = () => {`)
// Paste this block just before ChatbotPreview declaration

const __SHARP = 6; // NEW

const getBubbleBorderRadius = (sender) => { // NEW
  const r = bubbleRadius;

  if (bubbleVariant === "angular") return `${__SHARP}px`;
  if (bubbleVariant === "round") return `${r}px`;

  if (bubbleVariant === "angularAndRound") {
    return sender === "bot" ? `${__SHARP}px` : `${r}px`;
  }

  if (bubbleVariant === "angularTop") {
    const tl = sender === "bot" ? __SHARP : r;
    const tr = sender === "user" ? __SHARP : r;
    return `${tl}px ${tr}px ${r}px ${r}px`;
  }

  if (bubbleVariant === "angularBottom") {
    const br = sender === "user" ? __SHARP : r;
    const bl = sender === "bot" ? __SHARP : r;
    return `${r}px ${r}px ${br}px ${bl}px`;
  }

  return `${r}px`;
};

const getQuickReplyAlignClass = () => { // NEW
  if (quickReplyAlignment === "right") return "justify-end";
  if (quickReplyAlignment === "center") return "justify-center";
  return "justify-start";
};


  const ChatbotPreview = () => {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-gray-200 bg-white"
      style={{
        backgroundColor: effectiveChatBg,
        boxShadow: `0 8px 25px rgba(0,0,0,${shadowIntensity})`,
        fontFamily: fontMap[fontFamily],   // ← THIS LINE WAS MISSING OR NOT APPLIED PROPERLY
        fontWeight: fontWeight,
      
      }}
    >
      
      <div className="p-5 flex items-center justify-between" style={{ backgroundColor: headerColor }}>
  <div className="flex items-center gap-4">
    <img 
      src={agentAvatar} 
      alt={agentName} 
      className={COMPACT ? "w-12 h-12 border-2 border-white shadow" : "w-16 h-16 border-4 border-white shadow"}
      style={{ borderRadius: `${avatarRadius}%` }} 
    />
    <div>
      <h3 className={COMPACT ? "text-base font-semibold" : "text-lg font-semibold"} style={{ color: headerTextColor }}>
        {agentName}
      </h3>
      {showOnlineStatus && (
        <p className={COMPACT ? "text-xs flex items-center gap-2 opacity-90" : "text-sm flex items-center gap-2 opacity-90"} style={{ color: headerTextColor }}>
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          {onlineStatusText}
        </p>
      )}
      <p className="text-sm opacity-90" style={{ color: headerTextColor }}>
        {agentRole}
      </p>
    </div>
  </div>

  {/* Dark Mode + Reset */}
{/* Header Actions */}
<div className="flex items-center gap-3 relative">
  
  {/* 🔹 Persistent Menu (3 dots ONLY) */}
  {showPersistentMenu && (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(v => !v)}
        className="p-2 rounded-lg bg-white/20 backdrop-blur hover:bg-white/30 transition"
        aria-label="Menu"
      >
        <MoreVertical className="w-5 h-5" style={{ color: headerTextColor }} />
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
          <button
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
            onClick={() => {
              setDarkMode(v => !v);
              setMenuOpen(false);
            }}
          >
            Toggle Dark Mode
          </button>
        </div>
      )}
    </div>
  )}

  {/* 🔹 Reset Button (NOT part of menu) */}
  {showResetButton && (
    <button
      onClick={() => {
        setMessages([]);
        setSelectedRating(0);
        setShowCarousel(false);
        setSelectedDate("");
        setSelectedTime("");
        setInput("");
      }}
      className={
        COMPACT
          ? "px-3 py-1.5 bg-white/20 backdrop-blur rounded-lg text-xs"
          : "px-4 py-2 bg-white/20 backdrop-blur rounded-lg text-sm"
      }
      style={{ color: headerTextColor }}
    >
      Reset
    </button>
  )}
</div>

</div>

      {/* Messages Area */}
      <div className={COMPACT
  ? "p-4 space-y-4 min-h-80 max-h-[420px] overflow-y-auto"
  : "p-6 space-y-6 min-h-96 max-h-[520px] overflow-y-auto"
}>
        {/* Initial State: Greeting + Quick Actions (shown for ALL templates) */}
        {messages.length === 0 && (
          <>
            {/* Greeting */}
            <div className="max-w-md">
              <div
                className="p-4 shadow-sm"
                style={{
                  backgroundColor: botBubbleColor,
                  color: botTextColor,
                  borderRadius: getBubbleBorderRadius("bot"),
                  fontSize: `${botFontSize}px`,
                }}
              >
                {/* <p className="text-base">{greetingMessage}</p> */}
                <p className="leading-relaxed" style={{ fontSize: 'inherit', margin: 0 }}>
  {greetingMessage}
</p>
              </div>
            </div>

           {/* Quick Actions Grid */}
{showQuickReplies && (
  <div className="mt-8">
    <div className={`flex ${getQuickReplyAlignClass()}`}>
      <div
        className={`grid gap-4 max-w-lg ${
          quickReplyVariant === "list" ? "grid-cols-1" : "grid-cols-2"
        }`}
      >
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleOptionClick(action.label)}
            className={COMPACT
              ? "py-3 bg-white border border-gray-200 hover:border-purple-400 hover:shadow-md transition-all font-medium text-gray-800 flex flex-col items-center gap-2"
              : "py-6 bg-white border-2 border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all font-medium text-gray-800 flex flex-col items-center gap-3"
            }
            style={{
              fontFamily: fontMap[fontFamily],
              fontWeight: fontWeight,
              fontSize: `${botFontSize}px`,
              borderRadius:
                quickReplyVariant === "round"
                  ? "9999px"
                  : quickReplyVariant === "angular"
                  ? `${__SHARP}px`
                  : `${buttonRadius}px`,
            }}
          >
            {action.icon && (
              <action.icon
                className="w-10 h-10 text-purple-600"
                style={{ fontSize: "inherit" }}
              />
            )}
            <span className="text-center px-2" style={{ fontSize: "inherit" }}>
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  </div>
)}
          </>
        )}
                {/* Recruitment - View Jobs */}
        {selectedTemplate === "recruit" && messages.some(m => m.text === "View Jobs") && (
          <div className="bg-white rounded-2xl shadow-sm border p-8 mt-6 max-w-2xl mx-auto">
            <p className="text-2xl font-bold text-orange-800 mb-8 text-center">
              Current Open Positions
            </p>
            <div className="space-y-6">
              {[
                { title: "Senior Frontend Developer", location: "Remote", type: "Full-time" },
                { title: "UX/UI Designer", location: "Berlin", type: "Full-time" },
                { title: "Backend Engineer (Node.js)", location: "Remote", type: "Full-time" },
                { title: "Product Manager", location: "London", type: "Full-time" },
              ].map((job, i) => (
                <div key={i} className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                  <h4 className="font-bold text-xl text-orange-900">{job.title}</h4>
                  <p className="text-orange-700 mt-2">
                    📍 {job.location} • ⏰ {job.type}
                  </p>
                  <button
                    onClick={() => {
  addMessage(`I'm interested in ${job.title}`, "user");
  addMessage("Great choice! Would you like to apply now?", "bot");
}}
                    className="mt-4 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition"
                  >
                    Apply for this role
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setMessages(prev => prev.filter(m => m.text !== "View Jobs"))}
              className="mt-6 text-sm text-gray-600 hover:text-gray-800 underline block mx-auto"
            >
              ← Back
            </button>
          </div>
        )}

        {/* Recruitment - Contact HR */}
        {selectedTemplate === "recruit" && messages.some(m => m.text === "Contact HR") && (
          <div className="bg-white rounded-2xl shadow-sm border p-8 mt-6 max-w-xl mx-auto text-center">
            <p className="text-2xl font-bold text-orange-800 mb-6">
              Get in touch with our HR team
            </p>
            <div className="space-y-4">
              <p className="text-lg text-gray-700">
                📧 Email: <a href="mailto:hr@company.com" className="text-orange-600 font-medium">hr@company.com</a>
              </p>
              <p className="text-lg text-gray-700">
                📞 Phone: <span className="font-medium">+1 (555) 123-4567</span>
              </p>
              <p className="text-lg text-gray-700">
                🕒 Available: Mon–Fri, 9 AM – 6 PM EST
              </p>
            </div>
            <p className="mt-8 text-gray-600">
              We'll get back to you within 24 hours!
            </p>
          </div>
        )}

        {/* Appointment - View Schedule */}
        {selectedTemplate === "appointment" && messages.some(m => m.text === "View Schedule") && (
          <div className="bg-white rounded-2xl shadow-sm border p-8 mt-6 max-w-2xl mx-auto">
            <p className="text-2xl font-bold text-green-800 mb-8 text-center">
              Your Upcoming Appointments
            </p>
            <div className="text-center py-12">
              <Calendar className="w-20 h-20 text-green-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No upcoming appointments</p>
              <p className="text-gray-500 mt-4">Book your first one today!</p>
            </div>
          </div>
        )}

        {/* Appointment - Reschedule */}
        {selectedTemplate === "appointment" && messages.some(m => m.text === "Reschedule") && (
          <div className="bg-white rounded-2xl shadow-sm border p-8 mt-6 max-w-xl mx-auto text-center">
            <p className="text-2xl font-bold text-green-800 mb-6">
              Reschedule Appointment
            </p>
            <p className="text-lg text-gray-700 mb-8">
              You don't have any upcoming appointments to reschedule.
            </p>
            <button
             onClick={() => {
  addMessage("Book Appointment", "user");
  setSelectedDate("");
  setSelectedTime("");
}}
              className="px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Book a New Appointment
            </button>
          </div>
        )}

        {/* E-commerce - Track Order */}
        {selectedTemplate === "ecommerce" && messages.some(m => m.text === "Track Order") && (
          <div className="bg-white rounded-2xl shadow-sm border p-8 mt-6 max-w-xl mx-auto">
            <p className="text-2xl font-bold text-purple-800 mb-6 text-center">
              Track Your Order
            </p>
            <input
              type="text"
              placeholder="Enter your order number"
              className="w-full px-6 py-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 outline-none text-center text-lg"
            />
            <button className="mt-6 w-full py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition">
              Track Order
            </button>
            <p className="text-sm text-gray-500 text-center mt-6">
              Example order: ORD-2025-12345
            </p>
          </div>
        )}

        {/* E-commerce - Cancel Order */}
        {selectedTemplate === "ecommerce" && messages.some(m => m.text === "Cancel Order") && (
          <div className="bg-white rounded-2xl shadow-sm border p-8 mt-6 max-w-xl mx-auto text-center">
            <p className="text-2xl font-bold text-purple-800 mb-6">
              Cancel Order
            </p>
            <p className="text-lg text-gray-700 mb-8">
              To cancel an order, please provide your order number and we'll assist you.
            </p>
            <button className="px-8 py-4 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition">
              Contact Support to Cancel
            </button>
          </div>
        )}

        {/* E-commerce - Contact Support */}
        {selectedTemplate === "ecommerce" && messages.some(m => m.text === "Contact Support") && (
          <div className="bg-white rounded-2xl shadow-sm border p-8 mt-6 max-w-xl mx-auto text-center">
            <p className="text-2xl font-bold text-purple-800 mb-6">
              We're here to help!
            </p>
            <p className="text-lg text-gray-700 mb-8">
              Average response time: <span className="font-bold">under 5 minutes</span>
            </p>
            <p className="text-gray-600">
              Just type your question below and we'll connect you with a support agent.
            </p>
          </div>
        )}

        {/* Support Template - All actions */}
        {selectedTemplate === "support" && messages.length > 0 && (
          <div className="bg-blue-50 rounded-2xl p-8 mt-6 max-w-xl mx-auto text-center">
            <p className="text-2xl font-bold text-blue-800 mb-4">
              How can we assist you today?
            </p>
            <p className="text-lg text-blue-700">
              Our support team is ready to help. Please describe your issue.
            </p>
          </div>
        )}

        {/* Feedback - Leave Review */}
        {selectedTemplate === "feedback" && messages.some(m => m.text === "Leave Review") && (
          <div className="bg-pink-50 rounded-2xl p-10 border-2 border-pink-200 shadow-lg max-w-lg mx-auto">
            <p className="text-3xl font-bold text-pink-800 text-center mb-8">
              Share Your Experience
            </p>
            <textarea
              placeholder="Write your detailed review here..."
              className="w-full p-6 bg-white border-2 border-pink-200 rounded-xl resize-none focus:border-pink-400 outline-none text-gray-700"
              rows="6"
            />
            <button className="mt-6 w-full py-5 bg-pink-600 text-white text-lg font-semibold rounded-xl hover:bg-pink-700 transition">
              Submit Review
            </button>
          </div>
        )}

        {/* Feedback - Contact Us */}
        {selectedTemplate === "feedback" && messages.some(m => m.text === "Contact Us") && (
          <div className="bg-pink-50 rounded-2xl p-10 border-2 border-pink-200 shadow-lg max-w-lg mx-auto text-center">
            <p className="text-3xl font-bold text-pink-800 mb-6">
              Get in Touch
            </p>
            <p className="text-xl text-pink-700 mb-8">
              We'd love to hear from you!
            </p>
            <p className="text-lg text-gray-700">
              📧 feedback@company.com<br />
              📞 +1 (555) 987-6543
            </p>
          </div>
        )}
        {/* E-commerce Carousel */}
        {showCarousel && selectedTemplate === "ecommerce" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border p-5">
              <img src={productImage} alt="Product" className="w-full h-64 object-cover rounded-xl mb-4" />
              <h4 className="font-semibold text-lg">Premium Headphones</h4>
              <p className="text-2xl font-bold mt-2">$299</p>
              <button className="mt-4 w-full py-3 bg-purple-600 text-white rounded-xl font-medium">
                View Details
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm border p-4 text-center">
                  <div className="bg-gray-200 rounded-lg h-32 mb-3 mx-auto w-32" />
                  <p className="font-medium">Product {i}</p>
                  <p className="text-gray-600">$99</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowCarousel(false)} className="text-purple-600 font-medium text-sm">
              ← Back to menu
            </button>
          </div>
        )}
                        {/* Feedback Flow - Static Stars (EXACT Match to Your Screenshot) */}
        {selectedTemplate === "feedback" && 
         messages.some(m => m.text === "Rate Experience") && 
         selectedRating === 0 && (
          <div className="mt-12 bg-pink-50 rounded-2xl p-10 border-2 border-pink-200 shadow-lg max-w-lg mx-auto">
            <p className="text-3xl font-bold text-pink-800 text-center mb-12 leading-tight">
              How would you rate your experience?
            </p>

            {/* Completely Static Large Stars - No Hover, No Scale, No Movement */}
            <div className="flex justify-center gap-6 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => handleRatingClick(i)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      selectedRating >= i 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Optional Feedback Text */}
            <textarea
              placeholder="Tell us more about your experience... (optional)"
              className="w-full p-5 bg-white border-2 border-pink-200 rounded-xl resize-none focus:border-pink-400 focus:outline-none text-gray-700"
              rows="4"
            />

            {/* Full Width Submit Button */}
            <button className="mt-8 w-full py-5 bg-pink-600 text-white text-lg font-semibold rounded-xl hover:bg-pink-700 transition">
              Submit Feedback
            </button>
          </div>
        )}

        {/* Thank You Screen - Also Static */}
        {selectedTemplate === "feedback" && selectedRating > 0 && (
          <div className="mt-12 bg-pink-50 rounded-2xl p-12 text-center border-2 border-pink-200 shadow-lg max-w-lg mx-auto">
            <CheckCircle className="w-32 h-32 text-pink-600 mx-auto mb-8" />
            <p className="text-4xl font-bold text-pink-800 mb-6">
              Thank you for your feedback!
            </p>
            <p className="text-2xl text-pink-700 mb-10">
              You rated us {selectedRating} {selectedRating === 1 ? "star" : "stars"} ⭐
            </p>
            <button
              onClick={() => {
                setSelectedRating(0);
                setMessages([]);
              }}
              className="px-12 py-5 bg-pink-600 text-white text-lg font-semibold rounded-xl hover:bg-pink-700 transition"
            >
              Rate Again
            </button>
          </div>
        )}

      
  {selectedTemplate === "recruit" && messages.some(m => m.text === "Apply Now") && (
  <div className="bg-orange-50 rounded-2xl shadow-sm border border-orange-200 p-10 mt-6 max-w-2xl mx-auto">
    {/* Step 1: Experience */}
    {!messages.some(m => m.text.match(/year|years/)) && (
      <>
        <p className="text-3xl font-bold text-orange-800 mb-10 text-center">
          How many years of professional experience do you have with JavaScript?
        </p>
        <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
          {["0-1 year", "1-3 years", "3-5 years", "5+ years"].map((exp) => (
            <button
              key={exp}
              onClick={() => {
                const userTs = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const botTs = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setMessages(prev => [
                  ...prev,
                  { text: exp, sender: "user", timestamp: userTs },
                  { text: "Thank you! One final question...", sender: "bot", timestamp: botTs }
                ]);
              }}
              className="py-8 rounded-2xl bg-white border-2 border-orange-200 hover:border-orange-500 hover:bg-orange-50 font-bold text-xl transition shadow-md"
            >
              {exp}
            </button>
          ))}
        </div>
      </>
    )}

    {/* Step 2: Availability */}
    {messages.some(m => m.text.match(/year|years/)) && !messages.some(m => m.text.includes("available")) && (
      <>
        <p className="text-3xl font-bold text-orange-800 mb-10 text-center">
          When are you available to start?
        </p>
        <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
          {["Immediately", "Within 2 weeks", "Within 1 month", "1-3 months"].map((opt) => (
            <button
              key={opt}
              onClick={() => {
                const userTs = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const botTs = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setMessages(prev => [
                  ...prev,
                  { text: opt, sender: "user", timestamp: userTs },
                  { text: "🎉 Application submitted! Our HR team will review your profile and contact you soon.", sender: "bot", timestamp: botTs }
                ]);
              }}
              className="py-8 rounded-2xl bg-white border-2 border-orange-200 hover:border-orange-500 hover:bg-orange-50 font-bold text-xl transition shadow-md"
            >
              {opt}
            </button>
          ))}
        </div>
      </>
    )}

    {/* Final Thank You */}
    {messages.some(m => m.text.includes("submitted")) && (
      <div className="text-center py-10">
        <CheckCircle className="w-32 h-32 text-orange-600 mx-auto mb-8" />
        <p className="text-3xl font-bold text-orange-800">
          Thank you for applying!
        </p>
      </div>
    )}
  </div>
)} 

                {/* Appointment Flow - Real Calendar (January 2026) */}
        {selectedTemplate === "appointment" && 
         messages.some(m => m.text === "Book Appointment") && 
         !selectedDate && 
         !selectedTime && (
          <div className="bg-white rounded-2xl shadow-sm border p-8 mt-6 max-w-2xl mx-auto">
            <p className="font-semibold text-xl mb-6 text-center text-gray-800">
              <Calendar className="w-7 h-7 inline mr-2 text-green-600" />
              Select an appointment date (January 2026)
            </p>

            {/* Calendar Header */}
            <div className="text-center mb-4">
              <p className="text-2xl font-bold text-gray-800">January 2026</p>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-3 text-center mb-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                <div key={day} className="text-sm font-bold text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-3 text-center">
              {/* Empty cells for Mon-Wed before Jan 1 (Thu) */}
              {[...Array(3)].map((_, i) => <div key={`empty-${i}`} />)}

              {/* Days 1 to 31 */}
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const isUnavailable = [3, 8, 15, 22, 29].includes(day); // Example unavailable Thursdays
                const isWeekend = [4, 5, 11, 12, 18, 19, 25, 26].includes(day); // Sat/Sun

                return (
                  <button
                    key={day}
                    disabled={isUnavailable || isWeekend}
                    onClick={() => {
  setSelectedDate(`January ${day}, 2026`);
  const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  setMessages(prev => [...prev, { text: `January ${day}, 2026`, sender: "user", timestamp: ts }]);
  setIsTyping(true);
  setTimeout(() => {
    const botTs = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { text: "Excellent! Now pick a time slot.", sender: "bot", timestamp: botTs }]);
    setIsTyping(false);
  }, 800);
}}
                    className={`
                      py-5 rounded-xl font-medium transition-all
                      ${isUnavailable || isWeekend
                        ? "text-gray-300 cursor-not-allowed line-through bg-gray-50"
                        : "hover:bg-green-50 hover:border-green-400 hover:shadow-md border-2 border-transparent"
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <p className="text-sm text-gray-500 text-center mt-6">
              Strikethrough = Unavailable • Weekends not bookable
            </p>
          </div>
        )}

        {/* Time Slots - Different per day example */}
        {selectedTemplate === "appointment" && selectedDate && !selectedTime && (
          <div className="bg-white rounded-2xl shadow-sm border p-8 mt-6 max-w-xl mx-auto">
            <p className="font-semibold text-xl mb-6 text-center text-gray-800">
              Available times for {selectedDate}
            </p>

            <div className="grid grid-cols-2 gap-5">
              {/* Example: Different times based on day */}
              {(() => {
                const dayNum = parseInt(selectedDate.split(" ")[1]);
                let times = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];
                
                // Make some days have limited slots
                if ([7, 14, 21, 28].includes(dayNum)) {
                  times = ["10:00 AM", "2:00 PM", "3:00 PM"];
                } else if ([1, 15].includes(dayNum)) {
                  times = ["9:00 AM", "11:00 AM", "4:00 PM"];
                }

                return times.map(time => (
                  <button
                    key={time}
                    onClick={() => {
  setSelectedTime(time);
  const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  setMessages(prev => [...prev, { text: time, sender: "user", timestamp: ts }]);
  setIsTyping(true);
  setTimeout(() => {
    const botTs = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { text: "Perfect! Your appointment is confirmed.", sender: "bot", timestamp: botTs }]);
    setIsTyping(false);
  }, 800);
}}
                    className="py-6 rounded-xl bg-green-50 border-2 border-green-200 hover:bg-green-100 hover:border-green-400 font-semibold text-green-800 transition shadow-sm"
                  >
                    {time}
                  </button>
                ));
              })()}
            </div>

            <button 
              onClick={() => setSelectedDate("")}
              className="mt-6 text-sm text-gray-600 hover:text-gray-800 underline block mx-auto"
            >
              ← Back to calendar
            </button>
          </div>
        )}

        {/* Confirmation - Same as before */}
        {selectedTemplate === "appointment" && selectedDate && selectedTime && (
          <div className="bg-green-50 rounded-2xl p-10 text-center border-2 border-green-200 shadow-lg max-w-lg mx-auto">
            <CheckCircle className="w-28 h-28 text-green-600 mx-auto mb-8" />
            <p className="text-4xl font-bold text-green-800 mb-6">Appointment Confirmed!</p>
            <div className="space-y-4 text-left max-w-xs mx-auto bg-white rounded-xl p-6 shadow">
              <p className="text-xl font-medium text-gray-800">
                <span className="font-semibold">Date:</span> {selectedDate}
              </p>
              <p className="text-xl font-medium text-gray-800">
                <span className="font-semibold">Time:</span> {selectedTime}
              </p>
            </div>
            <button 
              onClick={() => {
                setSelectedDate("");
                setSelectedTime("");
                setMessages([]);
              }} 
              className="mt-10 px-12 py-5 bg-green-600 text-white text-xl font-semibold rounded-xl hover:bg-green-700 transition shadow-lg"
            >
              Book Another
            </button>
          </div>
        )}
       
{/* All Messages (after interaction starts) */}
{messages.map((m, i) => (
  <div key={i} className={m.sender === "user" ? "ml-auto max-w-md" : "max-w-md"}>
    <div
      className="p-4 shadow-sm inline-block"
      style={{
        backgroundColor: m.sender === "user" ? effectiveUserBubbleBg : botBubbleColor,
        color: m.sender === "user" ? effectiveUserTextColor : botTextColor,
        borderRadius: getBubbleBorderRadius(m.sender === "user" ? "user" : "bot"),
        fontSize: m.sender === "user" ? `${userFontSize}px` : `${botFontSize}px`, // ← ADD THIS BACK
        lineHeight: "1.6",
      }}
    >
      {/* <p className="leading-relaxed break-words">{m.text}</p> */}
      <p 
  className="leading-relaxed break-words" 
  style={{ fontSize: 'inherit' }}  // This forces it to inherit the parent's fontSize
>
  {m.text}
</p>
      {showTimestamps && m.timestamp && (
        <p className="text-xs opacity-60 mt-2 text-right">
          {m.timestamp}
        </p>
      )}
    </div>
  </div>
))}
       
{isTyping && showTypingIndicator && (
  <div className="max-w-md">
    <div className="p-4 rounded-2xl bg-gray-200 inline-flex items-center gap-3">
      {typingIndicatorStyle === "dots" && (
        <div className="flex gap-1">
          {[0, 0.2, 0.4].map((d, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
              style={{ animationDelay: `${d}s` }}
            />
          ))}
        </div>
      )}
      {typingIndicatorStyle === "glow-dots" && (
  <div className="flex gap-2">
    {[0, 0.2, 0.4].map((d, i) => (
      <div
        key={i}
        className="w-3 h-3 bg-purple-500 rounded-full animate-ping shadow-lg shadow-purple-500/50"
        style={{ animationDelay: `${d}s` }}
      />
    ))}
  </div>
)}
      {typingIndicatorStyle === "wave" && (
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-2 h-6 bg-purple-600 rounded-full animate-ping"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}

      {typingIndicatorStyle === "typing" && (
        <span className="text-sm text-gray-600 italic">typing...</span>
      )}

      {typingIndicatorStyle === "voice-wave" && (
  <div className="flex items-end gap-1 h-6">
    {[1, 3, 5, 4, 2, 4, 3].map((h, i) => (
      <div
        key={i}
        className="w-1 bg-purple-600 rounded-full animate-bounce"
        style={{
          height: `${h * 4}px`,
          animationDelay: `${i * 0.1}s`,
          animationDuration: "0.8s",
        }}
      />
    ))}
  </div>
)}

      {typingIndicatorStyle === "spinner" && (
        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      )}

      {typingIndicatorStyle === "bounce-text" && (
        <span className="text-sm text-gray-700 font-medium animate-bounce">
          Typing
        </span>
      )}

      {typingIndicatorStyle === "ellipsis" && (
        <div className="flex gap-1">
          <span className="text-gray-600 animate-pulse" style={{ animationDelay: "0s" }}>.</span>
          <span className="text-gray-600 animate-pulse" style={{ animationDelay: "0.3s" }}>.</span>
          <span className="text-gray-600 animate-pulse" style={{ animationDelay: "0.6s" }}>.</span>
        </div>
      )}

      {typingIndicatorStyle === "bars" && (
        <div className="flex items-end gap-1 h-6">
          {[1, 3, 2, 4, 2].map((height, i) => (
            <div
              key={i}
              className="w-1 bg-purple-600 rounded-full animate-bounce"
              style={{
                height: `${height * 4}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  </div>
)}
      </div>

      
{/* {showPersistentMenu && (
  <div className="px-4 pb-3">
    <div className="flex gap-2 justify-center">
      <button
        onClick={() => {
          setMessages([]);
          setSelectedRating(0);
          setShowCarousel(false);
          setSelectedDate("");
          setSelectedTime("");
          setInput("");
        }}
        className="px-4 py-2 text-xs font-semibold bg-white border rounded-full hover:bg-gray-50"
      >
        Reset
      </button>
      <button
        onClick={() => {
          // example action — keep minimal
          addMessage("Help", "user");
          addMessage("Sure — tell me what you need help with.", "bot");
        }}
        className="px-4 py-2 text-xs font-semibold bg-white border rounded-full hover:bg-gray-50"
      >
        Help
      </button>
    </div>
  </div>
)} */}


      {/* Input Area */}
      <div className={COMPACT ? "p-3 border-t" : "p-5 border-t"} style={{ backgroundColor: effectiveChatBg }}>
        <div className="flex items-center gap-3">
          <button className="p-3 hover:bg-gray-100 rounded-full">
            <Paperclip className="w-5 h-5 text-gray-600" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())
            }
            placeholder="Type your message..."
            className={COMPACT
  ? "flex-1 px-4 py-3 border border-gray-300 focus:border-purple-500 focus:outline-none text-sm"
  : "flex-1 px-5 py-4 border border-gray-300 focus:border-purple-500 focus:outline-none"
}
            style={{
              backgroundColor: effectiveInputBg,
              borderRadius: `${inputRadius}px`,
            }}
          />
          <button
            onClick={sendMessage}
            className={COMPACT ? "p-3 text-white shadow-md" : "p-4 text-white shadow-md"}
            style={{
              backgroundColor: sendButtonColor,
              borderRadius: `${buttonRadius}px`,
            }}
          >
            <SelectedSendIcon className={COMPACT ? "w-5 h-5" : "w-6 h-6"} />
          </button>
        </div>
      </div>
    </div>
  );
};


const saveChatbot = async () => {
  setIsSaving(true);
  setSaveStatus("");
  const config = {
    template: selectedTemplate,
    agentName,
    agentRole,
    greetingMessage,
    conversationalTone,
    responseStyle,
    personality,
    quickActions: quickActions.map(a => ({
      label: a.label,
      iconName: a.icon?.displayName || null
    })),
    headerColor,
    headerTextColor,
    botBubbleColor,
    botTextColor,
    sendButtonColor,
    chatBackground,
    darkMode,
    avatarRadius,
    bubbleRadius,
    buttonRadius,
    inputRadius,
    shadowIntensity,
    fontFamily,
    botFontSize,
    userFontSize,
    fontWeight,
    sendButtonIcon,
    showTypingIndicator,
    typingIndicatorStyle,
    typingIndicatorColor,
    typingIndicatorSize,
    typingAnimationSpeed,
    showOnlineStatus,
    onlineStatusText,
    showResetButton,
    showTimestamps,
    knowledgeText,
    websiteUrl,
    qaPairs,
     onlyKnowledge,
    isPublic: isPublic,
    bubbleVariant,
    showQuickReplies,
    quickReplyVariant,
    quickReplyAlignment,
    showPersistentMenu,
  };
  const body = {
    name: agentName,
    config,
    avatar_url: agentAvatar.startsWith("/static") || agentAvatar.startsWith("http")
      ? agentAvatar
      : null,
  };
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token. Please log in again.");
    const method = chatbotId ? "PUT" : "POST";
    const url = chatbotId
      ? `${API}/chatbots/${chatbotId}`
      : "${API}/chatbots";
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Save failed (${res.status})`);
    }
    const data = await res.json();
    // Always update local ID after any save
    const newId = data.id || chatbotId || data.chatbot_id;
    if (newId) {
      setLocalChatbotId(newId);
      if (!chatbotId) {
        navigate(`/chatbot-builder/${newId}`, { replace: true });
      }
      setSaveStatus(`Saved successfully! ID: ${newId}`);
    } else {
      setSaveStatus("Chatbot saved/updated successfully!");
    }
  } catch (err) {
    console.error("Save error:", err);
    setSaveStatus(`Save failed: ${err.message}`);
  } finally {
    setIsSaving(false);
  }
};

  return (
    <>
      <header className="bg-white border-b sticky top-0 z-50">
  <div className="max-w-6xl mx-auto flex items-center gap-6 h-16 px-6 overflow-x-auto">
    
    {/* Back button */}
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium flex-shrink-0"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>

    {/* Divider */}
    <div className="h-5 w-px bg-gray-200" />

    {/* Stepper */}
    <div className={`flex items-center ${c.stepGap} ${c.stepText} font-medium whitespace-nowrap`}>
      {[
        "Template",
        "Persona",
        "Quick Actions",
        "Avatar",
        "Style",
        "Advanced Appearance",
        "Knowledge & Publish",
      ].map((label, i) => {
        const steps = [
          "template",
          "greeting",
          "quickactions",
          "avatar",
          "style",
          "advanced",
          "knowledge",
        ];

        return (
          <div
            key={i}
            className={`flex items-center gap-3 ${
              step === steps[i] ? "text-purple-600" : "text-gray-400"
            }`}
          >
            <div
              className={`${c.stepDot} rounded-full flex items-center justify-center font-bold ${
                step === steps[i]
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {i + 1}
            </div>

            <span className="hidden sm:block">{label}</span>
            {i < 7 && <ChevronRight className="w-4 h-4 text-gray-300" />}
          </div>
        );
      })}
    </div>
  </div>
</header>

      <div className="h-screen overflow-hidden flex flex-col bg-gradient-to-br from-purple-50 to-pink-50">
        <div
  className={`max-w-7xl mx-auto grid lg:grid-cols-2 ${c.gridGap} ${c.pagePad} pb-0 flex-1 min-h-0 items-stretch`}
  style={{ height: "calc(100vh - 160px)" }}
>
          <div
  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6
             overflow-y-auto"
>

            {/* Template Step */}
            {step === "template" && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold mb-5">Choose a Template</h2>
                <div className="grid grid-cols-2 gap-6">
                  {templates.map(t => (

<button
  key={t.id}
  onClick={() => {
    const selected = templates.find(tm => tm.id === t.id);
    const templateIndex = templates.indexOf(selected);
    setSelectedTemplate(t.id);
    setHeaderColor(t.color);
    setSendButtonColor(t.color);
    setAgentName(t.agentName);
    setAgentRole(t.agentRole);
    setGreetingMessage(t.greeting);
    setQuickActions(defaultQuickActions[t.id] || []);
    setAgentAvatar(defaultAvatars[templateIndex]);
    setMessages([]);
    setShowCarousel(false);
    setSelectedRating(0);
    setSelectedDate("");
    setSelectedTime("");
  }}
  className={`
    relative p-3 rounded-2xl border-2 overflow-hidden
    transition-all duration-200 cursor-pointer
    ${selectedTemplate === t.id
      ? "border-purple-600 shadow-xl"
      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
    }
  `}
>
  {/* Main card background - white */}
  <div className="absolute inset-0 bg-white" />

  {/* Colored circle behind the icon */}
  <div
  className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full"
  style={{ backgroundColor: t.color }}
/>

  {/* Icon on top - with white background circle and template color */}
  <div className="relative z-10 w-14 h-14 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-md border-2 border-white">
  <t.icon className="w-7 h-7" style={{ color: t.color }} />
</div>

  {/* Title and Description */}
  <div className="relative z-10 text-center mt-4">
    <h3 className="font-bold text-lg text-gray-900 mb-1">{t.name}</h3>
<p className="text-xs text-gray-600 leading-relaxed px-2">{t.desc}</p>
  </div>

  {/* Selected checkmark */}
  {selectedTemplate === t.id && (
    <div className="absolute top-4 right-4 z-20">
      <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center shadow">
  <CheckCircle className="w-4 h-4 text-white" />
</div>
    </div>
  )}
</button>
                  ))}
                </div>
                <div className="flex justify-end mt-10">
                  <button
                    onClick={() => setStep("greeting")}
                    disabled={!selectedTemplate}
                    className="flex-1 py-3 bg-purple-600 text-white rounded-xl text-sm font-bold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions Step */}
{step === "quickactions" && (
  <div className={`${c.card} space-y-6`}>
    <h2 className="text-2xl font-semibold mb-5">Customize Quick Actions</h2>
{/* <p className="text-sm text-gray-600">Edit the buttons users see when they first open the chat</p> */}
    <div className="space-y-4">
      {quickActions.map((action, index) => (
          
        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
  {/* Icon Selector */}
  <select
    value={action.icon ? action.icon.displayName : ""}
    onChange={(e) => {
      const iconName = e.target.value;
      const IconComponent = {
        Search, Truck, UserCircle, Headset
      }[iconName] || null;
      const updated = [...quickActions];
      updated[index].icon = IconComponent;
      setQuickActions(updated);
    }}
    className="px-3 py-2 rounded-lg border focus:border-purple-500 outline-none w-28 text-sm"
  >
    <option value="">No Icon</option>
    <option value="Search">Search</option>
    <option value="Truck">Truck</option>
    <option value="UserCircle">User</option>
    <option value="Headset">Headset</option>
  </select>

  {/* Label Input */}
  <input
    type="text"
    value={action.label}
    onChange={(e) => {
      const updated = [...quickActions];
      updated[index].label = e.target.value;
      setQuickActions(updated);
    }}
    className="flex-1 px-3 py-2 rounded-lg border focus:border-purple-500 outline-none text-sm"
    placeholder="Button label"
  />

  {/* Delete Button */}
  <button
    onClick={() => setQuickActions(quickActions.filter((_, i) => i !== index))}
    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
  >
    <Trash2 className="w-4 h-4" />
  </button>
</div>
      ))}
    </div>

    {/* Add New Action */}
    <button
      onClick={() => setQuickActions([...quickActions, { label: "New Option" }])}
      className="w-full py-3 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 text-sm font-semibold hover:bg-purple-50 flex items-center justify-center gap-2 transition"
    >
      <Plus className="w-4 h-4" /> Add New Action
    </button>

    <div className="flex gap-3 pt-2">
  <button onClick={() => setStep("greeting")} className="px-6 py-3 border-2 rounded-xl text-sm font-medium">
    Back
  </button>
  <button onClick={() => setStep("avatar")} className="flex-1 py-3 bg-purple-600 text-white rounded-xl text-sm font-bold">
    Next
  </button>
</div>
  </div>
)}

            

            {/* Avatar Step */}
            {step === "avatar" && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold mb-5">Choose Avatar</h2>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {defaultAvatars.map((src, i) => (
                    <button
  key={i}
  onClick={() => setAgentAvatar(src)}
  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all
    ${agentAvatar === src ? "border-purple-500 shadow-md" : "border-gray-200 hover:border-gray-300"}
  `}
>
  <img src={src} alt="" className="w-full h-full object-cover" />
</button>
                  ))}
                </div>
                <button
  onClick={() => fileInputRef.current.click()}
  className="w-full py-3 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 text-sm font-semibold hover:bg-gray-50"
>
  <ImageIcon className="w-5 h-5" /> Upload Custom Avatar
</button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                <div className="flex gap-3 mt-6">
  <button onClick={() => setStep("quickactions")} className="px-6 py-3 border-2 rounded-xl text-sm font-medium">
    Back
  </button>
  <button onClick={() => setStep("style")} className="flex-1 py-3 bg-purple-600 text-white rounded-xl text-sm font-bold">
    Next
  </button>
</div>
              </div>
            )}

            {/* Knowledge Step */}
            {step === "knowledge" && (
              <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
  <FileText className="w-6 h-6 text-green-600" /> Knowledge & Publish
</h2>

                {/* Public Toggle */}
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">Make this chatbot public</h3>
          {/* <p className="text-xs text-gray-600 mt-1">
            Anyone with the link can chat without login
          </p> */}
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={e => setIsPublic(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer
                          peer-checked:after:translate-x-7 after:content-['']
                          after:absolute after:top-0.5 after:left-[2px] after:bg-white
                          after:rounded-full after:h-6 after:w-6 after:transition-all
                          peer-checked:bg-purple-600"></div>
        </label>
      </div>
    </div>
    {onlyKnowledge && (
  <p className="mt-3 text-xs text-purple-700 bg-purple-50/50 p-3 rounded-lg border border-purple-200">
    AI fallback disabled — make sure your Q&A covers common questions!
  </p>
)}
    {/* <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100"> */}
{/* </div>

                <textarea value={knowledgeText} onChange={e => setKnowledgeText(e.target.value)} placeholder="Input FAQs, product info..." className="w-full h-28 p-2 rounded-xl border-2 focus:border-purple-500 outline-none" />
                <div>
                  <button onClick={() => fileInputRef.current.click()} className="w-full py-6 border-2 border-dashed rounded-xl flex flex-col items-center gap-4 hover:bg-gray-50 transition">
                    <Upload className="w-6 h-6 text-purple-500" />
                    <span className="text-sm font-bold">Upload Documents</span>
                  </button>
                  <input ref={fileInputRef} type="file" multiple onChange={handleKnowledgeUpload} className="hidden" />
                </div>
                <div className="flex gap-3">
  <input
    value={websiteUrl}
    onChange={e => setWebsiteUrl(e.target.value)}
    placeholder="https://yourwebsite.com"
    className="flex-1 px-4 py-3 rounded-xl border-2 focus:border-purple-500 outline-none text-sm"
  /> */}
  {/* <button className="px-5 py-3 bg-orange-600 text-white rounded-xl font-semibold flex items-center gap-2 text-sm">
    <Link2 className="w-4 h-4" /> Add
  </button> */}
{/* </div> */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Q&A Training</h3>
                    <button onClick={addQAPair} className="flex items-center gap-2 text-purple-600 font-semibold hover:bg-purple-50 px-4 py-2 rounded-xl transition">
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                  {qaPairs.map((pair, i) => (
                    <div key={i} className="mb-4 p-3 bg-gray-50 rounded-xl space-y-3">
                      <div className="flex items-center gap-3">
                        <input placeholder="Question" value={pair.question} onChange={e => updateQAPair(i, "question", e.target.value)} className="flex-1 px-4 py-3 rounded-xl border focus:border-purple-500 outline-none" />
                        {qaPairs.length > 1 && (
                          <button onClick={() => removeQAPair(i)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      <textarea placeholder="Answer" value={pair.answer} onChange={e => updateQAPair(i, "answer", e.target.value)} className="w-full px-4 py-3 rounded-xl border focus:border-purple-500 outline-none h-28 resize-none" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep("advanced")} className="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-300 rounded-lg font-sm hover:bg-gray-50 transition">Back</button>
                     {/* Save / Update Button - THIS WAS MISSING */}
  
      <button
  onClick={saveChatbot}
  disabled={isSaving}
  className={`
    flex-1 px-6 py-3 rounded-xl font-semibold transition   {/* ← ADD flex-1 here */}
    ${isSaving
      ? "bg-green-400 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700 text-white shadow-md"}
  `}
>
  {isSaving ? "Saving..." : chatbotId ? "Save & Finish" : "Save & Finish"}
</button>


<button
  onClick={() => {
    const chatId = localChatbotId || chatbotId;
    if (chatId) {
      const publicUrl = `${API}/chat/${chatId}`;
      window.open(publicUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert("Please save the chatbot first — we need an ID to generate the public link!");
    }
  }}
  disabled={isSaving || !(localChatbotId || chatbotId)}
  className={`
    flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-3 transition
    ${(localChatbotId || chatbotId) && !isSaving
      ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"}
  `}
>
  <ExternalLink className="w-3 h-3" />
  Test Public Chat
</button>
</div>
{/* Save Status Message */}
    {saveStatus && (
      <p className={`text-center font-semibold text-sm mt-4 ${
        saveStatus.includes("success") ? "text-green-600" : "text-red-600"
      }`}>
        {saveStatus}
      </p>
    )}
                
              </div>
            )}

            {/* Style Step */}
            {step === "style" && (
              <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Palette className="w-6 h-6" /> Style
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div className="flex items-center justify-between gap-4"><label className="text-m font-semibold">Header Color</label><input type="color" value={headerColor} onChange={e => setHeaderColor(e.target.value)} className="h-10 w-10 cursor-pointer rounded-lg border-2 border-gray-200 p-0"
    style={{ background: "transparent" }} /></div>
                  <div className="flex items-center justify-between gap-4"><label className="text-sm font-semibold">Header Text Color</label><input type="color" value={headerTextColor} onChange={e => setHeaderTextColor(e.target.value)} className="h-10 w-10 cursor-pointer rounded-lg border-2 border-gray-200 p-0"
    style={{ background: "transparent" }} /></div>
                  <div className="flex items-center justify-between gap-4"><label className="text-sm font-semibold">Bot Bubble Color</label><input type="color" value={botBubbleColor} onChange={e => setBotBubbleColor(e.target.value)} className="h-10 w-10 cursor-pointer rounded-lg border-2 border-gray-200 p-0"
    style={{ background: "transparent" }} /></div>
                  <div className="flex items-center justify-between gap-4"><label className="text-sm font-semibold">Send Button Color</label><input type="color" value={sendButtonColor} onChange={e => setSendButtonColor(e.target.value)} className="h-10 w-10 cursor-pointer rounded-lg border-2 border-gray-200 p-0"
    style={{ background: "transparent" }} /></div>
                  <div className="flex items-center justify-between gap-4"><label className="text-sm font-semibold">Bot Text Color</label><input type="color" value={botTextColor} onChange={e => setBotTextColor(e.target.value)} className="h-10 w-10 cursor-pointer rounded-lg border-2 border-gray-200 p-0"
    style={{ background: "transparent" }} /></div>
                  <div className="flex items-center justify-between gap-4"><label className="text-sm font-semibold">Chat Background</label><input type="color" value={chatBackground} onChange={e => setChatBackground(e.target.value)} className="h-10 w-10 cursor-pointer rounded-lg border-2 border-gray-200 p-0"
    style={{ background: "transparent" }} /></div>
                </div>
                <div className="space-y-6">
                  <div><label className="text-sm font-semibold">Shadow Intensity: {Math.round(shadowIntensity * 100)}%</label><input type="range" min="0" max="50" value={shadowIntensity * 100} onChange={e => setShadowIntensity(e.target.value / 100)} className="w-full h-1.5 rounded-lg bg-gray-200" /></div>
                  <div><label className="text-sm font-semibold">Avatar Shape: {avatarRadius}px</label><input type="range" min="0" max="60" value={avatarRadius} onChange={e => setAvatarRadius(+e.target.value)} className="w-full h-1.5 rounded-lg bg-gray-200" /></div>
                  <div><label className="text-sm font-semibold">Message Bubble Shape: {bubbleRadius}px</label><input type="range" min="0" max="32" value={bubbleRadius} onChange={e => setBubbleRadius(+e.target.value)} className="w-full h-1.5 rounded-lg bg-gray-200" /></div>
                  <div><label className="text-sm font-semibold">Button Shape: {buttonRadius}px</label><input type="range" min="0" max="32" value={buttonRadius} onChange={e => setButtonRadius(+e.target.value)} className="w-full h-1.5 rounded-lg bg-gray-200" /></div>
                  <div><label className="text-sm font-semibold">Message Field Shape: {inputRadius}px</label><input type="range" min="0" max="32" value={inputRadius} onChange={e => setInputRadius(+e.target.value)} className="w-full h-1.5 rounded-lg bg-gray-200" /></div>
                </div>
                <div className="flex gap-3 pt-4">
  <button
    onClick={() => setStep("avatar")}
    className="px-6 py-3 border-2 rounded-xl text-sm font-medium"
  >
    Back
  </button>
  <button
    onClick={() => setStep("advanced")}
    className="flex-1 py-3 bg-purple-600 text-white rounded-xl text-sm font-bold"
  >
    Next
  </button>
</div>
              </div>
            )}

            
{/* Advanced Appearance Step */}
{step === "advanced" && (
  <div className={ui.card}>
    <h2 className="text-2xl font-semibold flex items-center gap-2">
      <Palette className="w-6 h-6" /> Advanced Appearance
    </h2>

    {/* Dark Mode */}
    <div className="flex items-center justify-between">
      <label className="text-lg font-semibold">Dark Mode</label>
      <ToggleSwitch enabled={darkMode} onChange={setDarkMode} />
    </div>

    {/* Send Button Icon */}
    <div className="space-y-6">
     <h3 className="text-xl font-semibold">Send Button Icon</h3>

<div className={`grid grid-cols-4 ${ui.gridGap}`}>
  {sendIconOptions.map(({ value, icon: Icon, label }) => (
    <button
      key={value}
      onClick={() => setSendButtonIcon(value)}
      className={`rounded-xl border-2 transition-all flex flex-col items-center justify-center
        ${COMPACT_UI ? "p-3" : "p-6"}
        ${sendButtonIcon === value
          ? "border-purple-600 bg-purple-50 shadow-md"
          : "border-gray-200 hover:border-gray-300"
        }`}
    >
      <Icon className={COMPACT_UI ? "w-6 h-6" : "w-8 h-8"} />
      <span className="text-[11px] font-medium mt-1">{label}</span>
    </button>
  ))}
</div>

    </div>

    
    <div className="space-y-6">
  <h3 className="text-xl font-semibold">Typography</h3>

  {/* Font Family */}
  <div>
    <label className="block text-sm font-medium mb-3">Font Family</label>
    <select 
      value={fontFamily} 
      onChange={e => setFontFamily(e.target.value)} 
      className={ui.select}
      style={{ fontFamily: fontMap[fontFamily] }}
    >
      <option value="system">System Default</option>
      <option value="inter">Inter</option>
      <option value="poppins">Poppins</option>
      <option value="roboto">Roboto</option>
      <option value="outfit">Outfit</option>
      <option value="manrope">Manrope</option>
      <option value="spacegrotesk">Space Grotesk</option>
    </select>
  </div>

  {/* Bot Message Size - Dropdown */}
  <div>
    <label className="block text-sm font-medium mb-3">Bot Message Size</label>
    <select 
      value={botFontSize} 
      onChange={e => setBotFontSize(+e.target.value)}
      className={ui.select}
    >
      {[12, 13, 14, 15, 16, 17, 18, 20, 22, 24].map(size => (
        <option key={size} value={size}>{size}px</option>
      ))}
    </select>
  </div>

  {/* User Message Size - Dropdown */}
  <div>
    <label className="block text-sm font-medium mb-3">User Message Size</label>
    <select 
      value={userFontSize} 
      onChange={e => setUserFontSize(+e.target.value)}
      className={ui.select}
    >
      {[12, 13, 14, 15, 16, 17, 18, 20, 22, 24].map(size => (
        <option key={size} value={size}>{size}px</option>
      ))}
    </select>
  </div>

  {/* Font Weight - Keep as slider or make dropdown too */}
  <div>
    <label className="block text-sm font-medium mb-3">Font Weight</label>
    <select 
      value={fontWeight} 
      onChange={e => setFontWeight(+e.target.value)}
      className={ui.select}
    >
      <option value="300">Light (300)</option>
      <option value="400">Normal (400)</option>
      <option value="500">Medium (500)</option>
      <option value="600">Semi Bold (600)</option>
      <option value="700">Bold (700)</option>
      <option value="800">Extra Bold (800)</option>
    </select>
  </div>
</div>

    {/* === NEW ADVANCED OPTIONS START HERE === */}
    <div className="border-t pt-8 space-y-8">

      {/* Online Status */}
      <div>
        <div className="flex items-center justify-between py-4">
          <label className={ui.label}>Show Online Status</label>
          <ToggleSwitch enabled={showOnlineStatus} onChange={setShowOnlineStatus} />
        </div>
        {showOnlineStatus && (
          <input
            value={onlineStatusText}
            onChange={e => setOnlineStatusText(e.target.value)}
            className="w-full px-5 py-3 rounded-xl border mt-2 focus:border-purple-500 outline-none"
            placeholder="Online • Usually replies in seconds"
          />
        )}
      </div>

      {/* Reset Button */}
      <div className="flex items-center justify-between py-4">
        <label className={ui.label}>Show Reset Button in Header</label>
        <ToggleSwitch enabled={showResetButton} onChange={setShowResetButton} />
      </div>

      {/* Message Timestamps */}
      <div className="flex items-center justify-between py-4">
        <label className={ui.label}>Show Message Timestamps</label>
        <ToggleSwitch enabled={showTimestamps} onChange={setShowTimestamps} />
      </div>

    
<div className="py-6">
  <label className="font-semibold block mb-4 text-lg">Typing Indicator Style</label>
  <div className="grid grid-cols-3 gap-4">
    {[
      { value: "dots", label: "Dots" },
      { value: "wave", label: "Wave" },
      { value: "typing"},
      { value: "voice-wave", label: "Voice Wave" },
      { value: "spinner", label: "Spinner" },
      { value: "bounce-text" },
      { value: "ellipsis", label: "Grow" },
      { value: "bars", label: "Bars" },
      { value: "glow-dots", label:"Glow Dots" },
    ].map((style) => (
      <button
        key={style.value}
        onClick={() => setTypingIndicatorStyle(style.value)}
        className={`p-5 rounded-xl border-2 font-medium transition-all flex items-center justify-center gap-2 ${
          typingIndicatorStyle === style.value
            ? "border-purple-600 bg-purple-50 shadow-md"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {style.value === "dots" && "•••"}
        {style.value === "wave" && "▁▃▅▃▁"}
        {style.value === "typing" && "typing..."}
        {style.value === "voice-wave" && "∼∼∼"}
        {style.value === "spinner" && <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />}
        {style.value === "bounce-text" && <span className="animate-bounce">Typing ↑</span>}
        {style.value === "ellipsis" && "..."}
        {style.value === "bars" && "▂▃▅▃▂"}
        { style.value == "glow-dots" && "✨" }
        <span className="ml-2 text-xs text-gray-600">{style.label}</span>
      </button>
    ))}
  </div>
</div>
      

    </div>
    {/* === END OF NEW OPTIONS === */}

{/* Chat Message */}
<div className="border-t pt-8">
  <p className="font-semibold text-lg mb-4">Chat Message</p>
  {/* <p className="text-sm text-gray-500 mb-4">Bubble Variant</p> */}

  <div className="grid grid-cols-3 gap-4">
    {[
      { v: "round", t: "Round Corner"},
      { v: "angular", t: "Angular Corner"},
      { v: "angularBottom", t: "Angular Bottom"},
      { v: "angularTop", t: "Angular Top"},
      { v: "angularAndRound", t: "Angular and Round"},
    ].map((opt) => (
      <button
        key={opt.v}
        onClick={() => setBubbleVariant(opt.v)}
        className={`text-left p-4 rounded-2xl border-2 transition ${
          bubbleVariant === opt.v ? "border-purple-600 bg-purple-50" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="font-semibold">{opt.t}</div>
        <div className="text-xs text-gray-500">{opt.s}</div>
      </button>
    ))}
  </div>
</div>

{/* Quick Replies */}
<div className="border-t pt-8">
  <p className="font-semibold text-lg mb-4">Quick Replies</p>

  <div className="flex items-center justify-between py-2">
    <div>
      <div className="font-semibold">Show Quick Replies</div>
      {/* <div className="text-xs text-gray-500">Enable quick reply buttons with suggested responses</div> */}
    </div>
    <ToggleSwitch enabled={showQuickReplies} onChange={setShowQuickReplies} />
  </div>

  <div className="mt-6">
    <p className="text-sm font-semibold mb-3">Reply Variant</p>
    <div className="grid grid-cols-3 gap-4">
      {[
        { v: "round", t: "Round"},
        { v: "angular", t: "Angular"},
        { v: "list", t: "List"},
      ].map((opt) => (
        <button
          key={opt.v}
          onClick={() => setQuickReplyVariant(opt.v)}
          className={`text-left p-4 rounded-2xl border-2 transition ${
            quickReplyVariant === opt.v ? "border-purple-600 bg-purple-50" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="font-semibold">{opt.t}</div>
          <div className="text-xs text-gray-500">{opt.s}</div>
        </button>
      ))}
    </div>
  </div>

  <div className="mt-6">
    <p className="text-sm font-semibold mb-3">Alignment</p>
    <div className="grid grid-cols-3 gap-4">
      {[
        { v: "left", t: "Left"},
        { v: "right", t: "Right"},
        { v: "center", t: "Centered"},
      ].map((opt) => (
        <button
          key={opt.v}
          onClick={() => setQuickReplyAlignment(opt.v)}
          className={`text-left p-4 rounded-2xl border-2 transition ${
            quickReplyAlignment === opt.v ? "border-purple-600 bg-purple-50" : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="font-semibold">{opt.t}</div>
          <div className="text-xs text-gray-500">{opt.s}</div>
        </button>
      ))}
    </div>
  </div>
</div>

{/* Persistent Menu */}
<div className="border-t pt-8">
  <p className="font-semibold text-lg mb-4">Persistent Menu</p>

  <div className="flex items-center justify-between py-2">
    <div>
      <div className="font-semibold">Show Persistent Menu</div>
      {/* <div className="text-xs text-gray-500">Enable menu with options like download, reload</div> */}
    </div>
    <ToggleSwitch enabled={showPersistentMenu} onChange={setShowPersistentMenu} />
  </div>
</div>


    {/* Navigation */}
   <div className="flex gap-3 pt-4">
  <button
    onClick={() => setStep("style")}
    className="px-6 py-3 border-2 rounded-xl text-sm font-medium"
  >
    Back
  </button>
  <button
    onClick={() => setStep("knowledge")}
    className="flex-1 py-3 bg-purple-600 text-white rounded-xl text-sm font-bold"
  >
    Next
  </button>
</div>

  </div>
)}
                       {/* Persona + Greeting Step (merged) */}
{step === "greeting" && (
  <div className={`${c.card} space-y-6`}>
    <h2 className="text-2xl font-semibold">Persona</h2>

    {/* AI Persona Name */}
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-600">Name</label>
      <input
        value={agentName}
        onChange={(e) => setAgentName(e.target.value)}
        placeholder="e.g. Sarah"
        className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:border-purple-500 outline-none"
      />
    </div>

    {/* AI Persona Role */}
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-600">Role</label>
      <input
        value={agentRole}
        onChange={(e) => setAgentRole(e.target.value)}
        placeholder="e.g. Scheduling Assistant"
        className="w-full px-4 py-3 border-2 rounded-xl text-sm focus:border-purple-500 outline-none"
      />
    </div>

    {/* Greeting Message */}
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-600">Greeting Message</label>
      <textarea
        value={greetingMessage}
        onChange={(e) => setGreetingMessage(e.target.value)}
        className={c.textarea}
        placeholder="Enter your greeting message..."
      />
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
      <button onClick={() => setStep("template")} className={c.btnBack}>
        Back
      </button>
      <button onClick={() => setStep("quickactions")} className={c.btnNext}>
        Next
      </button>
    </div>
  </div>
)}
 </div>

          {/* Live Preview */}
          <div className="sticky top-24 h-full overflow-hidden">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-purple-600 text-white p-5 text-center">
                <div className="flex items-center justify-center gap-4">
                  <Eye className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Live Preview</h2>
                </div>
              </div>
              <div className="p-6 bg-gray-50">
                <div className="flex justify-center mb-12">
                  <div className="inline-flex bg-gray-200 rounded-xl p-1 shadow-md">
                    <button onClick={() => setPreviewMode("desktop")} className={`px-7 py-3 rounded-lg font-semibold transition-all ${previewMode === "desktop" ? "bg-white text-purple-600 shadow-lg" : "text-gray-600"}`}>Desktop</button>
                    <button onClick={() => setPreviewMode("mobile")} className={`px-7 py-3 rounded-lg font-semibold transition-all ${previewMode === "mobile" ? "bg-white text-purple-600 shadow-lg" : "text-gray-600"}`}>Mobile</button>
                  </div>
                </div>
                <div className="flex justify-center">
                  
                    {previewMode === "desktop" ? (
  <div className="w-[420px] mx-auto"> {/* Narrower, realistic chatbot widget size */}
    <ChatbotPreview />
  </div>
                  ) : (
                    <div className="w-96 h-[852px] relative">
                      <div className="absolute inset-0 bg-black rounded-[60px] p-[10px] shadow-2xl">
                        <div className="w-full h-full bg-white rounded-[50px] overflow-hidden relative">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-8 bg-black rounded-b-3xl z-20"></div>
                          <div className="absolute inset-0 pt-12 pb-28 px-4 flex flex-col">
                            <div className="flex-1 min-h-0 overflow-y-auto">
                              <ChatbotPreview />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 