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
  'assetAdjustment.notes.item1':
    '자산 증가는 신중하게 작업하세요. 자금이 사용자에게 흐르면 해당 손실을 부담해야 합니다;',
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

  // PresentTool Page
  'presentTool.title': '코인 증정 도구',

  'presentTool.select.all': '전체',
  'presentTool.select.market': '시장 만들기 증정',
  'presentTool.select.activity': '이벤트 증정',

  'presentTool.tip.type': '유형',
  'presentTool.tip.time': '시간',
  'presentTool.tip.currency': '통화',
  'presentTool.tip.input': '입력하세요',
  'presentTool.tip.start': '시작 시간',
  'presentTool.tip.end': '종료 시간',
  'presentTool.tip.text': '사용자 및 수량',
  'presentTool.tip.tip1': '형식: UID:수량. 여러 계정은 영문 "," 로 구분합니다',
  'presentTool.tip.tip2': '예: 12345:123,987654321:456',

  'presentTool.button.submit': '조회',
  'presentTool.button.gift': '코인 증정',
  'presentTool.button.bulkGift': '일괄 증정',
  'presentTool.button.cancel': '취소',
  'presentTool.button.submit2': '제출',
  'presentTool.button.previous': '이전',
  'presentTool.button.next': '다음',

  'presentTool.table.column.time': '증정 날짜',
  'presentTool.table.column.type': '유형',
  'presentTool.table.column.amount': '증정 수량',
  'presentTool.table.column.adminID': '관리자 ID',

  'presentTool.modal.gift.title': '새로운 코인 증정',
  'presentTool.modal.gift.typeError': '유형을 비워둘 수 없습니다',
  'presentTool.modal.gift.coinTypeError': '통화를 비워둘 수 없습니다',
  'presentTool.modal.gift.amountError': '사용자 및 증정 수량을 비워둘 수 없습니다',
  'presentTool.modal.gift.success': '코인 증정 성공',
  'presentTool.modal.gift.balance': '사용 가능 잔액',

  'presentTool.steps.step1': '파일 다운로드 및 업로드',
  'presentTool.steps.step2': '데이터 검사',
  'presentTool.steps.step3': '일괄 코인 증정',

  'presentTool.steps.tip': '유의사항',
  'presentTool.steps.tip1':
    '1. 이 모듈은 자산 조작을 수반합니다. UID가 정확한지 확인하고 신중하게 조작하세요!',
  'presentTool.steps.tip2':
    '2. 코인을 증정하기 전에 증정 계정에 자산이 충분한지 확인하세요. 부족한 경우 자금 도구-이체 도구로 이동하여 이체하세요.',
  'presentTool.steps.downloadTemplate': '템플릿 다운로드하고 정보 입력',
  'presentTool.steps.download': '템플릿 다운로드',
  'presentTool.steps.downloadTip':
    '템플릿 형식에 따라 데이터를 가져오세요. 헤더를 수정하거나 삭제하지 마세요.',
  'presentTool.steps.uploadFile': '정보 입력하고 파일 업로드',
  'presentTool.steps.upload': '파일 업로드',
  'presentTool.steps.uploadTip':
    '파일 확장자는 .xlsx여야 합니다. 최대 1000개의 데이터를 가져올 수 있습니다.',
  'presentTool.steps.template': '일괄 코인 증정 템플릿',
  'presentTool.steps.download.success': '템플릿이 성공적으로 다운로드되었습니다',
  'presentTool.steps.download.failed': '템플릿 다운로드에 실패했습니다',
  'presentTool.steps.upload.success': '파일이 성공적으로 업로드되었습니다',
  'presentTool.steps.upload.failed': '파일 업로드에 실패했습니다',
  'presentTool.steps.check.success': '데이터 검사에 성공했습니다',
  'presentTool.steps.check.failed': '데이터 검사에 실패했습니다',
  'presentTool.steps.bulkGift.success': '일괄 코인 증정에 성공했습니다',
  'presentTool.steps.bulkGift.failed': '일괄 코인 증정에 실패했습니다',
  'presentTool.steps.bulkGift.count':
    '{coinName}：누적{count}명；누적 금액{coinAmount}≈{rateAmount}{rate}',
  'presentTool.steps.bulkGift.count2': '{coinName}：누적{count}명；누적 금액{coinAmount}',
  'presentTool.steps.bulkGift.processing': '코인 증정 처리 중입니다. 잠시만 기다려주세요.',
  'presentTool.steps.bulkGift.notFound': '코인 증정이 처리 시작되었습니다. 잠시만 기다려주세요...',
  'presentTool.steps.bulkGift.success2': '작업이 성공했습니다!',
  'presentTool.steps.bulkGift.failed2': '작업이 실패했습니다!',
  'presentTool.steps.download.empty': '다운로드 내용이 비어 있습니다',

  'presentTool.steps.total1': '정상 데이터: {count} 건',
  'presentTool.steps.detail': '코인 선물 상세',
  'presentTool.steps.errtotal': '오류 안내',
  'presentTool.steps.null': '없음',
};
