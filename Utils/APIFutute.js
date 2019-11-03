class APIFutures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filtering() {
        // 1A) filtering query base
        const queryObj = { ...this.queryString };
        const exclude = ['limit', 'sort', 'page', 'field'];
        exclude.forEach(q => delete queryObj[q]);
        //2B) filtering range
        // gte, gt , lte, lt => $gte, $gt, $lte, $lt
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            match => `$${match}`
        );
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    sorting() {
        if (this.queryString.sort) {
            const querySort = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(querySort);
        } else {
            this.query = this.query.sort('createAt');
        }
        return this;
    }

    limitFields() {
        if (this.queryString.field) {
            const fieldQuery = this.queryString.field.split(',').join(' ');
            this.query = this.query.select(fieldQuery);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    pagination() {
        const page = Math.abs(this.queryString.page) * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFutures;
