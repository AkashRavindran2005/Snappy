import React, { useState, useRef } from "react";
import { BsEmojiSmile, BsImageFill, BsFileEarmarkPlay } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { HiOutlinePaperClip } from "react-icons/hi";
import { BsMicFill } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
    setShowAttachMenu(false);
  };

  const handleAttachMenu = () => {
    setShowAttachMenu(!showAttachMenu);
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview({ type: 'image', url: reader.result, name: file.name });
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview({ type: 'video', url: reader.result, name: file.name });
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview({ type: 'file', name: file.name });
      }
      
      setShowAttachMenu(false);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current.setAttribute('accept', 'image/*');
    fileInputRef.current.click();
    setShowAttachMenu(false);
  };

  const handleVideoClick = () => {
    fileInputRef.current.setAttribute('accept', 'video/*');
    fileInputRef.current.click();
    setShowAttachMenu(false);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0 || selectedFile) {
      // For now, we'll just send the text message
      // You'll need to update your backend to handle file uploads
      if (selectedFile) {
        const messageWithFile = `${msg} [File: ${selectedFile.name}]`;
        handleSendMsg(messageWithFile);
      } else {
        handleSendMsg(msg);
      }
      setMsg("");
      setSelectedFile(null);
      setFilePreview(null);
    }
  };

  return (
    <Container>
      {filePreview && (
        <FilePreviewContainer>
          <div className="preview-content">
            {filePreview.type === 'image' && (
              <img src={filePreview.url} alt="preview" />
            )}
            {filePreview.type === 'video' && (
              <video src={filePreview.url} controls />
            )}
            <div className="file-info">
              <span className="file-name">{filePreview.name}</span>
              <button onClick={handleRemoveFile} className="remove-btn">
                <MdClose />
              </button>
            </div>
          </div>
        </FilePreviewContainer>
      )}
      
      <div className="input-wrapper">
        <div className="button-container">
          <div className="emoji">
            <BsEmojiSmile onClick={handleEmojiPickerhideShow} />
            {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
          </div>
          <div className="attach">
            <HiOutlinePaperClip onClick={handleAttachMenu} />
            {showAttachMenu && (
              <div className="attach-menu">
                <div className="attach-option" onClick={handlePhotoClick}>
                  <BsImageFill />
                  <span>Photo</span>
                </div>
                <div className="attach-option" onClick={handleVideoClick}>
                  <BsFileEarmarkPlay />
                  <span>Video</span>
                </div>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
        <form className="input-container" onSubmit={(event) => sendChat(event)}>
          <input
            type="text"
            placeholder="Type a message"
            onChange={(e) => setMsg(e.target.value)}
            value={msg}
          />
          <button type="submit" className="send-btn">
            {msg.length > 0 || selectedFile ? <IoSend /> : <BsMicFill />}
          </button>
        </form>
      </div>
    </Container>
  );
}

const FilePreviewContainer = styled.div`
  background-color: #2A3942;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(134, 150, 160, 0.15);

  .preview-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: #202C33;
    padding: 0.8rem;
    border-radius: 0.5rem;

    img, video {
      max-width: 80px;
      max-height: 80px;
      border-radius: 0.3rem;
      object-fit: cover;
    }

    .file-info {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .file-name {
        color: #E9EDEF;
        font-size: 0.9rem;
      }

      .remove-btn {
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.3rem;
        border-radius: 50%;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        svg {
          font-size: 1.3rem;
          color: #8696A0;
        }
      }
    }
  }
`;

const Container = styled.div`
  background-color: #202C33;

  .input-wrapper {
    display: grid;
    align-items: center;
    grid-template-columns: 10% 90%;
    padding: 0.8rem 1.5rem;
    gap: 1rem;

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      padding: 0.8rem 1rem;
      gap: 0.5rem;
    }
  }

  .button-container {
    display: flex;
    align-items: center;
    color: #8696A0;
    gap: 1rem;

    .emoji, .attach {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      
      svg {
        font-size: 1.5rem;
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover {
          color: #E9EDEF;
        }
      }
    }

    .emoji-picker-react {
      position: absolute;
      bottom: 60px;
      left: 0;
      background-color: #202C33;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(134, 150, 160, 0.15);
      border-radius: 0.5rem;
      z-index: 10;

      .emoji-scroll-wrapper::-webkit-scrollbar {
        background-color: #2A3942;
        width: 5px;
        
        &-thumb {
          background-color: #8696A0;
          border-radius: 5px;
        }
      }

      .emoji-categories {
        button {
          filter: grayscale(1);
          
          &:hover {
            filter: grayscale(0);
          }
        }
      }

      .emoji-search {
        background-color: #2A3942;
        border-color: #8696A0;
        color: #E9EDEF;
      }

      .emoji-group:before {
        background-color: #202C33;
        color: #E9EDEF;
      }
    }

    .attach-menu {
      position: absolute;
      bottom: 60px;
      left: 0;
      background-color: #202C33;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(134, 150, 160, 0.15);
      border-radius: 0.5rem;
      padding: 0.5rem;
      z-index: 10;
      min-width: 150px;

      .attach-option {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.8rem 1rem;
        cursor: pointer;
        border-radius: 0.3rem;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: #2A3942;
        }

        svg {
          font-size: 1.3rem;
          color: #25D366;
        }

        span {
          color: #E9EDEF;
          font-size: 0.95rem;
        }
      }
    }
  }

  .input-container {
    width: 100%;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: #2A3942;

    input {
      width: 90%;
      height: 2.8rem;
      background-color: transparent;
      color: #E9EDEF;
      border: none;
      padding-left: 1rem;
      font-size: 0.95rem;

      &::placeholder {
        color: #8696A0;
      }

      &::selection {
        background-color: #005C4B;
      }

      &:focus {
        outline: none;
      }
    }

    .send-btn {
      padding: 0.5rem 1.2rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: rgba(37, 211, 102, 0.1);
      }

      svg {
        font-size: 1.5rem;
        color: #8696A0;
        transition: color 0.2s ease;
      }

      &:hover svg {
        color: #25D366;
      }

      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        
        svg {
          font-size: 1.2rem;
        }
      }
    }
  }
`;
