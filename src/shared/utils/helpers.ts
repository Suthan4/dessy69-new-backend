export class Helpers {
  static sanitizeQuery(query: any): any {
    const sanitized: any = {};
    for (const key in query) {
      if (typeof query[key] === "string" || typeof query[key] === "number") {
        sanitized[key] = query[key];
      }
    }
    return sanitized;
  }

  static calculatePagination(page: number, limit: number, total: number) {
    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }
}
