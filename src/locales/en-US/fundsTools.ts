export default {
  // AssetAdjustment Page
  'assetAdjustment.title': 'Asset Adjustment',
  'assetAdjustment.message.success': 'Asset adjustment operation submitted',
  'assetAdjustment.button.operation': 'Increase/Decrease Operation',

  // Table Columns
  'assetAdjustment.column.id': 'ID',
  'assetAdjustment.column.coinName': 'Currency',
  'assetAdjustment.column.amount': 'Amount',
  'assetAdjustment.column.description': 'Notes',
  'assetAdjustment.column.operator': 'Operator',
  'assetAdjustment.column.createTime': 'Time',

  // AssetAdjustmentForm
  'assetAdjustment.form.title': 'Increase/Decrease Token',
  'assetAdjustment.form.button.cancel': 'Cancel',
  'assetAdjustment.form.button.submit': 'Submit',

  // Form Fields
  'assetAdjustment.form.label.account': 'Account',
  'assetAdjustment.form.label.direction': 'Direction',
  'assetAdjustment.form.label.currency': 'Currency',
  'assetAdjustment.form.label.amount': 'Amount',
  'assetAdjustment.form.label.description': 'Notes',
  'assetAdjustment.form.label.googleCode': 'Google Verification Code',

  // Form Values
  'assetAdjustment.form.direction.increase': 'Increase',
  'assetAdjustment.form.direction.decrease': 'Decrease',

  // Form Placeholders
  'assetAdjustment.form.placeholder.amount': 'Amount',
  'assetAdjustment.form.placeholder.description': 'Reason',
  'assetAdjustment.form.placeholder.googleCode': 'Please enter verification code',

  // Form Validation
  'assetAdjustment.form.validation.amount': 'Please enter amount',
  'assetAdjustment.form.validation.googleCode': 'Please enter Google verification code',

  // Google Code
  'assetAdjustment.googleCode.notBound': 'Not bound, click to bind',
  'assetAdjustment.googleCode.bindSuccess': 'Binding successful',

  // Account Info
  'assetAdjustment.account.balance': 'Account Balance',
  'assetAdjustment.account.totalIncrease': 'Total Issued Amount',

  // Notes
  'assetAdjustment.notes.title': 'Notes:',
  'assetAdjustment.notes.item1':
    'Please be cautious when issuing assets. If funds flow to users, you will be responsible for corresponding losses;',
  'assetAdjustment.notes.item2': 'Recommended for market-making services.',

  // TransferRecords Page
  'transferRecords.title': 'Transfer Records',

  // TransferRecords Table Columns
  'transferRecords.column.createTime': 'Time',
  'transferRecords.column.fromAccount': 'From Account',
  'transferRecords.column.fromAccountType': 'From Account Type',
  'transferRecords.column.toAccount': 'To Account',
  'transferRecords.column.toAccountType': 'To Account Type',
  'transferRecords.column.amount': 'Transfer Amount',
  'transferRecords.column.description': 'Notes',
  'transferRecords.column.operator': 'Operator',

  // TransferTool Page
  'transferTool.title': 'User-to-User Transfer',
  'transferTool.message.success': 'Transfer successful',

  // TransferTool Form Labels
  'transferTool.form.label.fromAccount': 'From Account',
  'transferTool.form.label.toAccount': 'To Account',
  'transferTool.form.label.uid': 'UID',
  'transferTool.form.label.currency': 'Currency',
  'transferTool.form.label.amount': 'Transfer Amount',
  'transferTool.form.label.googleCode': 'Google Verification Code',
  'transferTool.form.label.description': 'Notes',
  'transferTool.form.label.available': 'Available',

  // TransferTool Form Placeholders
  'transferTool.form.placeholder.fromAccount': 'Please select from account',
  'transferTool.form.placeholder.toAccount': 'Please select to account',
  'transferTool.form.placeholder.uid': 'Please enter UID',
  'transferTool.form.placeholder.currency': 'Please select transfer currency',
  'transferTool.form.placeholder.amount': 'Please enter',
  'transferTool.form.placeholder.googleCode': 'Please enter verification code',
  'transferTool.form.placeholder.description': 'Please enter',

  // TransferTool Form Validation
  'transferTool.form.validation.fromAccount': 'Please select from account',
  'transferTool.form.validation.toAccount': 'Please select to account',
  'transferTool.form.validation.fromUid': 'Please enter from account UID',
  'transferTool.form.validation.toUid': 'Please enter to account UID',
  'transferTool.form.validation.currency': 'Please select currency',
  'transferTool.form.validation.amount': 'Please enter transfer amount',
  'transferTool.form.validation.googleCode': 'Please enter Google verification code',
  'transferTool.form.validation.description': 'Please enter notes',

  // TransferTool Form Buttons
  'transferTool.form.button.cancel': 'Cancel',
  'transferTool.form.button.confirm': 'Confirm',

  // TransferTool Account Types
  'transferTool.account.user': 'User Account',
  // PresentTool Page
  'presentTool.title': 'Coin Gifting Tool',

  'presentTool.select.all': 'All',
  'presentTool.select.market': 'Market Making Gift',
  'presentTool.select.activity': 'Event Gift',

  'presentTool.tip.type': 'Type',
  'presentTool.tip.time': 'Time',
  'presentTool.tip.currency': 'Currency',
  'presentTool.tip.input': 'Please input',
  'presentTool.tip.start': 'Start Time',
  'presentTool.tip.end': 'End Time',
  'presentTool.tip.text': 'User and Amount',
  'presentTool.tip.tip1': 'Format: UID:Amount. Separate multiple accounts with English ","',
  'presentTool.tip.tip2': 'For example: 12345:123,987654321:456',

  'presentTool.button.submit': 'Query',
  'presentTool.button.gift': 'Gift Coin',
  'presentTool.button.bulkGift': 'Bulk Gift',
  'presentTool.button.cancel': 'Cancel',
  'presentTool.button.submit2': 'Submit',
  'presentTool.button.previous': 'Previous',
  'presentTool.button.next': 'Next',

  'presentTool.table.column.time': 'Gifting Date',
  'presentTool.table.column.type': 'Type',
  'presentTool.table.column.amount': 'Gifting Amount',
  'presentTool.table.column.adminID': 'Admin ID',

  'presentTool.modal.gift.title': 'New Coin Gift',
  'presentTool.modal.gift.typeError': 'Type cannot be empty',
  'presentTool.modal.gift.coinTypeError': 'Currency cannot be empty',
  'presentTool.modal.gift.amountError': 'User and gifting amount cannot be empty',
  'presentTool.modal.gift.success': 'Coin gifting successful',
  'presentTool.modal.gift.balance': 'Available Balance',

  'presentTool.steps.step1': 'Download and Upload File',
  'presentTool.steps.step2': 'Data Check',
  'presentTool.steps.step3': 'Bulk Coin Gifting',

  'presentTool.steps.tip': 'Friendly Reminder',
  'presentTool.steps.tip1':
    '1. This module involves asset operations. Please ensure UIDs are correct and operate with caution!',
  'presentTool.steps.tip2':
    '2. Before gifting coins, confirm that the gifting account has sufficient assets. If not, please go to the Fund Tool - Transfer Tool to make a transfer.',
  'presentTool.steps.downloadTemplate': 'Download Template and Fill in Information',
  'presentTool.steps.download': 'Download Template',
  'presentTool.steps.downloadTip':
    'Please import data according to the template format. Do not modify or delete the header.',
  'presentTool.steps.uploadFile': 'Fill in Information and Upload File',
  'presentTool.steps.upload': 'Upload File',
  'presentTool.steps.uploadTip':
    'File suffix must be .xlsx. Up to 1000 pieces of data can be imported.',
  'presentTool.steps.template': 'Bulk Coin Gifting Template',
  'presentTool.steps.download.success': 'Template downloaded successfully',
  'presentTool.steps.download.failed': 'Template download failed',
  'presentTool.steps.upload.success': 'File uploaded successfully',
  'presentTool.steps.upload.failed': 'File upload failed',
  'presentTool.steps.check.success': 'Data check successful',
  'presentTool.steps.check.failed': 'Data check failed',
  'presentTool.steps.bulkGift.success': 'Bulk coin gifting successful',
  'presentTool.steps.bulkGift.failed': 'Bulk coin gifting failed',
  'presentTool.steps.bulkGift.count':
    '{coinName}: Total {count} people; Total amount {coinAmount}≈{rateAmount}{rate}',
  'presentTool.steps.bulkGift.count2':
    '{coinName}: Total {count} people; Total amount {coinAmount}',
  'presentTool.steps.bulkGift.processing': 'Coin gifting in progress, please wait a few minutes.',
  'presentTool.steps.bulkGift.notFound': 'Coin gifting started, please wait...',
  'presentTool.steps.bulkGift.success2': 'Operation successful!',
  'presentTool.steps.bulkGift.failed2': 'Operation failed!',
  'presentTool.steps.download.empty': 'Download content is empty',

  'presentTool.steps.total1': 'Normal data: {count} items',
  'presentTool.steps.detail': 'Coin gift details',
  'presentTool.steps.errtotal': 'Exception prompt',
  'presentTool.steps.null': 'None',
};
