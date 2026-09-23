import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Link {
	path: string;
	label: string;
}

interface PageSelectorProps {
	currentPath: string;
	links: Link[];
}

const springConfig = {
	type: 'spring' as const,
	stiffness: 350,
	damping: 30,
	mass: 1,
};

export default function PageSelector({
	currentPath,
	links,
}: PageSelectorProps) {
	const containerRef = useRef<HTMLUListElement>(null);
	const pillRefs = useRef<Map<string, HTMLLIElement>>(new Map());
	const [thumbStyle, setThumbStyle] = useState<{
		left: number;
		width: number;
	} | null>(null);
	const isFirstRender = useRef(true);

	const activeIndex = links.findIndex((link) =>
		link.path === '/' ? currentPath === '/' : currentPath.startsWith(link.path),
	);

	const updateThumbPosition = useCallback(() => {
		if (activeIndex === -1) {
			setThumbStyle(null);
			return;
		}
		if (!containerRef.current) return;

		const activePath = links[activeIndex].path;
		const pill = pillRefs.current.get(activePath);

		if (!pill) return;

		setThumbStyle({
			left: pill.offsetLeft,
			width: pill.offsetWidth,
		});
	}, [activeIndex, links]);

	useEffect(() => {
		updateThumbPosition();

		if (isFirstRender.current) {
			isFirstRender.current = false;
		}
	}, [updateThumbPosition]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const observer = new ResizeObserver(() => {
			updateThumbPosition();
		});

		observer.observe(container);
		return () => observer.disconnect();
	}, [updateThumbPosition]);

	useEffect(() => {
		const handleResize = () => updateThumbPosition();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [updateThumbPosition]);

	return (
		<>
			<ul
				ref={containerRef}
				className="relative flex list-none my-2 mx-0 p-0 gap-0"
			>
				{thumbStyle && (
					<motion.li
						aria-hidden="true"
						className="absolute bottom-0 left-0 h-px pointer-events-none z-0"
						style={{
							backgroundColor: 'var(--color-accent)',
						}}
						initial={false}
						animate={{
							x: thumbStyle.left,
							width: thumbStyle.width,
						}}
						transition={springConfig}
					/>
				)}

				{links.map((link, index) => {
					const isActive =
						link.path === '/'
							? currentPath === '/'
							: currentPath.startsWith(link.path);

					const isFirst = index === 0;
					const isLast = index === links.length - 1;

					return (
						<li
							key={link.path}
							ref={(el) => {
								if (el) pillRefs.current.set(link.path, el);
							}}
							className={`
                relative z-10 flex items-center justify-center h-8 m-0 p-0

              `}
						>
							<a
								href={link.path}
								aria-current={isActive ? 'page' : undefined}
								className={`
                  relative z-10 flex items-center justify-center
                  flex-shrink-0 h-full self-stretch
                  no-underline text-xs py-2.5
                  transition-colors duration-600
                  ${
										isActive
											? 'font-medium'
											: 'hover:text-[color:var(--color-accent)]'
									}
                `}
								style={{
									paddingLeft: isFirst
										? '0.75rem'
										: isLast
											? '0.5rem'
											: '0.75rem',
									paddingRight: isFirst
										? '0.5rem'
										: isLast
											? '0.75rem'
											: '0.75rem',
									color: isActive
										? 'var(--color-accent)'
										: 'var(--color-text-secondary)',
									transitionTimingFunction: 'var(--ease-out-expo)',
								}}
							>
								{link.label}
							</a>
						</li>
					);
				})}
			</ul>
		</>
	);
}
