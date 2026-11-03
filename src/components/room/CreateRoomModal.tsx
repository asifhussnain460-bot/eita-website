import React, { useState } from 'react';
import { X, Sparkles, Lock, Globe, Image, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoomCategory } from '../../types';

interface CreateRoomModalProps {
  onClose: () => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ onClose }) => {
  const { createRoom } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RoomCategory>('Music');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [wallpaper, setWallpaper] = useState('from-purple-950 via-slate-900 to-indigo-950');
  const [tagsInput, setTagsInput] = useState('Party, Chill, English');

  const categories: RoomCategory[] = ['Music', 'Gaming', 'Dating', 'Chill', 'Poetry', 'Chat'];

  const wallpapers = [
    { label: 'Neon Cyber', value: 'from-purple-950 via-slate-900 to-indigo-950', preview: 'bg-purple-900' },
    { label: 'Royal Gold', value: 'from-amber-950 via-slate-900 to-yellow-950', preview: 'bg-amber-700' },
    { label: 'Rose Dating', value: 'from-rose-950 via-slate-900 to-pink-950', preview: 'bg-rose-900' },
    { label: 'Gaming Squad', value: 'from-emerald-950 via-slate-900 to-teal-950', preview: 'bg-emerald-800' },
    { label: 'Late Midnight', value: 'from-slate-950 via-blue-950 to-black', preview: 'bg-blue-950' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    createRoom({
      title: title.trim(),
      description: description.trim() || 'Welcome to our voice party room! 12 seats open.',
      category,
      isPrivate,
      password: isPrivate ? password.trim() : undefined,
      wallpaper,
      tags: tags.length > 0 ? tags : ['Voice', 'Party'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg bg-[#121626] border-t sm:border border-purple-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">
              Create 12-Seat Voice Room
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Room Title */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Room Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 🔥 Weekend Acoustic & Karaoke Party 🎵"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0d101c] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Room Description */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Announcement / Bio
            </label>
            <textarea
              rows={2}
              placeholder="Tell listeners what this room is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0d101c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Wallpaper Theme */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Stage Atmosphere
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {wallpapers.map((w) => (
                <button
                  type="button"
                  key={w.label}
                  onClick={() => setWallpaper(w.value)}
                  className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-medium cursor-pointer ${
                    wallpaper === w.value
                      ? 'border-purple-400 bg-purple-950/40 text-purple-200'
                      : 'border-white/5 bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full ${w.preview}`} />
                  <span>{w.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Room Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Singing, Chill, Arabic, English"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-[#0d101c] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Privacy & Password */}
          <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isPrivate ? (
                  <Lock className="w-4 h-4 text-amber-400" />
                ) : (
                  <Globe className="w-4 h-4 text-emerald-400" />
                )}
                <div className="text-xs font-bold text-white">
                  {isPrivate ? 'Password-Protected Private Room' : 'Public Room'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  isPrivate ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                    isPrivate ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {isPrivate && (
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Enter 4-digit room passcode (e.g. 7777)"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0d101c] border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
          >
            Launch Voice Room Now 🎙️
          </button>
        </form>
      </div>
    </div>
  );
};
