import { FormRow, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { useOutletContext, redirect } from 'react-router-dom';
import { Form } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('avatar');
    if (file && file.size > 500000) {
      toast.error('Image size too large');
      return null;
    }
    try {
      await customFetch.patch('/users/update-user', formData);
      queryClient.invalidateQueries(['user']);
      toast.success('Profile updated successfully');
      return redirect('/dashboard');
    } catch (error: any) {
      toast.error(error?.response?.data?.msg);
      return null;
    }
  };

const Profile = () => {
  const context = useOutletContext() as { user: any };
  const { user } = context;

  const { name, lastName, email, location } = user;

  return (
    <Wrapper>
      <Form method='post' className='form' encType='multipart/form-data'>
        <h4 className='form-title'>profile</h4>
        <div className='form-center'>
          <FormRow type='text' name='name' labelText='first name' defaultValue={name} onChange={() => {}} />
          <FormRow
            type='text'
            name='lastName'
            labelText='last name'
            defaultValue={lastName}
            onChange={() => {}}
          />
          <FormRow type='email' name='email' labelText='email' defaultValue={email} onChange={() => {}} />
          <FormRow type='text' name='location' labelText='location' defaultValue={location} onChange={() => {}} />
          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};
export default Profile;
