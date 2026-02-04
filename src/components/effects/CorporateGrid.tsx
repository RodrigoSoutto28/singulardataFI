import { useEffect, useRef } from 'react';

export function CorporateGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Corporate color palette
    const primaryColor = { r: 66, g: 158, b: 189 }; // #429EBD
    const accentColor = { r: 95, g: 226, b: 245 }; // #5FE2F5

    // Grid configuration
    const gridSize = 60;
    let time = 0;

    // Floating data points
    const dataPoints: Array<{
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      size: number;
      speed: number;
      opacity: number;
    }> = [];

    // Initialize data points
    for (let i = 0; i < 15; i++) {
      dataPoints.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        targetX: Math.random() * canvas.width,
        targetY: Math.random() * canvas.height,
        size: Math.random() * 3 + 2,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.005;

      // Draw subtle grid
      ctx.strokeStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.03)`;
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw animated accent lines (subtle pulse effect)
      const pulseOffset = Math.sin(time) * 0.5 + 0.5;
      
      // Top accent line
      const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient1.addColorStop(0, `rgba(${accentColor.r}, ${accentColor.g}, ${accentColor.b}, 0)`);
      gradient1.addColorStop(0.3 + pulseOffset * 0.2, `rgba(${accentColor.r}, ${accentColor.g}, ${accentColor.b}, ${0.15 * pulseOffset})`);
      gradient1.addColorStop(0.5, `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${0.1 * pulseOffset})`);
      gradient1.addColorStop(0.7 + pulseOffset * 0.2, `rgba(${accentColor.r}, ${accentColor.g}, ${accentColor.b}, ${0.15 * pulseOffset})`);
      gradient1.addColorStop(1, `rgba(${accentColor.r}, ${accentColor.g}, ${accentColor.b}, 0)`);
      
      ctx.strokeStyle = gradient1;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.15);
      ctx.lineTo(canvas.width, canvas.height * 0.15);
      ctx.stroke();

      // Bottom accent line
      const gradient2 = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient2.addColorStop(0, `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0)`);
      gradient2.addColorStop(0.4, `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, ${0.12 * (1 - pulseOffset)})`);
      gradient2.addColorStop(0.6, `rgba(${accentColor.r}, ${accentColor.g}, ${accentColor.b}, ${0.08 * (1 - pulseOffset)})`);
      gradient2.addColorStop(1, `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0)`);
      
      ctx.strokeStyle = gradient2;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.85);
      ctx.lineTo(canvas.width, canvas.height * 0.85);
      ctx.stroke();

      // Update and draw data points
      dataPoints.forEach((point) => {
        // Move towards target
        const dx = point.targetX - point.x;
        const dy = point.targetY - point.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 5) {
          // Pick new target
          point.targetX = Math.random() * canvas.width;
          point.targetY = Math.random() * canvas.height;
        } else {
          point.x += (dx / distance) * point.speed;
          point.y += (dy / distance) * point.speed;
        }

        // Draw point with glow
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accentColor.r}, ${accentColor.g}, ${accentColor.b}, ${point.opacity})`;
        ctx.fill();

        // Subtle glow
        const glowGradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, point.size * 4
        );
        glowGradient.addColorStop(0, `rgba(${accentColor.r}, ${accentColor.g}, ${accentColor.b}, ${point.opacity * 0.3})`);
        glowGradient.addColorStop(1, `rgba(${accentColor.r}, ${accentColor.g}, ${accentColor.b}, 0)`);
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
      });

      // Draw corner accents
      const cornerSize = 80;
      ctx.strokeStyle = `rgba(${primaryColor.r}, ${primaryColor.g}, ${primaryColor.b}, 0.08)`;
      ctx.lineWidth = 1;

      // Top-left corner
      ctx.beginPath();
      ctx.moveTo(0, cornerSize);
      ctx.lineTo(0, 0);
      ctx.lineTo(cornerSize, 0);
      ctx.stroke();

      // Top-right corner
      ctx.beginPath();
      ctx.moveTo(canvas.width - cornerSize, 0);
      ctx.lineTo(canvas.width, 0);
      ctx.lineTo(canvas.width, cornerSize);
      ctx.stroke();

      // Bottom-left corner
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - cornerSize);
      ctx.lineTo(0, canvas.height);
      ctx.lineTo(cornerSize, canvas.height);
      ctx.stroke();

      // Bottom-right corner
      ctx.beginPath();
      ctx.moveTo(canvas.width - cornerSize, canvas.height);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(canvas.width, canvas.height - cornerSize);
      ctx.stroke();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
