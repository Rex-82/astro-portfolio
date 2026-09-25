import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Link {
	path: string;
	label: string;
}

interface PageSelectorProps {
	currentPath: string;
	links: Link[];
}

const spring = {
	type: 'spring' as const,
	stiffness: 350,
	damping: 30,
	mass: 1,
};

export default function PageSelector({
	currentPath,
	links,
}: PageSelectorProps) {
	const listRef = useRef<HTMLUListElement>(null);
	const [route, setRoute] = useState({ currentPath, links });
	const [indicator, setIndicator] = useState<{
		left: number;
		width: number;
	} | null>(null);

	useEffect(() => {
		const sync = () => {
			const data =
				document.querySelector<HTMLElement>('[data-page-links]')?.dataset
					.pageLinks;
			if (data)
				setRoute({
					currentPath: window.location.pathname,
					links: JSON.parse(data),
				});
		};
		document.addEventListener('astro:page-load', sync);
		sync();
		return () => document.removeEventListener('astro:page-load', sync);
	}, []);

	const activeIndex = route.links.findIndex((link) =>
		link.path === '/' || link.path === '/it/'
			? route.currentPath === link.path
			: route.currentPath.startsWith(link.path),
	);

	useEffect(() => {
		const list = listRef.current;
		if (!list) return;
		const update = () => {
			const item = list.querySelectorAll<HTMLLIElement>(
				'li:not([aria-hidden])',
			)[activeIndex];
			setIndicator(
				item ? { left: item.offsetLeft, width: item.offsetWidth } : null,
			);
		};
		update();
		const observer = new ResizeObserver(update);
		observer.observe(list);
		return () => observer.disconnect();
	}, [activeIndex, route.links]);

	return (
		<ul ref={listRef} className="relative flex list-none my-2 mx-0 p-0 gap-0">
			{indicator && (
				<motion.li
					aria-hidden="true"
					className="absolute bottom-0 left-0 h-px pointer-events-none z-0"
					style={{ backgroundColor: 'var(--color-accent)' }}
					initial={false}
					animate={{ x: indicator.left, width: indicator.width }}
					transition={spring}
				/>
			)}
			{route.links.map((link, index) => (
				<li
					key={link.path}
					className="relative z-10 flex items-center justify-center h-8 m-0 p-0"
				>
					<a
						href={link.path}
						aria-current={index === activeIndex ? 'page' : undefined}
						className="relative z-10 flex items-center justify-center h-full px-3 text-xs no-underline text-[var(--color-text-secondary)] hover:text-[var(--color-accent)]"
					>
						{link.label}
					</a>
				</li>
			))}
		</ul>
	);
}
