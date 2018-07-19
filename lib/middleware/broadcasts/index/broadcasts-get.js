'use strict';

const helpers = require('../../../helpers');

module.exports = function getBroadcasts() {
  return (req, res) => helpers.broadcast.fetch(req.query)
    .then(fetchResult => helpers.response.sendDataAndMeta(res, fetchResult.data, fetchResult.meta))
    .catch(err => helpers.sendErrorResponse(res, err));
};
