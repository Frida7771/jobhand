import { Link, Form, redirect, useNavigate } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { FormRow, Logo, SubmitBtn } from '../components';
import GoogleLoginButton from '../components/GoogleLoginButton';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action = (queryClient) => async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  
  try {
    await customFetch.post('/auth/login', data);
    
    // 🔥 关键修复：清除所有缓存
    queryClient.clear();
    queryClient.invalidateQueries();
    
    toast.success('Login successful');

    // 短暂延迟，确保缓存清除完成
    await new Promise(resolve => setTimeout(resolve, 100));

    // 获取当前用户信息来判断角色
    try {
      console.log('Fetching user role...');
      const userResponse = await customFetch.get('/users/current-user');
      console.log('Full user response:', userResponse.data);
      console.log('User object:', userResponse.data.user);
      const userRole = userResponse.data.user.role;
      console.log('Extracted role:', userRole);
      
      if (userRole === 'admin') {
        console.log('Redirecting to admin dashboard');
        return redirect('/dashboard/admin');
      } else {
        console.log('Redirecting to user dashboard');
        return redirect('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      toast.error('Failed to fetch user role');
      return redirect('/dashboard');
    }
    
  } catch (error: any) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Login = () => {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <Form method='post' className='form'>
        <Logo />
        <h4>login</h4>
         <GoogleLoginButton />
         
        <FormRow type='email' name='email' labelText='email' defaultValue='' onChange={() => {}} />
        <FormRow type='password' name='password' labelText='password' defaultValue='' onChange={() => {}} />
        <SubmitBtn formBtn />
      
        <p>
          Not a member yet?
          <Link to='/register' className='member-btn'>
            Register
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};
export default Login;
