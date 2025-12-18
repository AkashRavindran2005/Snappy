import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { username, password } = values;
    if (username === "") {
      toast.error("Username is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <div className="logo">
              <svg viewBox="0 0 50 50" width="60" height="60">
                <circle cx="25" cy="25" r="23" fill="#25D366" />
                <path
                  d="M25 10c-8.284 0-15 6.716-15 15 0 2.61.67 5.065 1.845 7.2L10 40l8.035-1.82A14.943 14.943 0 0025 40c8.284 0 15-6.716 15-15s-6.716-15-15-15zm8.5 20.5l-2.5 2.5c-1 1-3 .5-5.5-1.5s-4-4-5-5.5-1.5-3.5-.5-4.5l2-2c.5-.5.5-1.5 0-3s-1.5-3-2-3.5-1.5-.5-2 0c-2 2-2 4.5 0 8s5 7 8.5 8.5 6.5.5 8.5-1.5c.5-.5.5-1.5 0-2s-2-1.5-3.5-2-2.5-.5-3 0z"
                  fill="white"
                />
              </svg>
            </div>
            <h1>SNAPPY</h1>
            <p>Sign in to continue</p>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Sign In</button>
          <span>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background: linear-gradient(135deg, #0B141A 0%, #111B21 100%);

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 2rem;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    h1 {
      color: #E9EDEF;
      text-transform: uppercase;
      font-size: 1.8rem;
      font-weight: 600;
      letter-spacing: 0.1rem;
      margin: 0.5rem 0 0 0;
    }

    p {
      color: #8696A0;
      font-size: 0.95rem;
      margin: 0.3rem 0 0 0;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    background-color: #202C33;
    border-radius: 1rem;
    padding: 3rem 4rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    min-width: 400px;

    @media screen and (max-width: 720px) {
      min-width: 90vw;
      padding: 2rem;
    }

    input {
      background-color: #2A3942;
      padding: 1rem;
      border: 2px solid transparent;
      border-radius: 0.5rem;
      color: #E9EDEF;
      width: 100%;
      font-size: 1rem;
      transition: all 0.3s ease;

      &:focus {
        border: 2px solid #25D366;
        outline: none;
        background-color: #111B21;
      }

      &::placeholder {
        color: #8696A0;
      }
    }

    button {
      background-color: #25D366;
      color: white;
      padding: 1rem 2rem;
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
    }

    span {
      color: #8696A0;
      text-align: center;
      font-size: 0.9rem;

      a {
        color: #25D366;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.2s ease;

        &:hover {
          color: #20BD5A;
          text-decoration: underline;
        }
      }
    }
  }
`;
