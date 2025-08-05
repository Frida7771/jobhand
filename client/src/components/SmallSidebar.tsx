import { FaTimes } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/SmallSidebar';
import { useDashboardContext } from '../pages/DashboardLayout';
import Logo from './Logo';

import NavLinks from './NavLinks';
const SmallSidebar = () => {
  const context = useDashboardContext();
  const showSidebar = context?.showSidebar ?? false;
  const toggleSidebar = context?.toggleSidebar;

  return (
    <Wrapper>
      <div
        className={
          showSidebar ? 'sidebar-container show-sidebar' : 'sidebar-container'
        }
      >
        <div className='content'>
          <button type='button' className='close-btn' onClick={toggleSidebar} aria-label="close sidebar">
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          <NavLinks isBigSidebar={false} />
        </div>
      </div>
    </Wrapper>
  );
};
export default SmallSidebar;
