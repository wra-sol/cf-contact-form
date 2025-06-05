declare global {
  interface Window {
    google: any;
  }
}
import { useRef, useEffect } from 'react';
import { useSearchParams, useFetcher } from 'react-router';  

export default function PetitionStep2() {
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher();
  const sessionId = localStorage.getItem('sessionId');
  const firstName = searchParams.get('first_name') || '';
  const lastName = searchParams.get('last_name') || '';
  const email = searchParams.get('email') || '';
  const city = searchParams.get('city') || '';
  const privacy = searchParams.get('privacy') || 'full';
  const addressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('google', window.google.maps);
    if (!window.google || !window.google.maps || !window.google.maps.places) return;
    const input = addressRef.current;
    const autocomplete = new window.google.maps.places.Autocomplete(input, {
      types: ['address'],
      componentRestrictions: { country: 'ca' },
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address && addressRef.current) {
        addressRef.current.value = place.formatted_address;
      }
    });

    // Handler to block Enter/Tab if the Google dropdown is open
    const handleKeyDown = (e: KeyboardEvent) => {
      // Google autocomplete dropdown is .pac-container
      const pacContainers = document.querySelectorAll('.pac-container');
      let isDropdownOpen = false;
      pacContainers.forEach((el) => {
        if (el instanceof HTMLElement && el.style.display !== 'none' && el.childElementCount > 0) {
          isDropdownOpen = true;
        }
      });
      if (isDropdownOpen && (e.key === 'Enter' || e.key === 'Tab')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    if (input) {
      input.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (input) {
        input.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [window.google, addressRef]);

  return (
    <section className="p-6 md:p-8 mb-8 w-full border-gradient flex flex-col items-center flex-1 rounded">
      <h2 className="text-2xl font-bold text-[var(--text-secondary)] mb-2">Thank you for signing the petition!</h2>
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Are you interested in being a delegated voter at the AGM?</h3>
      {fetcher.data && fetcher.data.success ? (
        <div className="mt-4 px-4 py-3 rounded-md text-sm font-medium bg-green-100 text-green-800 border border-green-300">
          Thank you for joining the New Leaf Liberals! We'll be in touch soon to confirm your details.
        </div>
      ) : (
        <fetcher.Form method="post" action="/bff/petition/step2">
          <input type="hidden" name="sessionId" value={sessionId || '' as string} />
          <input type="hidden" name="first_name" value={firstName} />
          <input type="hidden" name="last_name" value={lastName} />
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="privacy" value={privacy} />
          <input type="hidden" name="city" value={city} />
          <div className="mb-4">
            <label htmlFor="phone" className="block mb-1 font-medium">
              Phone:
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="block mb-1 font-medium">
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              ref={addressRef}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="delegate"
              name="delegate"
              className="w-6 h-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] checked:bg-[var(--color-primary)]"
            />
            <label htmlFor="delegate" className="block mb-1 font-medium">
              I am interested in being a delegated voter at the AGM<br/>
              <span className="text-xs text-[var(--text-secondary)/50]"> The AGM will be held at the Sheraton Centre in Toronto from September 12-14, 2025. Ticket details will be available soon.</span>
            </label>
          </div>
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="volunteer"
              name="volunteer"
              className="w-6 h-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] checked:bg-[var(--color-primary)]"
            />
            <label htmlFor="volunteer" className="block mb-1 font-medium">
              I am interested to grow support for the New Leaf Liberals<br/>
              <span className="text-xs text-[var(--text-secondary)/50]"> Please let us know if you are interested in volunteering.</span>
            </label>
          </div>
          <div className="w-full flex justify-center sm:justify-end">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-800 text-white font-semibold px-5 py-2 rounded-md transition-colors duration-150"
            >
              Submit
            </button>
          </div>
          {fetcher.data && fetcher.data.error && (
            <div className="mt-4 px-4 py-3 rounded-md text-sm font-medium bg-red-100 text-red-800 border border-red-300">
              {fetcher.data.error}
            </div>
          )}
        </fetcher.Form>
      )}
    </section>
  );
} 