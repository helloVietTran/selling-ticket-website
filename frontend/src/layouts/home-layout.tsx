import LoginModal from '@/components/login-modal';
import RegisterModal from '@/components/register-modal';
import Header from '@/components/header';

// import { useAuthModal } from '@/context/auth-modal-context';

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  // const { openLogin, openRegister } = useAuthModal();
  return (
    <div>
      <LoginModal />
      <RegisterModal />
      <Header />

      <div>{children}</div>

      {/* <div className="flex gap-4 p-4">
        <button
          onClick={openLogin}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
        >
          Mở Login
        </button>
        <button
          onClick={openRegister}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Mở Register
        </button>
      </div> */}
    </div>
  );
};

export default HomeLayout;
