'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  Fab,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';

export default function Home() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ type: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage(userMessage: string) {
    try {
      const r = await fetch("/api/vertex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });
      const data = await r.json();

      // Append bot reply
      setMessages((prev) => [...prev, { type: 'bot', text: String(data) || "No answer." }]);
    } catch (err) {
      console.error("Error calling API:", err);
      setMessages((prev) => [...prev, { type: 'bot', text: "Something went wrong." }]);
    } finally {
      // Always re-enable input
      setLoading(false);
    }
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAsk = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    sendMessage(userMessage);
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="chat"
        onClick={handleOpen}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <ChatIcon />
      </Fab>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: 640,
            maxHeight: 1000,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Chat Support
          </Typography>

          <Paper
            elevation={1}
            sx={{
              flex: 1,
              overflowY: 'auto',
              mb: 1,
              p: 1,
              bgcolor: '#f5f5f5',
              borderRadius: 1,
            }}
          >
            {messages.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Start the conversation...
              </Typography>
            ) : (
              messages.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    my: 1,
                    textAlign: msg.type === 'user' ? 'right' : 'left',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: 'pre-line',
                      display: 'inline-block',
                      px: 1,
                      py: 1,
                      bgcolor: msg.type === 'user' ? '#1976d2' : '#e0e0e0',
                      color: msg.type === 'user' ? '#fff' : '#000',
                      borderRadius: 1,
                    }}
                  >
                    {msg.text}
                  </Typography>
                </Box>
              ))
            )}
          </Paper>

          <Box display="flex" gap={1}>
            <TextField
              size="small"
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAsk();
              }}
            />
            <Button variant="contained" onClick={handleAsk} disabled={loading}>
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
