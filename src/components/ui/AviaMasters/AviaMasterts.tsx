import React, { useState, useEffect, useRef } from 'react';
import styles from './AviaMasters.module.scss';
import Airplane from './Airplane/Airplane';
import Ship from './Ship/Ship';
import Bonus from './Bonus/Bonus';

const SCREEN_WIDTH = typeof window !== 'undefined' ? window.innerWidth : 1200;
const SCREEN_HEIGHT = typeof window !== 'undefined' ? window.innerHeight : 1200;

const SHIP_SPEED = 6000;
const SEA_HEIGHT = 200;

interface ShipType {
  id: number;
  isDefault?: boolean;
}

export interface BonusType {
  id: number;
  value: number;
  x: number;
  y: number;
}

const INITIAL_BONUSES_COUNT = 7;

const AviaMasters: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [ships, setShips] = useState<ShipType[]>([{ id: 0, isDefault: true }]);
  const [planeSpeed, setPlaneSpeed] = useState(0);
  const [bonuses, setBonuses] = useState<BonusType[]>([]);
  const [boost, setBoost] = useState(0);
  const [airplanePos, setAirplanePos] = useState<{ x: number; y: number }>({ x: 30, y: 0 });
  const [score, setScore] = useState(0);
  const airplanePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const bonusesRef = useRef<BonusType[]>([]);

  useEffect(() => {
    bonusesRef.current = bonuses;
  }, [bonuses]);

  const handleStart = () => setStarted(true);

  const handleFallIntoSea = () => {
    setStarted(false);
    setShips([{ id: 0, isDefault: true }]);
    setBonuses([]);
    setPlaneSpeed(0);
    setScore(0);
  };

  // Генерируем бонусы сразу при старте
  useEffect(() => {
    if (started) return;
    const newBonuses: BonusType[] = [];
    for (let i = 1; i <= INITIAL_BONUSES_COUNT; i++) {
      const minX = 0.1 * SCREEN_WIDTH;
      const maxX = 0.9 * SCREEN_WIDTH;
      const minY = 250;
      const maxY = SCREEN_HEIGHT - 50;
      newBonuses.push({
        id: i,
        value: Math.floor(Math.random() * 3) + 1,
        x: Math.random() * (maxX - minX) + minX,
        y: Math.random() * (maxY - minY) + minY,
      });
    }
    setBonuses(newBonuses);
  }, [started]);

  useEffect(() => {
    airplanePosRef.current = airplanePos;
  }, [airplanePos]);

  // Добавляем новые корабли после старта
  useEffect(() => {
    if (!started) return;

    let shipId = 1;
    const interval = setInterval(() => {
      setShips((prev) => [...prev, { id: shipId }]);
      shipId++;
    }, SHIP_SPEED / 2);

    return () => clearInterval(interval);
  }, [started]);

  // Двигаем бонусы влево
  useEffect(() => {
    if (!started) return;

    const BONUS_SPEED = 2;
    const interval = setInterval(() => {
      setBonuses((prev) => prev.map((b) => ({ ...b, x: b.x - BONUS_SPEED })).filter((b) => b.x > -50));
    }, 16);

    return () => clearInterval(interval);
  }, [started]);

  const checkCollisionRef = useRef<number | null>(null);

  useEffect(() => {
    if (!started) return;

    const checkCollision = () => {
      let pointsToAdd = 0;
      let boostTriggered = false;

      const newBonuses = bonusesRef.current.filter((b) => {
        const planeRect = {
          x: airplanePosRef.current.x + 90, // ← твои текущие значения из отладки
          y: airplanePosRef.current.y + 680,
          width: 120,
          height: 120,
        };

        const bonusRect = {
          x: b.x,
          y: b.y - 49,
          width: 90,
          height: 92,
        };

        const isColliding =
          planeRect.x < bonusRect.x + bonusRect.width &&
          planeRect.x + planeRect.width > bonusRect.x &&
          planeRect.y < bonusRect.y + bonusRect.height &&
          planeRect.y + planeRect.height > bonusRect.y;

        // ←←← самый важный лог
        if (isColliding) {
          console.log('COLLISION DETECTED!', {
            bonusId: b.id,
            bonusX: b.x,
            bonusY: b.y,
            planeX: airplanePosRef.current.x,
            planeY: airplanePosRef.current.y,
          });
          pointsToAdd += b.value;
          boostTriggered = true;
          return false;
        }

        return true;
      });

      setBonuses(newBonuses);

      if (pointsToAdd > 0) {
        setScore((s) => s + pointsToAdd);
      }
      if (boostTriggered) {
        setBoost(1);
      }

      checkCollisionRef.current = requestAnimationFrame(checkCollision);
    };
    // стартуем проверку
    checkCollisionRef.current = requestAnimationFrame(checkCollision);

    return () => {
      if (checkCollisionRef.current) cancelAnimationFrame(checkCollisionRef.current);
    };
  }, [started]);

  // Сбрасываем boost после короткого импульса
  useEffect(() => {
    if (boost) {
      const timer = setTimeout(() => setBoost(0), 50);
      return () => clearTimeout(timer);
    }
  }, [boost]);

  const handleAnimationComplete = (id: number) => {
    setShips((prev) => prev.filter((ship) => ship.id !== id));
  };

  // useEffect(() => {
  //   if (!started) return;

  //   const interval = setInterval(() => {
  //     const howMany = Math.floor(Math.random() * 5) + 3; // 1–3 штуки за раз

  //     const newBonuses: BonusType[] = [];
  //     for (let i = 0; i < howMany; i++) {
  //       const minX = 0.8 * SCREEN_WIDTH; // появляются справа
  //       const maxX = 1.2 * SCREEN_WIDTH; // чуть за экраном
  //       const minY = 150;
  //       const maxY = SCREEN_HEIGHT - 250;

  //       newBonuses.push({
  //         id: Date.now() + Math.random(), // уникальный id
  //         value: Math.floor(Math.random() * 3) + 1,
  //         x: Math.random() * (maxX - minX) + minX,
  //         y: Math.random() * (maxY - minY) + minY,
  //       });
  //     }

  //     setBonuses((prev) => [...prev, ...newBonuses]);
  //   }, 3000); // каждые 4.5 секунды — подбери под себя (3000–7000 мс)

  //   return () => clearInterval(interval);
  // }, [started]);

  return (
    <div className={styles.gameArea} style={{ position: 'relative', overflow: 'hidden' }}>
      <Airplane
        key={started ? 'flying' : 'ready'}
        startFlying={started}
        onSpeedChange={setPlaneSpeed}
        onFallIntoSea={handleFallIntoSea}
        onPositionChange={setAirplanePos}
        boost={boost}
      />
      <div className={styles.sea} />

      {ships.map((ship) => (
        <Ship key={ship.id} handleAnimationComplete={handleAnimationComplete} id={ship.id} planeSpeed={planeSpeed} started={started} />
      ))}

      {bonuses.map((bonus) => (
        <Bonus key={bonus.id} bonus={bonus} />
      ))}

      {!started && (
        <button className={styles.startButton} onClick={handleStart}>
          Start Game
        </button>
      )}

      <p className={styles.score}>{`Score: ${score}`}</p>
    </div>
  );
};

export default AviaMasters;
