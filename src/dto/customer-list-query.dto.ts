import {IPaginationQuery} from './pagination.dto';

export interface ICustomerListQuery extends IPaginationQuery {
    search?: string;
    personTypeId?: number;
    status?: 'active' | 'inactive';
}