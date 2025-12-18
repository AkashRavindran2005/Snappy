import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";

export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    const checkUser = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      }
    };
    checkUser();
  }, [navigate]);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      const styles = ['avataaars', 'bottts', 'personas', 'initials'];
      
      for (let i = 0; i < 4; i++) {
        try {
          const seed = Math.random().toString(36).substring(7);
          const style = styles[i];
          const avatarUrl = `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
          
          const image = await axios.get(avatarUrl);
          const base64 = btoa(unescape(encodeURIComponent(image.data)));
          data.push(base64);
        } catch (error) {
          console.error("Error fetching avatar:", error);
          // Fallback to a simple colored circle if fetch fails
          const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="50" fill="#${Math.floor(Math.random()*16777215).toString(16)}"/></svg>`;
          const base64 = btoa(fallbackSvg);
          data.push(base64);
        }
      }
      setAvatars(data);
      setIsLoading(false);
    };
    fetchAvatars();
  }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <div className="loader-container">
            <img src={loader} alt="loader" className="loader" />
            <p>Loading avatars...</p>
          </div>
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Choose Your Profile Picture</h1>
            <p>Select an avatar to represent you</p>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                  key={index}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt={`avatar-${index}`}
                    onClick={() => setSelectedAvatar(index)}
                    onError={(e) => {
                      e.target.src = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iIzI1RDM2NiIvPjwvc3ZnPg==`;
                    }}
                  />
                </div>
              );
            })}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Continue
          </button>
          <button onClick={() => window.location.reload()} className="refresh-btn">
            Refresh Avatars
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  background: linear-gradient(135deg, #0B141A 0%, #111B21 100%);
  height: 100vh;
  width: 100vw;
  padding: 2rem;

  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    .loader {
      max-width: 100px;
    }

    p {
      color: #8696A0;
      font-size: 1rem;
    }
  }

  .title-container {
    text-align: center;

    h1 {
      color: #E9EDEF;
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;

      @media screen and (max-width: 720px) {
        font-size: 1.5rem;
      }
    }

    p {
      color: #8696A0;
      font-size: 1rem;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 600px;

    @media screen and (max-width: 720px) {
      gap: 1rem;
    }

    .avatar {
      border: 4px solid transparent;
      padding: 0.4rem;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s ease;
      cursor: pointer;
      background-color: #202C33;

      img {
        height: 6rem;
        width: 6rem;
        border-radius: 50%;
        transition: all 0.3s ease;
        object-fit: cover;

        @media screen and (max-width: 720px) {
          height: 4.5rem;
          width: 4.5rem;
        }
      }

      &:hover {
        border: 4px solid #25D366;
        transform: scale(1.05);
      }
    }

    .selected {
      border: 4px solid #25D366;
      box-shadow: 0 0 20px rgba(37, 211, 102, 0.4);
      background-color: #2A3942;
    }
  }

  .submit-btn {
    background-color: #25D366;
    color: white;
    padding: 1rem 3rem;
    border: none;
    font-weight: 600;
    cursor: pointer;
    border-radius: 0.5rem;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05rem;
    transition: all 0.3s ease;

    &:hover {
      background-color: #20BD5A;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
    }

    @media screen and (max-width: 720px) {
      padding: 0.8rem 2rem;
      font-size: 0.9rem;
    }
  }

  .refresh-btn {
    background-color: transparent;
    color: #8696A0;
    padding: 0.8rem 2rem;
    border: 2px solid #8696A0;
    font-weight: 600;
    cursor: pointer;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05rem;
    transition: all 0.3s ease;

    &:hover {
      background-color: #2A3942;
      color: #E9EDEF;
      border-color: #E9EDEF;
    }

    @media screen and (max-width: 720px) {
      padding: 0.6rem 1.5rem;
      font-size: 0.8rem;
    }
  }
`;
