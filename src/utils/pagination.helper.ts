import {IPaginationQuery, IPaginationMeta} from '../dto/pagination.dto';

export class PaginationHelper {
    static readonly DEFAULT_PAGE = 1;
    static readonly DEFAULT_LIMIT = 10;
    static readonly MAX_LIMIT = 100;

    static validateAndNormalize(query: IPaginationQuery) {
        const page = Math.max(1, Number(query.page) || this.DEFAULT_PAGE);
        const limit = Math.min(
            this.MAX_LIMIT,
            Math.max(1, Number(query.limit) || this.DEFAULT_LIMIT)
        );
        const offset = (page - 1) * limit;
        const sortBy = query.sortBy || 'id';
        const sortOrder = query.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        return { page, limit, offset, sortBy, sortOrder };
    }

    static createMeta(
        page: number,
        limit: number,
        totalItems: number
    ): IPaginationMeta {
        const totalPages = Math.ceil(totalItems / limit);

        return {
            currentPage: page,
            itemsPerPage: limit,
            totalItems,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        };
    }
}