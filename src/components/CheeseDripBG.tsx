'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CheeseDripBGProps {
  className?: string;
}

// Basit ve performans dostu: birkaç sarı damla yavaşça aşağı süzülür, alt sınırda yeniden başlar
export default function CheeseDripBG({ className }: CheeseDripBGProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const dropsRef = useRef<THREE.Mesh[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Ortografik kamera (2D benzeri görünüm, performans iyi)
    const camera = new THREE.OrthographicCamera(0, width, height, 0, -10, 10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    // Arka plan degrade (mesh)
    const bgGeometry = new THREE.PlaneGeometry(width, height);
    const bgMaterial = new THREE.MeshBasicMaterial({
      color: 0xfff6e5,
      transparent: true,
      opacity: 0.4,
    });
    const bg = new THREE.Mesh(bgGeometry, bgMaterial);
    bg.position.set(width / 2, height / 2, -1);
    scene.add(bg);

    // Damla materyali (cheddar)
    const cheeseColor = new THREE.Color('#f7c948');
    const material = new THREE.MeshBasicMaterial({ color: cheeseColor });

    const dropCount = 14;
    const drops: THREE.Mesh[] = [];
    for (let i = 0; i < dropCount; i++) {
      const radius = 6 + Math.random() * 12; // 6-18px
      const geom = new THREE.SphereGeometry(radius, 12, 12);
      const drop = new THREE.Mesh(geom, material);
      const x = Math.random() * width;
      const y = Math.random() * height;
      drop.position.set(x, y, 0);
      (drop as any).speed = 20 + Math.random() * 40; // px/sn
      (drop as any).wiggle = 20 + Math.random() * 30;
      (drop as any).phase = Math.random() * Math.PI * 2;
      scene.add(drop);
      drops.push(drop);
    }
    dropsRef.current = drops;

    let last = performance.now();
    const animate = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const t = now / 1000;

      for (const d of dropsRef.current) {
        const speed = (d as any).speed as number;
        const wiggle = (d as any).wiggle as number;
        const phase = (d as any).phase as number;
        d.position.y += speed * dt;
        d.position.x += Math.sin(t * 2 + phase) * 10 * dt;
        if (d.position.y - 20 > height) {
          d.position.y = -10;
          d.position.x = Math.random() * width;
        }
      }

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      rendererRef.current.setSize(w, h);
      cameraRef.current.left = 0;
      cameraRef.current.right = w;
      cameraRef.current.top = 0;
      cameraRef.current.bottom = h;
      cameraRef.current.updateProjectionMatrix();
      bg.geometry.dispose();
      bg.geometry = new THREE.PlaneGeometry(w, h);
      bg.position.set(w / 2, h / 2, -1);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (rendererRef.current) rendererRef.current.dispose();
      if (sceneRef.current) {
        sceneRef.current.traverse(obj => {
          if ((obj as any).geometry) (obj as any).geometry.dispose?.();
          if ((obj as any).material) (obj as any).material.dispose?.();
        });
      }
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} className={className} style={{ position: 'absolute', inset: 0 }} />
  );
}




