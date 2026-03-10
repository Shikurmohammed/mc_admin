import React, { useState, useEffect, useRef } from 'react';
import {
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  Divider,
  Chip,
  Badge,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  alpha,
  useTheme,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Search,
  Close,
  MarkChatRead,
  MoreVert,
  PersonAdd,
  Groups,
  Send,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useMessages } from '../../../context/MessageContext';
import { useAuth } from '../../../context/AuthContext';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const MessagesDropdown = ({ anchorEl, open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { conversations, unreadCount, loading, markAsRead, isUserOnline } = useMessages();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    if (conversations.length > 0) {
      // Sort by last message time and take top 5
      const sorted = [...conversations]
        .sort((a, b) => new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0))
        .slice(0, 5);
      setRecentChats(sorted);
    }
  }, [conversations]);

  const handleChatClick = (conversation) => {
    markAsRead(conversation.id);
    onClose();
    navigate('/messages', { state: { selectedChat: conversation } });
  };

  const handleViewAll = () => {
    onClose();
    navigate('messages');
  };

  const handleNewMessage = () => {
    onClose();
    navigate('/messages', { state: { openNewMessage: true } });
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
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

  // Filter chats based on search
  const filteredChats = recentChats.filter(chat =>
    chat.participant?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.participant?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          width: 360,
          maxHeight: 500,
          borderRadius: 2,
          boxShadow: theme.shadows[20],
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Messages
          </Typography>
          <Box>
            <IconButton size="small" onClick={handleNewMessage}>
              <PersonAdd fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onClose}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search messages..."
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
              bgcolor: alpha(theme.palette.common.black, 0.02),
            },
          }}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
              fontSize: '0.8rem',
            },
          }}
        >
          <Tab 
            icon={<ChatIcon sx={{ fontSize: 16, mr: 0.5 }} />} 
            label={`Chats (${unreadCount})`} 
            iconPosition="start" 
          />
          <Tab 
            icon={<Groups sx={{ fontSize: 16, mr: 0.5 }} />} 
            label="Technicians" 
            iconPosition="start" 
          />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
        {tabValue === 0 ? (
          // Chats Tab
          <>
            {loading ? (
              <Box sx={{ p: 2 }}>
                {[1, 2, 3].map((i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton width="60%" height={16} />
                      <Skeleton width="80%" height={14} />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : filteredChats.length > 0 ? (
              <List disablePadding>
                {filteredChats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ListItem
                      button
                      onClick={() => handleChatClick(chat)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                          color={isUserOnline(chat.participant?.id) ? 'success' : 'default'}
                          sx={{
                            '& .MuiBadge-badge': {
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              border: `2px solid ${theme.palette.background.paper}`,
                            },
                          }}
                        >
                          <Avatar
                            src={chat.participant?.avatar}
                            sx={{
                              bgcolor: getAvatarColor(chat.participant?.role),
                              width: 40,
                              height: 40,
                            }}
                          >
                            {getInitials(chat.participant?.firstName, chat.participant?.lastName)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {chat.participant?.firstName} {chat.participant?.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              {formatMessageTime(chat.lastMessage?.createdAt)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography
                              variant="body2"
                              color={chat.unreadCount > 0 ? 'text.primary' : 'text.secondary'}
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: '70%',
                                fontWeight: chat.unreadCount > 0 ? 600 : 400,
                              }}
                            >
                              {chat.lastMessage?.content || 'No messages yet'}
                            </Typography>
                            {chat.unreadCount > 0 && (
                              <Chip
                                label={chat.unreadCount}
                                size="small"
                                color="primary"
                                sx={{
                                  height: 18,
                                  minWidth: 18,
                                  '& .MuiChip-label': {
                                    px: 0.5,
                                    fontSize: '0.6rem',
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
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ChatIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary" variant="body2">
                  No messages yet
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Send />}
                  onClick={handleNewMessage}
                  sx={{ mt: 1 }}
                >
                  Start a conversation
                </Button>
              </Box>
            )}
          </>
        ) : (
          // Technicians Tab
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Groups sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary" variant="body2" gutterBottom>
              Connect with our technicians
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                onClose();
                navigate('messages', { state: { tab: 1 } });
              }}
              sx={{ mt: 1 }}
            >
              View All Technicians
            </Button>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Divider />
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
        <Button
          fullWidth
          size="small"
          onClick={handleViewAll}
          sx={{ textTransform: 'none' }}
        >
          View All Messages
        </Button>
      </Box>
    </Popover>
  );
};

export default MessagesDropdown;