import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BsCircleFill } from "react-icons/bs";

export default function Contacts({ contacts, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      setCurrentUserName(data.username);
      setCurrentUserImage(data.avatarImage);
    };
    fetchUserData();
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <div className="brand">
            <h2>Messages</h2>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt=""
                    />
                    <BsCircleFill className="online-indicator" />
                  </div>
                  <div className="contact-info">
                    <div className="username">
                      <h3>{contact.username}</h3>
                      <span className="time">
                        {new Date().toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </span>
                    </div>
                    <p className="last-message">Tap to view messages</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #111B21;
  border-right: 1px solid rgba(134, 150, 160, 0.15);

  .brand {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 1.5rem;
    background-color: #202C33;
    border-bottom: 1px solid rgba(134, 150, 160, 0.15);

    h2 {
      color: #E9EDEF;
      font-weight: 600;
      font-size: 1.3rem;
      margin: 0;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0;
    
    &::-webkit-scrollbar {
      width: 0.3rem;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(134, 150, 160, 0.3);
      border-radius: 1rem;
    }

    .contact {
      background-color: transparent;
      min-height: 4.5rem;
      cursor: pointer;
      width: 100%;
      padding: 0.8rem 1.5rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: background-color 0.2s ease;
      border-bottom: 1px solid rgba(134, 150, 160, 0.1);
      position: relative;

      &:hover {
        background-color: rgba(32, 44, 51, 0.5);
      }

      .avatar {
        position: relative;
        
        img {
          height: 3rem;
          width: 3rem;
          border-radius: 50%;
          object-fit: cover;
        }

        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          font-size: 0.75rem;
          color: #25D366;
          background-color: #111B21;
          border-radius: 50%;
          padding: 1px;
        }
      }

      .contact-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        overflow: hidden;

        .username {
          display: flex;
          justify-content: space-between;
          align-items: center;

          h3 {
            color: #E9EDEF;
            font-size: 1rem;
            font-weight: 500;
            margin: 0;
          }

          .time {
            color: #8696A0;
            font-size: 0.75rem;
          }
        }

        .last-message {
          color: #8696A0;
          font-size: 0.85rem;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .selected {
      background-color: #2A3942;

      &:hover {
        background-color: #2A3942;
      }
    }
  }

  .current-user {
    background-color: #202C33;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    padding: 0.8rem 1.5rem;
    border-top: 1px solid rgba(134, 150, 160, 0.15);

    .avatar {
      img {
        height: 2.5rem;
        width: 2.5rem;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .username {
      h2 {
        color: #E9EDEF;
        font-size: 1rem;
        font-weight: 500;
        margin: 0;
      }
    }

    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      
      .username {
        h2 {
          font-size: 0.9rem;
        }
      }
    }
  }
`;
