export default {
  // Deposit Management
  'deposit.title': '充币管理',
  'deposit.column.id': '充值单号',
  'deposit.column.userId': '用户ID',
  'deposit.column.coin': '币种',
  'deposit.column.network': '网络名称',
  'deposit.column.amount': '数量',
  'deposit.column.address': '地址',
  'deposit.column.txId': 'TxID',
  'deposit.column.confirmations': '确认数',
  'deposit.column.status': '状态',
  'deposit.column.completedTime': '到账时间',
  'deposit.address.internal': '内',
  'deposit.address.external': '外',

  // Form Fields
  'deposit.form.coin.placeholder': '币种',
  'deposit.form.userId.placeholder': '用户ID',
  'deposit.form.network.placeholder': '网络名称',
  'deposit.form.status.placeholder': '充值状态',
  'deposit.form.addressOrTxId.placeholder': '到账地址、TxID',
  'deposit.form.dateRange.placeholder.start': '年/月/日',
  'deposit.form.dateRange.placeholder.end': '年/月/日',
  'deposit.form.button.search': '搜索',

  // Status
  'deposit.status.confirming': '确认中',
  'deposit.status.completed': '已到账',
  'deposit.status.failed': '失败',

  // Mock Data
  'deposit.mock.address': '这是一个地址',
  'deposit.mock.txId': '这是一个TxID',

  // Withdraw Management
  'withdraw.column.id': '提现单号',
  'withdraw.column.userId': '用户ID',
  'withdraw.column.coin': '币种',
  'withdraw.column.network': '网络名称',
  'withdraw.column.amount': '提现数量',
  'withdraw.column.fee': '手续费',
  'withdraw.column.actualAmount': '实际到账',
  'withdraw.column.minerFee': '实际矿工费',
  'withdraw.column.addressTxId': '地址/TxId',
  'withdraw.column.fromAddress': '发送地址',
  'withdraw.column.toAddress': '接收地址',
  'withdraw.column.txId': 'TxID',
  'withdraw.column.riskLevel': '风控等级',
  'withdraw.column.riskDesc': '风控说明',
  'withdraw.column.status': '状态',

  // Additional keys for WithdrawManage DetailModal
  'withdraw.modal.label.actualMinerFee': '实际矿工费',
  'withdraw.modal.label.remark': '审核备注',
  'withdraw.modal.placeholder.actualMinerFee': '请输入实际矿工费',
  'withdraw.modal.placeholder.remark': '请输入备注',
  'withdraw.message.transferAddressRequired': '转账地址为必填项',
  'withdraw.message.noRecordSelected': '未选择记录',
  'withdraw.button.confirm': '确认',
  'withdraw.tabs.operationLog': '操作日志',
  'withdraw.tabs.riskLog': '风控日志',
  'withdraw.riskLog.column.triggerType': '触发类型',
  'withdraw.riskLog.column.triggerReason': '触发原因',
  'withdraw.riskLog.column.triggerRiskLevel': '触发后风控等级',
  'withdraw.riskLog.column.suggestion': '处理建议',
  'withdraw.riskLog.column.triggerTime': '触发时间',

  // OperaLog Component
  'operaLog.column.requestPath': '接口路径',
  'operaLog.column.clientIp': 'ip地址',
  'operaLog.column.reqSource': '请求来源',
  'operaLog.column.networkType': '网络类型',
  'operaLog.column.beforeValue': '名称',
  'operaLog.column.timestamp': '请求时间',
  'operaLog.pagination.total': '共 {total} 条记录',

  // RiskLog Component
  'riskLog.column.sceneCode': '触发类型',
  'riskLog.column.resultContent': '触发原因',
  'riskLog.column.riskLevel': '触发后风控等级',
  'riskLog.column.riskRule': '风控周期',
  'riskLog.column.suggestion': '处理建议',
  'riskLog.column.createTime': '触发时间',
  'riskLog.pagination.total': '共 {total} 条记录',
  'withdraw.column.withdrawTime': '提现时间',
  'withdraw.column.action': '操作',

  // Form Fields
  'withdraw.form.addressOrTxId.placeholder': '到账地址、TxID',

  // Status
  'withdraw.status.all': '全部',
  'withdraw.status.created': '创建',
  'withdraw.status.pending': '待审核',
  'withdraw.status.completed': '完成',
  'withdraw.status.rejected': '拒绝',
  'withdraw.status.cancelled': '已撤销',
  'withdraw.status.userCancelled': '用户撤销',
  'withdraw.status.unknown': '未知状态',

  // Action Buttons
  'withdraw.action.review': '审核',
  'withdraw.action.details': '详情',

  // Detail Modal
  'withdraw.modal.title.details': '提现详情',
  'withdraw.modal.title.review': '提现审核',
  'withdraw.modal.title.userlog': '用户日志',
  'withdraw.modal.label.withdrawId': '提现单号',
  'withdraw.modal.label.userId': 'UID',
  'withdraw.modal.label.riskLevel': '风控等级',
  'withdraw.modal.label.amount': '提现金额',
  'withdraw.modal.label.fee': '手续费',
  'withdraw.modal.label.actualAmount': '应到金额',
  'withdraw.modal.label.protocol': '提币协议',
  'withdraw.modal.label.receivingAddress': '提现地址',
  'withdraw.modal.label.reviewStatus': '审核状态',
  'withdraw.modal.label.reviewResult': '审核结果',
  'withdraw.modal.label.processingMethod': '处理方式',
  'withdraw.modal.label.transferAddress': '转账地址',
  'withdraw.modal.label.txId': 'TXID',
  'withdraw.modal.label.realMinerFee': '实际矿工费',
  'withdraw.modal.label.reviewRemark': '审核备注',

  // Radio Options
  'withdraw.modal.option.approve': '通过',
  'withdraw.modal.option.reject': '拒绝',
  'withdraw.modal.option.walletProcessing': '钱包处理',
  'withdraw.modal.option.manualProcessing': '人工处理',

  // Placeholders
  'withdraw.modal.placeholder.transferAddress': '请输入转账地址（必填）',
  'withdraw.modal.placeholder.txId': '请输入TXID（必填）',
  'withdraw.modal.placeholder.minerFee': '请输入实际矿工费（必填）',

  // Buttons
  'withdraw.modal.button.submit': '提交',
  'withdraw.modal.button.cancel': '取消',

  // Tabs
  'withdraw.modal.tab.riskLog': '风控日志',
  'withdraw.modal.tab.operationLog': '操作日志',

  // Risk Log Table

  // Messages
  'withdraw.message.txIdRequired': 'TXID为必填项',
  'withdraw.message.minerFeeRequired': '实际矿工费为必填项',
  'withdraw.message.processSuccess': '人工处理成功',
  'withdraw.message.processFailed': '人工处理失败',
};
