'use strict';

require('dotenv').config();
const test = require('ava');
const chai = require('chai');
const expect = require('chai').expect;
const crypto = require('crypto');
const stubs = require('../../test/utils/stubs');
const sinon = require('sinon');
const contentful = require('../../lib/contentful.js');
const helpers = require('../../lib/helpers');
const httpMocks = require('node-mocks-http');

// TODO: Suppress logger console transport

// Stub functions
const fetchKeywordsForCampaignIdStub = () => new Promise((resolve) => {
  resolve(stubs.getKeywords());
});
const fetchKeywordsForCampaignIdStubFail = () => new Promise((resolve, reject) => {
  reject({ status: 500 });
});
// const sendResponseStub = () => { true; };

// Setup Spies
sinon.spy(helpers, 'sendErrorResponse');
sinon.spy(helpers, 'sendResponse');

// Setup stubs
sinon.stub(contentful, 'fetchKeywordsForCampaignId')
  .onCall(0)
  .callsFake(fetchKeywordsForCampaignIdStub)
  .onCall(1)
  .callsFake(fetchKeywordsForCampaignIdStubFail);

// setup should assertion style
chai.should();

test.beforeEach((t) => {
  t.context.req = httpMocks.createRequest();
  t.context.res = httpMocks.createResponse();
});

/**
 * Tests
 */

// replacePhoenixCampaignVars
test('replacePhoenixCampaignVars', async () => {
  const phoenixCampaign = stubs.getPhoenixCampaign();
  let renderedMessage = '';
  // signedup through gambit
  const signedupGambitMsg = stubs.getDefaultContenfulCampaignMessage('menu_signedup_gambit');
  renderedMessage = await helpers.replacePhoenixCampaignVars(signedupGambitMsg, phoenixCampaign);
  renderedMessage.should.have.string(phoenixCampaign.facts.problem);
  // invalid sign up command
  const invalidSignedupCmdMsg = stubs.getDefaultContenfulCampaignMessage('invalid_cmd_signedup');
  renderedMessage = await helpers
  .replacePhoenixCampaignVars(invalidSignedupCmdMsg, phoenixCampaign);
  renderedMessage.should.have.string('Sorry, I didn\'t understand that.');

  // TODO: test more messages!
});

test('replacePhoenixCampaignVars a message that makes a contentful request to get keywords', async () => {
  const keywords = stubs.getKeywords();
  let renderedMessage = '';
  const phoenixCampaign = stubs.getPhoenixCampaign();
  const relativeToSignUpMsg = stubs.getDefaultContenfulCampaignMessage('scheduled_relative_to_signup_date');
  // fetchKeywordsForCampaignIdStub should be called here
  // since it's the first time its called in our tests
  renderedMessage = await helpers.replacePhoenixCampaignVars(relativeToSignUpMsg, phoenixCampaign);

  sinon.assert.called(contentful.fetchKeywordsForCampaignId);
  renderedMessage.should.have.string(keywords[0].keyword);
});

test('replacePhoenixCampaignVars failure to retrieve keywords should throw', async (t) => {
  const phoenixCampaign = stubs.getPhoenixCampaign();
  const memberSupportMsg = stubs.getDefaultContenfulCampaignMessage('member_support');
  // fetchKeywordsForCampaignIdStubFail should be called here
  // since it's the second time its called in our tests
  await t.throws(helpers.replacePhoenixCampaignVars(memberSupportMsg, phoenixCampaign));
  sinon.assert.called(contentful.fetchKeywordsForCampaignId);
});

test('replacePhoenixCampaignVars with no message should return empty string', async () => {
  const phoenixCampaign = stubs.getPhoenixCampaign();
  const renderedMessage = await helpers.replacePhoenixCampaignVars(undefined, phoenixCampaign);
  renderedMessage.should.equal('');
});

test('replacePhoenixCampaignVars on a campaign object missing reportbackInfo should throw', async (t) => {
  const phoenixCampaign = stubs.getPhoenixCampaign();
  delete phoenixCampaign.reportbackInfo;
  const memberSupportMsg = stubs.getDefaultContenfulCampaignMessage('menu_signedup_gambit');
  await t.throws(helpers.replacePhoenixCampaignVars(memberSupportMsg, phoenixCampaign));
});

// addSenderPrefix
test('addSenderPrefix', () => {
  const prefix = process.env.GAMBIT_CHATBOT_RESPONSE_PREFIX;
  const text = 'taco';
  const string = `${prefix} ${text}`;
  helpers.addSenderPrefix(text).should.be.equal(string);

  process.env.GAMBIT_CHATBOT_RESPONSE_PREFIX = '';
  helpers.addSenderPrefix(text).should.be.equal(text);
});

// isValidZip
test('isValidZip', () => {
  helpers.isValidZip('10010').should.be.true;
  helpers.isValidZip('10010-9995').should.be.true;
  helpers.isValidZip('100100').should.be.false;
  helpers.isValidZip('abc10').should.be.false;
});

// isValidEmail
test('isValidEmail', () => {
  helpers.isValidEmail('do@something.org').should.be.true;
  helpers.isValidEmail('Joe Smith <email@example.com>').should.be.false;
  helpers.isValidEmail('email.example.com').should.be.false;
  helpers.isValidEmail('email@111.222.333.44444').should.be.false;
  helpers.isValidEmail('email@example..com').should.be.false;
  helpers.isValidEmail('Abc..123@example.com').should.be.false;
  helpers.isValidEmail('.email@example.com').should.be.false;
  helpers.isValidEmail('email@example.com (Joe Smith)').should.be.false;
});

// containsNaughtyWords
test('containsNaughtyWords', () => {
  helpers.containsNaughtyWords('suck').should.be.true;
  helpers.containsNaughtyWords('fuck you').should.be.true;
  helpers.containsNaughtyWords('hi').should.be.false;
});

// getFirstWord
test('getFirstWord should return null if no message is passed', () => {
  const result = helpers.getFirstWord(undefined);
  expect(result).to.be.null;
});

// TODO: It is now failing due to a bug when processing the message
// which fails to properly parse multi-word acceptable answers
// https://github.com/DoSomething/gambit/issues/866
test.skip('isYesResponse', () => {
  helpers.isYesResponse('yea').should.be.true;
  helpers.isYesResponse('yesss').should.be.true;
  helpers.isYesResponse('i can').should.be.true;
  helpers.isYesResponse('yes').should.be.true;
  helpers.isYesResponse('nah').should.be.false;
});

// isValidReportbackQuantity
test('isValidReportbackQuantity', () => {
  helpers.isValidReportbackQuantity(2).should.be.true;
  helpers.isValidReportbackQuantity('2').should.be.true;
  helpers.isValidReportbackQuantity('2 ').should.be.true;
  helpers.isValidReportbackQuantity('a2').should.be.NaN;
});

// isValidReportbackText
test('isValidReportbackText', () => {
  helpers.isValidReportbackText('i am valid').should.be.true;
  helpers.isValidReportbackText('no').should.be.false;
  helpers.isValidReportbackText('123').should.be.false;
  helpers.isValidReportbackText('hi     ').should.be.false;
  helpers.isValidReportbackText('').should.be.false;
});

// generatePassword
test('generatePassword', () => {
  process.env.DS_API_PASSWORD_KEY = 'bell';
  const key = crypto
    .createHmac('sha1', 'bell')
    .update('taco')
    .digest('hex')
    .substring(0, 6);
  helpers.generatePassword('taco').should.be.equal(key);
  helpers.generatePassword('burrito').should.not.be.equal(key);
});

// isCommand
test('isCommand should return true when incoming message is Q and type is member_support', () => {
  helpers.isCommand('q', 'member_support').should.be.true;
  helpers.isCommand('q ', 'member_support').should.be.true;
  helpers.isCommand(' q t pie', 'member_support').should.be.true;
});

test('isCommand should return true when incoming message is start and type is reportback', () => {
  helpers.isCommand('start', 'reportback').should.be.true;
  helpers.isCommand('start ', 'reportback').should.be.true;
  helpers.isCommand(' start the party!', 'reportback').should.be.true;
});

test('isCommand should return false when missing incomingMessage argument', () => {
  helpers.isCommand(undefined, 'member_support').should.be.false;
  helpers.isCommand(undefined, 'reportback').should.be.false;
});

// sendTimeoutResponse
test('sendTimeoutResponse', (t) => {
  const timeoutNumSeconds = helpers.getGambitTimeoutNumSeconds();
  helpers.sendTimeoutResponse(t.context.res);

  sinon.assert.called(helpers.sendResponse);
  sinon.assert.calledWith(helpers.sendResponse, t.context.res, 504, `Request timed out after ${timeoutNumSeconds} seconds.`);
});

// sendErrorResponse
// TODO: Test for more error types and messages
test('sendErrorResponse', (t) => {
  helpers.sendErrorResponse(t.context.res, { /* Error Object */ });

  sinon.assert.called(helpers.sendResponse);
  sinon.assert.calledWith(helpers.sendResponse, t.context.res, 500);
});

// sendUnproccessibleEntityResponse
test('sendUnproccessibleEntityResponse', (t) => {
  const message = 'Test';
  helpers.sendUnproccessibleEntityResponse(t.context.res, message);

  sinon.assert.called(helpers.sendResponse);
  sinon.assert.calledWith(helpers.sendResponse, t.context.res, 422, message);
});

// getGambitTimeoutNumSeconds
test('getGambitTimeoutNumSeconds', () => {
  helpers.getGambitTimeoutNumSeconds().should.not.be.undefined;
  helpers.getGambitTimeoutNumSeconds().should.be.below(30);
});

// upsertOptions
test('upsertOptions helper', () => {
  const opts = helpers.upsertOptions();
  opts.upsert.should.be.true;
  opts.new.should.be.true;
});