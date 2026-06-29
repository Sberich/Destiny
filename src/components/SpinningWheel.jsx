import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function SpinningWheel({ SidebarWrapper }) {
  const [inputType, setInputType] = useState('numbers');
  const [namesText, setNamesText] = useState('');
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(10);
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState(null);
  
  const [wheelTheme, setWheelTheme] = useState('luxury');

  const getItems = () => {
    if (inputType === 'names') {
      return namesText.split('\n').map(n => n.trim()).filter(n => n);
    }
    const arr = [];
    for (let i = min; i <= max; i++) arr.push(i);
    return arr;
  };
  
  const items = getItems();
  
  const fireConfetti = () => {
    const duration = 4000;
    const end = Date.now() + duration;
    // If pastel, use softer bright colors, otherwise normal rainbow
    const colors = wheelTheme === 'pastel' 
      ? ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#e8c9ff'] 
      : ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#00bfff', '#4b0082', '#9400d3', '#ff1493'];
      
    (function frame() {
      confetti({ particleCount: 8, angle: 60, spread: 55, startVelocity: 80, origin: { x: 0, y: 1 }, colors: colors, zIndex: 10001 });
      confetti({ particleCount: 8, angle: 120, spread: 55, startVelocity: 80, origin: { x: 1, y: 1 }, colors: colors, zIndex: 10001 });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  const handleSpin = () => {
    if (items.length < 2) {
      alert("Please provide at least 2 items to spin.");
      return;
    }
    if (isSpinning) return;
    
    setIsSpinning(true);
    setWinner(null);
    
    const winningIndex = Math.floor(Math.random() * items.length);
    const sliceAngle = 360 / items.length;
    
    // Add random offset within the winning slice to look natural
    const randomOffset = (Math.random() * 0.8 - 0.4) * sliceAngle; 
    
    const baseRot = rotation % 360;
    // Target is 90 degrees (RIGHT side) instead of 0 (TOP)
    const targetBase = 90 - (winningIndex * sliceAngle) + randomOffset;
    
    // 10 extra full spins for a longer, more dramatic build-up
    const extraSpins = 360 * 10;
    
    let diff = targetBase - baseRot;
    while (diff < 0) diff += 360;
    
    const finalRotation = rotation + diff + extraSpins;
    
    setRotation(finalRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      setWinner(items[winningIndex]);
      fireConfetti();
    }, 8000); // 8 seconds of suspense!
  };
  
  // Math for drawing pie slices
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", x, y,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
    ].join(" ");
  };

  const pastelColors = ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff', '#e8c9ff'];

  const handleRemoveWinner = () => {
    let currentItems = getItems();
    const indexToRemove = currentItems.indexOf(winner);
    
    if (indexToRemove !== -1) {
      currentItems.splice(indexToRemove, 1);
    }
    
    // Update the textarea with the remaining items
    setNamesText(currentItems.join('\n'));
    
    // If they were in numbers mode, switch to names mode so the custom list is used
    if (inputType === 'numbers') {
      setInputType('names');
    }
    
    setWinner(null);
  };

  return (
    <>
      <SidebarWrapper>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '4px' }}>
          <button 
            style={{ flex: 1, background: inputType === 'numbers' ? 'rgba(212, 175, 55, 0.2)' : 'transparent', border: 'none', color: inputType === 'numbers' ? 'var(--gold-light)' : 'var(--text-muted)', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
            onClick={() => setInputType('numbers')}
          >
            Numbers
          </button>
          <button 
            style={{ flex: 1, background: inputType === 'names' ? 'rgba(212, 175, 55, 0.2)' : 'transparent', border: 'none', color: inputType === 'names' ? 'var(--gold-light)' : 'var(--text-muted)', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
            onClick={() => setInputType('names')}
          >
            Names
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '4px' }}>
          <button 
            style={{ flex: 1, background: wheelTheme === 'luxury' ? 'rgba(212, 175, 55, 0.2)' : 'transparent', border: 'none', color: wheelTheme === 'luxury' ? 'var(--gold-light)' : 'var(--text-muted)', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
            onClick={() => setWheelTheme('luxury')}
          >
            Luxury Dark
          </button>
          <button 
            style={{ flex: 1, background: wheelTheme === 'pastel' ? 'rgba(255, 179, 186, 0.2)' : 'transparent', border: 'none', color: wheelTheme === 'pastel' ? '#ffb3ba' : 'var(--text-muted)', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
            onClick={() => setWheelTheme('pastel')}
          >
            Sweet Pastel
          </button>
        </div>

        {inputType === 'numbers' ? (
          <>
            <div className="input-group">
              <label>From Number</label>
              <input type="number" value={min} onChange={e => setMin(Number(e.target.value))} />
            </div>
            <div className="input-group">
              <label>To Number</label>
              <input type="number" value={max} onChange={e => setMax(Number(e.target.value))} />
            </div>
          </>
        ) : (
          <div className="input-group">
            <label>List of Names (One per line)</label>
            <textarea 
              value={namesText} 
              onChange={e => setNamesText(e.target.value)}
              placeholder="John&#10;Mary&#10;Peter..."
              style={{ width: '100%', height: '200px', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--gold-light)', padding: '0.5rem 0.8rem', borderRadius: '8px', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
            />
          </div>
        )}
      </SidebarWrapper>
      
      <main className="stage" style={{ overflow: 'hidden' }}>
        
        {items.length < 2 ? (
          <div className="cool-hint">SETUP AT LEAST 2 ITEMS</div>
        ) : (
          <div className={`wheel-container ${wheelTheme === 'pastel' ? 'theme-pastel' : ''}`} onClick={handleSpin} style={{ 
            cursor: isSpinning ? 'default' : 'pointer',
            borderColor: wheelTheme === 'pastel' ? '#fff' : 'var(--gold-dark)',
            boxShadow: wheelTheme === 'pastel' 
              ? '0 0 50px rgba(255, 179, 186, 0.4), inset 0 0 30px rgba(255,255,255,0.2)'
              : '0 0 50px rgba(212, 175, 55, 0.2), 0 0 100px rgba(212, 175, 55, 0.1), inset 0 0 30px rgba(0, 0, 0, 0.8)'
          }}>
            {/* The Pointer */}
            <svg className="wheel-pointer" viewBox="0 0 100 100">
              <path d="M 20 10 L 80 10 L 50 80 Z" fill={wheelTheme === 'pastel' ? '#ff9eb5' : '#f9d854'} stroke="#fff" strokeWidth="2" />
            </svg>
            
            {/* The Wheel Center Dot */}
            <div className="wheel-center-dot" style={{
              background: wheelTheme === 'pastel' ? 'radial-gradient(circle at 30% 30%, #fff, #ffdfba)' : 'radial-gradient(circle at 30% 30%, var(--gold-light), var(--gold-dark))',
              borderColor: wheelTheme === 'pastel' ? '#fff' : 'var(--bg-color)'
            }}></div>

            {/* The Wheel Itself */}
            <div className="wheel" style={{ transform: `rotate(${rotation}deg)` }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', borderRadius: '50%' }}>
                {items.map((item, idx) => {
                  const sliceAngle = 360 / items.length;
                  const startAngle = idx * sliceAngle;
                  const endAngle = startAngle + sliceAngle;
                  
                  const isEven = idx % 2 === 0;
                  const fillColor = wheelTheme === 'pastel' 
                    ? pastelColors[idx % pastelColors.length]
                    : (isEven ? '#1a1a24' : '#0a0a0f');
                  
                  const strokeColor = wheelTheme === 'pastel' ? '#ffffff' : 'rgba(212, 175, 55, 0.4)';
                  const textAngle = startAngle + (sliceAngle / 2);

                  // Calculate font size relative to number of items so it fits
                  let fSize = 5;
                  if (items.length > 10) fSize = 4;
                  if (items.length > 20) fSize = 3;
                  if (items.length > 40) fSize = 2;
                  if (items.length > 80) fSize = 1.5;

                  return (
                    <g key={idx}>
                      <path 
                        d={describeArc(50, 50, 50, startAngle, endAngle)} 
                        fill={fillColor} 
                        stroke={strokeColor}
                        strokeWidth={wheelTheme === 'pastel' ? "0.5" : "0.2"}
                      />
                      <g transform={`rotate(${textAngle}, 50, 50)`}>
                        <text 
                          x="50" 
                          y="22" 
                          fill={wheelTheme === 'pastel' ? "#333333" : (isEven ? "#f9d854" : "#ffffff")} 
                          fontSize={fSize} 
                          fontFamily="Outfit, sans-serif" 
                          fontWeight="600" 
                          textAnchor="middle" 
                          alignmentBaseline="middle"
                          transform="rotate(-90, 50, 22)"
                        >
                          {String(item).length > 15 ? String(item).substring(0, 13) + '...' : item}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}
        
      </main>
      
      {/* Winner Modal */}
      {winner && (
        <div className="wheel-winner-modal">
          <div className="cool-hint" style={{ marginTop: 0, animation: 'none', opacity: 1, textShadow: 'none' }}>THE WINNER IS</div>
          <div className="winner-text">
            {winner}
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button className="btn-secondary" onClick={() => setWinner(null)} style={{ width: 'auto', padding: '1rem 2rem', marginTop: 0, fontWeight: 'bold' }}>
              KEEP & CONTINUE
            </button>
            <button className="btn-primary" onClick={handleRemoveWinner} style={{ width: 'auto', padding: '1rem 2rem', marginTop: 0 }}>
              REMOVE WINNER
            </button>
          </div>
        </div>
      )}
    </>
  );
}
