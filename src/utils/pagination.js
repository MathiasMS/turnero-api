import { TURNERO_PAGINATION_LIMIT } from '../config/config.js';

const paginateResults = (items, requestedPage, pageLimit = TURNERO_PAGINATION_LIMIT) => {
    // We base this off a 0 index so we take 1 away
    const totalPages = Math.ceil(items.count / pageLimit) - 1;

    let currentPage = 0;

    if (requestedPage) {
        currentPage = Number(requestedPage);
    }

    const nextPage = currentPage >= totalPages
        ? null
        : Number(currentPage) + 1;

    const previousPage = currentPage > 0
        ? Number(currentPage) - 1
        : null;

    return {
        items: items.rows,
        totalPages,
        nextPage,
        previousPage,
        currentPage,
        totalRows: items.count,
    };
};

export default paginateResults;
