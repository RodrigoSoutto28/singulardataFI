export function CorporateGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {/* Base gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--primary) / 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 100% 100%, hsl(var(--accent) / 0.05) 0%, transparent 40%),
            radial-gradient(ellipse 50% 30% at 0% 80%, hsl(var(--primary) / 0.04) 0%, transparent 35%)
          `
        }}
      />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Corner accents */}
      <div 
        className="absolute top-0 left-0 w-32 h-32"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, transparent 60%)'
        }}
      />
      <div 
        className="absolute top-0 right-0 w-32 h-32"
        style={{
          background: 'linear-gradient(225deg, hsl(var(--primary) / 0.06) 0%, transparent 60%)'
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-32 h-32"
        style={{
          background: 'linear-gradient(45deg, hsl(var(--primary) / 0.04) 0%, transparent 60%)'
        }}
      />
      <div 
        className="absolute bottom-0 right-0 w-32 h-32"
        style={{
          background: 'linear-gradient(315deg, hsl(var(--accent) / 0.05) 0%, transparent 60%)'
        }}
      />
      
      {/* Horizontal accent lines */}
      <div 
        className="absolute left-0 right-0 h-px opacity-10"
        style={{
          top: '15%',
          background: 'linear-gradient(90deg, transparent 0%, hsl(var(--primary)) 30%, hsl(var(--primary)) 70%, transparent 100%)'
        }}
      />
      <div 
        className="absolute left-0 right-0 h-px opacity-5"
        style={{
          top: '85%',
          background: 'linear-gradient(90deg, transparent 0%, hsl(var(--accent)) 40%, hsl(var(--accent)) 60%, transparent 100%)'
        }}
      />
    </div>
  );
}
