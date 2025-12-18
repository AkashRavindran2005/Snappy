import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BsShieldLock, BsLightning, BsChatDots } from "react-icons/bs";

export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    try {
      const userString = localStorage.getItem(
        process.env.REACT_APP_LOCALHOST_KEY
      );
      if (userString) {
        const user = JSON.parse(userString);
        setUserName(user?.username || "");
      } else {
        setUserName("");
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUserName("");
    }
  }, []);

  return (
    <Container>
      <div className="welcome-content">
        <div className="icon">
          <svg viewBox="0 0 303 172" width="303" height="172">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#005C4B", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#25D366", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              fill="url(#gradient)"
              d="M96.5 27.5C96.5 42.136 84.636 54 70 54S43.5 42.136 43.5 27.5 55.364 1 70 1s26.5 11.864 26.5 26.5zM0 105c0-8.284 6.716-15 15-15h110c8.284 0 15 6.716 15 15v50c0 8.284-6.716 15-15 15H15c-8.284 0-15-6.716-15-15v-50z"
            />
            <circle cx="240" cy="30" r="25" fill="url(#gradient)" opacity="0.8" />
            <circle cx="270" cy="70" r="15" fill="url(#gradient)" opacity="0.6" />
            <rect x="160" y="95" width="130" height="70" rx="10" fill="url(#gradient)" opacity="0.7" />
          </svg>
        </div>
        <h1>Welcome{userName && `, ${userName}`}!</h1>
        <p>Select a contact to start messaging</p>
        <div className="features">
          <div className="feature">
            <BsShieldLock className="feature-icon" />
            <span>End-to-end encrypted</span>
          </div>
          <div className="feature">
            <BsLightning className="feature-icon" />
            <span>Real-time messaging</span>
          </div>
          <div className="feature">
            <BsChatDots className="feature-icon" />
            <span>Stay connected</span>
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #E9EDEF;
  flex-direction: column;
  background-color: #0B141A;
  height: 100%;
  padding: 2rem;

  .welcome-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 500px;

    .icon {
      margin-bottom: 2rem;
      opacity: 0.9;

      svg {
        width: 250px;
        height: auto;

        @media screen and (max-width: 720px) {
          width: 180px;
        }
      }
    }

    h1 {
      font-size: 2rem;
      font-weight: 400;
      margin-bottom: 0.8rem;
      color: #E9EDEF;

      @media screen and (max-width: 720px) {
        font-size: 1.5rem;
      }
    }

    p {
      font-size: 1rem;
      color: #8696A0;
      margin-bottom: 3rem;
      font-weight: 300;
    }

    .features {
      display: flex;
      gap: 3rem;
      margin-top: 1rem;

      @media screen and (max-width: 720px) {
        flex-direction: column;
        gap: 1.5rem;
      }

      .feature {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.8rem;
        color: #8696A0;
        font-size: 0.85rem;

        .feature-icon {
          font-size: 2.5rem;
          color: #25D366;
          margin-bottom: 0.3rem;
        }
      }
    }
  }
`;
