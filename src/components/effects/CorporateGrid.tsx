export function CorporateGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {/* Subtle corporate gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 50% 0%, hsl(var(--primary) / 0.03) 0%, transparent 50%),
            radial-gradient(ellipse 80% 50% at 100% 100%, hsl(var(--primary) / 0.02) 0%, transparent 40%)
          `
        }}
      />
    </div>
  );
}
