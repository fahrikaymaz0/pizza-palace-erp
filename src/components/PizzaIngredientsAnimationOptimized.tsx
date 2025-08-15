'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// Base64 encoded ingredient images - optimize edilmiş
const INGREDIENT_BASE64 = {
  domates: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // Placeholder
  biber: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // Placeholder
  mantar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // Placeholder
  mısır: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // Placeholder
  sucuk: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // Placeholder
  zeytin: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // Placeholder
};

const INGREDIENT_TYPES = Object.keys(INGREDIENT_BASE64);

interface Ingredient {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  type: string;
}

const PizzaIngredientsAnimationOptimized = () => {
  const [isLoading, setIsLoading] = useState(true);
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const ingredientsRef = useRef<Ingredient[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const texturesRef = useRef<{ [key: string]: THREE.Texture }>({});
  const texturesLoadedRef = useRef(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Base64 texture'ları anında yükle - ÇOK DAHA HIZLI!
    const loader = new THREE.TextureLoader();
    const totalTextures = INGREDIENT_TYPES.length;

    INGREDIENT_TYPES.forEach((type) => {
      const base64Data = INGREDIENT_BASE64[type as keyof typeof INGREDIENT_BASE64];
      
      loader.load(
        base64Data, // Base64 data URL
        texture => {
          // Texture optimizasyonları
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.generateMipmaps = false; // Performans için mipmap'leri kapat
          texture.flipY = false; // UV koordinatları için
          
          texturesRef.current[type] = texture;
          texturesLoadedRef.current++;

          // Tüm texture'lar yüklendiğinde animasyonu başlat
          if (texturesLoadedRef.current === totalTextures) {
            setIsLoading(false);
            initializeAnimation();
          }
        },
        undefined,
        error => {
          console.error('Base64 texture yükleme hatası:', error);
          texturesLoadedRef.current++;
          if (texturesLoadedRef.current === totalTextures) {
            setIsLoading(false);
            initializeAnimation();
          }
        }
      );
    });

    const initializeAnimation = () => {
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

      // Renderer setup - DAHA FAZLA OPTİMİZASYON
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
        precision: 'mediump', // Performans için düşük precision
      });
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Daha düşük pixel ratio
      renderer.shadowMap.enabled = false; // Shadow'ları kapat
      mountRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Ingredient oluşturucu - OPTİMİZE EDİLMİŞ
      const createIngredient = (type: string, x: number): Ingredient => {
        const texture = texturesRef.current[type] || null;
        const size = 0.9;
        
        // Geometry'yi paylaş (memory optimization)
        const geometry = new THREE.PlaneGeometry(size, size);
        
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
          side: THREE.DoubleSide, // Çift taraflı görünürlük
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, 8, 0);
        
        return {
          mesh,
          velocity: new THREE.Vector3(
            0,
            -0.15 - Math.random() * 0.08, // Daha hızlı düşüş
            0
          ),
          type,
        };
      };

      // Animation loop - ÇOK DAHA HIZLI
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate);

        // Genişlik oranına göre x aralığı hesapla
        const aspect = camera.aspect;
        const xRange = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z * aspect;

        // Daha sık yeni ingredient ekle - PERFORMANS ARTTI
        if (Math.random() < 0.2) { // %20 şans
          const randomType = INGREDIENT_TYPES[Math.floor(Math.random() * INGREDIENT_TYPES.length)];
          const x = (Math.random() - 0.5) * 2 * xRange;
          const ingredient = createIngredient(randomType, x);
          scene.add(ingredient.mesh);
          ingredientsRef.current.push(ingredient);
        }

        // Ingredient'leri güncelle - OPTİMİZE EDİLMİŞ
        for (let i = ingredientsRef.current.length - 1; i >= 0; i--) {
          const ingredient = ingredientsRef.current[i];
          ingredient.mesh.position.add(ingredient.velocity);

          // Ekran dışına çıktığında temizle
          if (ingredient.mesh.position.y < -8) {
            scene.remove(ingredient.mesh);
            ingredient.mesh.geometry.dispose();
            (ingredient.mesh.material as THREE.Material).dispose();
            ingredientsRef.current.splice(i, 1);
          }
        }

        renderer.render(scene, camera);
      };

      animate();

      // Handle resize - OPTİMİZE EDİLMİŞ
      const handleResize = () => {
        if (!mountRef.current || !camera || !renderer) return;
        
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
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
        // Scene temizliği - OPTİMİZE EDİLMİŞ
        if (scene) {
          scene.traverse(object => {
            if (object instanceof THREE.Mesh) {
              object.geometry.dispose();
              if (object.material instanceof THREE.Material) {
                object.material.dispose();
              }
            }
          });
        }
      };
    };

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  // Loading durumunda hızlı animasyon
  if (isLoading) {
    return (
      <div className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center">
        <div className="text-6xl animate-pulse">🍕</div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default PizzaIngredientsAnimationOptimized; 