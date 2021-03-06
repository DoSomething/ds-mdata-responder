'use strict';

/**
 * Query Builder class
 */
class QueryBuilder {
  constructor() {
    this.query = {};
  }
  /**
   * @param {Array} contentTypes
   */
  contentTypes(contentTypes) {
    // @see https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/inclusion
    this.query['sys.contentType.sys.id[in]'] = contentTypes.join(',');
    return this;
  }
  /**
   * @param {String} id
   */
  contentfulId(id) {
    this.query['sys.id'] = id;
    return this;
  }
  /**
   * @param {String} id
   */
  campaignId(id) {
    this.query['fields.campaignId'] = id;
    return this;
  }
  custom(queryObject) {
    Object.keys(queryObject).forEach((queryKey) => {
      this.query[queryKey] = queryObject[queryKey];
    });
    if (!queryObject.order) {
      this.orderByDescCreatedAt();
    }
    return this;
  }
  limit(pageSize) {
    this.query.limit = pageSize;
    return this;
  }
  orderByDescCreatedAt() {
    this.query.order = '-sys.createdAt';
    return this;
  }
  skip(offset) {
    this.query.skip = offset;
    return this;
  }
  build() {
    return this.query;
  }
}

module.exports = QueryBuilder;
