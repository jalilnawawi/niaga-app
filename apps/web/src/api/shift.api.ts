import type { CloseShift, OpenShift } from '@niaga/shared';
import { client, unwrap } from './client';

export const listShifts = () => client.shifts.$get().then(unwrap);

export const getCurrentShift = () => client.shifts.current.$get().then(unwrap);

export const openShift = (json: OpenShift) => client.shifts.$post({ json }).then(unwrap);

export const closeShift = (json: CloseShift) => client.shifts.current.close.$post({ json }).then(unwrap);
