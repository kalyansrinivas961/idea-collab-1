import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import socket from "../api/socket";
import EmojiPicker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

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
  const [activeMenu, setActiveMenu] = useState(null); // track which message menu is open
  const [menuPlacement, setMenuPlacement] = useState('bottom'); // 'top' or 'bottom'
  const [newlyArrivedIds, setNewlyArrivedIds] = useState(new Set()); // set of message IDs to highlight
  
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
    fetchContacts();
  }, []);

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
        
        // Add to newly arrived set for 3s highlight
        setNewlyArrivedIds(prev => {
          const next = new Set(prev);
          next.add(message._id);
          return next;
        });
        setTimeout(() => {
          setNewlyArrivedIds(prev => {
            const next = new Set(prev);
            next.delete(message._id);
            return next;
          });
        }, 3000);

        if (!selectedUser.isGroup) markMessagesRead(selectedUser._id);
        setPartnerTyping(false); // Stop typing indicator if message received
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
      
      // Initialize activity status from fetched data
      const initialStatus = {};
      res.data.forEach(conv => {
        if (!conv.isGroup) {
          initialStatus[conv._id] = conv.presenceStatus || (conv.isOnline ? 'online' : 'offline');
        }
      });
      setUserActivityStatus(prev => ({ ...prev, ...initialStatus }));

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
      <div className="bg-slate-50 dark:bg-slate-950 md:p-4 min-h-[calc(100vh-64px-56px)] md:min-h-[calc(100vh-140px)]">
        <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 md:rounded-[2rem] shadow-2xl shadow-indigo-500/5 border-0 md:border border-slate-100 dark:border-slate-800 overflow-hidden h-[calc(100vh-64px-56px)] md:h-[calc(100vh-180px)] landscape:h-[calc(100vh-64px)] flex flex-col md:flex-row -mx-4 md:mx-0 transition-all duration-500 relative">
          {/* Sidebar (Conversation List) */}
          <div className={`w-full md:w-[350px] lg:w-[400px] border-r border-slate-50 dark:border-slate-800 flex-col ${selectedUser ? 'hidden md:flex' : 'flex'} h-full bg-white dark:bg-slate-900 transition-colors z-30`}>
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Chats</h2>
                <div className="flex gap-2">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowCreateGroup(true)}
                    className="p-3 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-all border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-slate-900 shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowContacts(!showContacts)}
                    className="p-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                  </motion.button>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input 
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/10 transition-all placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-hide overscroll-contain bg-white dark:bg-slate-900">
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
              <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {conversations.map(conv => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={conv._id}
                    onClick={() => setSelectedUser(conv)}
                    className={`flex items-center gap-4 p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-all relative group/item ${selectedUser?._id === conv._id ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                  >
                    {selectedUser?._id === conv._id && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"
                      />
                    )}
                    <div className="relative flex-shrink-0">
                      {conv.isGroup ? (
                        <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                      ) : (
                        <div className="relative group-hover/item:scale-105 transition-transform duration-300">
                          <img src={conv.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.name)}&background=random`} alt={conv.name} className="w-14 h-14 rounded-[1.25rem] object-cover shadow-xl border-2 border-white dark:border-slate-800" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className={`text-sm md:text-base landscape:text-xs truncate pr-2 tracking-tight ${conv.unreadCount > 0 || conv.isNew ? 'font-black text-slate-900 dark:text-white' : 'font-bold text-slate-700 dark:text-slate-300'}`}>
                          {conv.name}
                        </h3>
                        <span className={`text-[10px] landscape:text-[9px] whitespace-nowrap font-black uppercase tracking-widest ${conv.unreadCount > 0 || conv.isNew ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                          {conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <p className={`text-xs landscape:text-[10px] truncate leading-relaxed font-medium ${conv.unreadCount > 0 || conv.isNew ? 'text-slate-900 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                          {conv.lastMessage ? (
                            <>
                              <span className="opacity-50">{conv.lastMessage.sender._id === user._id ? 'You: ' : ''}</span>
                              {conv.lastMessage.content || (conv.lastMessage.attachment ? '📎 Attachment' : '...')}
                            </>
                          ) : (
                            <span>
                              {conv.isGroup 
                                ? `${conv.members?.length || 0} members` 
                                : (conv.headline || "Member")}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    {(conv.unreadCount > 0 || conv.isNew) && (
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 min-w-[22px] h-5.5 bg-indigo-600 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1.5 shadow-xl shadow-indigo-500/30 animate-pulse">
                        {conv.unreadCount || 1}
                      </div>
                    )}
                  </motion.div>
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
        <AnimatePresence mode="wait">
          {selectedUser ? (
            <motion.div 
              key="chat-area"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className={`flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/50 fixed inset-0 z-[70] md:relative md:z-auto h-full transition-all duration-300`}
            >
              {/* Header */}
              <div className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-b border-slate-50 dark:border-slate-800 flex items-center justify-between shadow-sm z-20 sticky top-0 min-h-[80px] landscape:min-h-[60px]">
                <div className="flex items-center gap-4 min-w-0">
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedUser(null)}
                      className="md:hidden text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-3 -ml-1 min-w-[48px] min-h-[48px] flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-2xl transition-all"
                      aria-label="Back to conversations"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </motion.button>
                    
                    <div className="relative flex-shrink-0 group cursor-pointer">
                      {selectedUser.isGroup ? (
                        <div className="w-12 h-12 landscape:w-10 landscape:h-10 rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                          <svg className="w-7 h-7 landscape:w-6 landscape:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                      ) : (
                        <img src={selectedUser.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=random`} alt={selectedUser.name} className="w-12 h-12 landscape:w-10 landscape:h-10 rounded-[1.25rem] object-cover shadow-xl border-2 border-white dark:border-slate-800 transition-transform group-active:scale-95" />
                      )}
                    </div>
                    
                    <div className="min-w-0">
                      <h3 className="font-black text-slate-900 dark:text-white text-base md:text-lg landscape:text-sm leading-tight truncate pr-1 tracking-tight">{selectedUser.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {partnerTyping ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 animate-pulse uppercase tracking-widest">typing</span>
                            <div className="flex gap-1">
                              <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                              <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                              <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] landscape:text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                            {selectedUser.isGroup 
                              ? `${selectedUser.members?.length || 0} active members` 
                              : (selectedUser.role || "Innovator")
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    className="hidden sm:flex p-3 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-2xl transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </motion.button>
                  <div className="relative">
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowClearConfirm(!showClearConfirm)}
                      className="p-3 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all min-w-[48px] min-h-[48px] flex items-center justify-center"
                      aria-label="More options"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </motion.button>
                    
                    {showClearConfirm && (
                      <div className="absolute right-0 top-12 w-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 py-2 animate-fade-in-up">
                        <button 
                          onClick={handleClearChat}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 font-bold transition-colors"
                        >
                          <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </div>
                          Clear Entire Chat
                        </button>
                        <button className="w-full text-left px-4 py-3 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 font-semibold transition-colors">
                          <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          View Profile
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 space-y-4 bg-white dark:bg-slate-950 scroll-smooth landscape:p-3 relative">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] overflow-hidden">
                  <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]" />
                  <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 space-y-6">
                  {messages.map((msg, index) => {
                    const isMe = msg.sender._id === user._id || msg.sender === user._id;
                    const msgDate = new Date(msg.createdAt);
                    const dateString = msgDate.toDateString();
                    const prevMsg = messages[index - 1];
                    const prevDateString = prevMsg ? new Date(prevMsg.createdAt).toDateString() : null;
                    const showDate = dateString !== prevDateString;
                    const isToday = dateString === new Date().toDateString();
                    const isLastInGroup = !messages[index + 1] || (messages[index + 1].sender._id !== msg.sender._id && messages[index + 1].sender !== msg.sender._id);

                    return (
                      <React.Fragment key={msg._id || index}>
                        {showDate && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex justify-center my-8"
                          >
                            <span className="text-[10px] font-black text-slate-400 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md px-5 py-2 rounded-2xl uppercase tracking-[0.2em]">
                              {isToday ? "Today" : dateString}
                            </span>
                          </motion.div>
                        )}
                        
                        <motion.div 
                          layout
                          initial={{ opacity: 0, x: isMe ? 20 : -20, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-end gap-3 group relative`}
                        >
                          {!isMe && (selectedUser.isGroup || isLastInGroup) && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex-shrink-0 mb-1"
                            >
                              <img 
                                src={msg.sender.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender.name)}&background=random`} 
                                alt="" 
                                className="w-8 h-8 rounded-2xl border-2 border-white dark:border-slate-800 shadow-lg object-cover" 
                              />
                            </motion.div>
                          )}
                          
                          <div className={`relative flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%] lg:max-w-[60%]`}>
                            {selectedUser.isGroup && !isMe && isLastInGroup && (
                               <span className="text-[10px] font-black text-slate-400 mb-1.5 ml-1 uppercase tracking-widest">{msg.sender.name}</span>
                            )}
                            
                            {/* Reply Context */}
                            {msg.replyTo && (
                              <motion.div 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`mb-1 px-4 py-2 rounded-2xl text-[11px] border-l-4 ${isMe ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-400' : 'bg-slate-100 dark:bg-slate-800 border-slate-400'} italic max-w-full truncate opacity-80 cursor-pointer shadow-sm`}
                                onClick={() => {
                                  const element = document.getElementById(`msg-${msg.replyTo._id}`);
                                  if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    element.classList.add('ring-4', 'ring-indigo-400/30', 'ring-offset-2');
                                    setTimeout(() => element.classList.remove('ring-4', 'ring-indigo-400/30', 'ring-offset-2'), 2000);
                                  }
                                }}
                              >
                                <span className="block font-black text-[9px] uppercase opacity-60 mb-0.5">Replying to {msg.replyTo.sender?.name || "User"}</span>
                                <p className="truncate text-slate-600 dark:text-slate-400">{msg.replyTo.content}</p>
                              </motion.div>
                            )}
                            
                            <div 
                              id={`msg-${msg._id}`} 
                              className={`relative px-5 py-3.5 shadow-xl transition-all duration-300 ${
                                isMe 
                                  ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-[2rem] rounded-br-none shadow-indigo-500/10' 
                                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-100/50 dark:border-slate-800 rounded-[2rem] rounded-bl-none shadow-slate-200/10 dark:shadow-none'
                              } ${
                                newlyArrivedIds.has(msg._id) ? 'ring-4 ring-indigo-500/20' : ''
                              }`}
                            >
                              {/* Attachment Display */}
                              {msg.attachment && (
                                <div className="mb-3 rounded-2xl overflow-hidden bg-black/5 dark:bg-black/20 group/attachment">
                                  {msg.attachment.fileType === 'image' ? (
                                    <div className="relative overflow-hidden">
                                      <img 
                                        src={msg.attachment.isLocal ? msg.attachment.url : (msg.attachment.url.startsWith('http') ? msg.attachment.url : `${SERVER_URL}${msg.attachment.url}`)} 
                                        alt="attachment" 
                                        className="max-w-full h-auto object-cover max-h-80 w-full group-hover/attachment:scale-105 transition-transform duration-700 cursor-pointer" 
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/attachment:opacity-100 transition-opacity" />
                                    </div>
                                  ) : (
                                    <a 
                                      href={msg.attachment.isLocal ? msg.attachment.url : (msg.attachment.url.startsWith('http') ? msg.attachment.url : `${SERVER_URL}${msg.attachment.url}`)}
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className={`flex items-center gap-4 p-4 transition-all ${isMe ? 'text-white hover:bg-white/10' : 'text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                    >
                                      <div className={`p-3 rounded-2xl ${isMe ? 'bg-white/20' : 'bg-indigo-50 dark:bg-indigo-900/30 shadow-inner'}`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                      </div>
                                      <div className="min-w-0">
                                        <span className="block font-black truncate text-sm tracking-tight">{msg.attachment.originalName || "Document"}</span>
                                        <span className={`block text-[10px] uppercase font-black opacity-60 mt-1 tracking-[0.1em]`}>{msg.attachment.fileSize || "1.2 MB"}</span>
                                      </div>
                                    </a>
                                  )}
                                </div>
                              )}
                              
                              {/* Text Content */}
                              {editingMessage?._id === msg._id ? (
                                <form onSubmit={handleEditMessage} className="min-w-[240px]">
                                  <textarea
                                    autoFocus
                                    value={editingMessage.content}
                                    onChange={(e) => setEditingMessage({...editingMessage, content: e.target.value})}
                                    className={`w-full bg-slate-100/10 rounded-xl border-none focus:ring-2 focus:ring-white/20 text-sm p-3 resize-none ${isMe ? 'text-white placeholder:text-white/50' : 'text-slate-800 dark:text-white placeholder:text-slate-400'}`}
                                    rows={3}
                                  />
                                  <div className="flex justify-end gap-3 mt-3">
                                    <button type="button" onClick={() => setEditingMessage(null)} className="text-[10px] uppercase font-black opacity-70 hover:opacity-100 tracking-widest transition-opacity">Cancel</button>
                                    <button type="submit" className="text-[10px] uppercase font-black bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30 transition-all tracking-widest">Save Changes</button>
                                  </div>
                                </form>
                              ) : (
                                msg.content && (
                                  <div className="space-y-1.5">
                                    <p className="text-[15px] leading-[1.6] whitespace-pre-wrap break-words font-semibold tracking-[-0.01em]">{msg.content}</p>
                                    {msg.isEdited && <span className="text-[9px] font-black opacity-50 uppercase tracking-[0.15em]">(Edited)</span>}
                                  </div>
                                )
                              )}
                              
                              <div className={`text-[9px] mt-2 flex justify-end items-center gap-2 ${isMe ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'} font-black tabular-nums tracking-[0.1em] uppercase`}>
                                {msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {isMe && (
                                  <span className="flex items-center">
                                    {msg.status === 'failed' ? (
                                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="p-0.5 bg-red-500 rounded-full">
                                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                      </motion.div>
                                    ) : msg.status === 'sending' ? (
                                      <div className="w-3 h-3 border-2 border-indigo-200 border-t-transparent rounded-full animate-spin"></div>
                                    ) : msg.read ? (
                                      <div className="flex -space-x-1">
                                        <svg className="w-3.5 h-3.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        <svg className="w-3.5 h-3.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                      </div>
                                    ) : (
                                      <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Menu Trigger (⋮) */}
                          <div className={`relative flex items-center self-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => toggleMessageMenu(e, msg._id)}
                              className={`p-2.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${activeMenu === msg._id ? 'opacity-100 bg-white dark:bg-slate-800 text-indigo-600 border-slate-100' : ''}`}
                              aria-haspopup="true"
                              aria-expanded={activeMenu === msg._id}
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                              </svg>
                            </motion.button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                              {activeMenu === msg._id && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9, y: menuPlacement === 'top' ? 10 : -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.9, y: menuPlacement === 'top' ? 10 : -10 }}
                                  className={`absolute z-[100] min-w-[180px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] shadow-2xl py-2.5 overflow-hidden ${isMe ? 'right-0' : 'left-0'} ${menuPlacement === 'top' ? 'bottom-full mb-3' : 'top-full mt-3'} origin-center`}
                                >
                                  {[
                                    { label: 'Reply', icon: 'M3 10h10a8 8 0 018 8v2M3 10l5 5m-5-5l5-5', onClick: () => { setReplyingTo(msg); setActiveMenu(null); } },
                                    { label: 'Copy', icon: 'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3', onClick: () => { copyToClipboard(msg.content); setActiveMenu(null); } },
                                    { label: 'Translate', icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129', onClick: () => { setTranslationModal({ show: true, messageId: msg._id, content: msg.content }); setActiveMenu(null); }, show: !!msg.content },
                                    { label: 'Forward', icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z', onClick: () => { setForwardModal({ show: true, message: msg }); setActiveMenu(null); }, show: !!msg.content },
                                    { label: 'Edit', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', onClick: () => { setEditingMessage({ _id: msg._id, content: msg.content }); setActiveMenu(null); }, show: isMe && !msg.attachment },
                                  ].filter(item => item.show !== false).map((item, idx) => (
                                    <button
                                      key={idx}
                                      onClick={item.onClick}
                                      className="w-full text-left px-5 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center gap-4 transition-all group/menuitem font-bold"
                                    >
                                      <svg className="w-4.5 h-4.5 text-slate-400 group-hover/menuitem:text-indigo-600 group-hover/menuitem:scale-110 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} />
                                      </svg>
                                      {item.label}
                                    </button>
                                  ))}
                                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-2"></div>
                                  <button
                                    onClick={() => { confirmDelete(msg._id, isMe); setActiveMenu(null); }}
                                    className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-4 transition-all group/delete font-black"
                                  >
                                    <svg className="w-4.5 h-4.5 text-red-400 group-hover/delete:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </motion.div>
                      </React.Fragment>
                    );
                  })}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 md:p-6 bg-white dark:bg-slate-900 border-t dark:border-slate-800/50 sticky bottom-0 z-20 landscape:p-2">
                <div className="max-w-4xl mx-auto relative">
                  {/* Replying To Preview */}
                  <AnimatePresence>
                    {replyingTo && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="mb-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80 backdrop-blur-xl p-4 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-xl"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l5 5m-5-5l5-5" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <span className="block text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.15em] mb-0.5">Replying to {replyingTo.sender?.name}</span>
                            <span className="block text-sm text-slate-600 dark:text-slate-300 truncate font-medium italic">"{replyingTo.content}"</span>
                          </div>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setReplyingTo(null)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Attachment Preview */}
                  <AnimatePresence>
                    {attachment && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -20 }}
                        className="mb-4 flex items-center gap-4 bg-indigo-600 text-white p-3.5 rounded-[1.5rem] w-fit shadow-2xl shadow-indigo-500/30 ring-4 ring-indigo-500/10"
                      >
                        <div className="bg-white/20 p-2.5 rounded-xl">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        </div>
                        <div className="min-w-0 pr-2">
                          <span className="block text-sm font-black truncate max-w-[200px] tracking-tight">{attachment.name}</span>
                          <span className="block text-[9px] font-black uppercase opacity-60 tracking-widest mt-0.5">Ready to upload</span>
                        </div>
                        <button 
                          onClick={() => {
                            setAttachment(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <form onSubmit={handleSendMessage} className="flex items-end gap-3 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-[2.5rem] relative ring-1 ring-slate-200/50 dark:ring-slate-700/50 focus-within:ring-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-900 transition-all duration-300 shadow-inner">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    
                    <div className="flex items-center gap-1 pl-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all min-w-[48px] min-h-[48px] flex items-center justify-center shadow-sm"
                        aria-label="Attach file"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`p-3 rounded-full transition-all min-w-[48px] min-h-[48px] flex items-center justify-center shadow-sm ${showEmojiPicker ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 'text-slate-500 dark:text-slate-400 hover:text-yellow-500 hover:bg-white dark:hover:bg-slate-800'}`}
                        aria-label="Toggle emoji picker"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </motion.button>
                    </div>

                    <textarea
                      value={newMessage}
                      onChange={handleInputChange}
                      placeholder="Share your thoughts..."
                      rows="1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-40 text-slate-800 dark:text-white placeholder:text-slate-400 font-bold py-4 px-2 min-h-[56px] text-base"
                    />
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={!newMessage.trim() && !attachment}
                      className="bg-indigo-600 text-white p-4 rounded-full hover:bg-indigo-700 disabled:opacity-20 disabled:grayscale transition-all shadow-xl shadow-indigo-500/20 active:shadow-inner flex items-center justify-center group"
                      aria-label="Send message"
                    >
                      <svg className="w-6 h-6 transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </motion.button>
                  </form>

                  {showEmojiPicker && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.9 }}
                      className="absolute bottom-full left-0 mb-6 z-50 shadow-2xl rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                    >
                      <EmojiPicker 
                        onEmojiClick={handleEmojiClick} 
                        theme={localStorage.getItem("theme") === "dark" ? "dark" : "light"}
                        width={340} 
                        height={420} 
                        previewConfig={{ showPreview: false }}
                        searchDisabled={false}
                        skinTonesDisabled
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="no-chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 bg-slate-50/30 dark:bg-slate-950/30"
            >
              <div className="w-32 h-32 bg-white dark:bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-8 text-slate-100 dark:text-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-slate-800">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Your Conversations</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs leading-relaxed font-medium">Select a teammate from the sidebar or start a new group chat to begin collaborating.</p>
              <button onClick={() => setShowContacts(true)} className="mt-8 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none transition-all active:scale-95">New Message</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      {/* Modals and Overlays */}
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
