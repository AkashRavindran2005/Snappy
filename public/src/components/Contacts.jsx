import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BsSearch } from "react-icons/bs";
import { BiLogOut, BiUserPlus } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Contacts({ contacts, changeChat, currentUser }) {
  const navigate = useNavigate();
  const [currentSelected, setCurrentSelected] = useState(undefined);

  const [friends, setFriends] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addUsername, setAddUsername] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  const apiBase = process.env.REACT_APP_API_URL;

  // Load friends and requests
  useEffect(() => {
    if (!currentUser) return;

    const fetchAll = async () => {
      try {
        const [friendsRes, reqRes] = await Promise.all([
          axios.get(`${apiBase}/api/friends/list/${currentUser._id}`),
          axios.get(`${apiBase}/api/friends/requests/${currentUser._id}`),
        ]);
        setFriends(friendsRes.data || []);
        setFilteredContacts(friendsRes.data || []);
        setIncoming(reqRes.data?.incoming || []);
        setOutgoing(reqRes.data?.outgoing || []);
      } catch (err) {
        console.error("Error fetching friends/requests:", err);
      }
    };

    fetchAll();
  }, [currentUser, apiBase]);

  // Filter friends by search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredContacts(friends);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredContacts(
        friends.filter((contact) =>
          contact.username.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, friends]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const handleLogout = () => {
    localStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY);
    navigate("/login");
  };

  const refreshFriendsAndRequests = async () => {
    if (!currentUser) return;
    try {
      const [friendsRes, reqRes] = await Promise.all([
        axios.get(`${apiBase}/api/friends/list/${currentUser._id}`),
        axios.get(`${apiBase}/api/friends/requests/${currentUser._id}`),
      ]);
      setFriends(friendsRes.data || []);
      setFilteredContacts(friendsRes.data || []);
      setIncoming(reqRes.data?.incoming || []);
      setOutgoing(reqRes.data?.outgoing || []);
    } catch (err) {
      console.error("Refresh error:", err);
    }
  };

  // Add friend by username
  const handleSendRequest = async () => {
    if (!addUsername.trim() || !currentUser) return;
    setAddLoading(true);
    setAddError("");
    try {
      // lookup user by username
      const { data: user } = await axios.get(
        `${apiBase}/api/auth/user-by-username`,
        { params: { username: addUsername.trim() } }
      );
      if (!user || !user._id) {
        setAddError("User not found");
        setAddLoading(false);
        return;
      }
      if (user._id === currentUser._id) {
        setAddError("You cannot add yourself");
        setAddLoading(false);
        return;
      }

      await axios.post(`${apiBase}/api/friends/request`, {
        from: currentUser._id,
        to: user._id,
      });

      setAddUsername("");
      setShowAddModal(false);
      await refreshFriendsAndRequests();
    } catch (err) {
      console.error("Send request error:", err);
      setAddError(
        err.response?.data?.error || "Could not send friend request"
      );
    } finally {
      setAddLoading(false);
    }
  };

  const handleAccept = async (fromId) => {
    if (!currentUser) return;
    try {
      await axios.post(`${apiBase}/api/friends/accept`, {
        userId: currentUser._id,
        from: fromId,
      });
      await refreshFriendsAndRequests();
    } catch (err) {
      console.error("Accept error:", err);
    }
  };

  const handleDecline = async (otherId) => {
    if (!currentUser) return;
    try {
      await axios.post(`${apiBase}/api/friends/decline`, {
        userId: currentUser._id,
        otherId,
      });
      await refreshFriendsAndRequests();
    } catch (err) {
      console.error("Decline error:", err);
    }
  };

  return (
    <Container>
      <Header>
        <BrandSection>
          <BrandIcon>💬</BrandIcon>
          <BrandText>Snappy</BrandText>
        </BrandSection>
        <AddFriendButton onClick={() => setShowAddModal(true)}>
          <BiUserPlus />
          <span>Add Friend</span>
        </AddFriendButton>
      </Header>

      <SearchContainer>
        <SearchIcon>
          <BsSearch />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>

      {/* Friend Requests Panel */}
      <RequestsSection>
        {incoming.length > 0 && (
          <RequestsBlock>
            <RequestsTitle>Incoming requests</RequestsTitle>
            {incoming.map((user) => (
              <RequestRow key={user._id}>
                <span>{user.username}</span>
                <RequestActions>
                  <RequestButton
                    accept
                    onClick={() => handleAccept(user._id)}
                  >
                    Accept
                  </RequestButton>
                  <RequestButton onClick={() => handleDecline(user._id)}>
                    Decline
                  </RequestButton>
                </RequestActions>
              </RequestRow>
            ))}
          </RequestsBlock>
        )}

        {outgoing.length > 0 && (
          <RequestsBlock>
            <RequestsTitle>Sent requests</RequestsTitle>
            {outgoing.map((user) => (
              <RequestRow key={user._id}>
                <span>{user.username}</span>
                <PendingText>Pending</PendingText>
              </RequestRow>
            ))}
          </RequestsBlock>
        )}
      </RequestsSection>

      <ContactsList>
        {filteredContacts.map((contact, index) => (
          <ContactItem
            key={contact._id}
            isSelected={index === currentSelected}
            onClick={() => changeCurrentChat(index, contact)}
          >
            <AvatarWrapper>
              <Avatar
                src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                alt={contact.username}
              />
              <StatusDot />
            </AvatarWrapper>
            <ContactInfo>
              <ContactName>{contact.username}</ContactName>
              <ContactStatus>Friend</ContactStatus>
            </ContactInfo>
          </ContactItem>
        ))}
        {filteredContacts.length === 0 && (
          <NoContacts>No friends yet. Add someone first.</NoContacts>
        )}
      </ContactsList>

      {currentUser && (
        <CurrentUserSection>
          <CurrentUserInfo>
            <UserAvatar
              src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
              alt={currentUser.username}
            />
            <UserName>{currentUser.username}</UserName>
          </CurrentUserInfo>
          <LogoutButton onClick={handleLogout}>
            <BiLogOut />
          </LogoutButton>
        </CurrentUserSection>
      )}

      {/* Add Friend Modal */}
      {showAddModal && (
        <ModalBackdrop onClick={() => setShowAddModal(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Add a friend</ModalTitle>
            <ModalDescription>
              Enter their username to send a friend request.
            </ModalDescription>
            <ModalInput
              type="text"
              placeholder="Username"
              value={addUsername}
              onChange={(e) => setAddUsername(e.target.value)}
            />
            {addError && <ModalError>{addError}</ModalError>}
            <ModalActions>
              <ModalButton
                type="button"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </ModalButton>
              <ModalButton
                primary
                type="button"
                disabled={addLoading || !addUsername.trim()}
                onClick={handleSendRequest}
              >
                {addLoading ? "Sending..." : "Send Request"}
              </ModalButton>
            </ModalActions>
          </Modal>
        </ModalBackdrop>
      )}
    </Container>
  );
}

/* styled-components */

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  border-right: 1px solid rgba(148, 163, 184, 0.1);
`;

const Header = styled.div`
  padding: 1.2rem 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BrandIcon = styled.div`
  font-size: 1.5rem;
`;

const BrandText = styled.h1`
  margin: 0;
  color: #e2e8f0;
  font-size: 1.25rem;
  font-weight: 700;
`;

const AddFriendButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  background: rgba(79, 70, 229, 0.18);
  color: #c7d2fe;
  border-radius: 999px;
  border: 1px solid rgba(129, 140, 248, 0.6);
  cursor: pointer;
  font-size: 0.85rem;

  span {
    font-weight: 500;
  }

  svg {
    font-size: 1.1rem;
  }
`;

const SearchContainer = styled.div`
  padding: 1rem;
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.5rem;
  color: #e2e8f0;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const RequestsSection = styled.div`
  padding: 0 1rem 0.5rem 1rem;
  max-height: 160px;
  overflow-y: auto;
`;

const RequestsBlock = styled.div`
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(55, 65, 81, 0.8);
  border-radius: 0.5rem;
  padding: 0.5rem 0.6rem;
  margin-bottom: 0.5rem;
`;

const RequestsTitle = styled.div`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #9ca3af;
  margin-bottom: 0.3rem;
`;

const RequestRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #e5e7eb;
  padding: 0.25rem 0;
`;

const RequestActions = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const RequestButton = styled.button`
  padding: 0.15rem 0.45rem;
  font-size: 0.7rem;
  border-radius: 999px;
  border: 1px solid
    ${(p) => (p.accept ? "rgba(34,197,94,0.7)" : "rgba(239,68,68,0.7)")};
  color: ${(p) => (p.accept ? "#bbf7d0" : "#fecaca")};
  background: ${(p) =>
    p.accept ? "rgba(22,163,74,0.25)" : "rgba(185,28,28,0.25)"};
  cursor: pointer;
`;

const PendingText = styled.span`
  font-size: 0.7rem;
  color: #9ca3af;
`;

const ContactsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  background: ${(props) =>
    props.isSelected ? "rgba(102, 126, 234, 0.15)" : "transparent"};
  border-left: 3px solid
    ${(props) => (props.isSelected ? "#667eea" : "transparent")};
  transition: all 0.2s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
`;

const Avatar = styled.img`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  border: 2px solid rgba(102, 126, 234, 0.3);
`;

const StatusDot = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0.5rem;
  height: 0.5rem;
  background: #10b981;
  border: 2px solid #0f172a;
  border-radius: 50%;
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactName = styled.p`
  margin: 0;
  color: #e2e8f0;
  font-weight: 500;
`;

const ContactStatus = styled.p`
  margin: 0.125rem 0 0 0;
  color: #10b981;
  font-size: 0.75rem;
`;

const NoContacts = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #64748b;
`;

const CurrentUserSection = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(148, 163, 184, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CurrentUserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserAvatar = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 2px solid #667eea;
`;

const UserName = styled.p`
  margin: 0;
  color: #e2e8f0;
  font-weight: 600;
`;

const LogoutButton = styled.button`
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1.1rem;

  &:hover {
    background: rgba(239, 68, 68, 0.25);
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const Modal = styled.div`
  width: 320px;
  background: #020617;
  border-radius: 0.75rem;
  border: 1px solid rgba(55, 65, 81, 0.9);
  padding: 1rem 1.25rem;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7);
`;

const ModalTitle = styled.h3`
  margin: 0 0 0.25rem 0;
  color: #e5e7eb;
  font-size: 1rem;
  font-weight: 600;
`;

const ModalDescription = styled.p`
  margin: 0 0 0.75rem 0;
  color: #9ca3af;
  font-size: 0.8rem;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.8rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(75, 85, 99, 0.9);
  background: #020617;
  color: #e5e7eb;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.7);
  }
`;

const ModalError = styled.div`
  margin-top: 0.4rem;
  color: #fecaca;
  font-size: 0.78rem;
`;

const ModalActions = styled.div`
  margin-top: 0.9rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const ModalButton = styled.button`
  padding: 0.4rem 0.85rem;
  border-radius: 0.5rem;
  border: 1px solid
    ${(p) => (p.primary ? "rgba(129,140,248,0.8)" : "rgba(75,85,99,0.9)")};
  background: ${(p) =>
    p.primary ? "rgba(79,70,229,0.85)" : "rgba(15,23,42,1)"};
  color: ${(p) => (p.primary ? "#e5e7eb" : "#d1d5db")};
  font-size: 0.85rem;
  cursor: pointer;
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};

  &:disabled {
    cursor: not-allowed;
  }
`;
