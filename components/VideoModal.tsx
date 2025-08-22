'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  poster?: string;
}

export default function VideoModal({ isOpen, onClose, videoSrc, poster }: VideoModalProps) {
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {isVideoLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="h-12 w-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
          
          <video
            className="w-full h-full object-cover"
            controls
            autoPlay
            playsInline
            preload="metadata"
            poster={poster}
            muted={false}
            controlsList="nodownload"
            onCanPlay={() => setIsVideoLoading(false)}
            onLoadStart={() => setIsVideoLoading(true)}
          >
            <source src={videoSrc} type="video/mp4" />
            Tarayıcınız video oynatmayı desteklemiyor.
          </video>
          
          <button
            onClick={onClose}
            className="absolute -top-12 -right-12 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
