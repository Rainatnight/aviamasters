import type { FC } from 'react';

import Header from '@/ui/Header/Header.tsx';
import Navbar from '@/ui/Navbar/Navbar.tsx';
import { Outlet } from 'react-router';
import DepositModal from '@/screens/Donate/Modal/DepositModal';

const Layout: FC = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Navbar />
      <DepositModal />
    </>
  );
};

export default Layout;
