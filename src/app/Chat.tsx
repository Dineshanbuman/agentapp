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

export default function ChatWidget() {
  type ChatMessage = { type: 'user' | 'bot'; text: string };
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

    // Ensure response is always an array
   const botMessages: string[] = Array.isArray(data)
  ? data.map((msg: any) =>
      typeof msg === "string" ? msg : msg?.text || JSON.stringify(msg)
    )
  : [typeof data === "string" ? data : data?.text || JSON.stringify(data)];

    // Append each bot message to the chat
   setMessages((prev) => [
  ...prev,
  ...botMessages.map((text) => ({
    type: 'bot' as const,
    text: text || "Can you please come again",
  })),
]);


  } catch (err) {
    console.error("Error calling API:", err);
    setMessages((prev) => [
      ...prev,
      { type: 'bot', text: "Can you please come again." },
    ]);
  } finally {
    setLoading(false);
  }
}

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function handleNewChat() {
    try {
      await fetch("/api/reset", { method: "POST" });
      setMessages([]);
      console.log("Chat reset and cookie cleared.");
    } catch (err) {
      console.error("Failed to reset chat:", err);
    }
  }

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
      {/* Floating chat icon */}
      <Fab
        aria-label="chat"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: '#CD2028', // Wendy’s Red
          color: '#fff',
          '&:hover': { bgcolor: '#A32539' },
        }}
      >
        <ChatIcon />
      </Fab>

      {/* Chat modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: 640,
            maxHeight: 600,
            bgcolor: '#FFFFFF',
            borderRadius: 3,
            boxShadow: '0px 6px 16px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#FFFFFF',
              bgcolor: '#002B49', // Wendy’s Blue
              p: 1.5,
              borderRadius: '8px 8px 0 0',
              textAlign: 'center',
            }}
          >
            Customer Care Chat
          </Typography>

          {/* Chat message area */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              overflowY: 'auto',
              mb: 1,
              p: 2,
              bgcolor: '#F9F9F9',
              borderRadius: 2,
              border: '1px solid #E2E2E2',
              minHeight: 200,
              maxHeight: 450,
              scrollBehavior: 'smooth',
            }}
          >
            {messages.map((msg, i) => (
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
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    // display: 'block'
                    whiteSpace: 'pre-line',
                    display: 'inline-block',
                    maxWidth: '75%',
                    bgcolor: msg.type === 'user' ? '#CD2028' : '#029CD4',
                    color: '#fff',
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            ))}

            {/* Typing indicator */}
            {loading && (
              <Box sx={{ my: 1, textAlign: 'left' }}>
                <TypingDots />
              </Box>
            )}
          </Paper>

          {/* Input area */}
          <Box display="flex" gap={1} p={2} pt={0}>
            <TextField
              size="small"
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            />
            <Button
              variant="contained"
              onClick={handleAsk}
              disabled={loading}
              sx={{
                bgcolor: '#CD2028',
                '&:hover': { bgcolor: '#A32539' },
              }}
            >
              <SendIcon />
            </Button>
          </Box>

          {/* Start New Chat */}
          <Button
            variant="outlined"
            fullWidth
            size="small"
            onClick={handleNewChat}
            sx={{
              mb: 2,
              maxWidth: 200,
              mx: 'auto',
              color: '#029CD4',
              borderColor: '#029CD4',
              '&:hover': {
                borderColor: '#027BB0',
                color: '#027BB0',
              },
            }}
          >
            Start New Chat
          </Button>
        </Box>
      </Modal>
    </>
  );
}

/* Typing animation */
function TypingDots() {
  return (
    <span>
      <span className="dot">.</span>
      <span className="dot">.</span>
      <span className="dot">.</span>
      <style jsx>{`
        .dot {
          animation: blink 1.4s infinite;
          animation-delay: 0s;
          font-weight: bold;
          font-size: 1.6em;
          color: #CD2028; /* Wendy's red */
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes blink {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </span>
  );
}
