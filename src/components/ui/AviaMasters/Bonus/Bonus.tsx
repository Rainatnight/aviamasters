import React from 'react';
import { motion } from 'motion/react';
import styles from './Bonus.module.scss';
import bonusImg from '../src/bonus.png';

export interface BonusType {
  id: number;
  value: number;
  x: number;
  y: number;
}

interface BonusProps {
  bonus: BonusType;
}

const Bonus: React.FC<BonusProps> = ({ bonus }) => {
  return (
    <motion.div
      className={styles.bonus}
      style={{ left: bonus.x, top: bonus.y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: -50 }}
      transition={{ duration: 3 }}
    >
      <div className={styles.bonusImageWrapper}>
        <img src={bonusImg} alt="bonus" className={styles.bonusImage} />
        <span className={styles.bonusValue}>+{bonus.value}</span>
      </div>
    </motion.div>
  );
};

export default Bonus;
