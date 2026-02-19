import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Send,
  Search,
  AttachFile,
  InsertEmoticon,
  MoreVert,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import { useAuth } from '../context/AuthContext';

const MessagesPage = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  // Mock conversations
  const conversations = [
    {
      id: 1,
      user: {
        name: 'John Artisan',
        avatar: null,
        role: 'ARTISAN',
        lastSeen: '2 min ago',
      },
      lastMessage: 'Your order has been shipped!',
      timestamp: '10:30 AM',
      unread: 2,
    },
    {
      id: 2,
      user: {
        name: 'Sarah Customer',
        avatar: null,
        role: 'CUSTOMER',
        lastSeen: 'Online',
      },
      lastMessage: 'When will my craft be ready?',
      timestamp: 'Yesterday',
      unread: 0,
    },
  ];

  // Mock messages
  const messages = [
    {
      id: 1,
      sender: 'John Artisan',
      content: 'Hello! Your custom craft order is progressing well.',
      timestamp: '10:00 AM',
      isOwn: false,
    },
    {
      id: 2,
      sender: user?.name,
      content: 'Great! Can you share a photo?',
      timestamp: '10:05 AM',
      isOwn: true,
    },
    {
      id: 3,
      sender: 'John Artisan',
      content: 'Your order has been shipped! Tracking number: TRK123456',
      timestamp: '10:30 AM',
      isOwn: false,
    },
  ];

  return (
    <Container maxWidth="xl">
      <PageHeader
        title="Messages"
        subtitle="Chat with artisans and customers"
        breadcrumbs={true}
      />

      <Grid container spacing={3}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                placeholder="Search conversations..."
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Divider />
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <List disablePadding>
                {conversations.map((conv) => (
                  <ListItem
                    key={conv.id}
                    button
                    selected={selectedChat?.id === conv.id}
                    onClick={() => setSelectedChat(conv)}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        color: 'primary.contrastText',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={conv.user.avatar}>
                        {conv.user.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle2" noWrap>
                            {conv.user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {conv.timestamp}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: '70%' }}>
                            {conv.lastMessage}
                          </Typography>
                          {conv.unread > 0 && (
                            <Chip
                              label={conv.unread}
                              color="primary"
                              size="small"
                              sx={{ height: 20, minWidth: 20 }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar src={selectedChat.user.avatar}>
                      {selectedChat.user.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {selectedChat.user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedChat.user.lastSeen}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>

                {/* Messages */}
                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                  {messages.map((msg) => (
                    <Box
                      key={msg.id}
                      sx={{
                        display: 'flex',
                        justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: msg.isOwn ? 'primary.main' : 'background.default',
                          color: msg.isOwn ? 'primary.contrastText' : 'text.primary',
                        }}
                      >
                        <Typography variant="body2">{msg.content}</Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.8 }}>
                          {msg.timestamp}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="small">
                      <AttachFile />
                    </IconButton>
                    <IconButton size="small">
                      <InsertEmoticon />
                    </IconButton>
                    <TextField
                      fullWidth
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      size="small"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          console.log('Send message:', messageInput);
                          setMessageInput('');
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      endIcon={<Send />}
                      onClick={() => {
                        console.log('Send message:', messageInput);
                        setMessageInput('');
                      }}
                    >
                      Send
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Select a conversation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose a conversation from the list to start messaging
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MessagesPage;