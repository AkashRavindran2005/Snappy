import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { BsThreeDotsVertical, BsSearch, BsCheck2All } from "react-icons/bs";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });
    setMessages(response.data);
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
            <span className="status">online</span>
          </div>
        </div>
        <div className="header-actions">
          <BsSearch />
          <BsThreeDotsVertical />
          <Logout />
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content">
                  <p>{message.message}</p>
                  <span className="time">
                    {new Date().toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })}
                    {message.fromSelf && <BsCheck2All className="check-icon" />}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 78% 12%;
  gap: 0;
  overflow: hidden;
  background-color: #0B141A;
  
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 12% 75% 13%;
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem 1.5rem;
    background-color: #202C33;
    border-bottom: 1px solid rgba(134, 150, 160, 0.15);

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 2.5rem;
          width: 2.5rem;
          border-radius: 50%;
          object-fit: cover;
        }
      }

      .username {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;

        h3 {
          color: #E9EDEF;
          font-size: 1.05rem;
          font-weight: 500;
          margin: 0;
        }

        .status {
          color: #8696A0;
          font-size: 0.8rem;
          font-weight: 400;
        }
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;

      svg {
        font-size: 1.2rem;
        color: #8696A0;
        cursor: pointer;
        transition: color 0.2s ease;

        &:hover {
          color: #E9EDEF;
        }
      }
    }
  }

  .chat-messages {
    padding: 1.5rem 8%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    overflow: auto;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIj48cGF0aCBkPSJNMCAwaDMwdjMwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGgxdjFIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=');
    
    &::-webkit-scrollbar {
      width: 0.4rem;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(134, 150, 160, 0.3);
      border-radius: 1rem;
    }

    .message {
      display: flex;
      align-items: flex-end;
      margin-bottom: 0.3rem;

      .content {
        max-width: 65%;
        overflow-wrap: break-word;
        padding: 0.5rem 0.8rem;
        font-size: 0.95rem;
        border-radius: 0.5rem;
        position: relative;
        box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);

        p {
          margin: 0;
          color: #E9EDEF;
          line-height: 1.4;
          padding-right: 4rem;
        }

        .time {
          position: absolute;
          bottom: 0.3rem;
          right: 0.6rem;
          font-size: 0.7rem;
          color: #8696A0;
          display: flex;
          align-items: center;
          gap: 0.25rem;

          .check-icon {
            font-size: 1rem;
            color: #53BDEB;
          }
        }

        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 80%;
        }
      }
    }

    .sended {
      justify-content: flex-end;

      .content {
        background-color: #005C4B;
        border-radius: 0.5rem 0.5rem 0 0.5rem;
      }
    }

    .recieved {
      justify-content: flex-start;

      .content {
        background-color: #202C33;
        border-radius: 0.5rem 0.5rem 0.5rem 0;
      }
    }
  }
`;
