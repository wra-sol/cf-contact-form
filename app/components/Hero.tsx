import React from 'react';
import { Link } from 'react-router';

const Hero = ({ count }: { count: number }) => (
	<section className="relative flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--box-background)] rounded py-12 px-6 md:px-12 mb-12 overflow-hidden animate-fade-in">
		<div className="flex-1 flex flex-col items-start md:items-start mb-8 md:mb-0">
			<h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-secondary)] mb-4 leading-tight drop-shadow-sm">A PLAN</h1>
			<p className="text-lg md:text-xl text-[var(--text-primary)] mb-6">
				to <strong className="text-[var(--text-secondary)]">grow</strong> our grassroots,
				<br />
				to <strong className="text-[var(--text-secondary)]">drive</strong> committed membership,
				<br />
				to <strong className="text-[var(--text-secondary)]">nurture</strong> new ideas,
				<br />
				to <strong className="text-[var(--text-secondary)]">win</strong> back the trust of Ontarians,
				<br />
				to <strong className="text-[var(--text-secondary)]">win.</strong>
			</p>
		</div>
		<div className="flex-1 flex flex-col items-center md:items-end">
			<div className="text-2xl md:text-3xl font-semibold text-[var(--text-secondary)] mb-2 animate-pulse">
				Join <span className="font-extrabold text-[var(--color-primary)]">{count.toLocaleString()}</span> other Ontario Liberals
			</div>
			<div className="text-base md:text-lg text-[var(--text-primary)] mb-6 text-center md:text-right">
				in building a better Liberal Party for a better Ontario.
			</div>
			<div className="flex gap-4">
				<Link
					to="#get-involved"
					className="inline-block bg-[var(--color-primary)] hover:bg-[var(--text-secondary)] text-white font-bold py-3 px-8 rounded shadow-lg transition-colors duration-200 text-lg"
				>
					Sign the Petition
				</Link>
				<Link
					to="/signatures"
					className="inline-block border-2 border-[var(--color-primary)] hover:border-[var(--text-secondary)] hover:bg-[var(--text-secondary)] text-[var(--color-primary)] hover:text-white font-bold py-3 px-8 rounded shadow-lg transition-colors duration-200 text-lg"
				>
					View Signatures
				</Link>
			</div>
		</div>
	</section>
);

export default Hero;
