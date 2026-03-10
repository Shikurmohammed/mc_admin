import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  TextField,
  Button,
  Divider,
  IconButton,
  Chip,
  InputAdornment,
  Badge,
  CircularProgress,
  Alert,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  useTheme,
  alpha,
  AvatarGroup,
  Fade,
  Zoom,
  Skeleton,
  ListItemIcon,
} from '@mui/material';
import {
  Send,
  Search,
  AttachFile,
  InsertEmoticon,
  MoreVert,
  ArrowBack,
  Check,
  DoneAll,
  Info,
  Delete,
  Archive,
  Phone,
  Videocam,
  Block,
  Image as ImageIcon,
  Mic,
  EmojiEmotions,
  PersonAdd,
  Groups,
  Chat as ChatIcon,
  Menu as MenuIcon,
  DarkMode,
  LightMode,
  Settings,
  Logout,
  FilterList,
  Refresh,
} from '@mui/icons-material';
import { format, formatDistance, isToday, isYesterday, isThisWeek } from 'date-fns';
import PageHeader from '../components/common/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { useNavigate } from 'react-router-dom';
import { messagesAPI } from '../services/messagesService';
import { craftsAPI } from '../services/craftsService';
import { usersAPI } from '../services/usersService';
import EmojiPicker from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// Tab Panel Component
function TabPanel(props) {

  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: '100%', overflow: 'auto' }}
      {...other}
    >
      {value === index && <Box sx={{ height: '100%' }}>{children}</Box>}
    </div>
  );
}

const MessagesPage = () => {

  const location = useLocation();
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    conversations,
    unreadCount,
    loading: conversationsLoading,
    activeConversation,
    setActiveConversation,
    sendMessage,
    sendTyping,
    markAsRead,
    startConversation,
    loadConversations,
    isUserOnline,
  } = useMessages();

  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [newMessageDialog, setNewMessageDialog] = useState(false);
  const [users, setUsers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [initialMessage, setInitialMessage] = useState('');
  const [attachmentMenu, setAttachmentMenu] = useState(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [messageGroups, setMessageGroups] = useState({});
  const [techSearchQuery, setTechSearchQuery] = useState('');

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messageListRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Load users and technicians on mount
  useEffect(() => {
    loadUsers();
    loadTechnicians();
  }, []);

  // Load messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.id);
      markAsRead(selectedChat.id);
      setActiveConversation(selectedChat);
      setShowMobileChat(true);
    } else {
      setActiveConversation(null);
      setMessages([]);
      setShowMobileChat(false);
    }
  }, [selectedChat, setActiveConversation, markAsRead]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Group messages by date
  useEffect(() => {
    if (messages.length > 0) {
      const groups = {};
      messages.forEach(msg => {
        const date = new Date(msg.createdAt).toDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(msg);
      });
      setMessageGroups(groups);
    } else {
      setMessageGroups({});
    }
  }, [messages]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await usersAPI.getContacts({ role: 'CUSTOMER,ARTISAN' });
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadTechnicians = async () => {
    setLoadingUsers(true);
    try {
      const data = await usersAPI.getContacts({ role: 'ARTISAN,ADMIN' });
      setTechnicians(data || []);
    } catch (error) {
      console.error('Failed to load technicians:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadMessages = async (conversationId) => {
    setLoadingMessages(true);
    try {
      const data = await messagesAPI.getConversation(conversationId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    sendMessage(selectedChat.id, messageInput.trim());

    // Optimistically add message to UI
    const newMessage = {
      id: Date.now(),
      content: messageInput.trim(),
      sender: user,
      senderId: user.id,
      createdAt: new Date().toISOString(),
      status: 'sending',
    };
    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');

    // Clear typing indicator
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      sendTyping(selectedChat.id, false, selectedChat.participant.id);
    }
  };

  const handleTyping = (e) => {
    setMessageInput(e.target.value);

    if (!selectedChat) return;

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    } else {
      sendTyping(selectedChat.id, true, selectedChat.participant.id);
    }

    setTypingTimeout(setTimeout(() => {
      sendTyping(selectedChat.id, false, selectedChat.participant.id);
      setTypingTimeout(null);
    }, 2000));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEmojiSelect = (emoji) => {
    setMessageInput(prev => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    // Implement file upload logic with Cloudinary
    console.log('Upload files:', files);
    setAttachmentMenu(null);
  };

  const handleTechnicianClick = async (tech) => {
    // Check if conversation already exists
    const existingConversation = conversations.find(
      conv => conv.participant?.id === tech.id
    );

    if (existingConversation) {
      // If conversation exists, open it
      setSelectedChat(existingConversation);
    } else {
      // If no existing conversation, create one with a default message
      try {
        const defaultMessage = `Hello ${tech.firstName}, I need assistance.`;
        const conversation = await startConversation({
          recipientId: Number(tech.id),
          initialMessage: defaultMessage,
        });
        setSelectedChat(conversation);
      } catch (error) {
        console.error('Failed to start conversation:', error);
      }
    }
  };

  const handleStartConversation = async () => {
  if (!selectedUser) return;
  console.log('Starting conversation with user:', user);

  if (selectedUser.id === user.id) {
    console.error("Cannot start conversation with yourself");
    return;
  }

  try {
    const conversation = await startConversation({
      recipientId: Number(selectedUser.id),
      initialMessage,
    });

    setNewMessageDialog(false);
    setSelectedChat(conversation);
    setSelectedUser(null);
    setInitialMessage('');
  } catch (error) {
    console.error('Failed to start conversation:', error);
  }
};

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sending':
        return <CircularProgress size={12} sx={{ ml: 1, color: 'text.secondary' }} />;
      case 'sent':
        return <Check sx={{ fontSize: 14, ml: 1, color: 'text.secondary' }} />;
      case 'delivered':
        return <DoneAll sx={{ fontSize: 14, ml: 1, color: 'text.secondary' }} />;
      case 'read':
        return <DoneAll sx={{ fontSize: 14, ml: 1, color: 'primary.main' }} />;
      default:
        return null;
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE');
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getAvatarColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return theme.palette.error.main;
      case 'ARTISAN':
        return theme.palette.secondary.main;
      default:
        return theme.palette.primary.main;
    }
  };

  // Filter conversations based on search
  const filteredConversations = conversations.filter(conv =>
    conv.participant?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter technicians based on search
  const filteredTechnicians = technicians.filter(tech =>
    tech.firstName?.toLowerCase().includes(techSearchQuery.toLowerCase()) ||
    tech.lastName?.toLowerCase().includes(techSearchQuery.toLowerCase()) ||
    tech.email?.toLowerCase().includes(techSearchQuery.toLowerCase())
  );
  // Handle navigation state
  useEffect(() => {
    if (location.state?.selectedChat) {
      setSelectedChat(location.state.selectedChat);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
    if (location.state?.openNewMessage) {
      setNewMessageDialog(true);
      window.history.replaceState({}, document.title);
    }
    if (location.state?.tab !== undefined) {
      setTabValue(location.state.tab);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  return (
    <Box sx={{ height: '90vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          py: 1.5,
          px: 2,
          borderBottom: 1,
          borderColor: 'divider',
          borderRadius: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Messages
          </Typography>
          <Chip
            label={`${unreadCount} unread`}
            size="small"
            color="primary"
            sx={{ borderRadius: 1 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="New message">
            <IconButton size="small" onClick={() => setNewMessageDialog(true)}>
              <PersonAdd />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton size="small" onClick={loadConversations}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton size="small">
              <Settings />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar - Chat List */}
        <Box
          sx={{
            width: { xs: showMobileChat ? 0 : '100%', md: 360 },
            borderRight: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            transition: 'width 0.2s',
            overflow: 'hidden',
            display: { xs: showMobileChat ? 'none' : 'block', md: 'block' },
          }}
        >
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Search Bar */}
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                placeholder="Search chats..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
            </Box>

            {/* Tabs */}
            <Box sx={{ px: 2 }}>
              <Tabs
                value={tabValue}
                onChange={(e, v) => setTabValue(v)}
                variant="fullWidth"
                sx={{
                  minHeight: 40,
                  '& .MuiTab-root': {
                    minHeight: 40,
                    py: 0,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                  },
                }}
              >
                <Tab icon={<ChatIcon sx={{ fontSize: 18, mr: 0.5 }} />} label="Chats" iconPosition="start" />
                <Tab icon={<Groups sx={{ fontSize: 18, mr: 0.5 }} />} label="Technicians" iconPosition="start" />
              </Tabs>
            </Box>

            <Divider sx={{ mt: 1 }} />

            {/* Tab Content */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {/* Chats Tab */}
              <TabPanel value={tabValue} index={0}>
                {conversationsLoading ? (
                  <Box sx={{ p: 2 }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Skeleton variant="circular" width={48} height={48} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton width="60%" height={20} />
                          <Skeleton width="80%" height={16} />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : filteredConversations.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <ChatIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary" gutterBottom>
                      No chats yet
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setNewMessageDialog(true)}
                      sx={{ mt: 1 }}
                    >
                      Start a conversation
                    </Button>
                  </Box>
                ) : (
                  <List disablePadding>
                    {filteredConversations.map((conv) => (
                      <motion.div
                        key={conv.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ListItem
                          button
                          selected={selectedChat?.id === conv.id}
                          onClick={() => setSelectedChat(conv)}
                          sx={{
                            py: 1.5,
                            px: 2,
                            '&.Mui-selected': {
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.12),
                              },
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              variant="dot"
                              color={isUserOnline(conv.participant?.id) ? 'success' : 'default'}
                              sx={{
                                '& .MuiBadge-badge': {
                                  width: 10,
                                  height: 10,
                                  borderRadius: '50%',
                                  border: `2px solid ${theme.palette.background.paper}`,
                                },
                              }}
                            >
                              <Avatar
                                src={conv.participant?.avatar}
                                sx={{
                                  bgcolor: getAvatarColor(conv.participant?.role),
                                  width: 48,
                                  height: 48,
                                }}
                              >
                                {getInitials(conv.participant?.firstName, conv.participant?.lastName)}
                              </Avatar>
                            </Badge>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {conv.participant?.firstName} {conv.participant?.lastName}
                                  {conv.participant?.role === 'ADMIN' && (
                                    <Chip
                                      label="Admin"
                                      size="small"
                                      sx={{ ml: 1, height: 18, fontSize: '0.6rem' }}
                                      color="error"
                                    />
                                  )}
                                  {conv.participant?.role === 'ARTISAN' && (
                                    <Chip
                                      label="Artisan"
                                      size="small"
                                      sx={{ ml: 1, height: 18, fontSize: '0.6rem' }}
                                      color="secondary"
                                    />
                                  )}
                                </Typography>
                                {conv.lastMessage && (
                                  <Typography variant="caption" color="text.disabled">
                                    {formatMessageTime(conv.lastMessage.createdAt)}
                                  </Typography>
                                )}
                              </Box>
                            }
                            secondary={
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  mt: 0.5,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color={conv.unreadCount > 0 ? 'text.primary' : 'text.secondary'}
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: '70%',
                                    fontWeight: conv.unreadCount > 0 ? 600 : 400,
                                  }}
                                >
                                  {conv.lastMessage?.content || 'No messages yet'}
                                </Typography>
                                {conv.unreadCount > 0 && (
                                  <Chip
                                    label={conv.unreadCount}
                                    size="small"
                                    color="primary"
                                    sx={{
                                      height: 20,
                                      minWidth: 20,
                                      '& .MuiChip-label': {
                                        px: 0.5,
                                        fontSize: '0.7rem',
                                      },
                                    }}
                                  />
                                )}
                              </Box>
                            }
                            primaryTypographyProps={{ component: 'span' }}
                            secondaryTypographyProps={{ component: 'span' }}
                          />
                        </ListItem>
                      </motion.div>
                    ))}
                  </List>
                )}
              </TabPanel>

              {/* Technicians Tab */}
              <TabPanel value={tabValue} index={1}>
                {/* Search in technicians */}
                <Box sx={{ p: 2, pb: 1 }}>
                  <TextField
                    fullWidth
                    placeholder="Search technicians..."
                    size="small"
                    value={techSearchQuery}
                    onChange={(e) => setTechSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>

                {loadingUsers ? (
                  <Box sx={{ p: 2 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Skeleton variant="circular" width={48} height={48} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton width="50%" height={20} />
                          <Skeleton width="30%" height={16} />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : filteredTechnicians.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Groups sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary">
                      No technicians found
                    </Typography>
                  </Box>
                ) : (
                  <List disablePadding>
                    {filteredTechnicians.map((tech) => (
                      <ListItem
                        key={tech.id}
                        button
                        onClick={() => handleTechnicianClick(tech)}
                        sx={{ py: 1.5, px: 2 }}
                      >
                        <ListItemAvatar>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            color={isUserOnline(tech.id) ? 'success' : 'default'}
                            sx={{
                              '& .MuiBadge-badge': {
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                border: `2px solid ${theme.palette.background.paper}`,
                              },
                            }}
                          >
                            <Avatar
                              src={tech.avatar}
                              sx={{
                                bgcolor: getAvatarColor(tech.role),
                                width: 48,
                                height: 48,
                              }}
                            >
                              {getInitials(tech.firstName, tech.lastName)}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" fontWeight={600}>
                              {tech.firstName} {tech.lastName}
                              {tech.role === 'ARTISAN' && (
                                <Chip
                                  label="Artisan"
                                  size="small"
                                  sx={{ ml: 1, height: 18, fontSize: '0.6rem' }}
                                  color="secondary"
                                />
                              )}
                              {tech.role === 'ADMIN' && (
                                <Chip
                                  label="Admin"
                                  size="small"
                                  sx={{ ml: 1, height: 18, fontSize: '0.6rem' }}
                                  color="error"
                                />
                              )}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {tech.email}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </TabPanel>
            </Box>
          </Box>
        </Box>

        {/* Right Side - Chat Area */}
        <Box
          ref={chatContainerRef}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.black, 0.2)
              : alpha(theme.palette.common.white, 0.5),
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <Paper
                elevation={0}
                sx={{
                  py: 1,
                  px: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                  borderRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    sx={{ display: { md: 'none' } }}
                    onClick={() => setSelectedChat(null)}
                  >
                    <ArrowBack />
                  </IconButton>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    color={isUserOnline(selectedChat.participant?.id) ? 'success' : 'default'}
                    sx={{
                      '& .MuiBadge-badge': {
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        border: `2px solid ${theme.palette.background.paper}`,
                      },
                    }}
                  >
                    <Avatar
                      src={selectedChat.participant?.avatar}
                      sx={{
                        bgcolor: getAvatarColor(selectedChat.participant?.role),
                      }}
                    >
                      {getInitials(selectedChat.participant?.firstName, selectedChat.participant?.lastName)}
                    </Avatar>
                  </Badge>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {selectedChat.participant?.firstName} {selectedChat.participant?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {isUserOnline(selectedChat.participant?.id)
                        ? 'Online'
                        : `Last seen ${selectedChat.participant?.lastSeen || 'recently'}`}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Tooltip title="Voice call">
                    <IconButton size="small">
                      <Phone />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Video call">
                    <IconButton size="small">
                      <Videocam />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="More options">
                    <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
                      <MoreVert />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>

              {/* Messages */}
              <Box
                ref={messageListRef}
                sx={{
                  flex: 1,
                  overflow: 'auto',
                  p: 2,
                  position: 'relative',
                }}
              >
                {loadingMessages ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  Object.entries(messageGroups).map(([date, msgs]) => (
                    <Box key={date}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                        <Chip
                          label={formatMessageDate(date)}
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.common.black, 0.05),
                            color: 'text.secondary',
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                      {msgs.map((msg, index) => {
                        const isOwn = msg.senderId === user.id;
                        const showAvatar = index === 0 ||
                          msgs[index - 1]?.senderId !== msg.senderId;

                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: isOwn ? 'flex-end' : 'flex-start',
                                mb: 1,
                              }}
                            >
                              <Box sx={{ display: 'flex', maxWidth: '70%' }}>
                                {!isOwn && showAvatar && (
                                  <Avatar
                                    src={selectedChat.participant?.avatar}
                                    sx={{
                                      width: 28,
                                      height: 28,
                                      mr: 1,
                                      mt: 'auto',
                                      bgcolor: getAvatarColor(selectedChat.participant?.role),
                                    }}
                                  >
                                    {getInitials(selectedChat.participant?.firstName, selectedChat.participant?.lastName)}
                                  </Avatar>
                                )}
                                <Box>
                                  <Box
                                    sx={{
                                      p: 1.5,
                                      borderRadius: 2,
                                      bgcolor: isOwn ? 'primary.main' : 'background.paper',
                                      color: isOwn ? 'primary.contrastText' : 'text.primary',
                                      boxShadow: 1,
                                      position: 'relative',
                                      wordBreak: 'break-word',
                                      maxWidth: '100%',
                                      ...(isOwn
                                        ? {
                                          borderBottomRightRadius: 4,
                                        }
                                        : {
                                          borderBottomLeftRadius: 4,
                                        }),
                                    }}
                                  >
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                      {msg.content}
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        mt: 0.5,
                                        gap: 0.5,
                                      }}
                                    >
                                      <Typography
                                        variant="caption"
                                        sx={{ opacity: 0.8 }}
                                      >
                                        {format(new Date(msg.createdAt), 'h:mm a')}
                                      </Typography>
                                      {isOwn && getMessageStatusIcon(msg.status)}
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>
                          </motion.div>
                        );
                      })}
                    </Box>
                  ))
                )}
                {isTyping && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: getAvatarColor(selectedChat.participant?.role) }}>
                      {getInitials(selectedChat.participant?.firstName, selectedChat.participant?.lastName)}
                    </Avatar>
                    <Box sx={{ display: 'flex', gap: 0.5, p: 1, bgcolor: 'background.paper', borderRadius: 2 }}>
                      <Box sx={{ width: 4, height: 4, bgcolor: 'text.disabled', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                      <Box sx={{ width: 4, height: 4, bgcolor: 'text.disabled', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }} />
                      <Box sx={{ width: 4, height: 4, bgcolor: 'text.disabled', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }} />
                    </Box>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>

              {/* Message Input */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderTop: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <IconButton
                    size="small"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <AttachFile />
                  </IconButton>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    multiple
                    onChange={handleFileUpload}
                  />
                  <IconButton
                    size="small"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <EmojiEmotions />
                  </IconButton>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={handleTyping}
                    onKeyPress={handleKeyPress}
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        bgcolor: theme.palette.mode === 'dark'
                          ? alpha(theme.palette.common.white, 0.05)
                          : alpha(theme.palette.common.black, 0.02),
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    endIcon={<Send />}
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    sx={{
                      borderRadius: 3,
                      minWidth: 'auto',
                      px: 2,
                    }}
                  >
                    Send
                  </Button>
                </Box>

                {/* Emoji Picker */}
                <Zoom in={showEmojiPicker}>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 80,
                      right: 20,
                      zIndex: 1000,
                      boxShadow: 3,
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <EmojiPicker onEmojiClick={handleEmojiSelect} />
                  </Box>
                </Zoom>
              </Paper>
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <ChatIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Select a conversation
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Choose a chat from the sidebar to start messaging
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setNewMessageDialog(true)}
                  startIcon={<PersonAdd />}
                >
                  New Message
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Conversation Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: { minWidth: 200, borderRadius: 2 },
        }}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <Info fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <Archive fontSize="small" />
          </ListItemIcon>
          <ListItemText>Archive</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Conversation</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Block fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Block User</ListItemText>
        </MenuItem>
      </Menu>

      {/* New Message Dialog */}
      <Dialog
        open={newMessageDialog}
        onClose={() => setNewMessageDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
          <Typography variant="h6" fontWeight={600}>New Message</Typography>
          <Typography variant="caption" color="text.secondary">
            Select a user to start a conversation
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              placeholder="Search users..."
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            <List disablePadding>
              {users.map((user) => (
                <ListItem
                  key={user.id}
                  button
                  selected={selectedUser?.id === user.id}
                  onClick={() => setSelectedUser(user)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={user.avatar}
                      sx={{
                        bgcolor: getAvatarColor(user.role),
                      }}
                    >
                      {getInitials(user.firstName, user.lastName)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle2">
                          {user.firstName} {user.lastName}
                        </Typography>
                        {user.role === 'ARTISAN' && (
                          <Chip
                            label="Artisan"
                            size="small"
                            sx={{ ml: 1, height: 18, fontSize: '0.6rem' }}
                            color="secondary"
                          />
                        )}
                        {user.role === 'ADMIN' && (
                          <Chip
                            label="Admin"
                            size="small"
                            sx={{ ml: 1, height: 18, fontSize: '0.6rem' }}
                            color="error"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {user.email}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          {selectedUser && (
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2" gutterBottom>
                Message to {selectedUser.firstName}:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Write your message..."
                value={initialMessage}
                onChange={(e) => setInitialMessage(e.target.value)}
                size="small"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button onClick={() => setNewMessageDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleStartConversation}
            disabled={!selectedUser || !initialMessage.trim()}
          >
            Start Conversation
          </Button>
        </DialogActions>
      </Dialog>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default MessagesPage;