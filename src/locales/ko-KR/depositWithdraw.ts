export default {
  // Deposit Management
  'deposit.title': '충币 관리',
  'deposit.column.id': '충币 주문번호',
  'deposit.column.userId': '사용자 ID',
  'deposit.column.coin': '화폐 종류',
  'deposit.column.network': '네트워크 이름',
  'deposit.column.amount': '수량',
  'deposit.column.address': '주소',
  'deposit.column.txId': 'TxID',
  'deposit.column.confirmations': '확인 수',
  'deposit.column.status': '상태',
  'deposit.column.completedTime': '입금 시간',
  'deposit.address.internal': '내',
  'deposit.address.external': '외',
  
  // Form Fields
  'deposit.form.coin.placeholder': '화폐 종류',
  'deposit.form.userId.placeholder': '사용자 ID',
  'deposit.form.network.placeholder': '네트워크 이름',
  'deposit.form.status.placeholder': '충币 상태',
  'deposit.form.addressOrTxId.placeholder': '입금 주소, TxID',
  'deposit.form.dateRange.placeholder.start': '년/월/일',
  'deposit.form.dateRange.placeholder.end': '년/월/일',
  'deposit.form.button.search': '검색',
  
  // Status
  'deposit.status.confirming': '확인 중',
  'deposit.status.completed': '입금 완료',
  'deposit.status.failed': '입금 실패',
  
  // Mock Data
  'deposit.mock.address': '이 주소는 테스트용입니다',
  'deposit.mock.txId': '이 TxID는 테스트용입니다',

  // Withdraw Management
  'withdraw.column.id': '출금 주문번호',
  'withdraw.column.userId': '사용자 ID',
  'withdraw.column.coin': '화폐 종류',
  'withdraw.column.network': '네트워크 이름',
  'withdraw.column.amount': '출금 수량',
  'withdraw.column.fee': '수수료',
  'withdraw.column.actualAmount': '실제 입금액',
  'withdraw.column.minerFee': '실제 미네어 수수료',
  'withdraw.column.addressTxId': '주소/TxId',
  'withdraw.column.fromAddress': '송금 주소',
  'withdraw.column.toAddress': '수금 주소',
  'withdraw.column.txId': 'TxID',
  'withdraw.column.riskLevel': '리스크 레벨',
  'withdraw.column.riskDesc': '리스크 설명',
  'withdraw.column.status': '출금 상태',
  
  // Additional keys for WithdrawManage DetailModal
  'withdraw.modal.label.actualMinerFee': '실제 미네어 수수료',
  'withdraw.modal.label.remark': '검토 메모',
  'withdraw.modal.placeholder.actualMinerFee': '실제 미네어 수수료를 입력해주세요',
  'withdraw.modal.placeholder.remark': '검토 메모를 입력해주세요',
  'withdraw.message.transferAddressRequired': '입금 주소, TxID가 필수 입력값입니다',
  'withdraw.message.noRecordSelected': '선택된 기록이 없습니다',
  'withdraw.button.confirm': '확인',
  'withdraw.tabs.operationLog': '운영 로그',
  'withdraw.tabs.riskLog': '리스크 로그',
  'withdraw.riskLog.column.triggerType': '트리거 타입',
  'withdraw.riskLog.column.triggerReason': '트리거 이유',
  'withdraw.riskLog.column.triggerRiskLevel': '트리거 후 리스크 레벨',
  'withdraw.riskLog.column.suggestion': '처리 제안',
  'withdraw.riskLog.column.triggerTime': '트리거 시간',
  
  // OperaLog Component
  'operaLog.column.requestPath': 'API 경로',
  'operaLog.column.clientIp': 'IP 주소',
  'operaLog.column.reqSource': '요청 소스',
  'operaLog.column.networkType': '네트워크 타입',
  'operaLog.column.beforeValue': '이름',
  'operaLog.column.timestamp': '요청 시간',
  'operaLog.pagination.total': '총 {total}개의 기록',
  
  // RiskLog Component
  'riskLog.column.sceneCode': '트리거 타입',
  'riskLog.column.resultContent': '트리거 이유',
  'riskLog.column.riskLevel': '리스크 레벨',
  'riskLog.column.riskRule': '리스크 규칙',
  'riskLog.column.suggestion': '처리 제안',
  'riskLog.column.createTime': '트리거 시간',
  'riskLog.pagination.total': '총 {total}개의 기록',
  'withdraw.column.withdrawTime': '출금 시간',
  'withdraw.column.action': '액션',
  
  // Form Fields
  'withdraw.form.addressOrTxId.placeholder': '입금 주소, TxID',
  
  // Status
  'withdraw.status.all': '전체',
  'withdraw.status.created': '생성',
  'withdraw.status.pending': '대기',
  'withdraw.status.completed': '완료',
  'withdraw.status.rejected': '거부',
  'withdraw.status.cancelled': '취소',
  'withdraw.status.userCancelled': '사용자 취소',
  'withdraw.status.unknown': '未知状态',
  
  // Action Buttons
  'withdraw.action.review': '검토',
  'withdraw.action.details': '상세',
  
  // Detail Modal
  'withdraw.modal.title.details': '출금 상세',
  'withdraw.modal.title.review': '출금 검토',
  'withdraw.modal.label.withdrawId': '출금 주문번호',
  'withdraw.modal.label.userId': 'UID',
  'withdraw.modal.label.riskLevel': '리스크 레벨',
  'withdraw.modal.label.amount': '출금 수량',
  'withdraw.modal.label.fee': '수수료',
  'withdraw.modal.label.actualAmount': '실제 입금액',
  'withdraw.modal.label.protocol': '출금 프로토콜',
  'withdraw.modal.label.receivingAddress': '수금 주소',
  'withdraw.modal.label.reviewStatus': '검토 상태',
  'withdraw.modal.label.reviewResult': '검토 결과',
  'withdraw.modal.label.processingMethod': '처리 방법',
  'withdraw.modal.label.transferAddress': '입금 주소',
  'withdraw.modal.label.txId': 'TXID',
  'withdraw.modal.label.realMinerFee': '실제 미네어 수수료',
  'withdraw.modal.label.reviewRemark': '검토 메모',
  
  // Radio Options
  'withdraw.modal.option.approve': '통과',
  'withdraw.modal.option.reject': '거부',
  'withdraw.modal.option.walletProcessing': '지갑 처리',
  'withdraw.modal.option.manualProcessing': '인공 처리',
  
  // Placeholders
  'withdraw.modal.placeholder.transferAddress': '입금 주소를 입력해주세요',
  'withdraw.modal.placeholder.txId': 'TXID를 입력해주세요',
  'withdraw.modal.placeholder.minerFee': '실제 미네어 수수료를 입력해주세요',
  
  // Buttons
  'withdraw.modal.button.submit': '제출',
  'withdraw.modal.button.cancel': '취소',
  
  // Tabs
  'withdraw.modal.tab.riskLog': '리스크 로그',
  'withdraw.modal.tab.operationLog': '운영 로그',
  
  // Risk Log Table
  
  // Messages
  'withdraw.message.txIdRequired': 'TXID가 필수 입력값입니다',
  'withdraw.message.minerFeeRequired': '실제 미네어 수수료가 필수 입력값입니다',
  'withdraw.message.processSuccess': '인공 처리 성공',
  'withdraw.message.processFailed': '인공 처리 실패'
}