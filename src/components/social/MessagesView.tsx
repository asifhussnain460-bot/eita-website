import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  UserCheck,
  Send,
  Mic,
  MicOff,
  Square,
  Play,
  Pause,
  ArrowLeft,
  Check,
  X,
  Sparkles,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DirectMessageThread, UserProfile } from '../../types';

export const MessagesView: React.FC = () => {
  const {
    dms,
    activeDmThread,
    openDmWithUser,
    closeActiveDm,
    sendDmMessage,
    sendDmVoiceNote,
    friendRequests,
    respondFriendRequest,
    currentUser,
    allUsers,
    openUserProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'chats' | 'friends'>('chats');
  const [inputText, setInputText] = useState('');

  // Voice Note Recorder state
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // Audio Playback state
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeDmThread?.messages]);

  // Voice Recording handlers
  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        sendDmVoiceNote(audioUrl, Math.max(1, recordDuration));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordDuration(0);

      timerRef.current = window.setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone permission not granted for voice note', err);
      // Fallback simulated voice note
      sendDmVoiceNote('simulated_audio', 4);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePlayVoice = (id: string, url: string) => {
    if (playingVoiceId === id) {
      audioPlayerRef.current?.pause();
      setPlayingVoiceId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      if (url && url !== 'simulated_audio') {
        const audio = new Audio(url);
        audioPlayerRef.current = audio;
        audio.onended = () => setPlayingVoiceId(null);
        audio.play().catch(() => {});
      }
      setPlayingVoiceId(id);
      setTimeout(() => {
        setPlayingVoiceId(null);
      }, 3500);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendDmMessage(inputText);
    setInputText('');
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 pb-24">
      {/* If Active DM Thread is open */}
      {activeDmThread ? (
        <div className="rounded-3xl bg-[#121626] border border-purple-900/30 overflow-hidden shadow-2xl flex flex-col h-[78vh]">
          {/* Thread Header */}
          <div className="px-4 py-3 bg-[#0d101c] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={closeActiveDm}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div
                onClick={() => openUserProfile(activeDmThread.participant)}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <div className="relative">
                  <img
                    src={activeDmThread.participant.avatar}
                    alt={activeDmThread.participant.displayName}
                    className="w-9 h-9 rounded-full object-cover border border-purple-500/40"
                  />
                  {activeDmThread.participant.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border border-black" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                    {activeDmThread.participant.displayName}
                  </h4>
                  <div className="text-[10px] text-slate-400">
                    @{activeDmThread.participant.username} · VIP {activeDmThread.participant.vipLevel}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {activeDmThread.messages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMine && (
                    <img
                      src={msg.senderAvatar}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover shrink-0 mb-1"
                    />
                  )}

                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs shadow-md ${
                      isMine
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-br-none'
                        : 'bg-white/10 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.type === 'voice' && msg.voiceData ? (
                      <div className="flex items-center gap-2.5 py-0.5">
                        <button
                          type="button"
                          onClick={() => handlePlayVoice(msg.id, msg.voiceData!.audioUrl)}
                          className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors"
                        >
                          {playingVoiceId === msg.id ? (
                            <Pause className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5 ml-0.5" />
                          )}
                        </button>
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <span>🎙️ Voice Note</span>
                          <span className="opacity-80">({msg.voiceData.duration}s)</span>
                        </div>
                      </div>
                    ) : (
                      <p className="leading-relaxed break-words">{msg.content}</p>
                    )}
                    <span className="text-[9px] opacity-70 block text-right mt-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar with Text and Voice Recorder */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-[#0d101c] border-t border-white/5 flex items-center gap-2"
          >
            {isRecording ? (
              <div className="flex-1 flex items-center justify-between px-3.5 py-2 bg-rose-950/40 border border-rose-500/40 rounded-full animate-pulse">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  Recording Audio... {recordDuration}s
                </span>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Square className="w-3 h-3" /> Stop & Send
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />

                {/* Voice Note Button */}
                <button
                  type="button"
                  onClick={startRecording}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-purple-300 flex items-center justify-center cursor-pointer transition-colors"
                  title="Hold to Record Voice Message"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </>
            )}
          </form>
        </div>
      ) : (
        /* Conversation Threads List & Friend Requests */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-pink-400" />
              Social & Private Messages
            </h1>

            {/* Tab switch */}
            <div className="flex items-center gap-1 bg-[#121626] p-1 rounded-2xl border border-white/5">
              <button
                onClick={() => setActiveTab('chats')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'chats'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Chats ({dms.length})
              </button>
              <button
                onClick={() => setActiveTab('friends')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                  activeTab === 'friends'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Friend Requests
                {friendRequests.filter((f) => f.status === 'pending').length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-pink-500 text-white text-[9px] font-black">
                    {friendRequests.filter((f) => f.status === 'pending').length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* TAB 1: ACTIVE CHATS */}
          {activeTab === 'chats' && (
            <div className="rounded-3xl bg-[#121626] border border-purple-900/30 divide-y divide-white/5 overflow-hidden">
              {dms.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => openDmWithUser(thread.participant)}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <img
                        src={thread.participant.avatar}
                        alt={thread.participant.displayName}
                        className="w-12 h-12 rounded-full object-cover border border-purple-500/40"
                      />
                      {thread.participant.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-white truncate">
                          {thread.participant.displayName}
                        </h4>
                        <span className="text-[10px] text-purple-400 font-bold">
                          VIP {thread.participant.vipLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 truncate mt-0.5">
                        {thread.lastMessage}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {thread.lastMessageTime}
                    </span>
                    {thread.unreadCount > 0 && (
                      <span className="block mt-1 ml-auto w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-black flex items-center justify-center">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: FRIEND REQUESTS */}
          {activeTab === 'friends' && (
            <div className="rounded-3xl bg-[#121626] border border-purple-900/30 p-4 divide-y divide-white/5">
              {friendRequests.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No friend requests pending.
                </div>
              ) : (
                friendRequests.map((req) => (
                  <div key={req.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div
                      onClick={() => openUserProfile(req.fromUser)}
                      className="flex items-center gap-3 min-w-0 cursor-pointer"
                    >
                      <img
                        src={req.fromUser.avatar}
                        alt={req.fromUser.displayName}
                        className="w-11 h-11 rounded-full object-cover border border-purple-500/40"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {req.fromUser.displayName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          @{req.fromUser.username} · {req.fromUser.countryName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {req.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => respondFriendRequest(req.id, true)}
                            className="h-8 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Accept
                          </button>
                          <button
                            onClick={() => respondFriendRequest(req.id, false)}
                            className="h-8 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-semibold cursor-pointer"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] font-bold uppercase text-slate-500">
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
