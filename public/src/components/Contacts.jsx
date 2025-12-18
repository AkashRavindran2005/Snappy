import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BsSearch, BsCircleFill } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function Contacts({ contacts, changeChat, currentUser }) {
  const navigate = useNavigate();
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter((contact) =>
        contact.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchQuery, contacts]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const handleLogout = () => {
    localStorage.removeItem(process.env.REACT_APP_LOCALHOST_KEY);
    navigate("/login");
  };

  return (
    <Container>
      <Header>
        <BrandSection>
          <BrandIcon>💬</BrandIcon>
          <BrandText>SecureChat</BrandText>
        </BrandSection>
      </Header>

      <SearchContainer>
        <SearchIcon>
          <BsSearch />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchContainer>

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
              <ContactStatus>Active</ContactStatus>
            </ContactInfo>
          </ContactItem>
        ))}
        {filteredContacts.length === 0 && (
          <NoContacts>No contacts found</NoContacts>
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
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  border-right: 1px solid rgba(148, 163, 184, 0.1);
`;

const Header = styled.div`
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
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
  border-left: 3px solid ${(props) =>
    props.isSelected ? "#667eea" : "transparent"};
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
