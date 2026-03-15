import React, { useState, useEffect, useRef } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import socket from "../api/socket";
import EmojiPicker from "emoji-picker-react";

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
      } else {
        fetchConversations();
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

    socket.on("chat:message", handleMessage);
    socket.on("group:created", handleGroupCreated);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);
    socket.on("chat:read", handleRead);
    socket.on("chat:message_deleted", handleMessageDeleted);

    return () => {
      socket.off("chat:message", handleMessage);
      socket.off("group:created", handleGroupCreated);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      socket.off("chat:read", handleRead);
      socket.off("chat:message_deleted", handleMessageDeleted);
    };
  }, [selectedUser]);

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

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

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

      const res = await api.post("/messages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Replace optimistic message with real one
      setMessages((prev) => 
        prev.map(msg => msg._id === tempId ? { ...res.data, status: 'delivered' } : msg)
      );
      
      // Stop typing
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      setIsTyping(false);
      if (!selectedUser.isGroup) {
         socket.emit("stop_typing", { receiverId: selectedUser._id, senderId: user._id });
      }

      if (!conversations.find(c => c._id === selectedUser._id)) {
        setConversations(prev => [selectedUser, ...prev]);
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
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden h-[calc(100vh-140px)] flex">
        {/* Sidebar */}
        <div className={`w-full md:w-1/3 border-r flex-col ${selectedUser ? 'hidden md:flex' : 'flex'} h-full`}>
          <div className="p-4 border-b flex justify-between items-center bg-slate-50 min-h-[64px]">
            <h2 className="font-semibold text-slate-800">Messages</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowCreateGroup(true)}
                className="text-xs bg-white border border-indigo-200 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 shadow-sm transition min-h-[36px]"
              >
                + Group
              </button>
              <button 
                onClick={() => setShowContacts(!showContacts)}
                className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 shadow-sm transition min-h-[36px]"
              >
                + Chat
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-white">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : showCreateGroup ? (
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-700">New Group</h3>
                  <button onClick={() => setShowCreateGroup(false)} className="text-xs text-slate-500 hover:text-slate-800">Cancel</button>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Group Name</label>
                  <input 
                    type="text" 
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Project Team"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-600 mb-2">Select Members</label>
                  <div className="max-h-60 overflow-y-auto border rounded-lg divide-y">
                    {contacts.map(contact => (
                      <div 
                        key={contact._id}
                        onClick={() => toggleMemberSelection(contact._id)}
                        className={`flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer ${selectedMembers.includes(contact._id) ? 'bg-indigo-50' : ''}`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedMembers.includes(contact._id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                          {selectedMembers.includes(contact._id) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <img src={contact.avatarUrl || "https://via.placeholder.com/40"} alt={contact.name} className="w-8 h-8 rounded-full object-cover" />
                        <div className="text-sm text-slate-700">{contact.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={handleCreateGroup}
                  disabled={!groupName.trim() || selectedMembers.length === 0}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Group
                </button>
              </div>
            ) : showContacts ? (
              <div className="p-2">
                <div className="flex justify-between items-center px-2 mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Select a contact</span>
                  <button onClick={() => setShowContacts(false)} className="text-xs text-indigo-600 hover:underline">Cancel</button>
                </div>
                {contacts.map(contact => (
                  <div 
                    key={contact._id}
                    onClick={() => {
                      setSelectedUser(contact);
                      setShowContacts(false);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition border-b border-slate-50 last:border-0"
                  >
                    <img src={contact.avatarUrl || "https://via.placeholder.com/40"} alt={contact.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                    <div>
                      <div className="font-medium text-slate-800">{contact.name}</div>
                      <div className="text-xs text-slate-500">{contact.headline || contact.role}</div>
                    </div>
                  </div>
                ))}
                {contacts.length === 0 && <div className="text-center text-sm text-slate-500 p-4">No contacts found. Follow someone to chat!</div>}
              </div>
            ) : (
              <div>
                {conversations.map(conv => (
                  <div 
                    key={conv._id}
                    onClick={() => setSelectedUser(conv)}
                    className={`flex items-center gap-3 p-4 hover:bg-slate-50 cursor-pointer border-b border-slate-50 transition ${selectedUser?._id === conv._id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
                  >
                    {conv.isGroup ? (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      </div>
                    ) : (
                      <img src={conv.avatarUrl || "https://via.placeholder.com/40"} alt={conv.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-800 truncate">{conv.name}</div>
                      <div className="text-xs text-slate-500 truncate">
                        {conv.isGroup 
                          ? `${conv.members?.length || 0} members` 
                          : (conv.headline || "Click to chat")}
                      </div>
                    </div>
                  </div>
                ))}
                {conversations.length === 0 && !loading && (
                  <div className="text-center text-slate-500 p-8 flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="mb-2 font-medium">No conversations yet</p>
                    <button onClick={() => setShowContacts(true)} className="text-indigo-600 hover:underline text-sm">Start a new chat</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex-col bg-slate-50 ${selectedUser ? 'flex' : 'hidden md:flex'} h-full`}>
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="p-3 bg-white border-b flex items-center justify-between shadow-sm z-10 relative min-h-[64px]">
                <div className="flex items-center gap-3 min-w-0">
                    {/* Mobile Back Button */}
                    <button 
                      onClick={() => setSelectedUser(null)}
                      className="md:hidden text-slate-500 hover:text-slate-700 p-2 -ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {selectedUser.isGroup ? (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      </div>
                    ) : (
                      <img src={selectedUser.avatarUrl || "https://via.placeholder.com/40"} alt={selectedUser.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                    )}
                    <div>
                      <div className="font-semibold text-slate-800 leading-tight">{selectedUser.name}</div>
                      <div className="text-xs text-slate-500">
                        {partnerTyping ? (
                          <span className="text-indigo-600 font-medium animate-pulse">typing...</span>
                        ) : (
                          selectedUser.isGroup ? `${selectedUser.members?.length || 0} members` : (selectedUser.role || "Member")
                        )}
                      </div>
                    </div>
                  </div>

                {/* Clear Chat Option */}
                <div className="relative">
                  <button 
                    onClick={() => setShowClearConfirm(!showClearConfirm)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
                    title="Chat Options"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                  
                  {showClearConfirm && (
                    <div className="absolute right-0 top-10 w-48 bg-white border rounded-lg shadow-lg z-20 py-1">
                      <button 
                        onClick={handleClearChat}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Clear Chat
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                        <div className="flex justify-center my-4">
                          <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full shadow-sm">
                            {isToday ? "Today" : dateString}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2 group relative mb-1`}>
                        {/* Delete Message Button (For own messages) */}
                        {isMe && (
                          <button
                            onClick={() => confirmDelete(msg._id, true)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition md:opacity-0 md:group-hover:opacity-100 opacity-100"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-3 py-2 text-sm shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'}`}>
                          {selectedUser.isGroup && !isMe && (
                             <div className="text-[10px] font-bold text-slate-500 mb-1">{msg.sender.name}</div>
                          )}
                          {/* Attachment Display */}
                          {msg.attachment && (
                            <div className="mb-2 rounded-lg overflow-hidden bg-black/5">
                              {msg.attachment.fileType === 'image' ? (
                                <img 
                                  src={msg.attachment.isLocal ? msg.attachment.url : (msg.attachment.url.startsWith('http') ? msg.attachment.url : `${SERVER_URL}${msg.attachment.url}`)} 
                                  alt="attachment" 
                                  className="max-w-full h-auto object-cover max-h-60 w-full" 
                                />
                              ) : (
                                <a 
                                  href={msg.attachment.isLocal ? msg.attachment.url : (msg.attachment.url.startsWith('http') ? msg.attachment.url : `${SERVER_URL}${msg.attachment.url}`)}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className={`flex items-center gap-3 p-3 ${isMe ? 'text-white hover:bg-white/10' : 'text-indigo-600 hover:bg-slate-50'}`}
                                >
                                  <div className={`p-2 rounded ${isMe ? 'bg-white/20' : 'bg-indigo-100'}`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                  <span className="underline truncate font-medium">{msg.attachment.originalName || "Document"}</span>
                                </a>
                              )}
                            </div>
                          )}
                          
                          {/* Text Content */}
                          {msg.content && <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>}
                          
                          <div className={`text-[10px] mt-1 text-right flex justify-end items-center gap-1 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isMe && (
                              <span className="flex items-center">
                                {msg.status === 'failed' ? (
                                  <span className="text-red-300 flex items-center gap-0.5" title="Failed to send">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </span>
                                ) : msg.status === 'sending' ? (
                                  <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : msg.read ? (
                                  <svg className="w-3.5 h-3.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                ) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Delete Button for Others (Right of bubble) */}
                        {!isMe && (
                          <button
                            onClick={() => confirmDelete(msg._id, false)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition md:opacity-0 md:group-hover:opacity-100 opacity-100"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t">
                {/* Attachment Preview */}
                {attachment && (
                  <div className="mb-2 flex items-center gap-2 bg-indigo-50 p-2 rounded-lg w-fit border border-indigo-100">
                    <div className="bg-indigo-100 p-1 rounded">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </div>
                    <span className="text-xs text-indigo-900 truncate max-w-[200px] font-medium">{attachment.name}</span>
                    <button 
                      onClick={() => {
                        setAttachment(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-slate-400 hover:text-red-500 ml-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
                
                <form onSubmit={handleSendMessage} className="flex items-end gap-1 bg-slate-100 p-1.5 rounded-[2rem] relative border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50 transition-all">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  
                  {/* Tools Container */}
                  <div className="flex items-center gap-0.5 md:gap-1 pl-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-200 rounded-full transition min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Attach file"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2.5 text-slate-500 hover:text-yellow-600 hover:bg-slate-200 rounded-full transition relative min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="Add emoji"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>

                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-4 z-50 shadow-2xl rounded-xl overflow-hidden border border-slate-100">
                      <EmojiPicker onEmojiClick={handleEmojiClick} width={300} height={400} />
                    </div>
                  )}

                  <textarea
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    rows="1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 text-slate-800 placeholder:text-slate-400 py-2.5 px-2 min-h-[44px]"
                  />
                  
                  <button 
                    type="submit"
                    disabled={!newMessage.trim() && !attachment}
                    className="bg-indigo-600 text-white p-2.5 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm m-0.5"
                  >
                    <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-lg font-medium">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
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
