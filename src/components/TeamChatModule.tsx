import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import { THEME_CONFIG } from '../utils/theme';
import {
  MessageSquare,
  Send,
  Hash,
  Users,
  Shield,
  Megaphone,
  Sparkles,
} from 'lucide-react';

export const TeamChatModule: React.FC = () => {
  const { chats, sendChatMessage, currentUser, themeAccent } = useApp();
  const theme = THEME_CONFIG[themeAccent];

  const [activeChannel, setActiveChannel] = useState<ChatMessage['channel']>('staff');
  const [inputText, setInputText] = useState('');

  const channels: { id: ChatMessage['channel']; name: string; icon: any; desc: string }[] = [
    { id: 'staff', name: 'front-desk-staff', icon: Hash, desc: 'Daily operations & key allocations' },
    { id: 'warden', name: 'warden-security', icon: Shield, desc: 'Discipline, late-entry logs & safety' },
    { id: 'announcements', name: 'campus-announcements', icon: Megaphone, desc: 'Official student residence notices' },
    { id: 'residents', name: 'resident-community', icon: Users, desc: 'Student community lounge & social' },
  ];

  const channelMessages = chats.filter((c) => c.channel === activeChannel);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(activeChannel, inputText.trim());
    setInputText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Team Collaboration & Resident Chat
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Synchronized real-time messaging between housing staff, wardens, maintenance dispatch, and student residents.
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 md:grid-cols-4 overflow-hidden min-h-[550px]">
        {/* Left Channels List */}
        <div className="border-r border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-900/50 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Discussion Channels
          </div>

          {channels.map((chan) => {
            const Icon = chan.icon;
            const isSelected = activeChannel === chan.id;
            return (
              <button
                key={chan.id}
                onClick={() => setActiveChannel(chan.id)}
                className={`w-full flex items-start space-x-2.5 rtl:space-x-reverse p-2.5 rounded-xl text-left rtl:text-right transition ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <p className="text-xs font-semibold leading-tight">#{chan.name}</p>
                  <p className="text-[10px] text-slate-400 font-normal mt-0.5 leading-snug">
                    {chan.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Active Message View */}
        <div className="md:col-span-3 flex flex-col justify-between h-full bg-white dark:bg-slate-900/40">
          {/* Active channel header */}
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                #{activeChannel}
              </span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                Active Channel
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Posting as: <strong className="text-slate-700 dark:text-slate-200">{currentUser.name}</strong> ({currentUser.role})
            </span>
          </div>

          {/* Messages Feed */}
          <div className="p-4 space-y-4 overflow-y-auto max-h-[420px] flex-1">
            {channelMessages.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">
                No messages yet in #{activeChannel}. Say hello!
              </div>
            ) : (
              channelMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className="flex items-start space-x-3 rtl:space-x-reverse text-xs">
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {msg.senderName}
                        </span>
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {msg.senderRole}
                        </span>
                        <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Send Input Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message #${activeChannel}...`}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`px-4 py-2.5 rounded-xl text-white text-xs font-bold ${theme.primary} ${theme.primaryHover} disabled:opacity-50 transition flex items-center space-x-1.5`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
