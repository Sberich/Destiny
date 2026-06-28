import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function Randomizer({ SidebarWrapper }) {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [isUnique, setIsUnique] = useState(false);
  const [currentNumber, setCurrentNumber] = useState('?');
  const [history, setHistory] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const intervalRef = useRef(null);

  // Clear interval on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#d4af37', '#f9d854', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#d4af37', '#f9d854', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleRandomize = () => {
    if (min > max) {
      alert("From number must be less than or equal to To number.");
      return;
    }
    if (isSpinning) return;

    let possibleNumbers = [];
    for (let i = min; i <= max; i++) {
      possibleNumbers.push(i);
    }

    if (isUnique) {
      possibleNumbers = possibleNumbers.filter(n => !history.includes(n));
      if (possibleNumbers.length === 0) {
        alert("All unique numbers have been drawn!");
        return;
      }
    }

    setIsSpinning(true);
    setIsFinal(false);
    
    // Choose the final number in advance
    const randomIndex = Math.floor(Math.random() * possibleNumbers.length);
    const chosen = possibleNumbers[randomIndex];

    const spinDuration = 5000; // 5 seconds
    const startTime = Date.now();
    
    // Rapid spin effect
    intervalRef.current = setInterval(() => {
      const fakeRandom = Math.floor(Math.random() * (max - min + 1)) + min;
      setCurrentNumber(fakeRandom);

      if (Date.now() - startTime >= spinDuration) {
        clearInterval(intervalRef.current);
        setCurrentNumber(chosen);
        setIsSpinning(false);
        setIsFinal(true);
        if (isUnique) {
          setHistory(prev => [chosen, ...prev]);
        }
        fireConfetti();
      }
    }, 70); // 70ms per spin frame
  };

  const handleReset = () => {
    setHistory([]);
    setCurrentNumber('?');
    setIsFinal(false);
    setIsSpinning(false);
  };

  return (
    <>
      <SidebarWrapper>
        <div className="input-group">
          <label>From Number</label>
          <input type="number" value={min} onChange={e => setMin(Number(e.target.value))} />
        </div>
        <div className="input-group">
          <label>To Number</label>
          <input type="number" value={max} onChange={e => setMax(Number(e.target.value))} />
        </div>
        
        <label className="checkbox-group">
          <input type="checkbox" checked={isUnique} onChange={e => {
            setIsUnique(e.target.checked);
            if (e.target.checked) handleReset();
          }} />
          <span>Unique Number (No Repeats)</span>
        </label>

        {isUnique && history.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>
              Drawn: {history.length} / {max - min + 1}
            </p>
            <button className="btn-secondary" onClick={handleReset}>Reset Drawer</button>
          </div>
        )}
      </SidebarWrapper>
      
      <main className="stage">
        <div className="stage-center">
          <div 
            className={`mega-number-container ${isSpinning ? 'disabled' : ''}`} 
            onClick={!isSpinning ? handleRandomize : undefined}
            title="Click to Randomize!"
          >
            <div className={`mega-number ${isSpinning ? 'spinning' : ''} ${isFinal ? 'final' : ''}`}>
              {currentNumber}
            </div>
          </div>
          {!isSpinning && !isFinal && currentNumber === '?' && (
            <div className="cool-hint">RANDOMIZE!</div>
          )}
        </div>
      </main>
    </>
  );
}
