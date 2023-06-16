import { Transaction } from './plugins.interface';

export interface UnitOfWorkPort extends Transaction {}
export const unitOfWorkDiToken = Symbol('UNIT_OF_WORK');
