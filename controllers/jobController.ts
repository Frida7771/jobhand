import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import dayjs from 'dayjs';
import Job from '../models/JobModel';
import { AuthenticatedRequest } from '../types/index.js';

// 👇 Custom typings for query params (you can extract this to types/)
interface GetAllJobsQuery {
  search?: string;
  jobStatus?: string;
  jobType?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

// ✅ Get all jobs (with filters + pagination)
export const getAllJobs = async (
  req: Request<{}, {}, {}, GetAllJobsQuery>,
  res: Response
): Promise<void> => {
  const { search, jobStatus, jobType, sort } = req.query;

  const queryObject: any = {
    createdBy: (req.user as any)?.userId,
  };

  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  if (jobStatus && jobStatus !== 'all') queryObject.jobStatus = jobStatus;
  if (jobType && jobType !== 'all') queryObject.jobType = jobType;

  const sortOptions: Record<string, string> = {
    newest: '-createdAt',
    oldest: 'createdAt',
    'a-z': 'position',
    'z-a': '-position',
  };

  const sortKey = sortOptions[sort || 'newest'];

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jobs = await Job.find(queryObject).sort(sortKey).skip(skip).limit(limit);
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({
    totalJobs,
    numOfPages,
    currentPage: page,
    jobs,
  });
};

// ✅ Create job
export const createJob = async (req: Request, res: Response): Promise<void> => {
  req.body.createdBy = (req.user as any)?.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

// ✅ Get single job
export const getJob = async (req: Request, res: Response): Promise<void> => {
  const job = await Job.findById(req.params.id);
  res.status(StatusCodes.OK).json({ job });
};

// ✅ Update job
export const updateJob = async (req: Request, res: Response): Promise<void> => {
  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({ msg: 'job modified', job: updatedJob });
};

// ✅ Delete job
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  const removedJob = await Job.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({ msg: 'job deleted', job: removedJob });
};

// ✅ Show statistics (grouping by jobStatus & monthly)
export const showStats = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as any)?.userId;
  if (!userId) throw new Error('Missing userId');

  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
  ]);

  const statMap: Record<string, number> = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {} as Record<string, number>);

  const defaultStats = {
    pending: statMap.pending || 0,
    interview: statMap.interview || 0,
    declined: statMap.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = dayjs().month(month - 1).year(year).format('MMM YY');
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

// ✅ Admin: get all jobs with user info
export const getAllJobsForAdmin = async (req: Request, res: Response): Promise<void> => {
  const jobs = await Job.find({})
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.status(StatusCodes.OK).json({ jobs });
};
