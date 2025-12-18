import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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
  }, [navigate]);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error("Password and confirm password should be same.", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
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
      <Outer>
        <Card>
          <Brand>
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
            <p>Create your account</p>
          </Brand>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={handleChange}
            />
            <button type="submit">Create Account</button>
            <span>
              Already have an account? <Link to="/login">Sign In</Link>
            </span>
          </form>
        </Card>
      </Outer>
      <ToastContainer />
    </>
  );
}

const Outer = styled.div`
  height: 100vh;
  width: 100vw;
  background: #0b141a;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  background: #111b21;
  border-radius: 1.2rem;
  padding: 3rem 4rem;
  min-width: 420px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.45);
  border: 1px solid #202c33;

  @media (max-width: 720px) {
    min-width: 90vw;
    padding: 2.2rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.3rem;
  }

  input {
    background-color: #202c33;
    padding: 0.9rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    color: #e9edef;
    font-size: 0.95rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #25d366;
      background-color: #111b21;
    }

    &::placeholder {
      color: #8696a0;
    }
  }

  button {
    margin-top: 0.4rem;
    background-color: #25d366;
    color: #ffffff;
    padding: 0.9rem 1.2rem;
    border-radius: 999px;
    border: none;
    font-weight: 600;
    font-size: 0.95rem;
    letter-spacing: 0.05rem;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s ease;

    &:hover {
      background-color: #20bd5a;
      box-shadow: 0 4px 16px rgba(37, 211, 102, 0.35);
      transform: translateY(-1px);
    }
  }

  span {
    margin-top: 0.4rem;
    font-size: 0.85rem;
    color: #8696a0;
    text-align: center;

    a {
      color: #25d366;
      font-weight: 600;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
        color: #20bd5a;
      }
    }
  }
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1.8rem;

  h1 {
    color: #e9edef;
    text-transform: uppercase;
    font-size: 1.6rem;
    letter-spacing: 0.15rem;
    margin: 0.3rem 0 0;
  }

  p {
    color: #8696a0;
    font-size: 0.9rem;
    margin: 0;
  }
`;
