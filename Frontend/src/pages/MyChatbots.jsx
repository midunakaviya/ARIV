import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Bot, ExternalLink } from "lucide-react";

const defaultAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&crop=face",
];

export default function MyChatbots() {
  const navigate = useNavigate();
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatbots = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/chatbots", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setChatbots(data || []); // assuming backend returns array directly
      } catch (err) {
        console.error(err);
        alert("Failed to load your chatbots");
      } finally {
        setLoading(false);
      }
    };
    fetchChatbots();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this chatbot? This cannot be undone.")) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8000/chatbots/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatbots(chatbots.filter((bot) => bot.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <p className="text-xl text-purple-600">Loading your chatbots...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-purple-900 flex items-center gap-4">
            <Bot className="w-12 h-12 text-purple-600" />
            My Chatbots
          </h1>
          <button
            onClick={() => navigate("/chatbot-builder")}
            className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition flex items-center gap-3"
          >
            <Plus className="w-6 h-6" />
            Create New Chatbot
          </button>
        </div>

        {chatbots.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-2xl p-20 text-center">
            <Bot className="w-32 h-32 text-purple-200 mx-auto mb-8" />
            <h2 className="text-3xl font-bold mb-4">No Chatbots Yet</h2>
            <p className="text-xl text-gray-600 mb-8">
              Start building your first AI chatbot!
            </p>
            <button
              onClick={() => navigate("/chatbot-builder")}
              className="px-12 py-4 bg-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition"
            >
              Create Your First Chatbot
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chatbots.map((bot) => (
              <div
                key={bot.id}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                {/* Avatar/Header Image */}
                <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center relative">
                  {bot.avatar_url ? (
                    <img
                      src={bot.avatar_url?.startsWith('http') ? bot.avatar_url : `http://localhost:8000${bot.avatar_url}`}
                      alt={bot.name}
                      className="w-32 h-32 rounded-full border-8 border-white shadow-2xl object-cover"
                    />
                  ) : (
                    <Bot className="w-32 h-32 text-purple-300" />
                  )}
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{bot.name}</h3>

                  {/* Status + Date */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                    <span>
                      Created: {new Date(bot.created_at).toLocaleDateString()}
                    </span>
                    {bot.is_public ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Public
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        Private
                      </span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {/* Edit */}
                    <button
                      onClick={() => navigate(`/chatbot-builder/${bot.id}`)}
                      className="flex-1 min-w-[100px] py-3 bg-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-purple-700 transition"
                    >
                      <Edit className="w-5 h-5" />
                      Edit
                    </button>

                    {/* Copy Public Link */}
                    <button
                      onClick={() => {
                        const publicLink = `${window.location.origin}/chat/${bot.id}`;
                        navigator.clipboard.writeText(publicLink);
                        alert(
                          `Public chat link copied!\nAnyone with this link can use it:\n${publicLink}`
                        );
                      }}
                      disabled={!bot.is_public}
                      className={`
                        flex-1 min-w-[160px] py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition
                        ${
                          bot.is_public
                            ? "bg-green-600 hover:bg-green-700 text-white shadow-sm"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }
                      `}
                    >
                      <ExternalLink className="w-5 h-5" />
                      {bot.is_public ? "Copy Public Link" : "Make Public First"}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(bot.id)}
                      className="px-5 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition flex items-center justify-center"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}