import React from 'react';
import styled from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa';
import logo from '../assets/logo.png';

const NavbarContainer = styled.nav`
  background: ${props => props.theme.cardBackground};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.border};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.img`
  height: 32px;
  width: auto;
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.hover};
    transform: scale(1.1);
  }
`;

interface NavbarProps {
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onThemeToggle, isDarkMode }) => {
  return (
    <NavbarContainer>
      <LogoContainer>
        <Logo src={logo} alt="SQL Query Runner Logo" />
        <LogoText>SQL Query Runner</LogoText>
      </LogoContainer>
      <ThemeToggle onClick={onThemeToggle}>
        {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
      </ThemeToggle>
    </NavbarContainer>
  );
};

export default Navbar; 