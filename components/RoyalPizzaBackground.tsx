'use client';

import React, { useMemo } from 'react';

interface RoyalPizzaBackgroundProps {
	className?: string;
	itemCount?: number;
}

// Pizza (dilim) + taç motifli premium arka plan
// Hafif: düşük opaklık, az sayıda vektör, basit CSS animasyonları
export default function RoyalPizzaBackground({ className, itemCount = 24 }: RoyalPizzaBackgroundProps) {
	const items = useMemo(
		() =>
			Array.from({ length: itemCount }, (_, i) => ({
				left: 5 + Math.random() * 90,
				top: 4 + Math.random() * 86,
				size: 18 + Math.random() * 28, // px
				rotate: Math.random() * 360,
				delay: Math.random() * 6,
				kind: i % 2 === 0 ? 'crown' : 'slice',
			})),
		[itemCount]
	);

	return (
		<div className={className ?? ''} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
			{/* Altın-kırmızı degrade + yumuşak vinyet */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'radial-gradient(1100px circle at 50% 15%, rgba(245, 158, 11, 0.18), transparent 60%), linear-gradient(135deg, #fff7ed 0%, #fff1e5 35%, #fee2e2 100%)',
				}}
			/>

			{/* Motifler */}
			<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
				<defs>
					<g id="crownIcon">
						<path d="M4 16L3 9l4 3 4-6 4 6 4-3  -1 7z" fill="currentColor" />
						<rect x="3" y="16" width="18" height="3" rx="1.5" fill="currentColor" />
					</g>
					<g id="sliceIcon">
						<path d="M2 19 L20 11 L3 2 Z" fill="currentColor" />
						<circle cx="8" cy="9" r="1.3" fill="#ffffff" opacity="0.85" />
						<circle cx="12" cy="7" r="1.1" fill="#ffffff" opacity="0.85" />
					</g>
					<filter id="softGlow" x="-80%" y="-80%" width="260%" height="260%">
						<feGaussianBlur stdDeviation="0.8" result="b1" />
						<feGaussianBlur in="b1" stdDeviation="1.2" result="b2" />
						<feMerge>
							<feMergeNode in="b2" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>

				{items.map((it, idx) => {
					const isCrown = it.kind === 'crown';
					const color = isCrown ? 'rgba(245, 158, 11, 0.22)' : 'rgba(239, 68, 68, 0.18)';
					const x = it.left; // %
					const y = it.top; // %
					const s = it.size / 100; // scale vs viewBox (20x20 base)
					return (
						<g key={idx} style={{ transformOrigin: 'center', filter: 'url(#softGlow)' }}>
							<use
								href={isCrown ? '#crownIcon' : '#sliceIcon'}
								style={{
									transformBox: 'fill-box',
									transform: `translate(${x}% ${y}%) rotate(${it.rotate}deg) scale(${s})`,
									color,
								}}
								className="royal-float"
							/>
						</g>
					);
				})}
			</svg>

			<style jsx>{`
				.royal-float { animation: rfY 14s ease-in-out infinite; }
				.royal-float:nth-child(odd) { animation-duration: 18s; }
				.royal-float:nth-child(3n) { animation-duration: 22s; }
				@keyframes rfY { 0%,100% { transform: translate(var(--tx,0), var(--ty,0)) rotate(0deg); } 50% { transform: translate(calc(var(--tx,0) + 0.5%), calc(var(--ty,0) - 0.8%)) rotate(2deg); } }
			`}</style>
		</div>
	);
}





