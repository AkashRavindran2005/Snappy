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

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/messages/upload-media`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSelectedFile({
        url: data.mediaUrl,
        type: data.mediaType,
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
    setShowEmoji(false);
  };

  const handleEmojiClick = (emojiData, event) => {
    setMsg((prev) => prev + (emojiData?.emoji || ""));
  };

  return (
    <Container>
      {selectedFile && (
        <SelectedMediaPreview>
          <PreviewText>
            {selectedFile.type === "video" ? "📹 Video attached" : "📷 Image attached"}
          </PreviewText>
          <RemoveButton onClick={() => setSelectedFile(null)}>×</RemoveButton>
        </SelectedMediaPreview>
      )}

      <InputRow>
        <IconButton
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          title="Attach media"
        >
          <BsPaperclip />
        </IconButton>

        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          onChange={(e) => e.target.files?.[0] && handleMediaUpload(e.target.files[0])}
          accept="image/*,video/*"
        />

        <InputWrapper>
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

          {showEmoji && (
            <EmojiPickerWrapper>
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme="dark"
                searchDisabled
                skinTonesDisabled
              />
            </EmojiPickerWrapper>
          )}
        </InputWrapper>

        <IconButton
          type="button"
          onClick={() => setShowEmoji((v) => !v)}
          title="Emoji"
        >
          <BsEmojiSmileFill />
        </IconButton>

        <SendButton
          type="button"
          onClick={handleSend}
          disabled={!msg.trim() && !selectedFile}
          title="Send message"
        >
          <BsSend />
        </SendButton>
      </InputRow>
    </Container>
  );
}

const Container = styled.div`
  padding: 0.9rem 1.25rem;
  background: rgba(15, 23, 42, 0.95);
  border-top: 1px solid rgba(15, 23, 42, 1);
`;

const InputRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
  position: relative;
`;

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const MessageInput = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(51, 65, 85, 0.9);
  border-radius: 0.75rem;
  color: #e2e8f0;
  font-size: 0.94rem;
  font-family: inherit;

  &::placeholder {
    color: #64748b;
  }

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.6);
  }
`;

const IconButton = styled.button`
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(51, 65, 85, 0.9);
  color: #c7d2fe;
  font-size: 1.15rem;
  cursor: pointer;
  padding: 0.6rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    background: rgba(51, 65, 85, 1);
    color: #e5e7eb;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  color: white;
  font-size: 1.1rem;
  padding: 0.7rem 0.85rem;
  border-radius: 999px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    box-shadow: 0 8px 18px rgba(79, 70, 229, 0.45);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const SelectedMediaPreview = styled.div`
  margin-bottom: 0.55rem;
  padding: 0.55rem 0.8rem;
  background: rgba(30, 64, 175, 0.25);
  border-radius: 0.55rem;
  border: 1px solid rgba(129, 140, 248, 0.7);
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #e0e7ff;
  font-size: 0.86rem;
`;

const PreviewText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RemoveButton = styled.button`
  border: none;
  background: transparent;
  color: #e0e7ff;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0 0 0 0.35rem;

  &:hover {
    color: #fecaca;
  }
`;

const EmojiPickerWrapper = styled.div`
  position: absolute;
  bottom: 110%;
  right: 0;
  z-index: 50;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.8);
  border-radius: 0.75rem;
  overflow: hidden;

  .EmojiPickerReact {
    --epr-bg-color: #020617;
    --epr-category-label-bg-color: #020617;
    --epr-category-navigation-color: #e5e7eb;
    --epr-search-input-bg-color: #020617;
    --epr-search-input-text-color: #e5e7eb;
    --epr-hover-bg-color: #111827;
    --epr-focus-bg-color: #1e293b;
    --epr-skin-tone-picker-menu-bg-color: #020617;
    border: 1px solid rgba(31, 41, 55, 0.9);
  }
`;
