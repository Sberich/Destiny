import React, { useState } from 'react';

export default function ListAll({ SidebarWrapper }) {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [numbers, setNumbers] = useState([]);

  const handleGenerateList = () => {
    if (min > max) {
      alert("From number must be less than or equal to To number.");
      return;
    }

    const arr = [];
    for (let i = min; i <= max; i++) {
      arr.push(i);
    }

    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    setNumbers(arr);
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
        <button className="btn-primary" onClick={handleGenerateList}>
          List All Numbers
        </button>
      </SidebarWrapper>

      <main className="stage">
        {numbers.length > 0 ? (
          <div className="mega-grid">
            {numbers.map((num, idx) => (
              <div key={idx} className="mega-chip" style={{ animationDelay: `${(idx % 20) * 0.03}s` }}>
                {num}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
            Click "List All Numbers" to generate
          </div>
        )}
      </main>
    </>
  );
}
