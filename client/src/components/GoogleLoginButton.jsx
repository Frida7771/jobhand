import { FaGoogle } from 'react-icons/fa';
import styled from 'styled-components';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = '/api/v1/auth/google';
  };

  return (
    <Wrapper>
      <button 
        type="button" 
        onClick={handleGoogleLogin}
        className="btn google-btn"
      >
        <FaGoogle className="google-icon" />
        Continue with Google
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .google-btn {
    background: #4285f4;
    color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    margin-bottom: 1rem;
    transition: background-color 0.3s ease;

    &:hover {
      background: #3367d6;
    }

    .google-icon {
      font-size: 1.2rem;
    }
  }

  .divider {
    text-align: center;
    margin: 1rem 0;
    position: relative;
    color: var(--text-secondary-color);

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--grey-200);
      z-index: 1;
    }

    span {
      background: var(--background-secondary-color);
      padding: 0 1rem;
      position: relative;
      z-index: 2;
    }
  }
`;

export default GoogleLoginButton;