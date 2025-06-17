export default {
  // AssetAdjustment Page
  'assetAdjustment.title': '资产调整',
  'assetAdjustment.message.success': '资产调整操作已提交',
  'assetAdjustment.button.operation': '增减操作',

  // Table Columns
  'assetAdjustment.column.id': '编号',
  'assetAdjustment.column.coinName': '币种',
  'assetAdjustment.column.amount': '金额',
  'assetAdjustment.column.description': '备注',
  'assetAdjustment.column.operator': '操作人',
  'assetAdjustment.column.createTime': '时间',

  // AssetAdjustmentForm
  'assetAdjustment.form.title': '增减代币',
  'assetAdjustment.form.button.cancel': '取消',
  'assetAdjustment.form.button.submit': '提交',

  // Form Fields
  'assetAdjustment.form.label.account': '账户',
  'assetAdjustment.form.label.direction': '方向',
  'assetAdjustment.form.label.currency': '币种',
  'assetAdjustment.form.label.amount': '金额',
  'assetAdjustment.form.label.description': '备注',
  'assetAdjustment.form.label.googleCode': '谷歌验证码',

  // Form Values
  'assetAdjustment.form.direction.increase': '增币',
  'assetAdjustment.form.direction.decrease': '减币',

  // Form Placeholders
  'assetAdjustment.form.placeholder.amount': '金额',
  'assetAdjustment.form.placeholder.description': '原因',
  'assetAdjustment.form.placeholder.googleCode': '请输入验证码',

  // Form Validation
  'assetAdjustment.form.validation.amount': '请输入金额',
  'assetAdjustment.form.validation.googleCode': '请输入谷歌验证码',

  // Google Code
  'assetAdjustment.googleCode.notBound': '未绑定，点击前往绑定',
  'assetAdjustment.googleCode.bindSuccess': '绑定成功',

  // Account Info
  'assetAdjustment.account.balance': '账户余额',
  'assetAdjustment.account.totalIncrease': '累计增发金额',

  // Notes
  'assetAdjustment.notes.title': '注意事项:',
  'assetAdjustment.notes.item1': '增发资产建议谨慎操作，若资金流向用户，您需要承担对应损失；',
  'assetAdjustment.notes.item2': '建议用于做市服务。',

  // TransferRecords Page
  'transferRecords.title': '转账记录',

  // TransferRecords Table Columns
  'transferRecords.column.createTime': '时间',
  'transferRecords.column.fromAccount': '转出账户',
  'transferRecords.column.fromAccountType': '转出账户类型',
  'transferRecords.column.toAccount': '转入账户',
  'transferRecords.column.toAccountType': '转入账户类型',
  'transferRecords.column.amount': '转账金额',
  'transferRecords.column.description': '备注',
  'transferRecords.column.operator': '操作人',

  // TransferTool Page
  'transferTool.title': '用户间转账',
  'transferTool.message.success': '转账成功',

  // TransferTool Form Labels
  'transferTool.form.label.fromAccount': '转出账户',
  'transferTool.form.label.toAccount': '转入账户',
  'transferTool.form.label.uid': 'uid',
  'transferTool.form.label.currency': '币种',
  'transferTool.form.label.amount': '转账金额',
  'transferTool.form.label.googleCode': '谷歌验证码',
  'transferTool.form.label.description': '备注',
  'transferTool.form.label.available': '可用',

  // TransferTool Form Placeholders
  'transferTool.form.placeholder.fromAccount': '请选择转出账户',
  'transferTool.form.placeholder.toAccount': '请选择转入账户',
  'transferTool.form.placeholder.uid': '请输入uid',
  'transferTool.form.placeholder.currency': '请选择转账币种',
  'transferTool.form.placeholder.amount': '请输入',
  'transferTool.form.placeholder.googleCode': '请输入验证码',
  'transferTool.form.placeholder.description': '请输入',

  // TransferTool Form Validation
  'transferTool.form.validation.fromAccount': '请选择转出账户',
  'transferTool.form.validation.toAccount': '请选择转入账户',
  'transferTool.form.validation.fromUid': '请输入转出账户uid',
  'transferTool.form.validation.toUid': '请输入转入账户uid',
  'transferTool.form.validation.currency': '请选择币种',
  'transferTool.form.validation.amount': '请输入转账金额',
  'transferTool.form.validation.googleCode': '请输入谷歌验证码',
  'transferTool.form.validation.description': '请输入备注',

  // TransferTool Form Buttons
  'transferTool.form.button.cancel': '取消',
  'transferTool.form.button.confirm': '确认',

  // TransferTool Account Types
  'transferTool.account.user': '用户账户',

  // PresentTool Page
  'presentTool.title': '赠币工具',

  'presentTool.select.all': '全部',
  'presentTool.select.market': '做市赠币',
  'presentTool.select.activity': '活动赠币',

  'presentTool.tip.type': '类型',
  'presentTool.tip.time': '时间',
  'presentTool.tip.currency': '币种',
  'presentTool.tip.input': '请输入',
  'presentTool.tip.start': '开始时间',
  'presentTool.tip.end': '结束时间',
  'presentTool.tip.text': '用户和数量',
  'presentTool.tip.tip1': '格式：UID:数量。多个账号使用英文","区分',
  'presentTool.tip.tip2': '例如：12345:123,987654321:456',

  'presentTool.button.submit': '查询',
  'presentTool.button.gift': '赠币',
  'presentTool.button.bulkGift': '批量赠币',
  'presentTool.button.cancel': '取消',
  'presentTool.button.submit2': '提交',
  'presentTool.button.previous': '上一步',
  'presentTool.button.next': '下一步',

  'presentTool.table.column.time': '赠币日期',
  'presentTool.table.column.type': '类型',
  'presentTool.table.column.amount': '赠币数量',
  'presentTool.table.column.adminID': '管理员ID',

  'presentTool.modal.gift.title': '新增赠币',
  'presentTool.modal.gift.typeError': '类型不能为空',
  'presentTool.modal.gift.coinTypeError': '币种不能为空',
  'presentTool.modal.gift.amountError': '用户和赠币数量不能为空',
  'presentTool.modal.gift.success': '赠币成功',
  'presentTool.modal.gift.balance': '可用余额',
  'presentTool.modal.gift.error': '格式错误',

  'presentTool.steps.step1': '下载并上传文件',
  'presentTool.steps.step2': '数据检查',
  'presentTool.steps.step3': '批量赠币',

  'presentTool.steps.tip': '温馨提示',
  'presentTool.steps.tip1': '1. 该模块涉及资产操作，请确保UID正确并谨慎操作！',
  'presentTool.steps.tip2':
    '2. 赠币前请确认赠币账户资产充足，若不足请前往资金工具-转账工具进行转账。',
  'presentTool.steps.downloadTemplate': '下载模板并填写信息',
  'presentTool.steps.download': '下载模板',
  'presentTool.steps.downloadTip': '请按照模板的格式导入数据，不可修改或删除表头。',
  'presentTool.steps.uploadFile': '填写信息并上传文件',
  'presentTool.steps.upload': '上传文件',
  'presentTool.steps.uploadTip': '文件后缀需为.xlsx，最多支持导入1000条数据。',
  'presentTool.steps.template': '批量赠币模板',
  'presentTool.steps.download.success': '模板下载成功',
  'presentTool.steps.download.failed': '模板下载失败',
  'presentTool.steps.upload.success': '文件上传成功',
  'presentTool.steps.upload.failed': '文件上传失败',
  'presentTool.steps.check.success': '数据检查成功',
  'presentTool.steps.check.failed': '数据检查失败',
  'presentTool.steps.bulkGift.success': '批量赠币成功',
  'presentTool.steps.bulkGift.failed': '批量赠币失败',
  'presentTool.steps.bulkGift.count':
    '{coinName}：累计{count}人；累计金额{coinAmount}≈{rateAmount}{rate}',
  'presentTool.steps.bulkGift.count2': '{coinName}：累计{count}人；累计金额{coinAmount}',
  'presentTool.steps.bulkGift.processing': '赠币处理中，请稍等几分钟。',
  'presentTool.steps.bulkGift.notFound': '赠币开始处理，请稍等...',
  'presentTool.steps.bulkGift.success2': '操作成功！',
  'presentTool.steps.bulkGift.failed2': '操作失败！',
  'presentTool.steps.download.empty': '下载内容为空',
  'presentTool.steps.bulkGift.failed3': '超时未进入处理状态',
  'presentTool.steps.bulkGift.failed4': '请稍后刷新查看结果',

  'presentTool.steps.total1': '正常数据：{count} 条',
  'presentTool.steps.detail': '赠币详情',
  'presentTool.steps.errtotal': '异常提示',
  'presentTool.steps.null': '无',
};
