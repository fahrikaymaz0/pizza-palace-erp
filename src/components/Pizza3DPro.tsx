'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface Ingredient3D {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  type: string;
  originalY: number;
  isAnimating: boolean;
}

interface Pizza3DProProps {
  className?: string;
  autoPlay?: boolean;
  ingredientCount?: number;
  showControls?: boolean;
}

const INGREDIENT_CONFIGS = {
  domates: { color: '#dc2626', size: 0.3, speed: 0.02 },
  biber: { color: '#16a34a', size: 0.25, speed: 0.015 },
  mantar: { color: '#8b5a2b', size: 0.2, speed: 0.018 },
  mısır: { color: '#fbbf24', size: 0.15, speed: 0.025 },
  sucuk: { color: '#dc2626', size: 0.35, speed: 0.012 },
  zeytin: { color: '#166534', size: 0.12, speed: 0.03 },
};

const INGREDIENT_TYPES = Object.keys(INGREDIENT_CONFIGS);

export default function Pizza3DPro({
  className,
  autoPlay = true,
  ingredientCount = 6,
  showControls = false,
}: Pizza3DProProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [fps, setFps] = useState(60);
  
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const ingredientsRef = useRef<Ingredient3D[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Performance monitoring
  const performanceRef = useRef({
    frameTime: 0,
    drawCalls: 0,
    triangles: 0,
  });

  // Optimized ingredient creation
  const createIngredient = useCallback((type: string, x: number): Ingredient3D => {
    const config = INGREDIENT_CONFIGS[type as keyof typeof INGREDIENT_CONFIGS];
    const geometry = new THREE.SphereGeometry(config.size, 8, 6); // Low poly for performance
    
    const material = new THREE.MeshLambertMaterial({
      color: config.color,
      transparent: true,
      opacity: 0.9,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, 8, 0);
    mesh.castShadow = false; // Disable shadows for performance
    mesh.receiveShadow = false;

    return {
      mesh,
      velocity: new THREE.Vector3(0, -config.speed, 0),
      type,
      originalY: 8,
      isAnimating: false,
    };
  }, []);

  // Scene initialization
  const initializeScene = useCallback(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1, 20); // Add fog for depth
    sceneRef.current = scene;

    // Camera setup with better positioning
    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup with optimizations
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Disable antialiasing for performance
      powerPreference: 'high-performance',
      precision: 'mediump',
      stencil: false,
      depth: true,
    });

    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Pizza base (invisible platform)
    const pizzaBase = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 0.1, 16),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    pizzaBase.position.y = -2;
    scene.add(pizzaBase);

    // Create ingredients
    const ingredients: Ingredient3D[] = [];
    for (let i = 0; i < ingredientCount; i++) {
      const type = INGREDIENT_TYPES[i % INGREDIENT_TYPES.length];
      const x = (i - ingredientCount / 2) * 1.5;
      ingredients.push(createIngredient(type, x));
    }
    ingredientsRef.current = ingredients;
    ingredients.forEach(ingredient => scene.add(ingredient.mesh));

    setIsLoading(false);
  }, [createIngredient, ingredientCount]);

  // Animation loop with performance monitoring
  const animate = useCallback((time: number) => {
    if (!isPlaying) return;

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // FPS calculation
    frameCountRef.current++;
    if (frameCountRef.current % 60 === 0) {
      const currentFps = Math.round(1000 / (deltaTime || 1));
      setFps(currentFps);
    }

    // Update ingredients
    ingredientsRef.current.forEach((ingredient, index) => {
      if (ingredient.mesh.position.y > -1.5) {
        ingredient.mesh.position.add(ingredient.velocity);
        
        // Add some rotation for visual appeal
        ingredient.mesh.rotation.x += 0.02;
        ingredient.mesh.rotation.z += 0.01;
      } else {
        // Reset ingredient to top
        ingredient.mesh.position.y = ingredient.originalY;
        ingredient.mesh.rotation.set(0, 0, 0);
      }
    });

    // Performance monitoring
    if (rendererRef.current) {
      const info = rendererRef.current.info;
      performanceRef.current = {
        frameTime: deltaTime,
        drawCalls: info.render.calls,
        triangles: info.render.triangles,
      };
    }

    // Render
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    animationIdRef.current = requestAnimationFrame(animate);
  }, [isPlaying]);

  // Handle resize
  const handleResize = useCallback(() => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  }, []);

  // Initialize scene
  useEffect(() => {
    initializeScene();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [initializeScene, handleResize]);

  // Animation control
  useEffect(() => {
    if (isPlaying && !isLoading) {
      animationIdRef.current = requestAnimationFrame(animate);
    } else if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [isPlaying, isLoading, animate]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (sceneRef.current) {
        sceneRef.current.traverse(object => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            if (object.material instanceof THREE.Material) {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn('flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50', className)}
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-4"
          >
            🍕
          </motion.div>
          <p className="text-gray-600">3D Pizza hazırlanıyor...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={cn('relative w-full h-full', className)}>
      {/* 3D Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {/* Controls */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              {isPlaying ? '⏸️ Duraklat' : '▶️ Başlat'}
            </button>
            
            <div className="text-sm text-gray-600">
              <div>FPS: {fps}</div>
              <div>Çizim: {performanceRef.current.drawCalls}</div>
              <div>Üçgen: {performanceRef.current.triangles}</div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Performance indicator */}
      {fps < 30 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm"
        >
          ⚠️ Düşük FPS
        </motion.div>
      )}
    </div>
  );
}




