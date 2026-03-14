import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { messagesAPI, MessageWebSocket } from '../services/messagesService';
import { useAuth } from './AuthContext';

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const { user } = useAuth();

    // Use refs for frequently updated state
    const conversationsRef = useRef([]);
    const messagesRef = useRef([]);
    const typingUsersRef = useRef({});
    const onlineUsersRef = useRef(new Set());

    // React state for UI updates (use sparingly)
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [ws, setWs] = useState(null);
    const [activeConversation, setActiveConversation] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected');

    const wsRef = useRef(null);
    const connectionCheckInterval = useRef(null);
    const updateScheduled = useRef(false);
    const pendingUpdates = useRef(new Set());

    // Batch UI updates using requestAnimationFrame
    const scheduleUpdate = useCallback((type) => {
        pendingUpdates.current.add(type);

        if (!updateScheduled.current) {
            updateScheduled.current = true;

            requestAnimationFrame(() => {
                // Apply all pending updates
                if (pendingUpdates.current.has('conversations')) {
                    setConversations([...conversationsRef.current]);
                }
                if (pendingUpdates.current.has('messages')) {
                    setMessages([...messagesRef.current]);
                }
                if (pendingUpdates.current.has('typing')) {
                    setTypingUsersState({ ...typingUsersRef.current });
                }
                if (pendingUpdates.current.has('online')) {
                    setOnlineUsersState(new Set(onlineUsersRef.current));
                }

                pendingUpdates.current.clear();
                updateScheduled.current = false;
            });
        }
    }, []);

    // Derived state for React components
    const [typingUsersState, setTypingUsersState] = useState({});
    const [onlineUsersState, setOnlineUsersState] = useState(new Set());

    // Memoized selectors
    const isUserOnline = useCallback((userId) => {
        return onlineUsersRef.current.has(userId);
    }, []);

    const isUserTyping = useCallback((conversationId, userId) => {
        return typingUsersRef.current[`${conversationId}-${userId}`] || false;
    }, []);

    // ============== DEFINE ALL CALLBACKS IN CORRECT ORDER ==============

    // First, define functions that don't depend on others
    const requestOnlineStatus = useCallback(() => {
        if (!wsRef.current?.isConnected() || conversationsRef.current.length === 0) return;

        const userIds = conversationsRef.current
            .map(conv => conv.participant?.id)
            .filter(id => id && id !== user?.id);

        if (userIds.length > 0) {
            wsRef.current.getOnlineStatus(userIds);
        }
    }, [user]);

    // Load functions
    const loadConversations = useCallback(async () => {
        setLoading(true);
        try {
            const data = await messagesAPI.getConversations();
            conversationsRef.current = data.conversations || [];

            const totalUnread = conversationsRef.current.reduce(
                (sum, conv) => sum + (conv.unreadCount || 0),
                0
            );
            setUnreadCount(totalUnread);
            scheduleUpdate('conversations');
        } catch (error) {
            console.error('Failed to load conversations:', error);
        } finally {
            setLoading(false);
        }
    }, [scheduleUpdate]);

    const loadMessages = useCallback(async (conversationId) => {
        try {
            const data = await messagesAPI.getConversation(conversationId);
            messagesRef.current = data.messages || [];
            scheduleUpdate('messages');
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    }, [scheduleUpdate]);

    const loadUnreadCount = useCallback(async () => {
        try {
            const data = await messagesAPI.getUnreadCount();
            setUnreadCount(prev => {
                if (prev !== data.unreadCount) {
                    return data.unreadCount;
                }
                return prev;
            });
        } catch (error) {
            console.error('Failed to load unread count:', error);
        }
    }, []);

    // Define markAsRead FIRST since it's used by handleNewMessage
    const markAsRead = useCallback(async (conversationId) => {
        if (!conversationId) return;

        // Find the conversation to get current unread count
        const conversation = conversationsRef.current.find(c => c.id === conversationId);
        const oldUnreadCount = conversation?.unreadCount || 0;

        // If already 0, don't do anything
        if (oldUnreadCount === 0) return;

        const unreadMessages = messagesRef.current
            .filter(m => m.conversationId === conversationId && m.senderId !== user?.id && m.status !== 'read')
            .map(m => m.id);

        if (unreadMessages.length === 0) return;

        // Send via WebSocket for real-time update
        if (wsRef.current?.isConnected() && activeConversation?.participant?.id) {
            wsRef.current.markAsRead({
                conversationId,
                messageIds: unreadMessages,
                senderId: activeConversation.participant.id
            });
        }

        try {
            // Call REST API for persistence
            await messagesAPI.markAsRead(conversationId);

            // Update messages status
            messagesRef.current = messagesRef.current.map(msg =>
                msg.conversationId === conversationId && msg.senderId !== user?.id
                    ? { ...msg, status: 'read' }
                    : msg
            );
            scheduleUpdate('messages');

            // Update conversations - set unreadCount to 0
            conversationsRef.current = conversationsRef.current.map(c =>
                c.id === conversationId ? { ...c, unreadCount: 0 } : c
            );
            scheduleUpdate('conversations');

            // Decrement unread count by the old value - ONLY ONCE
            if (oldUnreadCount > 0) {
                setUnreadCount(prev => {
                    const newCount = Math.max(0, prev - oldUnreadCount);
                    console.log('📊 Decrementing unread count from', prev, 'to', newCount);
                    return newCount;
                });
            }
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    }, [activeConversation, user, scheduleUpdate]);

    // Now define handleNewMessage with markAsRead in dependencies
    const handleNewMessage = useCallback((message) => {
        // Clear typing for this conversation
        Object.keys(typingUsersRef.current).forEach(key => {
            if (key.startsWith(`${message.conversationId}-`)) {
                delete typingUsersRef.current[key];
            }
        });
        scheduleUpdate('typing');

        // Check if this is a new message from someone else and not in active conversation
        const isFromOther = message.senderId !== user?.id;
        const isNotActiveConversation = activeConversation?.id !== message.conversationId;
        const shouldIncrementUnread = isFromOther && isNotActiveConversation;

        // Check if we've already processed this message (prevent duplicates)
        const messageExists = conversationsRef.current.some(c =>
            c.lastMessage?.id === message.id || c.lastMessage?.tempId === message.tempId
        );

        if (messageExists) {
            console.log('⚠️ Message already processed, skipping:', message.id);
            return;
        }

        // Update conversations
        const index = conversationsRef.current.findIndex(c => c.id === message.conversationId);

        if (index !== -1) {
            const updated = [...conversationsRef.current];

            // Don't increment if this message is already the last message
            if (updated[index].lastMessage?.id === message.id) {
                return;
            }

            // Calculate new unread count - ONLY increment once
            let newUnreadCount = updated[index].unreadCount || 0;
            if (shouldIncrementUnread) {
                newUnreadCount += 1;
            }

            updated[index] = {
                ...updated[index],
                lastMessage: {
                    id: message.id,
                    content: message.content,
                    createdAt: message.createdAt,
                    senderId: message.senderId,
                    status: message.status,
                },
                unreadCount: newUnreadCount,
            };

            // Move to top
            const [movedItem] = updated.splice(index, 1);
            conversationsRef.current = [movedItem, ...updated];

            // Update React state unreadCount - ONLY ONCE
            if (shouldIncrementUnread) {
                // Use functional update to ensure we're not double counting
                setUnreadCount(prev => {
                    console.log('📊 Incrementing unread count from', prev, 'to', prev + 1);
                    return prev + 1;
                });
            }
        } else {
            // New conversation
            conversationsRef.current = [{
                id: message.conversationId,
                lastMessage: {
                    id: message.id,
                    content: message.content,
                    createdAt: message.createdAt,
                    senderId: message.senderId,
                },
                unreadCount: shouldIncrementUnread ? 1 : 0,
                participant: message.sender,
            }, ...conversationsRef.current];

            // Update React state unreadCount - ONLY ONCE
            if (shouldIncrementUnread) {
                setUnreadCount(prev => {
                    console.log('📊 Incrementing unread count from', prev, 'to', prev + 1);
                    return prev + 1;
                });
            }
        }

        scheduleUpdate('conversations');

        // Update messages if active conversation
        if (activeConversation?.id === message.conversationId) {
            const exists = messagesRef.current.some(m =>
                m.id === message.id || m.tempId === message.tempId
            );

            if (!exists) {
                messagesRef.current = [...messagesRef.current, {
                    ...message,
                    status: message.status || 'delivered'
                }];
                scheduleUpdate('messages');
            }

            // Mark as read if this is the active conversation and message is from others
            if (isFromOther) {
                markAsRead(message.conversationId);
            }
        }
    }, [user, activeConversation, markAsRead, scheduleUpdate]);


    const handleMessageSent = useCallback((data) => {
        messagesRef.current = messagesRef.current.map(msg =>
            msg.tempId === data.tempId
                ? { ...data.message, status: data.delivered ? 'delivered' : 'sent' }
                : msg
        );
        scheduleUpdate('messages');

        const index = conversationsRef.current.findIndex(c => c.id === data.message?.conversationId);
        if (index !== -1) {
            conversationsRef.current[index] = {
                ...conversationsRef.current[index],
                lastMessage: {
                    content: data.message?.content,
                    createdAt: data.message?.createdAt,
                    senderId: data.message?.senderId,
                    status: data.delivered ? 'delivered' : 'sent',
                },
            };
            scheduleUpdate('conversations');
        }
    }, [scheduleUpdate]);

    const handleMessagesRead = useCallback(({ conversationId, messageIds }) => {
        const conversation = conversationsRef.current.find(c => c.id === conversationId);
        const oldUnreadCount = conversation?.unreadCount || 0;

        conversationsRef.current = conversationsRef.current.map(c =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
        );
        scheduleUpdate('conversations');

        if (activeConversation?.id === conversationId) {
            messagesRef.current = messagesRef.current.map(msg =>
                msg.senderId !== user?.id && (!messageIds || messageIds.includes(msg.id))
                    ? { ...msg, status: 'read' }
                    : msg
            );
            scheduleUpdate('messages');
        }

        if (oldUnreadCount > 0) {
            setUnreadCount(prev => Math.max(0, prev - oldUnreadCount));
        }
    }, [user, activeConversation, scheduleUpdate]);

    const handleUserTyping = useCallback(({ conversationId, senderId, isTyping }) => {
        if (senderId !== user?.id) {
            const key = `${conversationId}-${senderId}`;

            if (isTyping) {
                typingUsersRef.current[key] = true;

                setTimeout(() => {
                    if (typingUsersRef.current[key]) {
                        delete typingUsersRef.current[key];
                        scheduleUpdate('typing');
                    }
                }, 3000);
            } else {
                delete typingUsersRef.current[key];
            }

            scheduleUpdate('typing');
        }
    }, [user, scheduleUpdate]);

    const handleUserStatus = useCallback(({ userId, isOnline }) => {
        if (isOnline) {
            onlineUsersRef.current.add(userId);
        } else {
            onlineUsersRef.current.delete(userId);
        }

        conversationsRef.current = conversationsRef.current.map(conv => {
            if (conv.participant?.id === userId) {
                return {
                    ...conv,
                    participant: { ...conv.participant, isOnline }
                };
            }
            return conv;
        });

        scheduleUpdate('online');
        scheduleUpdate('conversations');
    }, [scheduleUpdate]);

    const handleOnlineStatus = useCallback((statuses) => {
        if (Array.isArray(statuses)) {
            statuses.forEach(status => handleUserStatus(status));
        }
    }, [handleUserStatus]);

    const sendMessage = useCallback(async (conversationId, content) => {
        if (!content?.trim() || !conversationId || !user || !activeConversation) {
            throw new Error('Invalid message parameters');
        }

        const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const optimisticMessage = {
            id: tempId,
            tempId,
            content,
            sender: user,
            senderId: user.id,
            createdAt: new Date().toISOString(),
            status: 'sending',
            conversationId,
        };

        messagesRef.current = [...messagesRef.current, optimisticMessage];
        scheduleUpdate('messages');

        if (wsRef.current?.isConnected()) {
            const success = wsRef.current.sendMessage({
                tempId,
                conversationId,
                content,
                recipientId: activeConversation?.participant?.id,
            });

            if (success) {
                return new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        wsRef.current?.off('messageSent', handler);
                        reject(new Error('Message send timeout'));
                    }, 10000);

                    const handler = (data) => {
                        if (data.tempId === tempId) {
                            clearTimeout(timeout);
                            wsRef.current?.off('messageSent', handler);
                            resolve(data.message);
                        }
                    };

                    wsRef.current?.on('messageSent', handler);
                });
            }
        }

        console.warn('WebSocket not connected, using REST API');
        try {
            const response = await messagesAPI.sendMessage({ conversationId, content });

            messagesRef.current = messagesRef.current.map(msg =>
                msg.id === tempId ? { ...response, status: 'sent' } : msg
            );
            scheduleUpdate('messages');

            return response;
        } catch (error) {
            messagesRef.current = messagesRef.current.map(msg =>
                msg.id === tempId ? { ...msg, status: 'failed' } : msg
            );
            scheduleUpdate('messages');
            throw error;
        }
    }, [activeConversation, user, scheduleUpdate]);

    const sendTyping = useCallback((conversationId, isTyping, recipientId) => {
        if (wsRef.current?.isConnected() && conversationId && recipientId) {
            wsRef.current.sendTyping({ conversationId, isTyping, recipientId });
        }
    }, []);

    const startConversation = useCallback(async (data) => {
        try {
            console.log('📝 Starting conversation with data:', data);

            // Ensure recipientId is a number
            const payload = {
                recipientId: Number(data.recipientId),
                initialMessage: data.initialMessage || '',
                ...(data.craftId && { craftId: Number(data.craftId) }),
                ...(data.subject && { subject: data.subject })
            };

            console.log('📝 Sending payload:', payload);

            const conversation = await messagesAPI.startConversation(payload);
            console.log('✅ Conversation started:', conversation);

            await loadConversations();

            if (wsRef.current?.isConnected() && conversation.participant?.id) {
                wsRef.current.getOnlineStatus([conversation.participant.id]);
            }

            return conversation;
        } catch (error) {
            console.error('❌ Failed to start conversation:', error);
            console.error('❌ Error response:', error.response?.data);
            console.error('❌ Error status:', error.response?.status);
            throw error;
        }
    }, [loadConversations]);

    // ============== EFFECTS ==============

    // Initialize WebSocket
    useEffect(() => {
        if (!user) return;

        const initWebSocket = async () => {
            try {
                setConnectionStatus('connecting');

                const socket = new MessageWebSocket();
                await socket.connect();

                wsRef.current = socket;
                setWs(socket);
                setConnectionStatus('connected');

                socket.on('connect', () => {
                    setConnectionStatus('connected');
                    setTimeout(() => requestOnlineStatus(), 1000);
                });

                socket.on('disconnect', () => setConnectionStatus('disconnected'));
                socket.on('error', () => setConnectionStatus('error'));

                socket.on('newMessage', handleNewMessage);
                socket.on('messageSent', handleMessageSent);
                socket.on('messagesRead', handleMessagesRead);
                socket.on('userTyping', handleUserTyping);
                socket.on('userStatus', handleUserStatus);
                socket.on('onlineStatus', handleOnlineStatus);

            } catch (error) {
                console.error('Failed to connect WebSocket:', error);
                setConnectionStatus('error');
            }
        };

        initWebSocket();

        connectionCheckInterval.current = setInterval(() => {
            if (wsRef.current && !wsRef.current.isConnected() && connectionStatus === 'connected') {
                setConnectionStatus('reconnecting');
                wsRef.current.connect().catch(console.error);
            }
        }, 30000);

        return () => {
            if (wsRef.current) {
                wsRef.current.disconnect();
                wsRef.current = null;
                setWs(null);
            }
            clearInterval(connectionCheckInterval.current);
        };
    }, [user, handleNewMessage, handleMessageSent, handleMessagesRead, handleUserTyping,
        handleUserStatus, handleOnlineStatus, requestOnlineStatus, connectionStatus]);

    // Load initial data
    useEffect(() => {
        if (user) {
            loadConversations();
            loadUnreadCount();
        }
    }, [user, loadConversations, loadUnreadCount]);

    useEffect(() => {
        if (conversationsRef.current.length > 0 && wsRef.current?.isConnected()) {
            requestOnlineStatus();
        }
    }, [conversationsRef.current.length, requestOnlineStatus]);

    useEffect(() => {
        if (activeConversation) {
            loadMessages(activeConversation.id);
        }
    }, [activeConversation, loadMessages]);

    const value = {
        conversations,
        messages,
        unreadCount,
        loading,
        connectionStatus,
        activeConversation,
        setActiveConversation,
        sendMessage,
        sendTyping,
        markAsRead,
        startConversation,
        loadConversations,
        loadUnreadCount,
        isUserOnline,
        isUserTyping,
        checkConnection: () => wsRef.current?.isConnected() || false,
        onlineUsers: onlineUsersState,
        ws: wsRef.current,
    };

    return (
        <MessageContext.Provider value={value}>
            {children}
        </MessageContext.Provider>
    );
};

export const useMessages = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessages must be used within MessageProvider');
    }
    return context;
};