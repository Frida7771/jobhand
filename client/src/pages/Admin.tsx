import { FaSuitcaseRolling, FaCalendarCheck, FaUsers, FaEye, FaArrowLeft } from 'react-icons/fa';
import { useLoaderData, redirect } from 'react-router-dom';
import { useState } from 'react';
import customFetch from '../utils/customFetch';
import Wrapper from '../assets/wrappers/StatsContainer';
import { toast } from 'react-toastify';
import { StatItem } from '../components';

export const loader = async () => {
  try {
    const response = await customFetch.get('/users/admin/app-stats');
    return response.data;
  } catch (error: any) {
    console.error('Admin loader error:', error);
    if (error?.response?.status === 401) {
      toast.error('You are not authorized to view this page');
      return redirect('/');
    }
    toast.error('Failed to load admin data');
    return redirect('/dashboard');
  }
};

const Admin = () => {
  const data = useLoaderData() as { users: number; jobs: number };
  const { users, jobs } = data;
  const [activeView, setActiveView] = useState('stats');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取详细用户列表
  const fetchAllUsers = async () => {
    if (allUsers.length > 0) return; // 如果已经获取过，不重复获取
    
    setLoading(true);
    try {
      const response = await customFetch.get('/users/admin/all-users');
      setAllUsers(response.data.users || []);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取详细工作列表
  const fetchAllJobs = async () => {
    if (allJobs.length > 0) return; // 如果已经获取过，不重复获取
    
    setLoading(true);
    try {
      const response = await customFetch.get('/jobs/admin/all-jobs');
      setAllJobs(response.data.jobs || []);
    } catch (error) {
      toast.error('Failed to fetch jobs');
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理统计卡片点击
  const handleStatClick = (type) => {
    if (type === 'users') {
      setActiveView('users');
      fetchAllUsers();
    } else if (type === 'jobs') {
      setActiveView('jobs');
      fetchAllJobs();
    }
  };

  // 用户列表视图
  const UsersView = () => (
    <div className="mt-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
              <p className="text-sm text-gray-600 mt-1">Total: {allUsers.length} registered users</p>
            </div>
            <button 
              onClick={() => setActiveView('stats')}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-lg border border-blue-200 transition-all duration-200 shadow-sm"
            >
              <FaArrowLeft className="text-sm" />
              Back to Stats
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-16 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {allUsers.map((user, index) => (
                  <tr key={user._id || index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'User'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {allUsers.length === 0 && !loading && (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <FaUsers className="mx-auto h-12 w-12" />
                </div>
                <p className="text-gray-500 font-medium">No users found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // 工作列表视图
  const JobsView = () => (
    <div className="mt-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Jobs</h2>
              <p className="text-sm text-gray-600 mt-1">Total: {allJobs.length} job applications</p>
            </div>
            <button 
              onClick={() => setActiveView('stats')}
              className="flex items-center gap-2 bg-white hover:bg-gray-50 text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-lg border border-blue-200 transition-all duration-200 shadow-sm"
            >
              <FaArrowLeft className="text-sm" />
              Back to Stats
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-16 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading jobs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Location & Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Created By
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {allJobs.map((job, index) => (
                  <tr key={job._id || index} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{job.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{job.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        <div>{job.jobLocation}</div>
                        <div className="text-xs text-gray-500">{job.jobType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        job.jobStatus === 'interview' 
                          ? 'bg-blue-100 text-blue-800'
                          : job.jobStatus === 'declined'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {job.jobStatus?.charAt(0).toUpperCase() + job.jobStatus?.slice(1) || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {job.createdBy?.name || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {job.createdBy?.email || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {allJobs.length === 0 && !loading && (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <FaSuitcaseRolling className="mx-auto h-12 w-12" />
                </div>
                <p className="text-gray-500 font-medium">No jobs found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-4">
      {/* 管理员标题 */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Overview of users and jobs across the platform</p>
        </div>
      </div>

      {/* 统计卡片 */}
      {activeView === 'stats' && (
        <div className="mb-8">
          <Wrapper>
            <div 
              onClick={() => handleStatClick('users')} 
              className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <StatItem
                title='current users'
                count={users}
                color='#e9b949'
                bcg='#fcefc7'
                icon={<FaUsers />}
              />
            </div>
            <div 
              onClick={() => handleStatClick('jobs')} 
              className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <StatItem
                title='total jobs'
                count={jobs}
                color='#647acb'
                bcg='#e0e8f9'
                icon={<FaCalendarCheck />}
              />
            </div>
          </Wrapper>
        </div>
      )}

      {/* 交互提示 */}
      {activeView === 'stats' && (
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <FaEye className="text-blue-600 text-xl" />
              <div>
                <p className="text-blue-800 font-semibold">Interactive Dashboard</p>
                <p className="text-blue-700 text-sm">Click on the cards above to view detailed information</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 详细视图 */}
      {activeView === 'users' && <UsersView />}
      {activeView === 'jobs' && <JobsView />}
    </div>
  );
};

export default Admin;