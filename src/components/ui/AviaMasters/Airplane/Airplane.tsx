import React, { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import airplaneImg from '../src/plane.png'
import cls from  './Airplane.module.scss'

interface AirplaneProps {
  startFlying: boolean
   onSpeedChange?: (vx: number) => void
    onFallIntoSea?: () => void
     onPositionChange?: (pos: { x: number, y: number }) => void
     boost:number
}
const SEA_HEIGHT = 200;

const Airplane: React.FC<AirplaneProps> = ({ startFlying ,onSpeedChange,onFallIntoSea,onPositionChange,boost}) => {
  const controls = useAnimation()
  const requestRef = useRef<number>(null)
  const startTime = useRef<number | null>(null)

useEffect(() => {
  if (!startFlying) return;

  const X0 = 0;
  const Y0 = 0;
  let Vy0 = -8; // базовая вертикальная скорость
  const Vx0 = 12;
  const ax = -0.01;
  const g = 0.05;

  const animate = (time: number) => {
    if (!startTime.current) startTime.current = time;

    const t = (time - startTime.current) / 16.66;

    // 🔹 Добавляем импульс boost к Vy0
    if (boost) {
      Vy0 -= boost; // уменьшаем y для подброса вверх
    }

    const x = X0 + Vx0 * t + 0.5 * ax * t * t;
    const y = Y0 + Vy0 * t + 0.5 * g * t * t;

    const xClamped = Math.min(x, window.innerWidth * 0.5);
    const yClamped = Math.min(y, window.innerHeight - 50);

    if (y >= window.innerHeight - SEA_HEIGHT) {
      if (onFallIntoSea) {
        onFallIntoSea();
        controls.set({ x: 0, y: 0, rotate: 0 });
      }
      return;
    }

    controls.set({ x: xClamped, y: yClamped, rotate: Math.min((Vy0 + g * t) * 2, 25) });

    if (onSpeedChange) onSpeedChange(Math.max(Vx0 + ax * t, 2));
    if (onPositionChange) onPositionChange({ x: xClamped, y: yClamped });

    requestRef.current = requestAnimationFrame(animate);
  };

  requestRef.current = requestAnimationFrame(animate);
  return () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    startTime.current = null;
  };
}, [startFlying, onSpeedChange, boost]);

  return (
    <motion.img
      src={airplaneImg}
      alt="Airplane"
      className={cls.airplane}
      animate={controls}
    />
  )
}

export default Airplane
