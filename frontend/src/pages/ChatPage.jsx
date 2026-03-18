import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import socket from "../api/socket";
import EmojiPicker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const SERVER_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

const ChatPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [attachment, setAttachment] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, messageId: null, isSender: false });
  const [editingMessage, setEditingMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [translationModal, setTranslationModal] = useState({ show: false, messageId: null, content: "" });
  const [isTranslating, setIsTranslating] = useState(false);
  const [forwardModal, setForwardModal] = useState({ show: false, message: null });
  const [preferencesModal, setPreferencesModal] = useState(false);
  const [preferences, setPreferences] = useState({ autoTranslate: false, defaultLanguage: "English" });
  const [activeMenu, setActiveMenu] = useState(null); // track which message menu is open
  const [menuPlacement, setMenuPlacement] = useState('bottom'); // 'top' or 'bottom'
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  // For "New Chat" modal/list
  const [showContacts, setShowContacts] = useState(false);
  const [contacts, setContacts] = useState([]);

  // For "Create Group" modal
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    fetchConversations();
    fetchUnreadCount();
    fetchTranslationPreferences();
    fetchContacts();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/messages/unread-count");
      // You might want to store this in state or context if needed elsewhere
      // For now we'll just log it or dispatch an event
      console.log("Unread count:", res.data.count);
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  };

  const fetchTranslationPreferences = async () => {
    try {
      // Assuming we have an endpoint for user profile or preferences
      // For now, I'll use the new preferences endpoint if it supports GET, 
      // or just assume default if not fetched.
      // Since I added the PUT endpoint, I'll also add a way to get them if needed,
      // but for now let's just use the current user from context if it has it.
      if (user && user.translationPreferences) {
        setPreferences(user.translationPreferences);
      }
    } catch (err) {
      console.error("Failed to fetch preferences", err);
    }
  };

  const updatePreferences = async (newPrefs) => {
    try {
      const res = await api.put("/messages/preferences", newPrefs);
      setPreferences(res.data.preferences);
      toast.success("Preferences updated");
    } catch (err) {
      toast.error("Failed to update preferences");
    }
  };

  useEffect(() => {
    if (selectedUser) {
      if (selectedUser.isGroup) {
        fetchGroupMessages(selectedUser._id);
        // Join group room
        socket.emit("join:group", selectedUser._id);
      } else {
        fetchMessages(selectedUser._id);
      }
      setPartnerTyping(false);
      
      // Clear highlight and unread count for selected user
      setConversations(prev => prev.map(c => 
        (c._id === selectedUser._id || (c.isGroup && c._id === selectedUser._id))
          ? { ...c, isNew: false, unreadCount: 0 }
          : c
      ));
    }
  }, [selectedUser]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, partnerTyping]);

  useEffect(() => {
    const handleMessage = (message) => {
      // If the message is from the selected user (or group), append it
      const isRelevant = selectedUser && (
        (selectedUser.isGroup && message.conversationId === selectedUser._id) || 
        (!selectedUser.isGroup && message.sender._id === selectedUser._id && !message.conversationId)
      );

      if (isRelevant) {
        setMessages((prev) => [...prev, message]);
        if (!selectedUser.isGroup) markMessagesRead(selectedUser._id);
        setPartnerTyping(false); // Stop typing indicator if message received

        // Auto-translation logic
        if (preferences.autoTranslate && message.sender._id !== user._id && message.content) {
          autoTranslateMessage(message._id, preferences.defaultLanguage);
        }
      }

      // Update conversations list for real-time reordering and highlighting
      setConversations((prev) => {
        const conversationId = message.conversationId || message.sender._id;
        const existingConvIndex = prev.findIndex(c => c._id === conversationId || (c.isGroup && c._id === message.conversationId));
        
        let updatedConv;
        let newConversations = [...prev];

        if (existingConvIndex > -1) {
          // Update existing conversation and move to top
          const conv = newConversations[existingConvIndex];
          updatedConv = { 
            ...conv, 
            lastMessage: message,
            updatedAt: new Date().toISOString(),
            unreadCount: isRelevant ? 0 : (conv.unreadCount || 0) + 1,
            isNew: !isRelevant // Highlight if not currently open
          };
          newConversations.splice(existingConvIndex, 1);
        } else {
          // New conversation, add to top
          updatedConv = {
            _id: conversationId,
            name: message.sender.name,
            avatarUrl: message.sender.avatarUrl,
            lastMessage: message,
            updatedAt: new Date().toISOString(),
            unreadCount: 1,
            isNew: true
          };
        }
        
        return [updatedConv, ...newConversations];
      });
    };

    const autoTranslateMessage = async (messageId, targetLanguage) => {
      try {
        const res = await api.post(`/messages/${messageId}/translate`, { targetLanguage });
        setMessages(prev => prev.map(msg => 
          msg._id === messageId 
            ? { 
                ...msg, 
                translations: { ...(msg.translations || {}), [targetLanguage]: res.data.translation },
                detectedLanguage: res.data.detectedLanguage 
              } 
            : msg
        ));
      } catch (err) {
        console.error("Auto-translation failed", err);
      }
    };
    
    const handleGroupCreated = (group) => {
       fetchConversations();
    };

    const handleTyping = ({ senderId }) => {
      if (selectedUser && !selectedUser.isGroup && senderId === selectedUser._id) {
        setPartnerTyping(true);
      }
    };

    const handleStopTyping = ({ senderId }) => {
      if (selectedUser && !selectedUser.isGroup && senderId === selectedUser._id) {
        setPartnerTyping(false);
      }
    };

    const handleRead = ({ readerId }) => {
      if (selectedUser && !selectedUser.isGroup && readerId === selectedUser._id) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender._id === user._id || msg.sender === user._id
              ? { ...msg, read: true }
              : msg
          )
        );
      }
    };

    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    };

    const handleMessageUpdated = (updatedMessage) => {
      setMessages((prev) => 
        prev.map(msg => msg._id === updatedMessage._id ? updatedMessage : msg)
      );
      
      // Also update last message in conversations
      setConversations((prev) => 
        prev.map(conv => {
          const convId = updatedMessage.conversationId || updatedMessage.sender._id;
          if (conv._id === convId || (conv.isGroup && conv._id === updatedMessage.conversationId)) {
            return { ...conv, lastMessage: updatedMessage };
          }
          return conv;
        })
      );
    };

    socket.on("chat:message", handleMessage);
    socket.on("group:created", handleGroupCreated);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);
    socket.on("chat:read", handleRead);
    socket.on("chat:message_deleted", handleMessageDeleted);
    socket.on("chat:message_updated", handleMessageUpdated);

    // Close menu on outside click
    const handleClickOutside = (e) => {
      if (activeMenu && !e.target.closest('.message-menu-container')) {
        setActiveMenu(null);
      }
    };

    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveMenu(null);
        setReplyingTo(null);
        setEditingMessage(null);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      socket.off("chat:message", handleMessage);
      socket.off("group:created", handleGroupCreated);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      socket.off("chat:read", handleRead);
      socket.off("chat:message_deleted", handleMessageDeleted);
      socket.off("chat:message_updated", handleMessageUpdated);
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedUser, activeMenu]);

  const markMessagesRead = async (senderId) => {
    try {
      await api.put("/messages/read", { senderId });
      window.dispatchEvent(new Event("messages:read"));
    } catch (err) {
      console.error("Failed to mark messages as read", err);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await api.get("/messages/conversations");
      setConversations(res.data);
      // Join all group rooms
      res.data.filter(c => c.isGroup).forEach(group => {
        socket.emit("join:group", group._id);
      });
    } catch (err) {
      console.error("Failed to fetch conversations", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContacts = async () => {
    try {
      const resFollowers = await api.get(`/users/${user._id}/followers`);
      const resFollowing = await api.get(`/users/${user._id}/following`);
      const allContacts = [...resFollowers.data, ...resFollowing.data];
      const uniqueContacts = Array.from(new Map(allContacts.map(item => [item._id, item])).values());
      setContacts(uniqueContacts);
    } catch (err) {
      console.error("Failed to fetch contacts", err);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await api.get(`/messages/${userId}`);
      setMessages(res.data);
      markMessagesRead(userId);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };
  
  const fetchGroupMessages = async (groupId) => {
    try {
      const res = await api.get(`/messages/group/${groupId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch group messages", err);
    }
  };
  
  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedMembers.length === 0) return;
    
    try {
      const res = await api.post("/messages/group", {
        name: groupName,
        members: selectedMembers
      });
      setConversations(prev => [res.data, ...prev]);
      setSelectedUser(res.data);
      setShowCreateGroup(false);
      setGroupName("");
      setSelectedMembers([]);
      socket.emit("join:group", res.data._id);
    } catch (err) {
      console.error("Failed to create group", err);
      alert("Failed to create group");
    }
  };
  
  const toggleMemberSelection = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  const handleClearChat = async () => {
    if (!selectedUser) return;
    try {
      await api.post("/messages/clear", { partnerId: selectedUser._id });
      setMessages([]);
      setShowClearConfirm(false);
    } catch (err) {
      console.error("Failed to clear chat", err);
    }
  };

  const handleDeleteMessage = async (messageId, type) => {
    try {
      await api.delete(`/messages/${messageId}?type=${type}`);
      // Remove locally immediately for better UX
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      setDeleteModal({ show: false, messageId: null, isSender: false });
    } catch (err) {
      console.error("Failed to delete message", err);
    }
  };

  const confirmDelete = (messageId, isSender) => {
    setDeleteModal({ show: true, messageId, isSender });
  };

  const handleEditMessage = async (e) => {
    e.preventDefault();
    if (!editingMessage || !editingMessage.content.trim()) return;
    
    try {
      const res = await api.put(`/messages/${editingMessage._id}`, {
        content: editingMessage.content
      });
      setMessages(prev => prev.map(msg => msg._id === res.data._id ? res.data : msg));
      setEditingMessage(null);
      toast.success("Message updated");
    } catch (err) {
      console.error("Failed to edit message", err);
      toast.error("Failed to update message");
    }
  };

  const handleTranslateMessage = async (targetLanguage) => {
    if (!translationModal.messageId) return;
    setIsTranslating(true);
    try {
      const res = await api.post(`/messages/${translationModal.messageId}/translate`, {
        targetLanguage
      });
      setTranslationModal(prev => ({ ...prev, translated: res.data.translation }));
      
      // Update the message in local state to show translation
      setMessages(prev => prev.map(msg => 
        msg._id === translationModal.messageId 
          ? { 
              ...msg, 
              translations: { ...(msg.translations || {}), [targetLanguage]: res.data.translation },
              detectedLanguage: res.data.detectedLanguage 
            } 
          : msg
      ));
      
      toast.success("Translated successfully");
    } catch (err) {
      console.error("Translation failed", err);
      toast.error("Translation failed");
    } finally {
      setIsTranslating(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", { icon: "📋" });
  };

  const toggleMessageMenu = (e, messageId) => {
    if (activeMenu === messageId) {
      setActiveMenu(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const menuHeight = 250; // approximate max height of menu
      
      if (rect.bottom + menuHeight > windowHeight) {
        setMenuPlacement('top');
      } else {
        setMenuPlacement('bottom');
      }
      setActiveMenu(messageId);
    }
  };

  const handleForwardMessage = async (targetUser) => {
    if (!forwardModal.message) return;
    
    try {
      const formData = new FormData();
      if (targetUser.isGroup) {
        formData.append("conversationId", targetUser._id);
      } else {
        formData.append("receiverId", targetUser._id);
      }
      
      formData.append("content", `[Forwarded]: ${forwardModal.message.content}`);
      
      // If original had attachment, we'd need to handle that too, but for simplicity let's do text
      
      await api.post("/messages", formData);
      setForwardModal({ show: false, message: null });
      toast.success(`Message forwarded to ${targetUser.name}`);
    } catch (err) {
      console.error("Forward failed", err);
      toast.error("Failed to forward message");
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    // Keyboard Shortcuts
    if (e.key === 'Escape') {
      setReplyingTo(null);
      setEditingMessage(null);
    }

    if (selectedUser) {
      if (!isTyping) {
        setIsTyping(true);
        socket.emit("typing", { receiverId: selectedUser._id, senderId: user._id });
      }

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        socket.emit("stop_typing", { receiverId: selectedUser._id, senderId: user._id });
      }, 2000);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !attachment) || !selectedUser) return;

    // Optimistic Update Data
    const tempId = Date.now().toString();
    const optimisticMessage = {
      _id: tempId,
      sender: { _id: user._id, name: user.name, avatarUrl: user.avatarUrl },
      content: newMessage,
      createdAt: new Date().toISOString(),
      status: 'sending', // custom field for UI
      attachment: attachment ? { 
        url: URL.createObjectURL(attachment), 
        fileType: attachment.type.startsWith('image/') ? 'image' : 'document',
        originalName: attachment.name,
        isLocal: true // flag to use local blob URL
      } : null
    };

    // Add optimistically
    setMessages((prev) => [...prev, optimisticMessage]);
    const currentMessage = newMessage;
    const currentAttachment = attachment;
    
    setNewMessage("");
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    try {
      const formData = new FormData();
      if (selectedUser.isGroup) {
        formData.append("conversationId", selectedUser._id);
      } else {
        formData.append("receiverId", selectedUser._id);
      }
      
      if (currentMessage.trim()) formData.append("content", currentMessage);
      if (currentAttachment) formData.append("attachment", currentAttachment);
      if (replyingTo) formData.append("replyTo", replyingTo._id);

      const res = await api.post("/messages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Clear replyingTo state after successful send
      setReplyingTo(null);

      // Replace optimistic message with real one
      setMessages((prev) => 
        prev.map(msg => msg._id === tempId ? { ...res.data, status: 'delivered' } : msg)
      );
      
      // Move current conversation to top
      setConversations((prev) => {
        const existingConvIndex = prev.findIndex(c => c._id === selectedUser._id);
        const newConvs = [...prev];
        if (existingConvIndex > -1) {
          const updatedConv = { 
            ...newConvs[existingConvIndex], 
            lastMessage: res.data,
            updatedAt: new Date().toISOString()
          };
          newConvs.splice(existingConvIndex, 1);
          return [updatedConv, ...newConvs];
        } else {
          // If not found, it might be a new contact chat, so add to top
          return [selectedUser, ...prev];
        }
      });

      // Stop typing
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      setIsTyping(false);
      if (!selectedUser.isGroup) {
         socket.emit("stop_typing", { receiverId: selectedUser._id, senderId: user._id });
      }
    } catch (err) {
      console.error("Failed to send message", err);
      // Mark as failed
      setMessages((prev) => 
        prev.map(msg => msg._id === tempId ? { ...msg, status: 'failed' } : msg)
      );
    }
  };

  return (
    <Layout>
      <div className="bg-white md:rounded-xl shadow-sm border-0 md:border overflow-hidden h-[calc(100vh-64px)] md:h-[calc(100vh-140px)] flex flex-col md:flex-row -mx-4 md:mx-0">
        {/* Sidebar */}
        <div className={`w-full md:w-1/3 lg:w-1/4 border-r flex-col ${selectedUser ? 'hidden md:flex' : 'flex'} h-full bg-white`}>
          <div className="p-4 border-b flex justify-between items-center bg-slate-50/50 backdrop-blur-sm sticky top-0 z-20 min-h-[64px]">
            <h2 className="text-lg font-bold text-slate-800">Messages</h2>
            <div className="flex gap-1.5">
              <button 
                onClick={() => setShowCreateGroup(true)}
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition min-w-[40px] min-h-[40px] flex items-center justify-center border border-indigo-100 bg-white shadow-sm"
                title="Create Group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </button>
              <button 
                onClick={() => setShowContacts(!showContacts)}
                className="p-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-full transition min-w-[40px] min-h-[40px] flex items-center justify-center shadow-md"
                title="New Chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {loading ? (
              <div className="flex flex-col justify-center items-center h-64 gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Syncing chats...</p>
              </div>
            ) : showCreateGroup ? (
              <div className="p-4 animate-fade-in-up">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800">New Group</h3>
                  <button onClick={() => setShowCreateGroup(false)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-full transition">Cancel</button>
                </div>
                <div className="mb-5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Group Name</label>
                  <input 
                    type="text" 
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50"
                    placeholder="e.g. Design Sync"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Select Members</label>
                  <div className="max-h-[40vh] overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50 shadow-inner">
                    {contacts.map(contact => (
                      <div 
                        key={contact._id}
                        onClick={() => toggleMemberSelection(contact._id)}
                        className={`flex items-center gap-3 p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${selectedMembers.includes(contact._id) ? 'bg-indigo-50/50' : ''}`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selectedMembers.includes(contact._id) ? 'bg-indigo-600 border-indigo-600 scale-110 shadow-sm' : 'border-slate-300 bg-white'}`}>
                          {selectedMembers.includes(contact._id) && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <img src={contact.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random`} alt={contact.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-700 text-sm truncate">{contact.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{contact.role || "Member"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={handleCreateGroup}
                  disabled={!groupName.trim() || selectedMembers.length === 0}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
                >
                  Create Group
                </button>
              </div>
            ) : showContacts ? (
              <div className="p-2 animate-fade-in-up">
                <div className="flex justify-between items-center px-3 mb-4 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Contact</span>
                  <button onClick={() => setShowContacts(false)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-full transition">Back</button>
                </div>
                <div className="space-y-1">
                  {contacts.map(contact => (
                    <div 
                      key={contact._id}
                      onClick={() => {
                        setSelectedUser(contact);
                        setShowContacts(false);
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-indigo-50/50 rounded-xl cursor-pointer transition-all group"
                    >
                      <div className="relative">
                        <img src={contact.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random`} alt={contact.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm group-hover:scale-105 transition-transform" />
                        <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-800 text-sm truncate">{contact.name}</div>
                        <div className="text-[11px] text-slate-500 truncate italic">{contact.headline || contact.role || "Member"}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {contacts.length === 0 && (
                  <div className="text-center py-12 px-6">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">No followers found</p>
                    <p className="text-[11px] text-slate-400 mt-1">Follow people to start chatting!</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {conversations.map(conv => (
                  <div 
                    key={conv._id}
                    onClick={() => setSelectedUser(conv)}
                    className={`flex items-center gap-3.5 p-4 hover:bg-slate-50/80 cursor-pointer transition-all relative ${selectedUser?._id === conv._id ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
                  >
                    <div className="relative flex-shrink-0">
                      {conv.isGroup ? (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                      ) : (
                        <>
                          <img src={conv.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.name)}&background=random`} alt={conv.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-slate-100" />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className={`text-sm md:text-base truncate pr-2 ${conv.unreadCount > 0 || conv.isNew ? 'font-black text-indigo-900' : 'font-bold text-slate-800'}`}>
                          {conv.name}
                        </h3>
                        <span className={`text-[10px] whitespace-nowrap ${conv.unreadCount > 0 || conv.isNew ? 'text-indigo-600 font-bold' : 'text-slate-400 font-medium'}`}>
                          {conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '12:45 PM'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <p className={`text-xs truncate leading-relaxed ${conv.unreadCount > 0 || conv.isNew ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                          {conv.lastMessage ? (
                            <>
                              {conv.lastMessage.sender._id === user._id ? 'You: ' : ''}
                              {conv.lastMessage.content || (conv.lastMessage.attachment ? 'Sent an attachment' : '...')}
                            </>
                          ) : (
                            conv.isGroup ? `${conv.members?.length || 0} members` : (conv.headline || "Active now")
                          )}
                        </p>
                      </div>
                    </div>
                    {(conv.unreadCount > 0 || conv.isNew) && (
                      <div className="absolute right-4 bottom-4 min-w-[20px] h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1.5 shadow-md shadow-indigo-100 animate-pulse">
                        {conv.unreadCount || 1}
                      </div>
                    )}
                  </div>
                ))}
                {conversations.length === 0 && !loading && (
                  <div className="text-center py-20 px-8 flex flex-col items-center animate-fade-in-up">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 text-slate-200 border border-dashed border-slate-200">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h4 className="text-base font-bold text-slate-800 mb-1">No chats yet</h4>
                    <p className="text-xs text-slate-500 mb-6 text-center leading-relaxed">Connect with other innovators to start collaborating on amazing ideas.</p>
                    <button onClick={() => setShowContacts(true)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">Find People</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-slate-50/30 ${selectedUser ? 'flex fixed inset-0 z-50 md:relative' : 'hidden md:flex'} h-full transition-all duration-300`}>
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="p-3 bg-white/80 backdrop-blur-md border-b flex items-center justify-between shadow-sm z-20 sticky top-0 min-h-[64px]">
                <div className="flex items-center gap-3 min-w-0">
                    <button 
                      onClick={() => setSelectedUser(null)}
                      className="md:hidden text-slate-500 hover:text-indigo-600 p-2 -ml-1 min-w-[44px] min-h-[44px] flex items-center justify-center bg-slate-100 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <div className="relative flex-shrink-0">
                      {selectedUser.isGroup ? (
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-sm">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                      ) : (
                        <>
                          <img src={selectedUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=random`} alt={selectedUser.name} className="w-11 h-11 rounded-xl object-cover shadow-sm border border-slate-100" />
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                        </>
                      )}
                    </div>
                    
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight truncate pr-1">{selectedUser.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {partnerTyping ? (
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] md:text-xs text-indigo-600 font-bold animate-pulse uppercase tracking-wider">typing</span>
                            <div className="flex gap-0.5">
                              <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                              <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                              <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce"></div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] md:text-xs text-slate-400 font-medium truncate">
                            {selectedUser.isGroup ? `${selectedUser.members?.length || 0} participants` : (selectedUser.role || "Member")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                <div className="flex items-center gap-1 md:gap-2">
                  <button 
                    onClick={() => setPreferencesModal(true)}
                    className="flex p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    title="Translation Settings"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                  </button>
                  <button className="hidden sm:flex p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </button>
                  <button className="hidden sm:flex p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowClearConfirm(!showClearConfirm)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all min-w-[40px] min-h-[40px] flex items-center justify-center"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                    
                    {showClearConfirm && (
                      <div className="absolute right-0 top-12 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 py-2 animate-fade-in-up">
                        <button 
                          onClick={handleClearChat}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-bold transition-colors"
                        >
                          <div className="p-1.5 bg-red-100 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </div>
                          Clear Entire Chat
                        </button>
                        <button className="w-full text-left px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-3 font-semibold transition-colors">
                          <div className="p-1.5 bg-slate-100 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          View Profile
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50 scroll-smooth">
                {messages.map((msg, index) => {
                  const isMe = msg.sender._id === user._id || msg.sender === user._id;
                  const msgDate = new Date(msg.createdAt);
                  const dateString = msgDate.toDateString();
                  const prevMsg = messages[index - 1];
                  const prevDateString = prevMsg ? new Date(prevMsg.createdAt).toDateString() : null;
                  const showDate = dateString !== prevDateString;
                  const isToday = dateString === new Date().toDateString();

                  return (
                    <React.Fragment key={index}>
                      {showDate && (
                        <div className="flex justify-center my-8">
                          <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-100 px-4 py-1.5 rounded-full shadow-sm uppercase tracking-widest">
                            {isToday ? "Today" : dateString}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2 group relative animate-fade-in-up`}>
                        {!isMe && selectedUser.isGroup && (
                          <img src={msg.sender.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender.name)}&background=random`} alt="" className="w-6 h-6 rounded-full border border-white shadow-sm mb-1" />
                        )}
                        
                          <div className={`relative flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
                            {selectedUser.isGroup && !isMe && (
                               <span className="text-[10px] font-bold text-slate-500 mb-1 ml-1 uppercase tracking-tight">{msg.sender.name}</span>
                            )}
                            
                            {/* Reply Context */}
                            {msg.replyTo && (
                              <div className={`mb-1 px-3 py-1.5 rounded-xl text-[11px] border-l-4 ${isMe ? 'bg-indigo-700/50 border-indigo-300' : 'bg-slate-100 border-slate-300'} italic max-w-full truncate opacity-80 cursor-pointer`}
                                onClick={() => {
                                  const element = document.getElementById(`msg-${msg.replyTo._id}`);
                                  if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    element.classList.add('ring-4', 'ring-indigo-400/50');
                                    setTimeout(() => element.classList.remove('ring-4', 'ring-indigo-400/50'), 2000);
                                  }
                                }}
                              >
                                <span className="block font-bold text-[10px] uppercase opacity-60">Replying to {msg.replyTo.sender?.name || "User"}</span>
                                {msg.replyTo.content}
                              </div>
                            )}
                            
                            <div id={`msg-${msg._id}`} className={`relative rounded-2xl px-4 py-3 text-sm shadow-sm transition-all hover:shadow-md ${isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'}`}>
                              {/* Attachment Display */}
                            {msg.attachment && (
                              <div className="mb-3 rounded-xl overflow-hidden bg-black/5 ring-1 ring-black/5">
                                {msg.attachment.fileType === 'image' ? (
                                  <img 
                                    src={msg.attachment.isLocal ? msg.attachment.url : (msg.attachment.url.startsWith('http') ? msg.attachment.url : `${SERVER_URL}${msg.attachment.url}`)} 
                                    alt="attachment" 
                                    className="max-w-full h-auto object-cover max-h-72 w-full hover:scale-105 transition-transform duration-500 cursor-pointer" 
                                  />
                                ) : (
                                  <a 
                                    href={msg.attachment.isLocal ? msg.attachment.url : (msg.attachment.url.startsWith('http') ? msg.attachment.url : `${SERVER_URL}${msg.attachment.url}`)}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-3 p-4 transition-colors ${isMe ? 'text-white hover:bg-white/10' : 'text-indigo-600 hover:bg-slate-50'}`}
                                  >
                                    <div className={`p-2.5 rounded-xl ${isMe ? 'bg-white/20' : 'bg-indigo-50 border border-indigo-100'}`}>
                                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    </div>
                                    <div className="min-w-0">
                                      <span className="block font-bold truncate text-xs">{msg.attachment.originalName || "Document"}</span>
                                      <span className={`block text-[10px] uppercase font-bold opacity-60 mt-0.5`}>{msg.attachment.fileSize || "1.2 MB"}</span>
                                    </div>
                                  </a>
                                )}
                              </div>
                            )}
                            
                            {/* Text Content */}
                            {editingMessage?._id === msg._id ? (
                              <form onSubmit={handleEditMessage} className="min-w-[200px]">
                                <textarea
                                  autoFocus
                                  value={editingMessage.content}
                                  onChange={(e) => setEditingMessage({...editingMessage, content: e.target.value})}
                                  className={`w-full bg-transparent border-none focus:ring-0 text-sm p-0 resize-none ${isMe ? 'text-white' : 'text-slate-800'}`}
                                  rows={2}
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                  <button type="button" onClick={() => setEditingMessage(null)} className="text-[10px] uppercase font-bold opacity-70 hover:opacity-100">Cancel</button>
                                  <button type="submit" className="text-[10px] uppercase font-bold bg-white/20 px-2 py-1 rounded hover:bg-white/30">Save</button>
                                </div>
                              </form>
                            ) : (
                              msg.content && (
                                <div className="space-y-1">
                                  <p className="leading-relaxed whitespace-pre-wrap break-words font-medium">{msg.content}</p>
                                  {msg.isEdited && <span className="text-[9px] font-bold opacity-60 uppercase tracking-tighter">(Edited)</span>}
                                  
                                  {/* AI Translation Display */}
                                  {msg.translations && Object.keys(msg.translations).length > 0 && (
                                    <div className={`mt-2 pt-2 border-t ${isMe ? 'border-indigo-400/30' : 'border-slate-100'}`}>
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Translated from {msg.detectedLanguage || 'auto'}</span>
                                      </div>
                                      {Object.entries(msg.translations).map(([lang, text]) => (
                                        <p key={lang} className={`text-xs font-bold ${isMe ? 'text-indigo-100' : 'text-indigo-700'}`}>
                                          <span className="opacity-50 text-[9px] mr-1">[{lang}]</span> {text}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                            
                            <div className={`text-[10px] mt-1.5 flex justify-end items-center gap-1.5 ${isMe ? 'text-indigo-200' : 'text-slate-400'} font-bold tabular-nums`}>
                              {msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {isMe && (
                                <span className="flex items-center">
                                  {msg.status === 'failed' ? (
                                    <svg className="w-3.5 h-3.5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  ) : msg.status === 'sending' ? (
                                    <div className="w-3 h-3 border-2 border-indigo-200 border-t-transparent rounded-full animate-spin"></div>
                                  ) : msg.read ? (
                                    <div className="flex -space-x-1">
                                      <svg className="w-3.5 h-3.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                      <svg className="w-3.5 h-3.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                  ) : (
                                    <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Menu Trigger (⋮) */}
                        <div className={`relative message-menu-container flex items-center transition-all duration-200 ${isMe ? 'mr-1 flex-row-reverse' : 'ml-1 flex-row'}`}>
                          <button
                            onClick={(e) => toggleMessageMenu(e, msg._id)}
                            className={`p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${activeMenu === msg._id ? 'opacity-100 bg-indigo-50 text-indigo-600' : 'opacity-0 group-hover:opacity-100'}`}
                            aria-haspopup="true"
                            aria-expanded={activeMenu === msg._id}
                            title="Message options"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                          </button>

                          {/* Dropdown Menu */}
                          <AnimatePresence>
                            {activeMenu === msg._id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: menuPlacement === 'top' ? 10 : -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.15 }}
                                className={`absolute z-[100] min-w-[160px] bg-white border border-slate-100 rounded-2xl shadow-xl py-2 overflow-hidden ${isMe ? 'right-0' : 'left-0'} ${menuPlacement === 'top' ? 'bottom-12' : 'top-12'} ${isMe ? (menuPlacement === 'top' ? 'origin-bottom-right' : 'origin-top-right') : (menuPlacement === 'top' ? 'origin-bottom-left' : 'origin-top-left')}`}
                                role="menu"
                                aria-orientation="vertical"
                                onKeyDown={(e) => {
                                  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    const items = e.currentTarget.querySelectorAll('[role="menuitem"]');
                                    const index = Array.from(items).indexOf(document.activeElement);
                                    let nextIndex = e.key === 'ArrowDown' ? index + 1 : index - 1;
                                    if (nextIndex < 0) nextIndex = items.length - 1;
                                    if (nextIndex >= items.length) nextIndex = 0;
                                    items[nextIndex].focus();
                                  }
                                }}
                              >
                                <button
                                  onClick={() => { setReplyingTo(msg); setActiveMenu(null); }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors group/item"
                                  role="menuitem"
                                >
                                  <svg className="w-4 h-4 text-slate-400 group-hover/item:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l5 5m-5-5l5-5" /></svg>
                                  Reply
                                </button>
                                
                                {isMe && !msg.attachment && (
                                  <button
                                    onClick={() => { setEditingMessage({ _id: msg._id, content: msg.content }); setActiveMenu(null); }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors group/item"
                                    role="menuitem"
                                  >
                                    <svg className="w-4 h-4 text-slate-400 group-hover/item:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    Edit
                                  </button>
                                )}

                                <button
                                  onClick={() => { copyToClipboard(msg.content); setActiveMenu(null); }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors group/item"
                                  role="menuitem"
                                >
                                  <svg className="w-4 h-4 text-slate-400 group-hover/item:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                  Copy
                                </button>

                                {msg.content && (
                                  <button
                                    onClick={() => { setTranslationModal({ show: true, messageId: msg._id, content: msg.content }); setActiveMenu(null); }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors group/item"
                                    role="menuitem"
                                  >
                                    <svg className="w-4 h-4 text-slate-400 group-hover/item:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                                    Translate
                                  </button>
                                )}

                                {msg.content && (
                                  <button
                                    onClick={() => { setForwardModal({ show: true, message: msg }); setActiveMenu(null); }}
                                    className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors group/item"
                                    role="menuitem"
                                  >
                                    <svg className="w-4 h-4 text-slate-400 group-hover/item:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                    Forward
                                  </button>
                                )}

                                <div className="h-px bg-slate-100 my-1"></div>

                                <button
                                  onClick={() => { confirmDelete(msg._id, isMe); setActiveMenu(null); }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors group/item font-medium"
                                  role="menuitem"
                                >
                                  <svg className="w-4 h-4 text-red-400 group-hover/item:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t sticky bottom-0 z-20">
                {/* Replying To Preview */}
                {replyingTo && (
                  <div className="mb-3 flex items-center justify-between bg-indigo-50/80 backdrop-blur-sm p-3 rounded-2xl border border-indigo-100 shadow-sm animate-fade-in-up">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-indigo-600 p-2 rounded-xl shadow-md">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l5 5m-5-5l5-5" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Replying to {replyingTo.sender?.name || "User"}</span>
                        <span className="block text-xs text-indigo-900 truncate max-w-[300px] font-medium italic">"{replyingTo.content}"</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setReplyingTo(null)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Attachment Preview */}
                {attachment && (
                  <div className="mb-3 flex items-center gap-3 bg-indigo-50/80 backdrop-blur-sm p-2.5 rounded-2xl w-fit border border-indigo-100 shadow-sm animate-fade-in-up">
                    <div className="bg-indigo-600 p-2 rounded-xl shadow-md shadow-indigo-200">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </div>
                    <div className="min-w-0 pr-2">
                      <span className="block text-xs text-indigo-900 truncate max-w-[180px] font-bold">{attachment.name}</span>
                      <span className="block text-[10px] text-indigo-400 font-bold uppercase">Ready to send</span>
                    </div>
                    <button 
                      onClick={() => {
                        setAttachment(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-white rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                
                <form onSubmit={handleSendMessage} className="flex items-end gap-2 bg-slate-50 p-2 rounded-[1.75rem] relative border border-slate-200 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/30 transition-all shadow-inner">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  
                  <div className="flex items-center gap-1 pl-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-full transition-all min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-90"
                      title="Attach file"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2.5 text-slate-400 hover:text-yellow-500 hover:bg-white rounded-full transition-all relative min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-90"
                      title="Add emoji"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>

                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-6 z-50 shadow-2xl rounded-3xl overflow-hidden border border-slate-100 animate-fade-in-up">
                      <EmojiPicker 
                        onEmojiClick={handleEmojiClick} 
                        width={320} 
                        height={400} 
                        previewConfig={{ showPreview: false }}
                        skinTonesDisabled
                      />
                    </div>
                  )}

                  <textarea
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Message..."
                    rows="1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 text-slate-800 placeholder:text-slate-400 font-medium py-3 px-2 min-h-[44px] text-sm md:text-base"
                  />
                  
                  <button 
                    type="submit"
                    disabled={!newMessage.trim() && !attachment}
                    className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center justify-center group"
                  >
                    <svg className="w-5 h-5 transform group-active:translate-x-1 group-active:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
              <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 text-slate-100 shadow-xl shadow-slate-200/50 border border-slate-50">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Your Conversations</h3>
              <p className="text-sm text-slate-500 text-center max-w-xs leading-relaxed">Select a teammate from the sidebar or start a new group chat to begin collaborating.</p>
              <button onClick={() => setShowContacts(true)} className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">New Message</button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {/* Modals and Overlays */}
      {preferencesModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b flex justify-between items-center bg-indigo-50/30">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Translation Preferences
              </h3>
              <button onClick={() => setPreferencesModal(false)} className="p-2 hover:bg-white rounded-full transition-colors">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-800">Auto-Translate</p>
                  <p className="text-[10px] text-slate-400 font-medium">Automatically translate incoming messages</p>
                </div>
                <button 
                  onClick={() => updatePreferences({ autoTranslate: !preferences.autoTranslate })}
                  className={`w-12 h-6 rounded-full transition-all relative ${preferences.autoTranslate ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${preferences.autoTranslate ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Default Target Language</p>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                  {['English', 'Spanish', 'French', 'German', 'Chinese', 'Hindi', 'Arabic', 'Portuguese', 'Russian', 'Japanese', 'Korean'].map(lang => (
                    <button
                      key={lang}
                      onClick={() => updatePreferences({ defaultLanguage: lang })}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${preferences.defaultLanguage === lang ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-600'}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t flex justify-end">
              <button onClick={() => setPreferencesModal(false)} className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">Done</button>
            </div>
          </div>
        </div>
      )}

      {forwardModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b flex justify-between items-center bg-indigo-50/30">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                Forward Message
              </h3>
              <button onClick={() => setForwardModal({ show: false, message: null })} className="p-2 hover:bg-white rounded-full transition-colors">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-600 italic border border-slate-100 mb-4">
                "{forwardModal.message?.content}"
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Choose Contact</p>
              {contacts.map(contact => (
                <button
                  key={contact._id}
                  onClick={() => handleForwardMessage(contact)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100 group"
                >
                  <img src={contact.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}`} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm" />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-700">{contact.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{contact.type === 'group' ? 'Group' : 'User'}</p>
                  </div>
                  <div className="bg-white p-2 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {translationModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b flex justify-between items-center bg-indigo-50/30">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                Translate Message
              </h3>
              <button onClick={() => setTranslationModal({ show: false, messageId: null, content: "" })} className="p-2 hover:bg-white rounded-full transition-colors">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-600 italic border border-slate-100">
                "{translationModal.content}"
              </div>
              
              {translationModal.translated && (
                <div className="bg-indigo-50 p-4 rounded-2xl text-sm text-indigo-900 font-medium border border-indigo-100 animate-fade-in">
                  <span className="block text-[10px] uppercase font-bold text-indigo-400 mb-1">Translation:</span>
                  {translationModal.translated}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {['English', 'Spanish', 'French', 'German', 'Chinese', 'Hindi', 'Arabic'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => handleTranslateMessage(lang)}
                    disabled={isTranslating}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isTranslating ? 'Translating...' : lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-bold text-slate-800">Delete Message?</h3>
              <p className="text-sm text-slate-500 mt-1">Select how you want to delete this message.</p>
            </div>
            <div className="p-2 flex flex-col gap-2">
              {deleteModal.isSender && (
                <button 
                  onClick={() => handleDeleteMessage(deleteModal.messageId, 'everyone')}
                  className="w-full p-3 text-left hover:bg-slate-50 rounded-lg flex items-center gap-3 text-red-600 transition"
                >
                  <span className="bg-red-100 p-2 rounded-full">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </span>
                  <div>
                    <div className="font-semibold">Delete for everyone</div>
                    <div className="text-xs text-red-400">Remove for all participants</div>
                  </div>
                </button>
              )}
              <button 
                onClick={() => handleDeleteMessage(deleteModal.messageId, 'me')}
                className="w-full p-3 text-left hover:bg-slate-50 rounded-lg flex items-center gap-3 text-slate-700 transition"
              >
                <span className="bg-slate-100 p-2 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </span>
                <div>
                  <div className="font-semibold">Delete for me</div>
                  <div className="text-xs text-slate-500">Remove from your device only</div>
                </div>
              </button>
            </div>
            <div className="p-3 border-t bg-slate-50 flex justify-end">
              <button 
                onClick={() => setDeleteModal({ show: false, messageId: null, isSender: false })}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ChatPage;
