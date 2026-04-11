import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

const READERS = (feedUrl: string) => [
	{ name: 'Feedly', url: `https://feedly.com/i/subscription/feed/${encodeURIComponent(feedUrl)}` },
	{ name: 'Inoreader', url: `https://www.inoreader.com/?add_feed=${encodeURIComponent(feedUrl)}` },
	{ name: 'NewsBlur', url: `https://newsblur.com/?url=${encodeURIComponent(feedUrl)}` },
];

interface Props {
	feedUrl: string;
}

export default function RssSubscribe({ feedUrl }: Props) {
	const [open, setOpen] = useState(false);
	const [copied, setCopied] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener('click', handler);
		return () => document.removeEventListener('click', handler);
	}, []);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(feedUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div ref={containerRef} className="relative inline-block">
			<button
				onClick={() => setOpen((v) => !v)}
				className="flex items-center gap-1.5 cursor-pointer select-none bg-transparent
				           text-[var(--color-text-secondary)] text-[0.75rem] uppercase tracking-[0.1em]
				           transition-colors duration-300 ease-[var(--ease-out-expo)]
				           hover:text-[var(--color-accent-light)]"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="13"
					height="13"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
				>
					<path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20 4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z" />
				</svg>
				Subscribe
			</button>

			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: -8, scale: 0.96, x: '-50%' }}
						animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
						exit={{ opacity: 0, y: -4, scale: 0.98, x: '-50%' }}
						transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
						style={{ transformOrigin: 'top center', left: '50%' }}
						className="absolute top-[calc(100%+0.625rem)] z-20 w-[17rem]
						           bg-[var(--color-surface)] rounded-[var(--radius-card)] overflow-hidden
						           shadow-[inset_0_0_0_1px_var(--color-border-mid),0_8px_32px_var(--color-shadow)]"
					>
						{/* Accent bar */}
						<div
							className="h-[2px]"
							style={{ background: 'linear-gradient(to right, var(--color-accent), var(--color-accent-light), transparent)' }}
						/>

						{/* Feed URL */}
						<div className="px-4 pt-3.5 pb-3">
							<span className="block mb-2 text-[0.625rem] uppercase tracking-[0.1em] text-[var(--color-text-secondary)]">
								Feed URL
							</span>
							<div className="flex items-center gap-2">
								<code className="flex-1 min-w-0 truncate text-[0.6875rem] bg-[var(--color-border-subtle)] px-2 py-1 rounded text-[var(--color-text-muted)]">
									{feedUrl}
								</code>
								<button
									onClick={handleCopy}
									className="shrink-0 shadow-[inset_0_0_0_1px_var(--color-border-subtle)]
									           bg-[var(--color-surface-tag)] px-[0.625rem] py-1
									           rounded-[var(--radius-full)] text-[0.75rem] text-[var(--color-accent)]
									           cursor-pointer whitespace-nowrap
									           transition-[color,box-shadow,background] duration-300 ease-[var(--ease-out-expo)]
									           hover:text-[var(--color-accent-light)]
									           hover:shadow-[inset_0_0_0_1px_var(--color-border)]
									           hover:bg-[color-mix(in_srgb,var(--color-accent-light)_8%,transparent)]"
								>
									{copied ? 'Copied!' : 'Copy'}
								</button>
							</div>
						</div>

						{/* Gradient separator */}
						<div
							className="h-px"
							style={{ background: 'linear-gradient(to right, transparent, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent)' }}
						/>

						{/* Reader shortcuts */}
						<div className="px-4 pt-3.5 pb-3">
							<span className="block mb-2 text-[0.625rem] uppercase tracking-[0.1em] text-[var(--color-text-secondary)]">
								Add to reader
							</span>
							<div className="flex flex-wrap gap-1.5">
								{READERS(feedUrl).map((reader) => (
									<a
										key={reader.name}
										href={reader.url}
										target="_blank"
										rel="noopener noreferrer"
										className="shadow-[inset_0_0_0_1px_var(--color-border-subtle)]
										           bg-[var(--color-surface-tag)] px-3 py-1
										           rounded-[var(--radius-full)] text-[0.75rem] text-[var(--color-accent)]
										           no-underline
										           transition-[color,box-shadow,background] duration-300 ease-[var(--ease-out-expo)]
										           hover:text-[var(--color-accent-light)]
										           hover:shadow-[inset_0_0_0_1px_var(--color-border)]
										           hover:bg-[color-mix(in_srgb,var(--color-accent-light)_8%,transparent)]"
									>
										{reader.name}
									</a>
								))}
							</div>
						</div>

						{/* Raw feed link */}
						<a
							href="/rss.xml"
							target="_blank"
							rel="noopener noreferrer"
							className="block px-4 py-2 text-[0.6875rem] text-[var(--color-text-secondary)] no-underline
							           border-t border-[var(--color-border-subtle)]
							           transition-colors duration-300 ease-[var(--ease-out-expo)]
							           hover:text-[var(--color-accent-light)]"
						>
							View raw feed →
						</a>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
