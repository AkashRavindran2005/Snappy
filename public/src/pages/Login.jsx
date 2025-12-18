import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

// helper to turn ArrayBuffer -> base64
function bufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

// generate RSA keypair, store private locally, send public to backend
async function generateAndStoreKeypair(userId) {
  // if keys already exist, skip
  const existingPriv = localStorage.getItem("e2ee_private_key");
  const existingPub = localStorage.getItem("e2ee_public_key");
  if (existingPriv && existingPub) return;

  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const publicKeySpki = await window.crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
  );
  const privateKeyPkcs8 = await window.crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey
  );

  const publicKeyBase64 = bufferToBase64(publicKeySpki);
  const privateKeyBase64 = bufferToBase64(privateKeyPkcs8);

  localStorage.setItem("e2ee_private_key", privateKeyBase64);
  localStorage.setItem("e2ee_public_key", publicKeyBase64);

  await fetch(`/api/auth/${userId}/public-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicKey: publicKeyBase64 }),
  });
}

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
  }, [navigate]);

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

        // generate keypair + upload public key for E2EE
        try {
          await generateAndStoreKeypair(data.user._id);
        } catch (err) {
          console.error("E2EE keypair generation failed", err);
        }

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
                <circle cx="25" cy="25" r="23" fill="#8B5CF6" />
                <path
                  d="M25 10c-8.284 0-15 6.716-15 15 0 2.61.67 5.065 1.845 7.2L10 40l8.035-1.82A14.943 14.943 0 0025 40c8.284 0 15-6.716 15-15s-6.716-15-15-15zm8.5 20.5l-2.5 2.5c-1 1-3 .5-5.5-1.5s-4-4-5-5.5-1.5-3.5-.5-4.5l2-2c.5-.5.5-1.5 0-3s-1.5-3-2-3.5-1.5-.5-2 0c-2 2-2 4.5 0 8s5 7 8.5 8.5 6.5.5 8.5-1.5c.5-.5.5-1.5 0-2s-2-1.5-3.5-2-2.5-.5-3 0z"
                  fill="white"
                />
              </svg>
            </div>
            <h1>SNAPPY</h1>
            <p>Sign in to continue</p>
          </Brand>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <button type="submit">Sign In</button>
            <span>
              Don&apos;t have an account? <Link to="/register">Sign Up</Link>
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
  background: #050816;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  background: #050b1b;
  border-radius: 1.2rem;
  padding: 3rem 4rem;
  min-width: 380px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.6);
  border: 1px solid #111827;

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
    background-color: #0f172a;
    padding: 0.9rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    color: #e5e7eb;
    font-size: 0.95rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #8b5cf6;
      background-color: #020617;
    }

    &::placeholder {
      color: #6b7280;
    }
  }

  button {
    margin-top: 0.4rem;
    background: linear-gradient(135deg, #8b5cf6, #6366f1);
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
      background: linear-gradient(135deg, #7c3aed, #4f46e5);
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.5);
      transform: translateY(-1px);
    }
  }

  span {
    margin-top: 0.4rem;
    font-size: 0.85rem;
    color: #9ca3af;
    text-align: center;

    a {
      color: #a855f7;
      font-weight: 600;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
        color: #c084fc;
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
    color: #e5e7eb;
    text-transform: uppercase;
    font-size: 1.6rem;
    letter-spacing: 0.15rem;
    margin: 0.3rem 0 0;
  }

  p {
    color: #9ca3af;
    font-size: 0.9rem;
    margin: 0;
  }
`;
