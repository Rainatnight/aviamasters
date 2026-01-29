import { motion } from 'framer-motion';
import shipImg from '../src/ship.png';
import cls from './ship.module.scss'

const SHIP_WIDTH = 200; // ширина корабля в px
const SCREEN_WIDTH = typeof window !== 'undefined' ? window.innerWidth : 1200;


const Ship = ({id,planeSpeed,started,handleAnimationComplete}:any) => {

    const startX = SCREEN_WIDTH
    const endX = -3 * SHIP_WIDTH 
const isDefault = id === 0 
  // если скорость самолета ещё 0 (до старта), ставим дефолт
    const visualSpeed = Math.max(planeSpeed, 200) // px/sec
    const distance = Math.abs(endX - (isDefault ? -150 : startX))
    const duration = distance / visualSpeed


  return (
     <motion.img
      key={id}
      src={shipImg}
      alt='Ship'
      className={cls.ship}
      initial={{ x: isDefault ? -150 : startX, y: 0 }}
      animate={started ? { x: endX } : {}}
      transition={{ duration, ease: 'linear' }}
      onAnimationComplete={() => handleAnimationComplete(id)}
      style={{ position: 'absolute' }}
    />
  )
}

export default Ship