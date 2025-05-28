export default {
  // Basic Config Translations
  'basicConfig.card.loginRegister': 'Login & Registration Configuration',
  'basicConfig.card.loginNotification': 'Login Notification Configuration',
  'basicConfig.card.accessConfig': 'Access Configuration',

  // Tips and Descriptions
  'basicConfig.tips.loginRegister':
    'Tips: Restricting APP/PC registration, when enabled, mobile users cannot login or register on the exchange',
  'basicConfig.tips.loginNotification':
    'Tip: Notification for each successful login: When enabled, users will receive SMS or email notifications for each successful login to the exchange; When disabled, SMS or email notifications will be sent only for first-time logins, new IP addresses, or new device logins, with email taking priority over SMS.',
  'basicConfig.tips.accessConfig': 'Tips:',
  'basicConfig.tips.accessConfig.item1': 'Multiple data entries should be separated by commas;',
  'basicConfig.tips.accessConfig.item2':
    'Restricted mobile registration and open mobile registration can only be configured as mutually exclusive options;',

  // Switch Labels
  'basicConfig.switch.disableLogin': 'Disable Login',
  'basicConfig.switch.disableRegister': 'Disable Registration',
  'basicConfig.switch.loginNotification': 'Notification for Each Successful Login',

  // Country Code Settings
  'basicConfig.countryCode.title':
    'Country Codes Restricted for Mobile Registration (separate multiple codes with commas)',
  'basicConfig.countryCode.placeholder': 'Example: 86,1,44',
  'basicConfig.countryCode.description':
    'The entered country codes will restrict mobile registration for these area codes, example: 86,1,',
  'basicConfig.countryCode.saveButton': 'Save Country Code Settings',

  // Success Messages
  'basicConfig.message.loginConfig.success': 'Login restriction configuration updated successfully',
  'basicConfig.message.registerConfig.success':
    'Registration restriction configuration updated successfully',
  'basicConfig.message.loginNotification.success':
    'Login notification configuration updated successfully',
  'basicConfig.message.countryCode.success':
    'Country code restriction configuration updated successfully',

  // Error Messages
  'basicConfig.message.getConfig.error': 'Failed to retrieve configuration data',
  'basicConfig.message.loginConfig.error': 'Failed to update login restriction configuration',
  'basicConfig.message.registerConfig.error':
    'Failed to update registration restriction configuration',
  'basicConfig.message.loginNotification.error':
    'Failed to update login notification configuration',
  'basicConfig.message.countryCode.error':
    'Failed to update country code restriction configuration',

  // Console Error Messages
  'basicConfig.console.getConfig.error': 'Failed to retrieve configuration:',
  'basicConfig.console.loginConfig.error': 'Failed to update login restriction configuration:',
  'basicConfig.console.registerConfig.error':
    'Failed to update registration restriction configuration:',
  'basicConfig.console.loginNotification.error':
    'Failed to update login notification configuration:',
  'basicConfig.console.countryCode.error':
    'Failed to update country code restriction configuration:',
};
