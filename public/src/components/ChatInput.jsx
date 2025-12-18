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
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size too large (max 50MB)");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("media", file);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/messages/upload-media`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSelectedFile({
        url: response.data.mediaUrl,
        type: response.data.mediaType,
        name: file.name,
      });
      toast.success("Media uploaded");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!msg.trim() && !selectedFile) return;
    onSendMsg({
      message: msg,
      mediaUrl: selectedFile?.url || null,
      mediaType: selectedFile?.type || null,
    });
    setMsg("");
    setSelectedFile(null);
  };

  const handleEmojiClick = (emojiData) => {
    // emoji-picker-react v4: onEmojiClick gives (emojiData, event)
    setMsg((prev) => prev + (emojiData?.emoji || ""));
  };

  return (
    <Container>
      {selectedFile && (
        <SelectedMediaPreview>
          <PreviewLabel>
            {selectedFile.type === "video" ? "📹 Video attached" : "📷 Image attached"}
          </PreviewLabel>
          <RemoveButton onClick={() => setSelectedFile(null)}>×</RemoveButton>
        </SelectedMediaPreview>
      )}

      <InputWrapper>
        <IconButton
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          title="Attach media"
        >
          <BsPaperclip />
        </IconButton>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(e) => e.target.files?.[0] && handleMediaUpload(e.target.files[0])}
          accept="image/*,video/*"
        />

        <MessageInput
          type="text"
          placeholder="Type your message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <IconButton
          type="button"
          onClick={() => setShowEmoji(!showEmoji)}
          title="Emoji"
        >
          <BsEmojiSmileFill />
        </IconButton>

        {showEmoji && (
          <EmojiPickerWrapper>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </EmojiPickerWrapper>
        )}

        <SendButton
          type="button"
          onClick={handleSend}
          disabled={!msg.trim() && !selectedFile}
          title="Send message"
        >
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
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
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
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    color: #764ba2;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.75rem;
  color: #e2e8f0;
  font-size: 0.95rem;
  font-family: inherit;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    outline: none;
    background: rgba(30, 41, 59, 0.95);
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SelectedMediaPreview = styled.div`
  padding: 0.75rem;
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #667eea;
  font-size: 0.9rem;
`;

const PreviewLabel = styled.span``;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: #764ba2;
    transform: scale(1.1);
  }
`;

const EmojiPickerWrapper = styled.div`
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
