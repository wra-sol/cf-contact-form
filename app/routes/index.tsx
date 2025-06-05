import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Grow from '../components/Grow';
import OpeningUp from '../components/OpeningUp';
import FAQ from '../components/FAQ';
import HowHelp from '../components/HowHelp';
import { Outlet, useLoaderData } from 'react-router';
import { API_ENDPOINTS } from '../config/constants';

export async function clientLoader({ request }: { request: Request }) {
	const url = new URL(request.url);
	const countRes = await fetch(API_ENDPOINTS.COUNT);
	const { count } = (await countRes.json()) as { count: number };
	const SITE_URL = url.origin;
	return { SITE_URL, count };
}

const Home = () => {
	const { SITE_URL, count } = useLoaderData<typeof clientLoader>();
	return (
		<body className="container flex flex-col gap-4 items-center text-[var(--text-primary)] w-full">
			<Header />
			<main className="flex flex-col items-center w-full max-w-screen-lg mx-auto px-4 md:px-0">
				<section id="hero" className="w-full">
					<Hero count={count} />
				</section>
				<section id="value-prop" className="w-full">
					<Grow />
				</section>
				<section id="story" className="w-full">
					<OpeningUp />
				</section>
                <section id="get-involved" className="w-full">
                    <Outlet />
                </section>
				<section id="faq" className="w-full">
					<FAQ />
				</section>
				<section id="cta" className="w-full">
					<HowHelp site_url={SITE_URL} />
				</section>
			</main>
		</body>
	);
};

export default Home;
