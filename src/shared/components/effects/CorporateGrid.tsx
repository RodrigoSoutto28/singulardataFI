export function CorporateGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Soft top-left tint */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 0% 0%, hsl(var(--primary) / 0.05) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 100% 100%, hsl(var(--accent) / 0.04) 0%, transparent 55%)
          `,
        }}
      />
    </div>
  );
}
