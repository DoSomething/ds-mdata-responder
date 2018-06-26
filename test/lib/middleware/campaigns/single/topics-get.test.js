'use strict';

// libs
require('dotenv').config();
const test = require('ava');
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const httpMocks = require('node-mocks-http');
const underscore = require('underscore');

const stubs = require('../../../../utils/stubs');
const helpers = require('../../../../../lib/helpers');

chai.should();
chai.use(sinonChai);

// module to be tested
const getTopics = require('../../../../../lib/middleware/campaigns/single/topics-get');

const sandbox = sinon.sandbox.create();

test.beforeEach((t) => {
  sandbox.stub(helpers, 'sendErrorResponse')
    .returns(underscore.noop);
  t.context.req = httpMocks.createRequest();
  t.context.req.campaign = stubs.getPhoenixCampaign();
  t.context.res = httpMocks.createResponse();
});

test.afterEach((t) => {
  sandbox.restore();
  t.context = {};
});

test('getTopics should inject a topics property set to helpers.topic.getByCampaignId result', async (t) => {
  const next = sinon.stub();
  const middleware = getTopics();
  sandbox.stub(helpers.defaultTopicTrigger, 'getAll')
    .returns(Promise.resolve([]));

  // test
  await middleware(t.context.req, t.context.res, next);
  helpers.defaultTopicTrigger.getAll.should.have.been.called;
  next.should.have.been.called;
  helpers.sendErrorResponse.should.not.have.been.called;
});

test('getTopics should sendErrorResponse if getByCampaignId fails', async (t) => {
  const next = sinon.stub();
  const middleware = getTopics();
  const mockError = { message: 'Epic fail' };
  sandbox.stub(helpers.defaultTopicTrigger, 'getAll')
    .returns(Promise.reject(mockError));

  // test
  await middleware(t.context.req, t.context.res, next);
  helpers.defaultTopicTrigger.getAll.should.have.been.called;
  next.should.not.have.been.called;
  helpers.sendErrorResponse.should.have.been.calledWith(t.context.res, mockError);
});
