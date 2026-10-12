import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Sparkles, Bot, User, RefreshCw, Compass, Heart, HelpCircle, Trash2 } from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';

interface AIOracleChatProps {
  userProfile: UserProfile | null;
  onOpenIntake: () => void;
  onClaimReward?: (points: number, reason: string) => void;
}

const CHAT_STORAGE_KEY = 'cosmic_oracle_chat_history_v1';

export const AIOracleChat: React.FC<AIOracleChatProps> = ({ userProfile, onOpenIntake, onClaimReward }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
    return [
      {
        id: 'welcome_1',
        sender: 'guide',
        text: userProfile
          ? `Greetings, ${userProfile.name || 'Honored Seeker'} 🔮. I am your Intuitive Companion. I see you vibrate at **Life Path #${userProfile.lifePathNumber}**. What cosmic question or guidance may I illuminate for you today?`
          : `Greetings 🔮. I am your Intuitive Guide. Please calculate your Birth Path above or ask any spiritual or numerology question to begin!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          userProfile,
        }),
      });

      const data = await res.json();
      const guideReply = data.reply || 'Trust your inner compass and embrace daily grounding. What else would you like to explore?';

      const guideMsg: ChatMessage = {
        id: `guide_${Date.now()}`,
        sender: 'guide',
        text: guideReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, guideMsg]);

      if (onClaimReward) {
        onClaimReward(10, 'Consulted the Intuitive Oracle Guide 🔮');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'guide',
          text: '🔮 *The cosmic winds are quiet momentarily.* Please try asking your question again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const initialMsg: ChatMessage = {
      id: `welcome_${Date.now()}`,
      sender: 'guide',
      text: userProfile
        ? `Greetings, ${userProfile.name || 'Honored Seeker'} 🔮. I am your Intuitive Companion. I see you vibrate at **Life Path #${userProfile.lifePathNumber}**. What cosmic question or guidance may I illuminate for you today?`
        : `Greetings 🔮. I am your Intuitive Guide. Please calculate your Birth Path above or ask any spiritual or numerology question to begin!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initialMsg]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 space-y-5">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[24px] sm:rounded-[32px] p-4 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#7D8E7A] bg-[#7D8E7A]/10 px-3 py-1 rounded-full border border-[#7D8E7A]/20">
              Intuitive AI Companion 🔮
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#4A4741] dark:text-[#F8F5F2] mt-2.5 break-words">
            Cosmic Oracle & Life Path Chat
          </h2>
          <p className="text-xs sm:text-sm text-[#6B665E] dark:text-[#A39E93] mt-1 font-medium break-words">
            Ask about relationships, career decisions, soul urge alignment, or spiritual timing.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {userProfile && (
            <div className="bg-[#F8F5F2] dark:bg-[#252320] px-4 py-2 rounded-2xl border border-[#E0D4C3] dark:border-[#3D3A35] text-xs text-[#C8826D] font-bold font-serif italic shrink-0">
              Life Path #{userProfile.lifePathNumber}
            </div>
          )}
          <button
            onClick={handleClearChat}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 text-xs font-semibold border border-stone-200 dark:border-stone-700 transition-colors"
            title="Reset conversation"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs">
        {[
          '🔮 What is my primary soul purpose?',
          '💖 How does my Life Path affect my relationships?',
          '🎯 Which career path aligns best with my energy?',
          '🧘‍♂️ What morning ritual increases my vibration?',
        ].map((promptText, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(promptText.replace(/^[^\s]+\s/, ''))}
            className="bg-white dark:bg-[#2D2A26] hover:bg-[#F8F5F2] dark:hover:bg-[#35322D] text-[#4A4741] dark:text-[#F8F5F2] border border-[#F0EBE5] dark:border-[#3D3A35] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all text-xs font-medium shadow-sm"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Chat Window */}
      <div className="bg-white dark:bg-[#2D2A26] border border-[#F0EBE5] dark:border-[#3D3A35] rounded-[24px] sm:rounded-[32px] p-3.5 sm:p-6 md:p-8 h-[480px] flex flex-col shadow-sm">
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-2.5 sm:space-x-3 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'user'
                    ? 'bg-[#C8826D] text-white shadow-sm'
                    : 'bg-[#7D8E7A] text-white shadow-sm'
                }`}
              >
                {m.sender === 'user' ? <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-[20px] sm:rounded-[24px] p-3 sm:p-4 text-xs leading-relaxed break-words ${
                  m.sender === 'user'
                    ? 'bg-[#C8826D]/15 text-[#3D3A35] dark:text-[#F8F5F2] border border-[#C8826D]/30 rounded-tr-none'
                    : 'bg-[#F8F5F2] dark:bg-[#252320] text-[#3D3A35] dark:text-[#F8F5F2] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-tl-none'
                }`}
              >
                {m.sender === 'user' ? (
                  <div className="whitespace-pre-wrap">{m.text}</div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none text-xs space-y-1.5 [&_p]:my-1 [&_ul]:my-1 [&_ul]:pl-4 [&_ul]:list-disc [&_li]:my-0.5 [&_strong]:text-[#4A4741] dark:[&_strong]:text-[#F8F5F2]">
                    <ReactMarkdown>{m.text}</ReactMarkdown>
                  </div>
                )}
                <span className="block text-[9px] text-[#8C867C] mt-1 font-sans">{m.timestamp}</span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-3 text-xs text-[#7D8E7A]">
              <div className="w-8 h-8 rounded-full bg-[#7D8E7A]/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 animate-spin text-[#7D8E7A]" />
              </div>
              <span className="italic font-serif">Intuitive Guide is channeling cosmic insights...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-[#F0EBE5] dark:border-[#3D3A35] flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask your Intuitive Guide anything..."
            className="flex-1 bg-[#F8F5F2] dark:bg-[#252320] border border-[#E0D4C3] dark:border-[#3D3A35] rounded-2xl px-4 py-3 text-xs text-[#3D3A35] dark:text-[#F8F5F2] focus:outline-none focus:border-[#7D8E7A]"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
            className="bg-[#7D8E7A] hover:bg-[#6c7d69] text-white p-3 rounded-2xl transition-all shadow-md disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
