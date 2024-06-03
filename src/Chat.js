import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, subscribeToMessages, updateMessageStatusInDB, getUsers } from './firebase';
import { Box, Paper, TextField, Button, Typography, Container, List, ListItem, ListItemText, Divider } from '@mui/material';
import './App.css';

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((updatedMessages) => {
      setMessages(updatedMessages);
      const uniqueUsers = [...new Set(updatedMessages.map(message => message.user))];
      setUsers(uniqueUsers);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage, user);
      setNewMessage('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // 기본 Enter 동작 방지 (새 줄 추가)
      handleSend();
    }
  };

  const updateMessageStatus = (id, newStatus) => {
    // 메시지 상태 업데이트
    updateMessageStatusInDB(id, newStatus);
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'read':
        return '누군가 읽었을지도';
      case 'unread':
        return '아무도안읽었어';
      case 'important':
        return '중요';
      default:
        return status;
    }
  };

   return (
    <Container>
    <Box display="flex">
      <Box flex={1} component={Paper} p={2} mt={2} className="chat-container">
        {messages.map((message) => (
          <Box key={message.id} className={`message ${message.userId === user.uid ? 'user' : 'other'}`}>
            <Typography variant="subtitle1" className="message-user">
              {message.user}
            </Typography>
            <Typography variant="body1">
                {message.text} <span className="message-status">({getStatusText(message.status)})</span>
            </Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box width="200px" ml={2}>
          <Paper>
            <Typography variant="h6" p={2}>Users</Typography>
            <Divider />
            <List>
              {users.map((user, index) => (
                <ListItem key={index}>
                  <ListItemText primary={user} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
        </Box>
      

      <Box mt={2} display="flex" alignItems="center">
        <TextField
          fullWidth
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="여따 입력하고 엔터 ㄱㄱ"
          className="message-input"
          multiline
        />
        <Button variant="contained" color="primary" onClick={handleSend} className="send-button">
          보내기임
        </Button>
      </Box>
    </Container>
  );
};

export default Chat;