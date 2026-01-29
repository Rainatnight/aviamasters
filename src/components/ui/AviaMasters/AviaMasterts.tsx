import React, { useState, useEffect } from 'react';
import styles from './AviaMasters.module.scss';
import Airplane from './Airplane/Airplane';
import Ship from './Ship/Ship';
import Bonus from './Bonus/Bonus';

const SCREEN_WIDTH = typeof window !== 'undefined' ? window.innerWidth : 1200;
const SCREEN_HEIGHT = typeof window !== 'undefined' ? window.innerHeight : 1200;

const SHIP_SPEED = 6000; // время полёта корабля через экран (ms)
const SEA_HEIGHT = 200;

interface ShipType {
  id: number;
  isDefault?: boolean;
}

interface BonusType {
  id: number;
  value: number;
  x: number;
  y: number;
}

const INITIAL_BONUSES_COUNT = 5; // сколько бонусов будет на старте

const AviaMasters: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [ships, setShips] = useState<ShipType[]>([{ id: 0, isDefault: true }]);
  const [planeSpeed, setPlaneSpeed] = useState(0);
  const [bonuses, setBonuses] = useState<BonusType[]>([]);

  const handleStart = () => setStarted(true);

  const handleFallIntoSea = () => {
    setStarted(false);
    setShips([{ id: 0, isDefault: true }]);
    setBonuses([])
    setPlaneSpeed(0)
  };

  // Генерируем бонусы при загрузке игры
  useEffect(() => {
    if(started) return
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

  // Добавляем новые бонусы после старта
  useEffect(() => {
    if (!started) return;

    let bonusId = bonuses.length + 1;
    const interval = setInterval(() => {
      const minX = 0.1 * SCREEN_WIDTH;
      const maxX = 0.9 * SCREEN_WIDTH;
      const minY = 250;
      const maxY = SCREEN_HEIGHT - 50;

      setBonuses((prev) => [
        ...prev,
        {
          id: bonusId++,
          value: Math.floor(Math.random() * 3) + 1,
          x: Math.random() * (maxX - minX) + minX,
          y: Math.random() * (maxY - minY) + minY,
        },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, [started]);

  // Двигаем бонусы влево вместе с кораблями
  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setBonuses((prev) =>
        prev
          .map((b) => ({ ...b, x: b.x - planeSpeed * 0.05 })) // скорость движения бонусов
          .filter((b) => b.x > -50) // удаляем бонусы, вышедшие за экран
      );
    }, 16); // ~60 FPS

    return () => clearInterval(interval);
  }, [started, planeSpeed]);

  useEffect(() => {
  if (!started) return;

  const BONUS_SPEED = 2; // пикселей за кадр

  const interval = setInterval(() => {
    setBonuses((prev) =>
      prev
        .map((b) => ({ ...b, x: b.x - BONUS_SPEED })) // двигаем влево
        .filter((b) => b.x > -50) // удаляем вышедшие за экран
    );
  }, 16); // примерно 60 FPS

  return () => clearInterval(interval);
}, [started]);



  const handleAnimationComplete = (id: number) => {
    setShips((prev) => prev.filter((ship) => ship.id !== id));
  };

  return (
    <div className={styles.gameArea} style={{ position: 'relative', overflow: 'hidden' }}>
      <Airplane startFlying={started} onSpeedChange={setPlaneSpeed} onFallIntoSea={handleFallIntoSea} />
      <div className={styles.sea} />

      {ships.map((ship) => (
        <Ship
          key={ship.id}
          handleAnimationComplete={handleAnimationComplete}
          id={ship.id}
          planeSpeed={planeSpeed}
          started={started}
        />
      ))}

      {bonuses.map((bonus) => (
        <Bonus
          key={bonus.id}
          bonus={bonus}
        
        />
      ))}

      {!started && (
        <button className={styles.startButton} onClick={handleStart}>
          Start Game
        </button>
      )}
    </div>
  );
};

export default AviaMasters;
