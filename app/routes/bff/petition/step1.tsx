import { API_ENDPOINTS } from "~/config/constants";
import { HTTP_METHODS } from "~/config/constants";
import { redirect } from "react-router";
import { getResponseFromKV, saveResponseToKV } from "~/services/kvStore";
import { env } from "cloudflare:workers";
import { validatePetitionStep1 } from "~/utils/validation";

export async function action({ request }: { request: Request }) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData) as Partial<import('~/types').PetitionFullData>;
    try {
      validatePetitionStep1(data);
      await saveResponseToKV(env, data, data.sessionId!);
    } catch (error) {
      console.error('Error submitting petition step 1', error);
      return { error: 'Failed to submit petition step 1' };
    }
    return redirect(`/petition/step2?${new URLSearchParams(formData as unknown as Record<string, string>).toString()}`);
}
      
export const loader = async ({ request }: { request: Request }) => {
	const url = new URL(request.url);
	const sessionId = url.searchParams.get('sessionId');
	if (!sessionId) {
		return redirect('/petition/step1');
	}
	const response = await getResponseFromKV(env, sessionId);
	return { sessionId, response };
};      