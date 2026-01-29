import type { FC } from 'react';

import { useGetAccountQuery, useGetInfoQuery } from '@/api/profile.api.ts';
import useOpenCase from '@/hooks/useOpenCase.ts';
import { useEffect, useState } from 'react';

import Balance from '@/ui/Balance/Balance';
import Container from '@/ui/Container/Container.tsx';
import LangSwitcher from '@/ui/Header/LangSwitcher/LangSwitcher.tsx';
import Tickets from '@/ui/Header/Tickets/Tickets';

import { useLocation } from 'react-router';

import styles from './Header.module.scss';
import { motion } from 'motion/react';
import { setIsPepeAvailable } from '@/store/ui/uiSlice';
import { useDispatch } from 'react-redux';

const Header: FC = () => {
  const location = useLocation();

  const { data: infoData, isSuccess: isInfoSuccess } = useGetInfoQuery();
  const { data: accountData } = useGetAccountQuery();
  const { isOpening } = useOpenCase();

  const dispatch = useDispatch();

  const [tickets, setTickets] = useState<number | undefined>(undefined);
  const [balance, setBalance] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!isOpening && isInfoSuccess) {
      setTickets(accountData?.pepes);
      setBalance(infoData?.is_demo ? accountData?.demo_balance : accountData?.balance);
    }
  }, [isOpening, isInfoSuccess, accountData]);

  useEffect(() => {
    if (accountData && accountData.next_pepe_claim_at) {
      const date = new Date(accountData.next_pepe_claim_at);
      const timeLeft = date.getTime() - Date.now();

      if (timeLeft <= 0) {
        dispatch(setIsPepeAvailable(true));
      }
    }
  }, [infoData, dispatch]);

  const wrapperVariants = {
    initial: {
      opacity: 1,
      transition: {
        opacity: {
          duration: 0.6,
          ease: 'easeInOut',
          delay: 0,
        },
        y: {
          duration: 0,
        },
      },
    },
    animate: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
        delay: 0.4,
      },
    },
  };

  return (
    <>
      {isInfoSuccess && (
        <motion.header initial='initial' animate={isOpening ? 'animate' : 'initial'} variants={wrapperVariants} className={styles.header}>
          <Container className={styles.container}>
            <Balance amount={balance} depositButton />
            {location.pathname === '/' || location.pathname === '/free-cases' ? (
              <Tickets amount={tickets ?? accountData?.pepes} />
            ) : location.pathname === '/collection' ? (
              <LangSwitcher />
            ) : null}
          </Container>
        </motion.header>
      )}
    </>
  );
};

export default Header;
