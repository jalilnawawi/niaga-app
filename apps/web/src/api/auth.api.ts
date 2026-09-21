import type { Login, Me, Signup } from '@niaga/shared';
import { client, unwrap } from './client';

export async function getMe(): Promise<Me | null> {
  const res = await client.auth.me.$get();
  return res.status === 401 ? null : unwrap(res);
}

export const login = (json: Login) => client.auth.login.$post({ json }).then(unwrap);

export const signup = (json: Signup) => client.auth.signup.$post({ json }).then(unwrap);

export const logout = () => client.auth.logout.$post().then(unwrap);
