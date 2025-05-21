class ApiFeatures {
    constructor(mongooseQuery, queryString = {}) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
        this.paginationResult = {};
    }

    filter() {
        const queryStringObj = { ...this.queryString };
        const excludesFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
        excludesFields.forEach((field) => delete queryStringObj[field]);

        let queryStr = JSON.stringify(queryStringObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        }
        else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        }
        else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }

        return this;
    }

    search(searchFields = ['name']) {
        if (this.queryString.keyword?.trim()) {
            const keyword = this.queryString.keyword;
            const query = {
                $or: searchFields.map((field) => ({
                    [field]: { $regex: keyword, $options: 'i' }
                }))
            };
            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }

    paginate(countDocuments) {
        const page = Math.max(1, this.queryString.page * 1 || 1);
        const limit = Math.max(1, this.queryString.limit * 1 || 50);
        const skip = (page - 1) * limit;
        const endIndex = page * limit;

        this.paginationResult = {
            currentPage: page,
            limit,
            numberOfPages: countDocuments > 0 ? Math.ceil(countDocuments / limit) : 1
        };

        if (endIndex < countDocuments) this.paginationResult.next = page + 1;
        if (skip > 0) this.paginationResult.prev = page - 1;

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

        return this;
    }
}
export default ApiFeatures;