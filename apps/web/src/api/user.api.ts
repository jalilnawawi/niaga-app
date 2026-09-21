import type { CreateCashier, UpdateUser } from '@niaga/shared';
import { client, unwrap } from './client';

export const listUsers = () => client.users.$get().then(unwrap);

export const createCashier = (json: CreateCashier) => client.users.$post({ json }).then(unwrap);

export const updateUser = (id: string, json: UpdateUser) => client.users[':id'].$patch({ param: { id }, json }).then(unwrap);
