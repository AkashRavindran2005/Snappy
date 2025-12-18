import React, { useState, useRef } from "react";
import styled from "styled-components";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ChatInput({ handleSendMsg, onSendMsg }) {
  const sendFn = onSendMsg || ((d) => handleSendMsg && handleSendMsg(d));
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const toggleEmojiPicker = () => setShowEmojiPicker((prev) => !prev);

  const handleEmojiClick = (_e, emojiObject) => {
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

    sendFn({
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

      <div className="content">
        <div className="button-container">
          <div className="emoji">
            <BsEmojiSmileFill onClick={toggleEmojiPicker} />
            {showEmojiPicker && (
              <div className="emoji-picker-react-wrapper">
                <Picker onEmojiClick={handleEmojiClick} disableSearchBar disableSkinTonePicker />
              </div>
            )}
          </div>
        </div>

        <form className="input-container" onSubmit={sendChat}>
          <label
            className={`attach ${uploading ? "disabled" : ""}`}
            onClick={() => !uploading && fileRef.current?.click()}
          >
            📎
          </label>
          <input
            ref={fileRef}
            type="file"
            hidden
            accept="image/*,video/*"
            onChange={(e) => handleMediaUpload(e.target.files?.[0])}
          />

          <input
            type="text"
            placeholder="Type your message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button type="submit">
            <IoMdSend />
          </button>
        </form>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #080420;
  padding: 0 2rem 1rem 2rem;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem 1rem 1rem;
  }

  .content {
    display: grid;
    grid-template-columns: 5% 95%;
    align-items: center;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;

    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }

      .emoji-picker-react-wrapper {
        position: absolute;
        bottom: 150%;
        left: 0;
        z-index: 100;

        .emoji-picker-react {
          background-color: #080420;
          box-shadow: 0 5px 10px #9a86f3;
          border-color: #9a86f3;
        }
      }
    }
  }

  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: #ffffff34;
    padding: 0.3rem 1rem;

    .attach {
      cursor: pointer;
      font-size: 1.2rem;
      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    input[type="text"] {
      flex: 1;
      background-color: transparent;
      color: white;
      border: none;
      font-size: 1.1rem;
      &::selection {
        background-color: #9a86f3;
      }
      &::placeholder {
        color: #d1d5db;
      }
      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      cursor: pointer;

      svg {
        font-size: 1.3rem;
        color: white;
      }

      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
    }
  }
`;

const SelectedMediaBar = styled.div`
  width: 100%;
  margin-bottom: 0.4rem;
  padding: 0.4rem 0.8rem;
  background: rgba(129, 140, 248, 0.15);
  border-radius: 0.5rem;
  border: 1px solid rgba(129, 140, 248, 0.7);
  color: #e5e7eb;
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: #e5e7eb;
  font-size: 1.1rem;
  cursor: pointer;
`;
