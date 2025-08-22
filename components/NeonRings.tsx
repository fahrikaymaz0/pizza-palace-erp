'use client';

import React from 'react';

interface NeonRingsProps {
	size?: string;
	redColor?: string;
	blackColor?: string;
	rotate?: boolean;
}

// Neon lamba etkili, kırmızı-siyah konsantrik halkalar
export default function NeonRings({
	size = 'clamp(420px, 60vw, 760px)',
	redColor = '#ef4444',
	blackColor = '#111827',
	rotate = true,
}: NeonRingsProps) {
	const radii = [38, 44, 50];
	const dash = '2 4';

	return (
		<div
			className={rotate ? 'animate-[ring-rotate_32s_linear_infinite]' : ''}
			style={{ width: size, height: size, pointerEvents: 'none' }}
		>
			<svg width="100%" height="100%" viewBox="0 0 100 100" role="img" aria-label="neon rings">
				<defs>
					<filter id="neonGlowR" x="-80%" y="-80%" width="260%" height="260%">
						<feGaussianBlur stdDeviation="1.2" result="b1" />
						<feGaussianBlur in="b1" stdDeviation="1.8" result="b2" />
						<feMerge>
							<feMergeNode in="b2" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>

				{/* İçten dışa üç halka: siyah kesikli + kırmızı neon kesikli */}
				{radii.map((r, idx) => (
					<g key={r}>
						<circle
							cx="50"
							cy="50"
							r={r}
							fill="none"
							stroke={blackColor}
							strokeWidth={idx === 0 ? 1.3 : idx === 1 ? 1.2 : 1.1}
							strokeDasharray={dash}
							strokeOpacity="0.9"
						/>
						<circle
							cx="50"
							cy="50"
							r={r}
							fill="none"
							stroke={redColor}
							strokeWidth={idx === 0 ? 1.6 : idx === 1 ? 1.5 : 1.4}
							strokeDasharray={dash}
							strokeDashoffset={2}
							filter="url(#neonGlowR)"
							className="neon-red"
							strokeOpacity="0.95"
						/>
					</g>
				))}
				{/* İnce iç çekirdek parıltısı */}
				<circle cx="50" cy="50" r="34" fill="none" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="0.4" />
			</svg>
			<style jsx>{`
				@keyframes ring-rotate { to { transform: rotate(360deg); } }
				@keyframes neon-flicker { 0%, 19%, 21%, 23%, 80%, 100% { opacity: 1; } 20%, 22% { opacity: .85; } 24% { opacity:.92 } 50% { opacity: .96 } }
				.neon-red { animation: neon-flicker 4s ease-in-out infinite; }
			`}</style>
		</div>
	);
}




