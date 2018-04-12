'use strict';

const defaultText = {
  askWhyParticipated: 'Last question: Why was participating in {{title}} important to you? (No need to write an essay, one sentence is good).',
  completedMenu: 'To submit another post for {{title}}, text {{cmd_reportback}}',
  declined: 'Text MENU if you\'d like to find a different action to take.',
  invalidInput: 'Sorry, I didn\'t get that.',
  signupMenu: 'Thanks for signing up for {{title}}! Text {{cmd_reportback}} to submit a post.',
  yesNo: '\n\nYes or No',
};

module.exports = {
  defaultPostType: 'photo',
  /**
   * Maps each content type that's available as a postConfig to the Post type it should create.
   *
   * { contentTypeName: 'postType' }
   */
  postTypesByContentType: {
    textPostConfig: 'text',
    photoPostConfig: 'photo',
  },
  /*
   * Maps each content type with a map of templateNames and its corresponding field name and
   * default text to use, if a field value doesn't exist. Fields without defaults are required.
   */
  templatesByContentType: {
    campaign: {
      memberSupport: {
        fieldName: 'memberSupportMessage',
        default: 'Text back your question and I\'ll try to get back to you within 24 hrs.\n\nIf you want to continue {{title}}, text back {{keyword}}',
      },
      campaignClosed: {
        fieldName: 'campaignClosedMessage',
        default: 'Sorry, {{title}} is no longer available.\n\nText {{cmd_member_support}} for help.',
      },
      askSignup: {
        fieldName: 'askSignupMessage',
        default: `{{tagline}}\n\nWant to join {{title}}?${defaultText.yesNo}`,
      },
      declinedSignup: {
        fieldName: 'declinedSignupMessage',
        default: `Ok! ${defaultText.declined}`,
      },
      invalidAskSignupResponse: {
        fieldName: 'invalidSignupResponseMessage',
        default: `${defaultText.invalidInput} Did you want to join {{title}}?${defaultText.yesNo}`,
      },
      askContinue: {
        fieldName: 'askContinueMessage',
        default: `Ready to get back to {{title}}?${defaultText.yesNo}`,
      },
      declinedContinue: {
        fieldName: 'declinedContinueMessage',
        default: `Right on, we'll check in with you about {{title}} later.\n\n${defaultText.declined}`,
      },
      invalidAskContinueResponse: {
        fieldName: 'invalidContinueResponseMessage',
        default: `${defaultText.invalidInput} Did you want to join {{title}}?${defaultText.yesNo}`,
      },
    },
    photoPostConfig: {
      gambitSignupMenu: {
        fieldName: 'gambitSignupMenuMessage',
        default: defaultText.signupMenu,
      },
      // This will get removed once Conversations Signup messages sends botSignupConfirmed.
      // @see textPostConfig property below.
      externalSignupMenu: {
        fieldName: 'externalSignupMenuMessage',
        default: `Hi its Freddie from DoSomething! ${defaultText.signupMenu}`,
      },
      webSignupConfirmed: {
        fieldName: 'externalSignupMenuMessage',
        default: defaultText.signupMenu,
      },
      invalidSignupMenuCommand: {
        fieldName: 'invalidSignupMenuCommandMessage',
        default: `${defaultText.invalidInput} Text {{cmd_reportback}} to a submit a post for {{title}}.`,
      },
      askQuantity: {
        fieldName: 'askQuantityMessage',
      },
      invalidQuantity: {
        fieldName: 'invalidQuantityMessage',
      },
      askPhoto: {
        fieldName: 'askPhotoMessage',
      },
      invalidPhoto: {
        fieldName: 'invalidPhotoMessage',
      },
      askCaption: {
        fieldName: 'askCaptionMessage',
        default: 'Got it! Now text back a caption for your photo (think Instagram)! Keep it short & sweet, under 60 characters please.',
      },
      invalidCaption: {
        fieldName: 'invalidCaptionMessage',
        default: `${defaultText.invalidInput}\n\nText back a caption for your photo -- keep it short & sweet, under 60 characters please. (but more than 3!)`,
      },
      askWhyParticipated: {
        fieldName: 'askWhyParticipatedMessage',
        default: defaultText.askWhyParticipated,
      },
      invalidWhyParticipated: {
        fieldName: 'invalidWhyParticipatedMessage',
        default: `${defaultText.invalidInput}\n\n${defaultText.askWhyParticipated}`,
      },
      completedMenu: {
        fieldName: 'completedMenuMessage',
        default: `Great! We've got you down for {{quantity}}.\n\n${defaultText.completedMenu}`,
      },
      invalidCompletedMenuCommand: {
        fieldName: 'invalidCompletedMenuCommandMessage',
        default: `${defaultText.invalidInput}\n\n${defaultText.completedMenu}.`,
      },
    },
    textPostConfig: {
      botSignupConfirmed: {
        fieldName: 'botSignupConfirmedMessage',
      },
      // This will eventually get deprecated for webSignupConfirmed once Conversation Signup
      // messages send the webSignupConfirmed.
      // @see photoPostConfig above.
      externalSignupMenu: {
        fieldName: 'botSignupConfirmedMessage',
      },
      webSignupConfirmed: {
        fieldName: 'webSignupConfirmedMessage',
      },
      invalidText: {
        fieldName: 'invalidTextMessage',
      },
      textPostCompleted: {
        fieldName: 'textPostCompletedMessage',
      },
    },
  },
};
