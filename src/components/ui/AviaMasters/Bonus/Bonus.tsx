import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import styles from './Bonus.module.scss';

export interface BonusType {
  id: number;
  value: number; // 1, 2 или 3
  x: number;     // случайная позиция по X
  y: number;     // случайная позиция по Y
}

interface BonusProps {
  bonus: BonusType;
  onAnimationComplete: (id: number) => void;
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
      animate={{ opacity: 1, y: -50 }} // например поднимается вверх
      transition={{ duration: 3 }}
    //   onAnimationComplete={() => onAnimationComplete(bonus.id)}
    >
      +{bonus.value}
    </motion.div>
  );
};

export default Bonus;
