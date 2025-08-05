 // jobConstants.ts

export const JOB_STATUS = {
    PENDING: 'pending',
    INTERVIEW: 'interview',
    DECLINED: 'declined',
  } as const;
  
  export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];
  
  export const JOB_TYPE = {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    INTERNSHIP: 'internship',
  } as const;
  
  export type JobType = (typeof JOB_TYPE)[keyof typeof JOB_TYPE];
  
  export const JOB_SORT_BY = {
    NEWEST_FIRST: 'newest',
    OLDEST_FIRST: 'oldest',
    ASCENDING: 'a-z',
    DESCENDING: 'z-a',
  } as const;
  
  export type JobSortBy = (typeof JOB_SORT_BY)[keyof typeof JOB_SORT_BY];
  