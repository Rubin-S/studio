'use server';

import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function loginAction(formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return { success: false, error: 'Invalid data provided.' };
  }

  const { email, password } = result.data;

  // IMPORTANT: This is NOT a secure way to handle authentication.
  // In a real production application, you should use a dedicated authentication
  // service like Firebase Authentication and store hashed passwords, not plain text.
  if (email === 'admin@smds.com' && password === 'password') {
    return { success: true };
  } else {
    return { success: false, error: 'Invalid email or password.' };
  }
}
