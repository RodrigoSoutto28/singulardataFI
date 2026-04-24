export function CorporateGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 50% 0%, hsl(var(--primary) / 0.06) 0%, transparent 55%),
            radial-gradient(ellipse 80% 50% at 100% 100%, hsl(var(--primary) / 0.04) 0%, transparent 45%)
          `,
        }}
      />

      {/* Soft refraction orbs (so glass has something to bend) */}
      <div
        className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full opacity-40"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--primary) / 0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute top-1/3 right-[-120px] w-[420px] h-[420px] rounded-full opacity-30"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--accent) / 0.18) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        className="absolute bottom-[-160px] left-1/3 w-[520px] h-[520px] rounded-full opacity-25"
        style={{
          background:
            'radial-gradient(circle, hsl(var(--warning) / 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}
