'use strict';

/**
 * Imports.
 */
const logger = require('winston');
const superagent = require('superagent');

const defaultConfig = require('../config/lib/rogue');

/**
 * @param {string} endpoint
 * @param {object} data
 */
function executePost(endpoint, data) {
  const url = `${defaultConfig.clientOptions.baseUri}/${endpoint}`;

  return superagent
    .post(url)
    .set(defaultConfig.apiKeyHeader, defaultConfig.clientOptions.apiKey)
    .send(data)
    .then(res => res.body)
    .catch(err => err);
}

/**
 * @return {boolean}
 */
module.exports.isEnabled = function () {
  return defaultConfig.enabled;
};

/**
 * @param {object} req
 * @return {Promise}
 */
module.exports.postSignupForReq = function (req) {
  const campaign = req.campaign;
  const userId = req.userId;

  const data = {
    source: defaultConfig.source,
    // TODO: This should happen in Phoenix JS.
    campaign_id: Number(campaign.id),
    campaign_run_id: Number(campaign.currentCampaignRun.id),
    northstar_id: userId,
  };
  logger.debug('rogue.postSignupForReq', { data });

  return executePost('signups', data);
};