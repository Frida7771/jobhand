// links.tsx
import { IoBarChartSharp } from 'react-icons/io5';
import { MdQueryStats, MdAdminPanelSettings } from 'react-icons/md';
import { FaWpforms } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { ReactElement } from 'react';

export interface NavLinkItem {
  text: string;
  path: string;
  icon: ReactElement;
}

const links: NavLinkItem[] = [
  {
    text: 'add job',
    path: '.',
    icon: <FaWpforms />,
  },
  {
    text: 'all jobs',
    path: 'all-jobs',
    icon: <MdQueryStats />,
  },
  {
    text: 'stats',
    path: 'stats',
    icon: <IoBarChartSharp />,
  },
  {
    text: 'profile',
    path: 'profile',
    icon: <ImProfile />,
  },
  {
    text: 'admin',
    path: 'admin',
    icon: <MdAdminPanelSettings />,
  },
];

export default links;
