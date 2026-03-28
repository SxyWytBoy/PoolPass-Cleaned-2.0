const Watermark = () => {
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
          fontSize: '5rem',
          fontWeight: 700,
          color: 'rgba(0, 0, 0, 0.04)',
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
