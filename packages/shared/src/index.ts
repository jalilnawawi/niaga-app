import { z } from 'zod';

export const healthSchema = z.object({
  status: z.literal('ok'),
  time: z.iso.datetime(),
});

export type Health = z.infer<typeof healthSchema>;

const email = z.string().trim().toLowerCase().pipe(z.email());
// Upper bound caps PBKDF2 work per request.
const password = z.string().min(8).max(128);

export const loginSchema = z.object({ email, password });

export const signupSchema = loginSchema.extend({
  name: z.string().trim().min(1).max(100),
  tenantName: z.string().trim().min(1).max(100),
});

export type Login = z.infer<typeof loginSchema>;
export type Signup = z.infer<typeof signupSchema>;

export type Me = {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'cashier';
  tenant: { id: string; name: string };
};
