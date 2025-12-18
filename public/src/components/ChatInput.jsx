import React, { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { HiOutlinePaperClip } from "react-icons/hi";
import { BsMicFill } from "react-icons/bs";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmile onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div>
        <div className="attach">
          <HiOutlinePaperClip />
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="Type a message"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit" className="send-btn">
          {msg.length > 0 ? <IoSend /> : <BsMicFill />}
        </button>
      </form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 10% 90%;
  background-color: #202C33;
  padding: 0.8rem 1.5rem;
  gap: 1rem;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0.8rem 1rem;
    gap: 0.5rem;
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
