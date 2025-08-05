import styled from 'styled-components';

const Logo = () => {
  return (
    <StyledLogo>
      Job<span>Hand</span>
    </StyledLogo>
  );
};

const StyledLogo = styled.h2`
  margin: 0;
  color: #2cb1bc;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  
  span {
    color: #667eea;
  }
  
  &:hover {
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }
`;

export default Logo;