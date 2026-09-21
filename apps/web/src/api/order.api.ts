import type { CreateOrder, VoidOrder } from '@niaga/shared';
import { client, unwrap } from './client';

export const listTodayOrders = () => client.orders.$get().then(unwrap);

export const createOrder = (json: CreateOrder) => client.orders.$post({ json }).then(unwrap);

export const voidOrder = (id: string, json: VoidOrder) => client.orders[':id'].void.$post({ param: { id }, json }).then(unwrap);
