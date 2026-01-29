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

const AviaMasters: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [ships, setShips] = useState<ShipType[]>([{ id: 0, isDefault: true }]); // корабль по дефолту
const [planeSpeed, setPlaneSpeed] = useState(0)
const [bonuses, setBonuses] = useState<any[]>([]);

  const handleStart = () => setStarted(true);

  const handleFallIntoSea = () => {
  setStarted(false)   // остановить игру
  setShips([{ id: 0, isDefault: true }]) // сбросить корабли
}

  useEffect(() => {
    if (!started) return;

    let shipId = 1; // следующий корабль после дефолтного

    const interval = setInterval(() => {
      setShips((prev) => [...prev, { id: shipId }]);
      shipId++;
    }, SHIP_SPEED / 2);

    return () => clearInterval(interval);
  }, [started]);

  useEffect(() => {
  if (!started) return;

  let bonusId = 1;

  const interval = setInterval(() => {
  const minX = 0.1 * SCREEN_WIDTH;
  const maxX = 0.9 * SCREEN_WIDTH;

  const minY = 250;
  const maxY = SCREEN_HEIGHT - 50;

  const randomValue = Math.floor(Math.random() * 3) + 1;
  const randomX = Math.random() * (maxX - minX) + minX;
  const randomY = Math.random() * (maxY - minY) + minY;

  setBonuses(prev => [
    ...prev,
    { id: bonusId++, value: randomValue, x: randomX, y: randomY },
  ]);
}, 1000);

  return () => clearInterval(interval);
}, [started]);

const handleBonusAnimationComplete = (id: number) => {
  setBonuses(prev => prev.filter(bonus => bonus.id !== id));
};

  const handleAnimationComplete = (id: number) => {
    setShips((prev) => prev.filter((ship) => ship.id !== id));
  };

  return (
    <div className={styles.gameArea} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Самолёт */}
     <Airplane startFlying={started} onSpeedChange={setPlaneSpeed}  onFallIntoSea={handleFallIntoSea}/>
     <div className={styles.sea} />
    
      {/* Корабли */}
     {ships.map((ship) => {
  return (
    <Ship handleAnimationComplete={handleAnimationComplete} id={ship.id}planeSpeed={planeSpeed}started={started}/>
  )
      })}

      {bonuses.map(bonus => (
   <Bonus
    key={bonus.id}
    bonus={bonus}
    // onAnimationComplete={handleBonusAnimationComplete}
    
  />
))}

      {/* Кнопка старта */}
      {!started && (
        <button className={styles.startButton} onClick={handleStart}>
          Start Game
        </button>
      )}
    </div>
  );
};

export default AviaMasters;
