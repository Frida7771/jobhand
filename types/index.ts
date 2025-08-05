export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  lastName?: string;
  location?: string;
  role: 'user' | 'admin';
  avatar?: string;
  avatarPublicId?: string;
}

export interface IJob {
  _id?: string;
  company: string;
  position: string;
  jobLocation: string;
  jobType: 'full-time' | 'part-time' | 'remote' | 'internship';
  jobStatus: 'interview' | 'declined' | 'pending';
  createdBy: string;
}

export interface AuthenticatedRequest {
  user: {
    userId: string;
    role: string;
    testUser?: boolean;
  };
  body: any;
  params: any;
  query: any;
  file?: any;
}

// 添加一个更通用的类型用于路由
export interface ExpressRequest extends Request {
  user?: {
    userId: string;
    role: string;
    testUser?: boolean;
  };
}

export interface JobQueryParams {
  search?: string;
  jobStatus?: string;
  jobType?: string;
  sort?: string;
  page?: number;
}

export interface JobStats {
  pending: number;
  interview: number;
  declined: number;
}

export interface MonthlyApplication {
  date: string;
  count: number;
}

export interface ApiResponse<T = any> {
  msg: string;
  [key: string]: T | string;
}

export interface JobsResponse {
  jobs: IJob[];
  totalJobs: number;
  numOfPages: number;
}

export interface StatsResponse {
  defaultStats: JobStats;
  monthlyApplications: MonthlyApplication[];
}

// Constants
export const JOB_STATUS = {
  INTERVIEW: 'interview',
  DECLINED: 'declined',
  PENDING: 'pending',
} as const;

export const JOB_TYPE = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  REMOTE: 'remote',
  INTERNSHIP: 'internship',
} as const;

export const JOB_SORT_BY = {
  NEWEST_FIRST: 'newest',
  OLDEST_FIRST: 'oldest',
  A_Z: 'a-z',
  Z_A: 'z-a',
} as const; 