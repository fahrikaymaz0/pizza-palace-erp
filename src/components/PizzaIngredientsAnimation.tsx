'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const INGREDIENT_IMAGES = [
  { type: 'domates', src: '/düşenpng/domates.png' },
  { type: 'biber', src: '/düşenpng/biber.png' },
  { type: 'mantar', src: '/düşenpng/mantar.png' },
  { type: 'mısır', src: '/düşenpng/mısır.png' },
  { type: 'sucuk', src: '/düşenpng/sucuk.png' },
  { type: 'zeytin', src: '/düşenpng/zeytin.png' },
];

interface Ingredient {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  type: string;
}

const PizzaIngredientsAnimation = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const ingredientsRef = useRef<Ingredient[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const texturesRef = useRef<{ [key: string]: THREE.Texture }>({});

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Texture loader
    const loader = new THREE.TextureLoader();
    INGREDIENT_IMAGES.forEach(({ type, src }) => {
      loader.load(src, texture => {
        texturesRef.current[type] = texture;
      });
    });

    // Ingredient oluşturucu (plane + PNG texture)
    const createIngredient = (type: string, x: number): Ingredient => {
      const texture = texturesRef.current[type] || null;
      const size = 0.9; // PNG'ler için boyut
      const geometry = new THREE.PlaneGeometry(size, size);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, 8, 0);
      return {
        mesh,
        velocity: new THREE.Vector3(
          0, // X ekseninde hareket yok, sadece düz iniyor
          -0.09 - Math.random() * 0.03, // Daha hızlı düşüş
          0
        ),
        type,
      };
    };

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      // Genişlik oranına göre x aralığı hesapla
      const aspect = camera.aspect;
      const xRange =
        Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * aspect;

      // Sık sık yeni ingredient ekle
      if (Math.random() < 0.12) {
        const random =
          INGREDIENT_IMAGES[
            Math.floor(Math.random() * INGREDIENT_IMAGES.length)
          ];
        const x = (Math.random() - 0.5) * 2 * xRange; // Tüm ekran genişliğine yayılacak
        const ingredient = createIngredient(random.type, x);
        scene.add(ingredient.mesh);
        ingredientsRef.current.push(ingredient);
      }

      // Ingredient'leri güncelle
      for (let i = ingredientsRef.current.length - 1; i >= 0; i--) {
        const ingredient = ingredientsRef.current[i];
        ingredient.mesh.position.add(ingredient.velocity);
        // Rotation yok
        if (ingredient.mesh.position.y < -8) {
          scene.remove(ingredient.mesh);
          ingredientsRef.current.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && renderer) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default PizzaIngredientsAnimation;
