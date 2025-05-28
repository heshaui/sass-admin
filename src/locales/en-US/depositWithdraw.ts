export default {
  // Deposit Management
  'deposit.title': 'Deposit Management',
  'deposit.column.id': 'Deposit Order Number',
  'deposit.column.userId': 'User ID',
  'deposit.column.coin': 'Currency',
  'deposit.column.network': 'Network Name',
  'deposit.column.amount': 'Amount',
  'deposit.column.address': 'Address',
  'deposit.column.txId': 'TxID',
  'deposit.column.confirmations': 'Confirmations',
  'deposit.column.status': 'Status',
  'deposit.column.completedTime': 'Completion Time',
  'deposit.address.internal': 'Internal',
  'deposit.address.external': 'External',

  // Form Fields
  'deposit.form.coin.placeholder': 'Currency',
  'deposit.form.userId.placeholder': 'User ID',
  'deposit.form.network.placeholder': 'Network Name',
  'deposit.form.status.placeholder': 'Deposit Status',
  'deposit.form.addressOrTxId.placeholder': 'Receiving Address, TxID',
  'deposit.form.dateRange.placeholder.start': 'Year/Month/Day',
  'deposit.form.dateRange.placeholder.end': 'Year/Month/Day',
  'deposit.form.button.search': 'Search',

  // Status
  'deposit.status.confirming': 'Confirming',
  'deposit.status.completed': 'Completed',
  'deposit.status.failed': 'Failed',

  // Mock Data
  'deposit.mock.address': 'This is an address',
  'deposit.mock.txId': 'This is a TxID',

  // Withdraw Management
  'withdraw.column.id': 'Withdrawal Order Number',
  'withdraw.column.userId': 'User ID',
  'withdraw.column.coin': 'Currency',
  'withdraw.column.network': 'Network Name',
  'withdraw.column.amount': 'Withdrawal Amount',
  'withdraw.column.fee': 'Fee',
  'withdraw.column.actualAmount': 'Actual Amount',
  'withdraw.column.minerFee': 'Actual Miner Fee',
  'withdraw.column.addressTxId': 'Address/TxId',
  'withdraw.column.fromAddress': 'From Address',
  'withdraw.column.toAddress': 'To Address',
  'withdraw.column.txId': 'TxID',
  'withdraw.column.riskLevel': 'Risk Level',
  'withdraw.column.riskDesc': 'Risk Description',
  'withdraw.column.status': 'Status',

  // Additional keys for WithdrawManage DetailModal
  'withdraw.modal.label.actualMinerFee': 'Actual Miner Fee',
  'withdraw.modal.label.remark': 'Review Notes',
  'withdraw.modal.placeholder.actualMinerFee': 'Please enter actual miner fee',
  'withdraw.modal.placeholder.remark': 'Please enter notes',
  'withdraw.message.transferAddressRequired': 'Transfer address is required',
  'withdraw.message.noRecordSelected': 'No record selected',
  'withdraw.button.confirm': 'Confirm',
  'withdraw.tabs.operationLog': 'Operation Log',
  'withdraw.tabs.riskLog': 'Risk Control Log',
  'withdraw.riskLog.column.triggerType': 'Trigger Type',
  'withdraw.riskLog.column.triggerReason': 'Trigger Reason',
  'withdraw.riskLog.column.triggerRiskLevel': 'Risk Level After Trigger',
  'withdraw.riskLog.column.suggestion': 'Processing Suggestion',
  'withdraw.riskLog.column.triggerTime': 'Trigger Time',

  // OperaLog Component
  'operaLog.column.requestPath': 'API Path',
  'operaLog.column.clientIp': 'IP Address',
  'operaLog.column.reqSource': 'Request Source',
  'operaLog.column.networkType': 'Network Type',
  'operaLog.column.beforeValue': 'Name',
  'operaLog.column.timestamp': 'Request Time',
  'operaLog.pagination.total': 'Total {total} records',

  // RiskLog Component
  'riskLog.column.sceneCode': 'Trigger Type',
  'riskLog.column.resultContent': 'Trigger Reason',
  'riskLog.column.riskLevel': 'Risk Level After Trigger',
  'riskLog.column.riskRule': 'Risk Control Period',
  'riskLog.column.suggestion': 'Processing Suggestion',
  'riskLog.column.createTime': 'Trigger Time',
  'riskLog.pagination.total': 'Total {total} records',
  'withdraw.column.withdrawTime': 'Withdrawal Time',
  'withdraw.column.action': 'Action',

  // Form Fields
  'withdraw.form.addressOrTxId.placeholder': 'Receiving Address, TxID',

  // Status
  'withdraw.status.all': 'All',
  'withdraw.status.created': 'Created',
  'withdraw.status.pending': 'Pending Review',
  'withdraw.status.completed': 'Completed',
  'withdraw.status.rejected': 'Rejected',
  'withdraw.status.cancelled': 'Cancelled',
  'withdraw.status.userCancelled': 'User Cancelled',
  'withdraw.status.unknown': 'Unknown Status',

  // Action Buttons
  'withdraw.action.review': 'Review',
  'withdraw.action.details': 'Details',

  // Detail Modal
  'withdraw.modal.title.details': 'Withdrawal Details',
  'withdraw.modal.title.review': 'Withdrawal Review',
  'withdraw.modal.label.withdrawId': 'Withdrawal Order Number',
  'withdraw.modal.label.userId': 'UID',
  'withdraw.modal.label.riskLevel': 'Risk Level',
  'withdraw.modal.label.amount': 'Withdrawal Amount',
  'withdraw.modal.label.fee': 'Fee',
  'withdraw.modal.label.actualAmount': 'Expected Amount',
  'withdraw.modal.label.protocol': 'Withdrawal Protocol',
  'withdraw.modal.label.receivingAddress': 'Receiving Address',
  'withdraw.modal.label.reviewStatus': 'Review Status',
  'withdraw.modal.label.reviewResult': 'Review Result',
  'withdraw.modal.label.processingMethod': 'Processing Method',
  'withdraw.modal.label.transferAddress': 'Transfer Address',
  'withdraw.modal.label.txId': 'TXID',
  'withdraw.modal.label.realMinerFee': 'Actual Miner Fee',
  'withdraw.modal.label.reviewRemark': 'Review Notes',

  // Radio Options
  'withdraw.modal.option.approve': 'Approve',
  'withdraw.modal.option.reject': 'Reject',
  'withdraw.modal.option.walletProcessing': 'Wallet Processing',
  'withdraw.modal.option.manualProcessing': 'Manual Processing',

  // Placeholders
  'withdraw.modal.placeholder.transferAddress': 'Please enter transfer address (required)',
  'withdraw.modal.placeholder.txId': 'Please enter TXID (required)',
  'withdraw.modal.placeholder.minerFee': 'Please enter actual miner fee (required)',

  // Buttons
  'withdraw.modal.button.submit': 'Submit',
  'withdraw.modal.button.cancel': 'Cancel',

  // Tabs
  'withdraw.modal.tab.riskLog': 'Risk Control Log',
  'withdraw.modal.tab.operationLog': 'Operation Log',

  // Risk Log Table

  // Messages
  'withdraw.message.txIdRequired': 'TXID is required',
  'withdraw.message.minerFeeRequired': 'Actual miner fee is required',
  'withdraw.message.processSuccess': 'Manual processing successful',
  'withdraw.message.processFailed': 'Manual processing failed',
};
