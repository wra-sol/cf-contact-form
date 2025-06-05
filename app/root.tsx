import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import type { Route } from './+types/root';
import './app.css';
import { HTTP_METHODS } from './config/constants';

const getAnalyticsData = (request: Request, headers: Headers) => {
	const sessionId = localStorage.getItem('sessionId');
	return {
		sessionId,
		url: window.location.href,
		referrer: document.referrer,
		userAgent: navigator.userAgent,
		timestamp: new Date().toISOString(),
		ip: request?.headers?.get('x-forwarded-for') || '',
		headers: Object.fromEntries(request?.headers?.entries() || []) || {},
		cookies: request?.headers?.get('cookie') || '',
		screen: {
			width: window.screen.width,
			height: window.screen.height,
			availWidth: window.screen.availWidth,
			availHeight: window.screen.availHeight,
			pixelDepth: window.screen.pixelDepth,
			colorDepth: window.screen.colorDepth,
		},
		window: {
			innerWidth: window.innerWidth,
			innerHeight: window.innerHeight,
			devicePixelRatio: window.devicePixelRatio,
		},
		language: navigator.language,
		languages: navigator.languages,
		platform: navigator.platform,
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		navigationType: performance.getEntriesByType('navigation')[0]?.name || 'unknown',
		performance: {
			timeOrigin: performance.timeOrigin,
			now: performance.now(),
		},
	};
};

export const clientLoader = async (request: Request, headers: Headers) => {
	const sessionId = localStorage.getItem('sessionId');
	if (!sessionId) {
		const newSessionId = crypto.randomUUID();
		localStorage.setItem('sessionId', newSessionId);
		const analyticsData = getAnalyticsData(request, headers);
		void fetch('/bff/analytics', {
			method: HTTP_METHODS.POST,
			body: JSON.stringify(analyticsData),
		}).catch((e) => {
			console.warn('Error sending analytics data', e);
		});
	}
	if (navigator.doNotTrack === '1') {
		return { sessionId: null };
	}

	return { sessionId };
};

export const links: Route.LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Reddit+Sans:ital,wght@0,100..900;1,100..900&display=swap',
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCNVnySYEFPXsIgoE_8EFdwjM7zO5177BM&loading=async&libraries=places" />
				<Meta />
				<Links />
			</head>
				{children}
				{/* <ScrollRestoration /> */}
				<Scripts />
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = 'Oops!';
	let details = 'An unexpected error occurred.';
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error';
		details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
