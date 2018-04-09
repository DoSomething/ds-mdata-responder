'use strict';

const helpers = require('../../../helpers');

module.exports = function getBotConfig() {
  return (req, res, next) => helpers.botConfig.fetchByCampaignId(req.campaignId)
    .then((botConfig) => {
      req.botConfig = botConfig;

      return next();
    })
    .catch(err => helpers.sendErrorResponse(res, err));
};