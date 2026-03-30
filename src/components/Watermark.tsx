import { useEffect, useState } from 'react';

const Watermark = () => {
  const [fontSize, setFontSize] = useState('5rem');

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) setFontSize('2rem');
      else if (w < 768) setFontSize('3rem');
      else if (w < 1024) setFontSize('4rem');
      else setFontSize('5rem');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <span
        style={{
          fontSize,
          fontWeight: 700,
          color: 'rgba(0, 0, 0, 0.12)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          transform: 'rotate(-35deg)',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        Sample Website
      </span>
    </div>
  );
};

export default Watermark;
