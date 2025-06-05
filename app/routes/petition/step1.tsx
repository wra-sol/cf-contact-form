import { redirect, useFetcher, useLoaderData } from 'react-router';

export const clientLoader = async ({ request }: { request: Request }) => {
	const sessionId = localStorage.getItem('sessionId');
	if (!sessionId) {
		return redirect('/petition/step1');
	}
	const response = await fetch(`/bff/petition/step1?sessionId=${sessionId}`);
	const data = (await response.json()) as {
		sessionId: string;
		response: { first_name: string; last_name: string; email: string; city: string; privacy: string; consent: string };
	};
	return { sessionId, data: data.response };
};

const privacyOptions = [
	{ value: 'full', label: 'Display full name and city' },
	{ value: 'first', label: 'Display first name and city' },
	{ value: 'private', label: 'Anonymous (city only)' },
];
export function ErrorBoundary({ error }: { error: Error }) {
	return <div className="mt-4 px-4 py-3 rounded-md text-sm font-medium bg-red-100 text-red-800 border border-red-300">{error.message}</div>;
}

export default function PetitionStep1() {
	const { sessionId, data } = useLoaderData<typeof clientLoader>();
	const fetcher = useFetcher();
	return (
		<section id="get-involved" className="p-6 md:p-8 mb-8 w-full border-gradient flex flex-col items-center flex-1 rounded">
			<h2 className="text-2xl font-bold text-[var(--text-secondary)] mb-2">Sign the Petition</h2>
			<fetcher.Form method="post" action="/bff/petition/step1" className="w-full">
				<input type="hidden" name="sessionId" value={sessionId} />
				<div className="mb-4 flex flex-col gap-2">
					<label htmlFor="first_name" className="block mb-1 font-medium">
						First Name:
					</label>
					<input
						type="text"
						id="first_name"
						name="first_name"
						autoComplete="given-name"
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
						defaultValue={data?.first_name}
					/>
					<label htmlFor="last_name" className="block mb-1 font-medium">
						Last Name:
					</label>
					<input
						type="text"
						id="last_name"
						name="last_name"
						autoComplete="family-name"
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
						defaultValue={data?.last_name}
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="email" className="block mb-1 font-medium">
						Email:
					</label>
					<input
						type="email"
						id="email"
						name="email"
						autoComplete="email"
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
						defaultValue={data?.email}
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="city" className="block mb-1 font-medium">
						City:
					</label>
					<input
						type="text"
						id="city"
						name="city"
						autoComplete="address-level2"
						required
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
						defaultValue={data?.city}
					/>
				</div>
				<div className="mb-4">
					<span className="block mb-1 font-medium">Privacy Option:</span>
					{privacyOptions.map((option) => (
						<label key={option.value} className="block mb-1">
							<input
								type="radio"
								name="privacy"
								value={option.value}
								defaultChecked={option.value === (data?.privacy ? data.privacy : 'full')}
								className="mr-2"
							/>
							{option.label}
						</label>
					))}
				</div>
				<div className="mb-4 flex items-center">
					<input type="checkbox" id="consent" name="consent" required className="mr-2 w-6 h-6" defaultChecked={true} />
					<label htmlFor="consent" className="block mb-1">
						I agree to receive communications from New Leaf Liberals. (You can unsubscribe at any time. )
					</label>
				</div>
				<div className="w-full flex justify-center sm:justify-end">
					<button
						type="submit"
						className="bg-red-600 hover:bg-red-800 text-white font-semibold px-5 py-2 rounded-md transition-colors duration-150 w-full sm:w-auto"
					>
						Sign
					</button>
				</div>
			</fetcher.Form>
			{fetcher.data && fetcher.data.error && (
				<div className="mt-4 px-4 py-3 rounded-md text-sm font-medium bg-red-100 text-red-800 border border-red-300">
					{fetcher.data.error}
				</div>
			)}
		</section>
	);
}
