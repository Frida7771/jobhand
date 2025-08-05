// 全局类型声明
declare global {
  interface Window {
    // 添加任何全局 window 属性
  }
}

// 模块声明
declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module '*.jpeg' {
  const content: any;
  export default content;
}

// 环境变量类型
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// React 组件 Props 类型
export interface FormRowProps {
  type: string;
  name: string;
  labelText?: string;
  defaultValue?: any;
  onChange?: (e: any) => void;
}

export interface FormRowSelectProps {
  name: string;
  labelText?: string;
  list: any[];
  defaultValue?: string;
  onChange?: (e: any) => void;
}

export interface SubmitBtnProps {
  formBtn?: boolean;
}

export interface JobProps {
  _id: string;
  company: string;
  position: string;
  jobLocation: string;
  jobType: string;
  jobStatus: string;
  createdAt: string;
}

export interface StatItemProps {
  count: number;
  title: string;
  color: string;
  bcg: string;
  icon: React.ReactNode;
}

export interface StatsContainerProps {
  title: string;
  stats: StatItemProps[];
}

export interface ChartsContainerProps {
  title: string;
  children: React.ReactNode;
}

export interface JobInfoProps {
  icon: React.ReactNode;
  text: string;
}

export interface NavLinksProps {
  isBigSidebar?: boolean;
}

export interface PageBtnContainerProps {
  numOfPages: number;
  currentPage: number;
}

export interface SearchContainerProps {
  search: string;
  searchStatus: string;
  searchType: string;
  sort: string;
  handleSearch: (e: any) => void;
  clearFilters: () => void;
}

export interface SmallSidebarProps {
  // 添加需要的 props
}

export interface ThemeToggleProps {
  // 添加需要的 props
}

export interface NavbarProps {
  // 添加需要的 props
}

export interface LogoutContainerProps {
  // 添加需要的 props
}

export interface JobsContainerProps {
  // 添加需要的 props
}

export interface BigSidebarProps {
  // 添加需要的 props
}

export interface GoogleLoginButtonProps {
  // 添加需要的 props
}

export interface LoadingProps {
  // 添加需要的 props
}

export interface LogoProps {
  // 添加需要的 props
}

export interface AreaChartProps {
  data: any[];
}

export interface BarChartProps {
  data: any[];
}

// Context 类型
export interface DashboardContextType {
  user: any;
  showSidebar: boolean;
  toggleSidebar: () => void;
  logoutUser: () => void;
  isDarkTheme: boolean;
  toggleDarkTheme: () => void;
}

export interface AllJobsContextType {
  data: any;
  searchValues: any;
}

// API 响应类型
export interface ApiResponse {
  msg: string;
  [key: string]: any;
}

export interface JobsResponse {
  jobs: JobProps[];
  totalJobs: number;
  numOfPages: number;
  currentPage: number;
}

export interface StatsResponse {
  defaultStats: {
    pending: number;
    interview: number;
    declined: number;
  };
  monthlyApplications: {
    date: string;
    count: number;
  }[];
} 