import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: ${props => props.theme.cardBackground};
  color: ${props => props.theme.text};
  padding: 1rem 2rem;
  width: 100%;
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
`;

const FooterContent = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const FooterText = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterText>© 2025 SQL Query Runner</FooterText>
        <FooterText>|</FooterText>
        <FooterText>All rights reserved</FooterText>
      </FooterContent>
      <FooterContent>
        <FooterText>Made with ❤️ for Atlan</FooterText>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 