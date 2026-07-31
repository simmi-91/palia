import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

export async function verifyGoogleToken(token: string) {
  if (!process.env.VITE_GOOGLE_CLIENT_ID) return null;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });

    return ticket.getPayload();
  } catch {
    return null;
  }
}