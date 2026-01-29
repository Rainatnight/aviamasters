import type { FC } from 'react';

import Layout from '@/navigation/Layout/Layout.tsx';

import Collection from '@/screens/Collection/Collection';
import Donate from '@/screens/Donate/Donate.tsx';
import Earn from '@/screens/Earn/Earn';
import Gift from '@/screens/Gift/Gift.tsx';
import GiftDeposit from '@/screens/GiftDeposit/GiftDeposit';
import Home from '@/screens/Home/Home';
import Onboarding from '@/screens/Home/Onboarding/Onboarding';
import Leaderboard from '@/screens/Leaderboard/Leaderboard';
import RoulettePage from '@/screens/Roulette/RoulettePage';
import { AnimatePresence } from 'motion/react';
import { Route, BrowserRouter as Router, Routes } from 'react-router';
import BalanceScreen from '@/screens/balanceScreen/BalanceScreen';
import FreeCases from '@/screens/FreeCases/FreeCases';
import AviaMasterts from '@/ui/AviaMasters/AviaMasterts';

const Navigation: FC = () => {
  return (
    <>
      <AnimatePresence>
        <Router>
          <Routes>
            <Route path='/aviamasters' element={<AviaMasterts />} />
          </Routes>
        </Router>
      </AnimatePresence>
    </>
  );
};

export default Navigation;
