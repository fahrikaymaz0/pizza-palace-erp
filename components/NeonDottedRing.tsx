'use client';

import React, { useMemo } from 'react';

interface NeonDottedRingProps {
	// CSS boyut değeri: ör. '560px' veya 'clamp(340px, 50vw, 680px)'
	size?: string;
	numDots?: number;
	redColor?: string;
	blackColor?: string;
	rotate?: boolean;
}

// Hafif ve profesyonel: SVG ile noktalı çember, kırmızı noktalarda neon parıltı
export default function NeonDottedRing({
	size = 'clamp(340px, 50vw, 680px)',
	numDots = 56,
	redColor = '#ef4444', // tailwind red-500
	blackColor = '#111827', // tailwind gray-900
	rotate = true,
}: NeonDottedRingProps) {
	const dots = useMemo(() => Array.from({ length: numDots }), [numDots]);

	return (
		<div
			className={rotate ? 'animate-[ring-rotate_28s_linear_infinite]' : ''}
			style={{ width: size, height: size, pointerEvents: 'none' }}
		>
			<svg width="100%" height="100%" viewBox="0 0 100 100" role="img" aria-label="neon dotted ring">
				<defs>
					{/* neon parıltı için çoklu gölge */}
					<filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
						<feGaussianBlur stdDeviation="0.8" result="blur1" />
						<feGaussianBlur in="blur1" stdDeviation="1.2" result="blur2" />
						<feMerge>
							<feMergeNode in="blur2" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>

				{dots.map((_, i) => {
					const angle = (i / numDots) * Math.PI * 2;
					const r = 42; // yarıçap
					const cx = 50 + Math.cos(angle) * r;
					const cy = 50 + Math.sin(angle) * r;
					const isRed = i % 2 === 0;
					const dotSize = 1.8; // svg birimi
					return (
						<circle
							key={i}
							cx={cx}
							cy={cy}
							r={dotSize}
							fill={isRed ? redColor : blackColor}
							filter={isRed ? 'url(#neonGlow)' : undefined}
							opacity={isRed ? 0.95 : 0.85}
						/>
					);
				})}
			</svg>
			<style jsx>{`
				@keyframes ring-rotate { to { transform: rotate(360deg); } }
			`}</style>
		</div>
	);
}



