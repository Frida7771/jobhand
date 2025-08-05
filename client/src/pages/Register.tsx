import { Form, redirect, Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { FormRow, Logo, SubmitBtn, GoogleLoginButton } from '../components';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post('/auth/register', data);
    toast.success('Registration successful');
    return redirect('/login');
  } catch (error) {
    toast.error((error as any)?.response?.data?.msg);

    return error;
  }
};
const Register = () => {
  return (
    <Wrapper>
      <Form method='post' className='form'>
        <Logo />
        <h4>Register</h4>

         <GoogleLoginButton />
         
        <FormRow type='text' name='name' labelText='name' defaultValue='' onChange={() => {}} />
        <FormRow type='text' name='lastName' labelText='last name' defaultValue='' onChange={() => {}} />
        <FormRow type='text' name='location' labelText='location' defaultValue='' onChange={() => {}} />
        <FormRow type='email' name='email' labelText='email' defaultValue='' onChange={() => {}} />
        <FormRow type='password' name='password' labelText='password' defaultValue='' onChange={() => {}} />
        <SubmitBtn formBtn />
        <p>
          Already a member?
          <Link to='/login' className='member-btn'>
            Login
          </Link>
        </p>
      </Form>
    </Wrapper>
  );
};
export default Register;
