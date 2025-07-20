import { Link, Form, redirect, useNavigate } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { FormRow, Logo, SubmitBtn } from '../components';
import GoogleLoginButton from '../components/GoogleLoginButton';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      await customFetch.post('/auth/login', data);
      queryClient.invalidateQueries();
      toast.success('Login successful');



      
      // 获取当前用户信息来判断角色
    try {
      const userResponse = await customFetch.get('/users/current-user');
      const userRole = userResponse.data.user.role;
      
      if (userRole === 'admin') {
        return redirect('/admin'); // 直接跳转到admin页面
      } else {
        return redirect('/dashboard'); // 普通用户跳转到主仪表板
      }
    }
      catch (error) {
        toast.error('Failed to fetch user role');
        return redirect('/dashboard'); // 如果获取用户角色失败，默认跳转到主仪表板
      }

    } catch (error) {
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
         
        <FormRow type='email' name='email' />
        <FormRow type='password' name='password' />
        <SubmitBtn />
      
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
