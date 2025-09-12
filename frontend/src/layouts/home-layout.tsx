import { Outlet } from 'react-router-dom';

import LoginModal from '@/components/login-modal';
import RegisterModal from '@/components/register-modal';
import Header from '@/components/header';

const HomeLayout = () => {
  return (
    <>
      <LoginModal />
      <RegisterModal />
      <Header />
      <Outlet />
    </>
  );
};

export default HomeLayout;
