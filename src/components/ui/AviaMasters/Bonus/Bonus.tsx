import React from 'react';
import { motion } from 'motion/react';
import styles from './Bonus.module.scss';
import bonusImg from '../src/bonus.png'; // твоя картинка бонуса

export interface BonusType {
  id: number;
  value: number; // 1, 2 или 3
  x: number;     // случайная позиция по X
  y: number;     // случайная позиция по Y
}

interface BonusProps {
  bonus: BonusType;
  collected?: boolean;
}

const Bonus: React.FC<BonusProps> = ({ bonus }) => {
  return (
    <motion.div
      className={styles.bonus}
      style={{
        left: bonus.x,
        top: bonus.y,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: -50 }} // поднимается вверх
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
