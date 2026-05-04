import { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  className?: string;
}

const ParticleBackground = ({ className }: ParticleBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let loopId = 0;
    let particles: Particle[] = [];

    const options = {
      particleColor: 'rgba(255,255,255,0.85)',
      lineColor: 'rgba(66,158,189)', // brand primary #429EBD
      particleAmount: 40,
      defaultRadius: 1.5,
      variantRadius: 1.5,
      defaultSpeed: 0.4,
      variantSpeed: 0.4,
      linkRadius: 300,
    };

    const baseW = 2800;
    const baseH = 1200;
    const basePerimeter = baseW + baseH;
    const rgb = options.lineColor.match(/\d+/g) ?? ['66', '158', '189'];

    const resizeReset = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      color: string;
      radius: number;
      speed: number;
      directionAngle: number;
      vector: { x: number; y: number };

      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.color = options.particleColor;
        this.radius = options.defaultRadius + Math.random() * options.variantRadius;
        this.speed = options.defaultSpeed + Math.random() * options.variantSpeed;
        this.directionAngle = Math.random() * Math.PI * 2;
        this.vector = {
          x: Math.cos(this.directionAngle) * this.speed,
          y: Math.sin(this.directionAngle) * this.speed,
        };
      }

      update() {
        this.border();
        this.x += this.vector.x;
        this.y += this.vector.y;
      }

      border() {
        if (this.x >= w || this.x <= 0) this.vector.x *= -1;
        if (this.y >= h || this.y <= 0) this.vector.y *= -1;
        if (this.x > w) this.x = w;
        if (this.y > h) this.y = h;
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const initializeParticles = () => {
      const screenPerimeter = w + h;
      const scale = screenPerimeter / basePerimeter;
      options.particleAmount = Math.min(120, Math.floor((w + h) / 50));
      options.defaultSpeed = Math.sqrt(scale) * 0.4;
      options.variantSpeed = Math.sqrt(scale) * 0.4;
      options.linkRadius = w / 10 + h / 5;
      particles = [];
      for (let i = 0; i < options.particleAmount; i++) {
        particles.push(new Particle());
      }
    };

    const checkDistance = (x1: number, y1: number, x2: number, y2: number) =>
      Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    const linkPoints = (point: Particle, hubs: Particle[]) => {
      hubs.forEach((hub) => {
        const distance = checkDistance(point.x, point.y, hub.x, hub.y);
        const opacity = 1 - distance / options.linkRadius;
        if (opacity > 0) {
          ctx.lineWidth = 0.5;
          ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(hub.x, hub.y);
          ctx.stroke();
        }
      });
    };

    const drawScene = () => {
      particles.forEach((p) => linkPoints(p, particles));
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
    };

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      drawScene();
      loopId = requestAnimationFrame(loop);
    };

    const handleResize = () => {
      resizeReset();
      initializeParticles();
    };

    resizeReset();
    initializeParticles();
    loopId = requestAnimationFrame(loop);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(loopId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={
        className ??
        'pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90'
      }
    />
  );
};

export default ParticleBackground;
