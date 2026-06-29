import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function CountdownTimer({ SidebarWrapper }) {
  const [inputMinutes, setInputMinutes] = useState(5);
  const [inputSeconds, setInputSeconds] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  const timerRef = useRef(null);

  // Load initial time when inputs change (and not running)
  useEffect(() => {
    if (!isRunning && !isFinished) {
      setTimeLeft(inputMinutes * 60 + inputSeconds);
    }
  }, [inputMinutes, inputSeconds, isRunning, isFinished]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setIsFinished(true);
            playAlarm();
            fireConfetti();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  const playAlarm = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      // Use 'square' or 'sawtooth' wave for a classic siren sound
      oscillator.type = 'sawtooth';
      
      const startTime = audioCtx.currentTime;
      const duration = 6; // Play siren for 6 seconds
      
      // Make the siren sweep up and down
      oscillator.frequency.setValueAtTime(600, startTime);
      
      // Loop the siren sweep 3 times (1 second each loop)
      for (let j = 0; j < duration; j++) {
        oscillator.frequency.linearRampToValueAtTime(1200, startTime + j + 0.5);
        oscillator.frequency.linearRampToValueAtTime(600, startTime + j + 1);
      }
      
      // Fade in and fade out the volume so it doesn't click sharply
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.1); // Volume level 0.3 (not too loud)
      gainNode.gain.setValueAtTime(0.3, startTime + duration - 0.2);
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    } catch (e) {
      console.error("Audio not supported", e);
    }
  };

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#d4af37', '#f9d854', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#d4af37', '#f9d854', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleStart = () => {
    if (timeLeft === 0 && !isFinished) {
      setTimeLeft(inputMinutes * 60 + inputSeconds);
    }
    if (isFinished) {
      setIsFinished(false);
      setTimeLeft(inputMinutes * 60 + inputSeconds);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(inputMinutes * 60 + inputSeconds);
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <SidebarWrapper>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <div className="input-group" style={{ flex: 1, minWidth: 0 }}>
            <label style={{ whiteSpace: 'nowrap' }}>Minutes</label>
            <input 
              type="number" 
              min="0" 
              max="60" 
              value={inputMinutes} 
              onChange={e => setInputMinutes(Math.min(60, Math.max(0, Number(e.target.value))))} 
              disabled={isRunning}
            />
          </div>
          <div className="input-group" style={{ flex: 1, minWidth: 0 }}>
            <label style={{ whiteSpace: 'nowrap' }}>Seconds</label>
            <input 
              type="number" 
              min="0" 
              max="59" 
              value={inputSeconds} 
              onChange={e => setInputSeconds(Math.min(59, Math.max(0, Number(e.target.value))))} 
              disabled={isRunning}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {!isRunning ? (
            <button className="btn-primary" onClick={handleStart}>
              {isFinished ? "RESTART TIMER" : timeLeft < (inputMinutes * 60 + inputSeconds) && timeLeft > 0 ? "RESUME" : "START TIMER"}
            </button>
          ) : (
            <button className="btn-secondary" onClick={handlePause} style={{ borderColor: '#ff4444', color: '#ff4444' }}>
              PAUSE
            </button>
          )}
          
          <button className="btn-secondary" onClick={handleReset} disabled={isRunning && timeLeft === (inputMinutes * 60 + inputSeconds)}>
            RESET
          </button>
        </div>
      </SidebarWrapper>

      <main className="stage">
        <div className="stage-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className={`mega-number ${isFinished ? 'timer-text-finished' : ''}`} style={{ fontSize: 'clamp(6rem, 20vw, 15rem)', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', textShadow: isFinished ? 'none' : '0 0 50px rgba(212, 175, 55, 0.4)' }}>
            {isFinished ? "00:00" : formatTime(timeLeft)}
          </div>
          
          {isFinished && (
            <div className="cool-hint timer-text-finished" style={{ marginTop: '2rem', fontSize: '3rem', letterSpacing: '4px' }}>
              TIME'S UP!
            </div>
          )}
        </div>
      </main>
    </>
  );
}
