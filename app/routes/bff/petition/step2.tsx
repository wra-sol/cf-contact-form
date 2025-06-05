import { redirect } from "react-router";
import { getResponseFromKV, saveResponseToKV } from "~/services/kvStore";
import { env } from "cloudflare:workers";
import { validatePetitionFormData } from "~/utils/validation";

export async function action({ request }: { request: Request }) {

  const formData = await request.formData();
  const data = Object.fromEntries(formData) as Partial<import('~/types').PetitionFullData>;
  try {
    const sessionId = data.sessionId!;
    const existing = await getResponseFromKV(env, sessionId) || {};
    const merged = { ...existing, ...data };
    validatePetitionFormData(merged);
    await saveResponseToKV(env, merged, sessionId);
  } catch (error) {
    console.error('Error submitting petition step 2', error);
    return { error: 'Failed to submit petition step 2' };
  }
  return { success: true };
}
    