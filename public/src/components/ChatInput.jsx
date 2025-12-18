import React, { useState } from "react";
import styled from "styled-components";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ChatInput({ onSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (_event, emojiObject) => {
    setMsg((prev) => prev + (emojiObject?.emoji || ""));
  };

  const handleMediaUpload = async (file) => {
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Max 50MB");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("media", file);
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/messages/upload-media`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSelectedFile({
        url: data.mediaUrl,
        type: data.mediaType,
        name: file.name,
      });
      toast.success("Media uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (!msg.trim() && !selectedFile) return;

    onSendMsg({
      message: msg,
      mediaUrl: selectedFile?.url || null,
      mediaType: selectedFile?.type || null,
    });

    setMsg("");
    setSelectedFile(null);
    setShowEmojiPicker(false);
  };

  return (
    <Container>
      {selectedFile && (
        <SelectedMediaBar>
          <span>
            {selectedFile.type === "video" ? "📹 Video attached" : "📷 Image attached"}
          </span>
          <RemoveBtn onClick={() => setSelectedFile(null)}>×</RemoveBtn>
        </SelectedMediaBar>
      )}

      <Form onSubmit={sendChat}>
        <ButtonContainer>
          <EmojiWrapper>
            <BsEmojiSmileFill onClick={toggleEmojiPicker} />
            {showEmojiPicker && (
              <EmojiPickerWrapper>
                <Picker onEmojiClick={handleEmojiClick} disableSearchBar={true} />
              </EmojiPickerWrapper>
            )}
          </EmojiWrapper>
        </ButtonContainer>

        <InputContainer>
          <input
            type="file"
            id="chat-file-input"
            hidden
            accept="image/*,video/*"
            onChange={(e) => handleMediaUpload(e.target.files?.[0])}
          />
          <AttachLabel htmlFor="chat-file-input" disabled={uploading}>
            📎
          </AttachLabel>

          <input
            type="text"
            placeholder="Type your message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button type="submit">
            <IoMdSend />
          </button>
        </InputContainer>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 100%;
  background-color: #020617;
  padding: 0.75rem 1.5rem;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 5% 95%;
  align-items: center;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  color: white;
  gap: 1rem;
`;

const EmojiWrapper = styled.div`
  position: relative;
  svg {
    font-size: 1.5rem;
    color: #facc15;
    cursor: pointer;
  }
`;

const EmojiPickerWrapper = styled.div`
  position: absolute;
  bottom: 150%;
  left: 0;
  z-index: 100;
  .emoji-picker-react {
    background-color: #020617;
    box-shadow: 0 5px 15px rgba(15, 23, 42, 0.8);
    border-color: #4f46e5;
  }
`;

const InputContainer = styled.div`
  width: 100%;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #020617;
  border: 1px solid #1f2937;
  padding: 0.4rem 0.8rem;

  input[type="text"] {
    flex: 1;
    background-color: transparent;
    border: none;
    color: #e5e7eb;
    font-size: 0.95rem;
    padding-left: 0.2rem;

    &::placeholder {
      color: #6b7280;
    }

    &:focus {
      outline: none;
    }
  }

  button {
    padding: 0.4rem 0.9rem;
    border-radius: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #4f46e5;
    border: none;
    cursor: pointer;

    svg {
      font-size: 1.2rem;
      color: white;
    }
  }
`;

const AttachLabel = styled.label`
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  font-size: 1.1rem;
`;

const SelectedMediaBar = styled.div`
  grid-column: 1 / -1;
  margin-bottom: 0.4rem;
  padding: 0.4rem 0.75rem;
  background: rgba(37, 99, 235, 0.25);
  border-radius: 0.5rem;
  border: 1px solid rgba(59, 130, 246, 0.7);
  color: #e5e7eb;
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: #e5e7eb;
  font-size: 1.2rem;
  cursor: pointer;
`;
