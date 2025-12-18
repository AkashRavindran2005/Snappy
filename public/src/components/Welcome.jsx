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
        <div className="icon-container">
          <svg viewBox="0 0 200 200" className="chat-icon">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#25D366", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#128C7E", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              d="M100 20 C145 20 180 50 180 90 C180 130 145 160 100 160 L40 160 L50 180 L40 160 C30 160 20 150 20 90 C20 50 55 20 100 20 Z"
              fill="url(#gradient)"
              opacity="0.9"
            />
            <line x1="50" y1="70" x2="150" y2="70" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <line x1="50" y1="90" x2="130" y2="90" stroke="white" strokeWidth="6" strokeLinecap="round" />
            <line x1="50" y1="110" x2="140" y2="110" stroke="white" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>

        <div className="text-content">
          <h1>
            <span className="wave">👋</span> Welcome{userName && `, ${userName}`}!
          </h1>
          <p className="subtitle">Select a contact on the left to start messaging.</p>
        </div>

        <div className="features">
          <div className="feature">
            <div className="feature-icon">
              <BsShieldLock />
            </div>
            <span>End-to-end encrypted</span>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <BsLightning />
            </div>
            <span>Real-time messaging</span>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <BsChatDots />
            </div>
            <span>Stay connected</span>
          </div>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: #0b141a;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #e9edef;
  padding: 2rem;

  .welcome-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 640px;
    animation: fadeIn 0.6s ease-in;

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .icon-container {
      margin-bottom: 2.2rem;
      animation: float 3s ease-in-out infinite;

      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      .chat-icon {
        width: 180px;
        height: 180px;
        filter: drop-shadow(0 10px 30px rgba(37, 211, 102, 0.3));

        @media screen and (max-width: 720px) {
          width: 140px;
          height: 140px;
        }
      }
    }

    .text-content {
      margin-bottom: 2.5rem;

      h1 {
        font-size: 2.1rem;
        font-weight: 300;
        margin-bottom: 0.7rem;
        color: #e9edef;
        line-height: 1.3;

        .wave {
          display: inline-block;
          animation: wave 2s ease-in-out infinite;
        }

        @keyframes wave {
          0%, 100% {
            transform: rotate(0deg);
          }
          10%, 30% {
            transform: rotate(14deg);
          }
          20%, 40% {
            transform: rotate(-8deg);
          }
          50% {
            transform: rotate(14deg);
          }
          60% {
            transform: rotate(0deg);
          }
        }

        @media screen and (max-width: 720px) {
          font-size: 1.6rem;
        }
      }

      .subtitle {
        font-size: 1rem;
        color: #8696a0;
        font-weight: 300;
      }
    }

    .features {
      display: flex;
      gap: 2.5rem;
      flex-wrap: wrap;
      justify-content: center;

      @media screen and (max-width: 720px) {
        gap: 1.8rem;
      }

      .feature {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.7rem;
        color: #8696a0;
        font-size: 0.9rem;
        transition: all 0.3s ease;

        &:hover {
          color: #e9edef;
          transform: translateY(-4px);

          .feature-icon {
            background-color: rgba(37, 211, 102, 0.16);
            color: #25d366;
          }
        }

        .feature-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background-color: #202c33;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;

          svg {
            font-size: 1.7rem;
            color: #25d366;
          }
        }
      }
    }
  }
`;
