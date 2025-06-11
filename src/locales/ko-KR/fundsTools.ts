export default {
  // AssetAdjustment Page
  'assetAdjustment.title': '자산 조정',
  'assetAdjustment.message.success': '자산 조정 작업이 제출되었습니다',
  'assetAdjustment.button.operation': '증감 작업',

  // Table Columns
  'assetAdjustment.column.id': 'ID',
  'assetAdjustment.column.coinName': '코인 이름',
  'assetAdjustment.column.amount': '금액',
  'assetAdjustment.column.description': '비고',
  'assetAdjustment.column.operator': '운영자',
  'assetAdjustment.column.createTime': '시간',

  // AssetAdjustmentForm
  'assetAdjustment.form.title': '증감 작업',
  'assetAdjustment.form.button.cancel': '취소',
  'assetAdjustment.form.button.submit': '제출',

  // Form Fields
  'assetAdjustment.form.label.account': '계정',
  'assetAdjustment.form.label.direction': '방향',
  'assetAdjustment.form.label.currency': '코인 유형',
  'assetAdjustment.form.label.amount': '금액',
  'assetAdjustment.form.label.description': '메모',
  'assetAdjustment.form.label.googleCode': '구글 인증코드',

  // Form Values
  'assetAdjustment.form.direction.increase': '코인 증가',
  'assetAdjustment.form.direction.decrease': '코인 감소',

  // Form Placeholders
  'assetAdjustment.form.placeholder.amount': '금액',
  'assetAdjustment.form.placeholder.description': '이유',
  'assetAdjustment.form.placeholder.googleCode': '인증코드를 입력하세요',

  // Form Validation
  'assetAdjustment.form.validation.amount': '금액을 입력해주세요',
  'assetAdjustment.form.validation.googleCode': '구글 인증코드를 입력해주세요',

  // Google Code
  'assetAdjustment.googleCode.notBound': '바인딩되지 않음, 바인딩하러 가기',
  'assetAdjustment.googleCode.bindSuccess': '바인딩 성공',

  // Account Info
  'assetAdjustment.account.balance': '계정 잔액',
  'assetAdjustment.account.totalIncrease': '누적 증가 금액',

  // Notes
  'assetAdjustment.notes.title': '주의사항:',
  'assetAdjustment.notes.item1': '자산 증가는 신중하게 작업하세요. 자금이 사용자에게 흐르면 해당 손실을 부담해야 합니다;',
  'assetAdjustment.notes.item2': '마켓 메이킹 서비스에 사용하는 것을 권장합니다.',

  // TransferRecords Page
  'transferRecords.title': '이체 기록',

  // TransferRecords Table Columns
  'transferRecords.column.createTime': '시간',
  'transferRecords.column.fromAccount': '출금 계정',
  'transferRecords.column.fromAccountType': '출금 계정 유형',
  'transferRecords.column.toAccount': '입금 계정',
  'transferRecords.column.toAccountType': '입금 계정 유형',
  'transferRecords.column.amount': '이체 금액',
  'transferRecords.column.description': '메모',
  'transferRecords.column.operator': '운영자',

  // TransferTool Page
  'transferTool.title': '사용자 간 이체',
  'transferTool.message.success': '이체 성공',

  // TransferTool Form Labels
  'transferTool.form.label.fromAccount': '출금 계정',
  'transferTool.form.label.toAccount': '입금 계정',
  'transferTool.form.label.uid': 'UID',
  'transferTool.form.label.currency': '코인 유형',
  'transferTool.form.label.amount': '이체 금액',
  'transferTool.form.label.googleCode': '구글 인증코드',
  'transferTool.form.label.description': '메모',
  'transferTool.form.label.available': '사용 가능',

  // TransferTool Form Placeholders
  'transferTool.form.placeholder.fromAccount': '출금 계정을 선택하세요',
  'transferTool.form.placeholder.toAccount': '입금 계정을 선택하세요',
  'transferTool.form.placeholder.uid': 'UID를 입력하세요',
  'transferTool.form.placeholder.currency': '이체할 코인 유형을 선택하세요',
  'transferTool.form.placeholder.amount': '입력하세요',
  'transferTool.form.placeholder.googleCode': '인증코드를 입력하세요',
  'transferTool.form.placeholder.description': '입력하세요',

  // TransferTool Form Validation
  'transferTool.form.validation.fromAccount': '출금 계정을 선택해주세요',
  'transferTool.form.validation.toAccount': '입금 계정을 선택해주세요',
  'transferTool.form.validation.fromUid': '출금 계정 UID를 입력해주세요',
  'transferTool.form.validation.toUid': '입금 계정 UID를 입력해주세요',
  'transferTool.form.validation.currency': '코인 유형을 선택해주세요',
  'transferTool.form.validation.amount': '이체 금액을 입력해주세요',
  'transferTool.form.validation.googleCode': '구글 인증코드를 입력해주세요',
  'transferTool.form.validation.description': '메모를 입력해주세요',

  // TransferTool Form Buttons
  'transferTool.form.button.cancel': '취소',
  'transferTool.form.button.confirm': '확인',

  // TransferTool Account Types
  'transferTool.account.user': '사용자 계정',

  'transferTool.account.company_general_account': '회사 총 계정', // 公司总账户
  'transferTool.account.withdrawal_fee_account': '출금 수수료 계정', // 转出账户类型描述
  'transferTool.account.recharge_fee_account': '충전 수수료', // 充值手续费
  'transferTool.account.invite_rebate_account': '초대 리베이트 계정', // 邀请返佣账户
  'transferTool.account.fee_account': '거래 수수료 지갑', // 币对手续费钱包
  'transferTool.account.virtual_accounts': '가상 계정', // 虚拟账户
  'transferTool.account.total_withdrawal_account': '회사 출금 전환 계정', // 公司提现划转账户

  // TransferTool Scene Types
  'transferTool.scene.M2M': '사용자 간 이체',
  'transferTool.scene.M2U': '사용자 -> 회사 이체',
  'transferTool.scene.U2M': '회사 -> 사용자 이체',
  'transferTool.scene.U2U': '사용자 간 이체'
}
