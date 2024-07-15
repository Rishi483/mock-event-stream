import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import Link from "next/link";
import HomeIcon from '@mui/icons-material/Home';
import CallMadeIcon from '@mui/icons-material/CallMade';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  text: string;
  user: boolean;
}

const Home: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorTimeout, setErrorTimeout] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async (useEventSource: boolean, error: boolean) => {
    if (!input) return;

    setLoading(true);
    setMessages((prev) => [...prev, { text: "", user: false }]);

    let url = `/query/${encodeURIComponent(input)}`;
    if (error && errorTimeout) {
      url += `?errorTimeout=${errorTimeout}`;
    }
    if (useEventSource) {
      const eventSource = new EventSource(url);

      eventSource.onmessage = (event) => {
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastMessageIndex = updatedMessages.length - 1;
          const lastMessage = updatedMessages[lastMessageIndex];

          const newLastMessage = {
            ...lastMessage,
            text: lastMessage.text + event.data,
          };
          updatedMessages[lastMessageIndex] = newLastMessage;

          return updatedMessages;
        });
      };

      eventSource.onerror = () => {
        setError("An error occurred while fetching data.");
        eventSource.close();
        setMessages((prev) => [...prev.slice(0, -1)]);
        setLoading(false);
      };

      eventSource.addEventListener("end", () => {
        eventSource.close();
        setLoading(false);
      });

      setInput("");
    } else {
      try {
        const response = await fetch(url, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        setMessages((prev) => [
          ...prev.slice(0, -1),
          { text: data.text, user: false },
        ]);
      } catch (error: any) {
        setMessages((prev) => [...prev.slice(0, -1)]);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
        setInput("");
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleSetErrorTimeout = () => {
    if (!errorTimeout) return;
    setLoading(true);

    handleSend(true, true);

    setInput("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      style={{ backgroundColor: "#EFF0F1" }}
    >
      <AppBar position="sticky" style={{ backgroundColor: "#fff", borderBottom: "1px solid #F8F8FA" }} elevation={0}>
        <Toolbar>
          <Typography sx={{ flexGrow: 1, fontWeight: "500", fontSize: "20px", display: "flex", alignItems: "center", gap: "4px" }}>
            <Link style={{ display: "flex", alignItems: "center", textDecoration: 'none', color: "black" }} href="/"><HomeIcon /></Link> {"> Mock Event Stream"}
          </Typography>
          <Button>
            <Link href="/MockEventStream/editor" style={{ fontWeight: "500", fontSize: "14px", textDecoration: 'none', color: "black", display: "flex", alignItems: "center" }}>
              Open Editor
              <CallMadeIcon />
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        <List sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: "auto" }}>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              style={{
                display: "flex",
                justifyContent: message.user ? "flex-end" : "flex-start",
              }}
            >
              <Paper
                style={{
                  padding: "10px",
                  backgroundColor: message.user ? "#fff" : "#fff",
                  color: "black",
                  maxWidth: "80%",
                  wordWrap: "break-word",
                  borderRadius: "10px",
                }}
              >
                <Typography>
                  {message.text}
                  {loading && index === messages.length - 1 && !message.user && (
                    <CircularProgress size={20} style={{ marginLeft: "10px" }} />
                  )}
                </Typography>
              </Paper>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>
      <Box
        position="sticky"
        bottom={0}
        left={0}
        right={0}
        p={2}
        style={{ backgroundColor: "#EFF0F1" }}
      >
        <Paper
          elevation={1}
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            borderRadius: "10px",
            backgroundColor: "#fff"
          }}
        >
          <TextField
            label="Query"
            type="text"
            fullWidth
            value={input}
            onChange={handleInputChange}
            sx={{ mr: 2 }}
          />
          <Button
            variant="outlined"
            onClick={() => handleSend(true, false)}
            disabled={loading}
            sx={{ mr: 2, height: "55px", width: "120px" }}
          >
            {loading ? "Fetching" : <div style={{ fontSize: "10px" }}>{<SendIcon />} (EventSource)</div>}
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleSend(false, false)}
            disabled={loading}
            sx={{ mr: 2, height: "55px", width: "120px" }}
          >
            {loading ? "Fetching" : <div style={{ fontSize: "10px" }}>{<SendIcon />} (Fetch)</div>}
          </Button>
          <TextField
            label="Timeout (ms)"
            type="number"
            value={errorTimeout}
            onChange={(e) => setErrorTimeout(e.target.value)}
            InputProps={{ inputProps: { min: 0 } }}
            sx={{ width: "140px", mr: 2, height: "55px" }}
          />
          <Button
            variant="outlined"
            onClick={handleSetErrorTimeout}
            disabled={loading}
          >
            {loading ? "Triggering Error..." : "Trigger Error"}
          </Button>
        </Paper>
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
