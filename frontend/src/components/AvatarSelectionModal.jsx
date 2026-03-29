import React, { useState } from "react";
import { X, CheckCircle2, Cloud, Palette, Sparkles, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_AVATARS = [
  { id: 1, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", category: "Casual" },
  { id: 2, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka", category: "Casual" },
  { id: 3, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", category: "Casual" },
  { id: 4, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha", category: "Casual" },
  { id: 5, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack", category: "Casual" },
  { id: 6, url: "https://api.dicebear.com/7.x/bottts/svg?seed=C3PO", category: "Tech" },
  { id: 7, url: "https://api.dicebear.com/7.x/bottts/svg?seed=R2D2", category: "Tech" },
  { id: 8, url: "https://api.dicebear.com/7.x/bottts/svg?seed=WallE", category: "Tech" },
  { id: 9, url: "https://api.dicebear.com/7.x/bottts/svg?seed=Eve", category: "Tech" },
  { id: 10, url: "https://api.dicebear.com/7.x/bottts/svg?seed=Baymax", category: "Tech" },
  { id: 11, url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Adventure1", category: "Creative" },
  { id: 12, url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Adventure2", category: "Creative" },
  { id: 13, url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Adventure3", category: "Creative" },
  { id: 14, url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Adventure4", category: "Creative" },
  { id: 15, url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Adventure5", category: "Creative" },
  { id: 16, url: "https://api.dicebear.com/7.x/miniavs/svg?seed=Mini1", category: "Minimal" },
  { id: 17, url: "https://api.dicebear.com/7.x/miniavs/svg?seed=Mini2", category: "Minimal" },
  { id: 18, url: "https://api.dicebear.com/7.x/miniavs/svg?seed=Mini3", category: "Minimal" },
  { id: 19, url: "https://api.dicebear.com/7.x/miniavs/svg?seed=Mini4", category: "Minimal" },
  { id: 20, url: "https://api.dicebear.com/7.x/miniavs/svg?seed=Mini5", category: "Minimal" },
];

const AvatarSelectionModal = ({ isOpen, onClose, onSelect, currentAvatar }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredAvatar, setHoveredAvatar] = useState(null);

  const categories = ["All", ...new Set(DEFAULT_AVATARS.map(a => a.category))];
  
  const filteredAvatars = selectedCategory === "All" 
    ? DEFAULT_AVATARS 
    : DEFAULT_AVATARS.filter(a => a.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                <Palette size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Choose Avatar</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Personalize your presence</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all active:scale-90"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Category Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Avatar Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              {filteredAvatars.map((avatar) => (
                <motion.button
                  key={avatar.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoveredAvatar(avatar.id)}
                  onMouseLeave={() => setHoveredAvatar(null)}
                  onClick={() => onSelect(avatar.url)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    currentAvatar === avatar.url 
                      ? "border-indigo-600 ring-4 ring-indigo-50 dark:ring-indigo-900/20" 
                      : "border-transparent bg-slate-50 dark:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700"
                  }`}
                >
                  <img 
                    src={avatar.url} 
                    alt={`Avatar ${avatar.id}`} 
                    className="w-full h-full object-cover p-1"
                  />
                  {currentAvatar === avatar.url && (
                    <div className="absolute inset-0 bg-indigo-600/10 flex items-center justify-center">
                      <div className="bg-indigo-600 text-white p-1 rounded-full">
                        <CheckCircle2 size={12} strokeWidth={3} />
                      </div>
                    </div>
                  )}
                  {hoveredAvatar === avatar.id && currentAvatar !== avatar.url && (
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                      <Sparkles className="text-indigo-600" size={16} />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Cloud size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Cloud Persisted</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium italic">Selected avatar will be synced across all your devices</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AvatarSelectionModal;
