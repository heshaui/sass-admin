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

  'transferTool.account.company_general_account': 'Company General Account', // 公司总账户
  'transferTool.account.withdrawal_fee_account': 'Withdrawal Account Type Description', // 转出账户类型描述
  'transferTool.account.recharge_fee_account': 'Recharge Fee', // 充值手续费
  'transferTool.account.invite_rebate_account': 'Invitation Rebate Account', // 邀请返佣账户
  'transferTool.account.fee_account': 'Trading Fee Wallet', // 币对手续费钱包
  'transferTool.account.virtual_accounts': 'Virtual Accounts', // 虚拟账户
  'transferTool.account.total_withdrawal_account': 'Company Withdrawal Transfer Account', // 公司提现划转账户


  // TransferTool Scene Types
  "transferTool.scene.test": "Test",
  "transferTool.scene.symbol-order": "Spot order deduction",
  "transferTool.scene.extraction-symbol-order": "Withdrawal - Available to Frozen",
  "transferTool.scene.undo_extraction-symbol-order": "Withdrawal - Frozen to Available",
  "transferTool.scene.symbol-order-fee": "Fee",
  "transferTool.scene.canal-symbol-order": "Cancel spot order",
  "transferTool.scene.buy-trade-symbol-order": "Seller spot order matching transfer",
  "transferTool.scene.sell-trade-symbol-order": "Buyer spot order matching transfer",
  "transferTool.scene.canal_symbol_order": "Spot order - Refund rejection",
  "transferTool.scene.M2M": "User to user transfer",
  "transferTool.scene.M2U": "User to company transfer",
  "transferTool.scene.U2M": "Company to user transfer",
  "transferTool.scene.U2U": "User to user transfer"
};
