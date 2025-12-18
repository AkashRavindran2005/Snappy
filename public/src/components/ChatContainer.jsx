import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { BsThreeDots } from "react-icons/bs";
import ChatInput from "./ChatInput";
import {
  sendMessageRoute,
  recieveMessageRoute,
} from "../utils/APIRoutes";
import toast from "react-hot-toast";

export default function ChatContainer({ currentChat, socket, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(recieveMessageRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      } catch (error) {
        toast.error("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };

    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat, currentUser._id]);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (data) => {
        setArrivalMessage({
          fromSelf: false,
          message: data.msg || "",
          mediaUrl: data.mediaUrl,
          mediaType: data.mediaType,
          timestamp: new Date(),
        });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

 const handleSendMsg = async (message) => {
  const mediaUrl = null;
  const mediaType = null;

  socket.current.emit("send-msg", {
    to: currentChat._id,
    from: currentUser._id,
    msg: message,
    mediaUrl,
    mediaType,
  });

  try {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message,
      mediaUrl,
      mediaType,
    });

    setMessages((prev) => [
      ...prev,
      {
        fromSelf: true,
        message,
        mediaUrl,
        mediaType,
        timestamp: new Date(),
      },
    ]);
  } catch (error) {
    toast.error("Failed to send message");
  }
};


  return (
    <Container>
      <Header>
        <UserSection>
          <UserAvatar
            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
            alt={currentChat.username}
          />
          <UserDetails>
            <UserName>{currentChat.username}</UserName>
            <UserStatus>Active now</UserStatus>
          </UserDetails>
        </UserSection>
        <BsThreeDots />
      </Header>

      <MessagesContainer>
        {isLoading ? (
          <LoadingMessage>Loading messages...</LoadingMessage>
        ) : messages.length === 0 ? (
          <EmptyState>
            <EmptyIcon>💬</EmptyIcon>
            <EmptyText>Start the conversation!</EmptyText>
          </EmptyState>
        ) : (
          messages.map((msg, idx) => (
            <Message key={idx} isSent={msg.fromSelf}>
              <MessageBubble isSent={msg.fromSelf}>
                {msg.mediaUrl && (
                  <>
                    {msg.mediaType === "video" ? (
                      <MediaVideo src={msg.mediaUrl} controls />
                    ) : (
                      <MediaImage src={msg.mediaUrl} alt="shared" />
                    )}
                  </>
                )}
                {msg.message && <MessageText>{msg.message}</MessageText>}
                <Timestamp>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Timestamp>
              </MessageBubble>
            </Message>
          ))
        )}
        <div ref={scrollRef} />
      </MessagesContainer>

      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #0f172a;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  background: rgba(15, 23, 42, 0.5);
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 2px solid rgba(102, 126, 234, 0.3);
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h3`
  margin: 0;
  color: #e2e8f0;
  font-size: 1rem;
  font-weight: 600;
`;

const UserStatus = styled.p`
  margin: 0.25rem 0 0 0;
  color: #10b981;
  font-size: 0.85rem;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #94a3b8;
  padding: 2rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  opacity: 0.5;
`;

const EmptyText = styled.p`
  color: #64748b;
  margin: 0;
`;

const Message = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isSent ? "flex-end" : "flex-start")};
`;

const MessageBubble = styled.div`
  max-width: 65%;
  background: ${(props) =>
    props.isSent
      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      : "rgba(30, 41, 59, 0.8)"};
  color: ${(props) => (props.isSent ? "#fff" : "#e2e8f0")};
  padding: 0.75rem 1rem;
  border-radius: ${(props) =>
    props.isSent ? "1rem 1rem 0.25rem 1rem" : "1rem 1rem 1rem 0.25rem"};
  border: 1px solid ${(props) =>
    props.isSent ? "rgba(255, 255, 255, 0.1)" : "rgba(148, 163, 184, 0.2)"};

  @media (max-width: 768px) {
    max-width: 85%;
  }
`;

const MediaImage = styled.img`
  width: 100%;
  max-height: 300px;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
`;

const MediaVideo = styled.video`
  width: 100%;
  max-height: 300px;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
`;

const MessageText = styled.p`
  margin: 0;
  word-break: break-word;
`;

const Timestamp = styled.span`
  display: block;
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.25rem;
  text-align: right;
`;
