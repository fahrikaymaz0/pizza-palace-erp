'use client';

import { useEffect, useRef } from 'react';

interface Ingredient {
  name: string;
  color: string;
  size: number;
  y: number;
  falling: boolean;
  delay: number;
}

export default function Pizza3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas boyutlarını ayarla
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Malzemeler listesi
    const ingredients: Ingredient[] = [
      { name: 'Domates', color: '#dc2626', size: 15, y: -100, falling: false, delay: 0 },
      { name: 'Mantar', color: '#8b5a2b', size: 12, y: -100, falling: false, delay: 1000 },
      { name: 'Mısır', color: '#fbbf24', size: 8, y: -100, falling: false, delay: 2000 },
      { name: 'Sosis', color: '#dc2626', size: 18, y: -100, falling: false, delay: 3000 },
      { name: 'Salam', color: '#dc2626', size: 16, y: -100, falling: false, delay: 4000 },
      { name: 'Peynir', color: '#fef3c7', size: 10, y: -100, falling: false, delay: 5000 },
      { name: 'Zeytin', color: '#166534', size: 6, y: -100, falling: false, delay: 6000 },
      { name: 'Biber', color: '#16a34a', size: 9, y: -100, falling: false, delay: 7000 }
    ];

    let time = 0;
    let startTime = Date.now();

    const animate = () => {
      time += 0.02;
      const currentTime = Date.now() - startTime;
      
      // Canvas'ı temizle
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#f97316');
      gradient.addColorStop(1, '#dc2626');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Pizza hamuru (alt kısımda)
      const centerX = canvas.width / 2;
      const centerY = canvas.height * 0.8;
      const radius = Math.min(canvas.width, canvas.height) * 0.25;
      
      // Pizza hamuru
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Pizza dilimleri
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8 + time * 0.5;
        const x = centerX + Math.cos(angle) * radius * 0.8;
        const y = centerY + Math.sin(angle) * radius * 0.8;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Malzemeler animasyonu
      ingredients.forEach((ingredient, index) => {
        if (currentTime > ingredient.delay) {
          if (!ingredient.falling) {
            ingredient.falling = true;
            ingredient.y = -50;
          }
          
          // Malzeme düşme animasyonu
          if (ingredient.falling && ingredient.y < centerY - radius * 0.5) {
            ingredient.y += 2;
          }
          
          // Malzeme çizimi
          const x = centerX + Math.sin(time + index) * (radius * 0.3);
          const y = ingredient.y;
          
          // Malzeme gölgesi
          ctx.beginPath();
          ctx.arc(x + 2, y + 2, ingredient.size, 0, 2 * Math.PI);
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.fill();
          
          // Malzeme
          ctx.beginPath();
          ctx.arc(x, y, ingredient.size, 0, 2 * Math.PI);
          ctx.fillStyle = ingredient.color;
          ctx.fill();
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Malzeme adı
          ctx.fillStyle = '#fff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(ingredient.name, x, y + ingredient.size + 20);
        }
      });
      
      // Peynir efekti (pizza üzerinde)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.9, 0, 2 * Math.PI);
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Dönen efekt
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.5);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.7, 0, Math.PI);
      ctx.stroke();
      ctx.restore();
      
      // Başlık
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Pizza Malzemeleri', canvas.width / 2, 50);
      
      // Açıklama
      ctx.font = '16px Arial';
      ctx.fillText('Malzemeler pizzanıza düşüyor...', canvas.width / 2, 80);
      
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-lg"
        style={{ display: 'block' }}
      />
    </div>
  );
} 