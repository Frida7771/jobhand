import { FaSuitcaseRolling, FaCalendarCheck, FaUsers, FaEye } from 'react-icons/fa';
import { useLoaderData, redirect } from 'react-router-dom';
import { useState, useEffect } from 'react';
import customFetch from '../utils/customFetch';
import Wrapper from '../assets/wrappers/StatsContainer';
import { toast } from 'react-toastify';
import { StatItem } from '../components';

export const loader = async () => {
  try {
    const response = await customFetch.get('/users/admin/app-stats');
    return response.data;
  } catch (error) {
    toast.error('You are not authorized to view this page');
    return redirect('/dashboard');
  }
};

const Admin = () => {
  const { users, jobs } = useLoaderData();
  const [activeView, setActiveView] = useState('stats');
  const [allUsers, setAllUsers] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
              <p className="text-sm text-gray-600 mt-1">Total: {allUsers.length} registered users</p>
            </div>
            <button 
              onClick={() => setActiveView('stats')}
              className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded transition-colors"
            >
              ← Back to Stats
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-3 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {allUsers.map((user, index) => (
                  <tr key={user._id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || user.firstName + ' ' + user.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="text-sm text-gray-700">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-md ${
                        user.role === 'admin' 
                          ? 'bg-red-50 text-red-700 border border-red-200' 
                          : 'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {allUsers.length === 0 && !loading && (
              <div className="p-8 text-center text-gray-500">
                No users found
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">All Jobs</h2>
              <p className="text-sm text-gray-600 mt-1">Total: {allJobs.length} job applications</p>
            </div>
            <button 
              onClick={() => setActiveView('stats')}
              className="text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded transition-colors"
            >
              ← Back to Stats
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-3 text-gray-600">Loading jobs...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Location & Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Created By
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {allJobs.map((job, index) => (
                  <tr key={job._id || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">{job.position}</div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="text-sm text-gray-700">{job.company}</div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="text-sm text-gray-700">
                        {job.jobLocation}
                        <span className="text-gray-500"> • {job.jobType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-md ${
                        job.jobStatus === 'interview' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : job.jobStatus === 'declined'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>
                        {job.jobStatus?.charAt(0).toUpperCase() + job.jobStatus?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="text-sm text-gray-700">
                        {job.createdBy?.name || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="text-sm text-gray-700">
                        {job.createdBy?.email || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-gray-100">
                      <div className="text-sm text-gray-700">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {allJobs.length === 0 && !loading && (
              <div className="p-8 text-center text-gray-500">
                No jobs found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 管理员标题 */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of users and jobs</p>
        </div>
      </div>

      {/* 统计卡片 */}
      {activeView === 'stats' && (
        <div className="mb-6">
          <Wrapper>
            <div 
              onClick={() => handleStatClick('users')} 
              className="cursor-pointer transition-transform hover:scale-105"
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
              className="cursor-pointer transition-transform hover:scale-105"
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
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <FaEye className="text-blue-600" />
              <p className="text-blue-800 text-sm font-medium">
                Click on the cards above to view detailed information
              </p>
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