import React, { createContext, useContext, useState } from 'react';

type ModalType = 'login' | 'register' | null;

type AuthModalContextType = {
  openLogin: () => void;
  openRegister: () => void;
  closeModal: () => void;
  modalType: ModalType;
};

const AuthModalContext = createContext<AuthModalContextType | undefined>(
  undefined
);

export const AuthModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [modalType, setModalType] = useState<ModalType>(null);

  const openLogin = () => setModalType('login');
  const openRegister = () => setModalType('register');
  const closeModal = () => setModalType(null);

  return (
    <AuthModalContext.Provider
      value={{ modalType, openLogin, openRegister, closeModal }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return context;
};
