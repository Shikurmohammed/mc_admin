import React, { memo } from 'react';
import { ListItemButton, ListItemAvatar, Badge, Avatar, ListItemText, Box, Typography, Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';

const MemoizedConversationItem = memo(({ 
    conv, 
    selected, 
    onClick, 
    isUserOnline, 
    isUserTyping, 
    getAvatarColor, 
    getInitials, 
    formatMessageTime,
    theme 
}) => {
    return (
        <ListItemButton
            selected={selected}
            onClick={onClick}
            sx={{
                py: 1.5,
                px: 2,
                '&.Mui-selected': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
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
                primaryTypographyProps={{ component: 'div' }}
                secondaryTypographyProps={{ component: 'div' }}
                primary={
                    <Box component='div' sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" fontWeight={600} component="span" noWrap>
                            {conv.participant?.firstName} {conv.participant?.lastName}
                        </Typography>
                        {conv.lastMessage && (
                            <Typography variant="caption" color="text.disabled" component="span">
                                {formatMessageTime(conv.lastMessage.createdAt)}
                            </Typography>
                        )}
                    </Box>
                }
                secondary={
                    <Box component='div' sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                        <Typography
                            variant="body2"
                            component="span"
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
                            {isUserTyping(conv.id, conv.participant?.id) && (
                                <Typography component="span" variant="caption" color="primary" sx={{ ml: 1 }}>
                                    typing...
                                </Typography>
                            )}
                        </Typography>
                        {conv.unreadCount > 0 && (
                            <Chip
                                label={conv.unreadCount}
                                size="small"
                                color="primary"
                                sx={{ height: 20, minWidth: 20 }}
                            />
                        )}
                    </Box>
                }
            />
        </ListItemButton>
    );
});

MemoizedConversationItem.displayName = 'MemoizedConversationItem';
export default MemoizedConversationItem;