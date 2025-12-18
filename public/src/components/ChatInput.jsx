import React, { useState, useRef } from "react";
import styled from "styled-components";
import { BsPaperclip, BsEmojiSmileFill, BsSend } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ChatInput({ onSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  const handleMediaUpload = async (file) => {
    if (file.size > 500 * 1024 * 1024) {
      toast.error("File too large");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("media", file);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/messages/upload-media`,
        formData
      );

      setSelectedFile({
        url: response.data.mediaUrl,
        type: response.data.mediaType,
      });
      toast.success("Media ready!");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (msg.trim() || selectedFile) {
      onSendMsg({
        message: msg,
        mediaUrl: selectedFile?.url,
        mediaType: selectedFile?.type,
      });
      setMsg("");
      setSelectedFile(null);
    }
  };

  return (
    <Container>
      {selectedFile && (
        <PreviewBox>
          <span>{selectedFile.type === "video" ? "📹" : "📷"}</span>
          <button onClick={() => setSelectedFile(null)}>×</button>
        </PreviewBox>
      )}

      <InputWrapper>
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
        >
          <BsPaperclip />
        </IconButton>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(e) =>
            e.target.files?. && handleMediaUpload(e.target.files)
          }
          accept="image/*,video/*"
        />

        <MessageInput
          type="text"
          placeholder="Type message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />

        <IconButton onClick={() => setShowEmoji(!showEmoji)}>
          <BsEmojiSmileFill />
        </IconButton>

        {showEmoji && (
          <EmojiWrapper>
            <EmojiPicker onEmojiClick={(e, obj) => setMsg(msg + obj.emoji)} />
          </EmojiWrapper>
        )}

        <SendButton onClick={handleSend} disabled={!msg.trim() && !selectedFile}>
          <BsSend />
        </SendButton>
      </InputWrapper>
    </Container>
  );
}

const Container = styled.div`
  padding: 1rem;
  background: rgba(15, 23, 42, 0.5);
  border-top: 1px solid rgba(148, 163, 184, 0.1);
`;

const PreviewBox = styled.div`
  padding: 0.75rem;
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #667eea;

  button {
    background: none;
    border: none;
    color: #667eea;
    font-size: 1.5rem;
    cursor: pointer;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  position: relative;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;

  &:hover:not(:disabled) {
    color: #764ba2;
  }

  &:disabled {
    opacity: 0.5;
  }
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.75rem;
  color: #e2e8f0;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SendButton = styled.button`
  padding: 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  border-radius: 0.75rem;
  cursor: pointer;
  font-size: 1.1rem;

  &:disabled {
    opacity: 0.5;
  }
`;

const EmojiWrapper = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0;
  z-index: 1000;
  margin-bottom: 0.5rem;

  .emoji-picker-react {
    background: #0f172a !important;
    border: 1px solid rgba(148, 163, 184, 0.2) !important;
  }
`;
