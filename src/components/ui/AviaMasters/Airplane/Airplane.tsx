import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import airplaneImg from '../src/plane.png';
import cls from './Airplane.module.scss';

interface AirplaneProps {
  startFlying: boolean;
  onSpeedChange?: (vx: number) => void;
  onFallIntoSea?: () => void;
  onPositionChange?: (pos: { x: number; y: number }) => void;
  boost: number;
}
const SEA_HEIGHT = 200;

const Airplane: React.FC<AirplaneProps> = ({
  startFlying,
  onSpeedChange,
  onFallIntoSea,
  onPositionChange,
  boost, // ← приходит снаружи, например: 0 → 1 → 2 → ...
}) => {
  const controls = useAnimation();
  const rafRef = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  // состояние физики — сохраняется между рендерами и между бустами
  const state = useRef({
    x: 30,
    y: 0,
    vx: 12,
    vy: -8,
    boostUsedUpTo: 0, // запоминаем, до какого уровня буста уже применили
  });

  useEffect(() => {
    if (!startFlying) {
      // можно здесь остановить/сбросить, если нужно
      return;
    }

    const GRAVITY = 0.05;
    const DRAG_X = -0.01;

    let prevTime = performance.now();

    const animate = (time: number) => {
      if (!startTime.current) startTime.current = time;
      const dt = (time - prevTime) / 1000; // в секундах
      prevTime = time;

      if (boost > state.current.boostUsedUpTo) {
        const levels = boost - state.current.boostUsedUpTo;

        state.current.vy -= 1.01 * levels; // ← основной подброс (было 1.01)
        state.current.vx += 0.1 * levels; // ← чуть больше ускорения вперёд

        // опционально: моментальный небольшой скачок по y (визуальный импульс)
        state.current.y -= 20 * levels; // мгновенно поднимаем на 8–16 пикселей

        state.current.boostUsedUpTo = boost;
      }

      // физика
      state.current.vy += GRAVITY * dt * 60; // ≈ 0.05 в 60 fps
      state.current.vx += DRAG_X * dt * 60;

      state.current.x += state.current.vx * dt * 60;
      state.current.y += state.current.vy * dt * 60;

      // ограничения
      const xClamped = Math.min(state.current.x, window.innerWidth * 0.5);
      const yClamped = Math.min(state.current.y, window.innerHeight - 50);

      if (yClamped >= window.innerHeight - SEA_HEIGHT) {
        onFallIntoSea?.();
        controls.set({ x: 0, y: 0, rotate: 0 });
        return; // останавливаем анимацию
      }

      // угол наклона
      const rot = Math.min(state.current.vy * 3, 35);

      controls.set({
        x: xClamped,
        y: yClamped,
        rotate: rot,
      });

      onSpeedChange?.(Math.max(state.current.vx, 2));
      onPositionChange?.({ x: xClamped, y: yClamped });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [startFlying, onSpeedChange, onFallIntoSea, onPositionChange, boost]);
  // ↑ boost оставляем в зависимостях — теперь это безопасно

  return <motion.img src={airplaneImg} alt='Airplane' className={cls.airplane} animate={controls} />;
};

export default Airplane;
