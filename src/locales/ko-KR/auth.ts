export default {
  // Role Admin Translations
  'roleAdmin.table.roleId': '역할 ID', // Role ID
  'roleAdmin.table.roleName': '역할 이름', // Role Name
  'roleAdmin.table.description': '설명', // Description
  'roleAdmin.table.createTime': '생성 시간', // Creation Time
  'roleAdmin.table.status': '상태', // Status
  'roleAdmin.table.status.disabled': '비활성화', // Disabled
  'roleAdmin.table.status.enabled': '활성화', // Enabled
  'roleAdmin.table.actions': '작업', // Actions
  'roleAdmin.table.actions.dispense': '권한 할당', // Permission Assignment
  'roleAdmin.table.actions.edit': '수정', // Edit
  'roleAdmin.table.actions.delete': '삭제', // Delete
  'roleAdmin.actions.create': '새로 만들기', // Create New
  'roleAdmin.messages.deleteConfirm.title': '삭제 확인', // Delete Confirmation
  'roleAdmin.messages.deleteConfirm.content':
    '이 역할을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.', // Are you sure to delete this role? This action cannot be undone.
  'roleAdmin.messages.deleteConfirm.okText': '확인', // Confirm
  'roleAdmin.messages.deleteConfirm.cancelText': '취소', // Cancel
  'roleAdmin.messages.deleteSuccess': '역할 삭제 성공', // Role deleted successfully
  'roleAdmin.messages.deleteError': '삭제 실패', // Deletion failed
  'roleAdmin.messages.updateSuccess': '역할 수정 성공', // Role updated successfully
  'roleAdmin.messages.updateError': '역할 수정 실패', // Role update failed
  'roleAdmin.messages.createSuccess': '역할 생성 성공', // Role created successfully
  'roleAdmin.messages.createError': '역할 생성 실패', // Role creation failed
  'roleAdmin.messages.operationError': '작업 실패', // Operation failed
  'roleAdmin.messages.noPermissionChanges': '권한 구성에 변경 사항이 없습니다', // No changes in permission configuration
  'roleAdmin.messages.addPermissionError': '권한 추가 실패', // Failed to add permission
  'roleAdmin.messages.removePermissionError': '권한 제거 실패', // Failed to remove permission
  'roleAdmin.messages.permissionAssignSuccess': '권한 할당 성공', // Permission assigned successfully

  // User Admin Translations
  'userAdmin.table.id': '관리자 ID', // Admin ID
  'userAdmin.table.nickname': '닉네임', // Nickname
  'userAdmin.table.remark': '비고', // Remark
  'userAdmin.table.role': '역할', // Role
  'userAdmin.table.phone': '휴대폰 번호', // Phone
  'userAdmin.table.email': '이메일', // Email
  'userAdmin.table.googleCode': '2FA', // 2FA
  'userAdmin.table.googleCode.enabled': '활성화됨', // Enabled
  'userAdmin.table.googleCode.disabled': '비활성화됨', // Disabled
  'userAdmin.table.status': '상태', // Status
  'userAdmin.table.status.disabled': '비활성화', // Disabled
  'userAdmin.table.status.enabled': '정상', // Enabled
  'userAdmin.table.actions': '작업', // Actions
  'userAdmin.table.actions.delete': '삭제', // Delete
  'userAdmin.table.actions.edit': '편집', // Edit
  'userAdmin.table.actions.resetPassword': '비밀번호 재설정', // Reset Password
  'userAdmin.table.actions.resetPassword.confirm': '이 사용자의 비밀번호를 재설정하시겠습니까?', // Are you sure to reset this user's password?
  'userAdmin.table.actions.resetPassword.success': '비밀번호 재설정 성공', // Password reset successfully
  'userAdmin.table.actions.resetPassword.error': '비밀번호 재설정 실패', // Password reset failed
  'userAdmin.table.actions.bindGoogle': 'Google 연동', // Bind Google
  'userAdmin.table.actions.resetGoogle': 'Google 재설정', // Reset Google
  'userAdmin.messages.editSuccess': '사용자 편집 성공', // User edited successfully
  'userAdmin.messages.editError': '사용자 편집 실패', // User edit failed
  'userAdmin.messages.createSuccess': '사용자 생성 성공', // User created successfully
  'userAdmin.messages.createError': '사용자 생성 실패', // User creation failed
  'userAdmin.messages.deleteSuccess': '사용자 삭제 성공', // User deleted successfully
  'userAdmin.messages.deleteError': '사용자 삭제 실패', // User deletion failed
  'userAdmin.messages.resetPasswordSuccess': '비밀번호 재설정 성공', // Password reset successfully
  'userAdmin.messages.resetPasswordError': '비밀번호 재설정 실패', // Password reset failed
  'userAdmin.messages.resetGoogleSuccess': 'Google 인증 재설정 성공', // Google authentication reset successfully
  'userAdmin.messages.resetGoogleError': 'Google 인증 재설정 실패', // Google authentication reset failed
  'userAdmin.messages.bindGoogleSuccess': 'Google 인증 연동 성공', // Google authentication binding succeeded
  'userAdmin.messages.bindGoogleError': 'Google 인증 연동 실패', // Google authentication binding failed
  'userAdmin.messages.operationError': '작업 실패', // Operation failed
  'userAdmin.messages.getRoleListError': '역할 목록 가져오기 실패:', // Failed to get role list:
  'userAdmin.messages.getUserListError': '사용자 목록 가져오기 실패:', // Failed to get user list:
  'userAdmin.messages.bindGoogleError.detail': 'Google 인증 연동 실패:', // Google authentication binding failed:
  'userAdmin.actions.create': '새로 만들기', // Create New
  'userAdmin.modal.resetPasswordTitle': '비밀번호 재설정 확인', // Confirm Password Reset

  // UserModal Translations
  'userModal.title.edit': '사용자 편집', // Edit User
  'userModal.title.create': '새 사용자 생성', // Create User
  'userModal.form.nickname': '닉네임', // Nickname
  'userModal.form.nickname.required': '닉네임을 입력하세요', // Please enter nickname
  'userModal.form.nickname.maxLength': '닉네임은 최대 20자입니다', // Nickname up to 20 characters
  'userModal.form.phone': '휴대폰 번호', // Phone
  'userModal.form.phone.maxLength': '휴대폰 번호는 최대 15자입니다', // Phone up to 15 characters
  'userModal.form.email': '이메일', // Email
  'userModal.form.email.required': '이메일을 입력하세요', // Please enter email
  'userModal.form.email.format': '유효한 이메일 형식을 입력하세요', // Please enter valid email format
  'userModal.form.role': '역할', // Role
  'userModal.form.role.required': '역할을 선택하세요', // Please select role
  'userModal.form.role.atLeastOne': '최소 하나의 역할을 선택하세요', // Please select at least one role
  'userModal.form.role.placeholder': '역할을 선택하세요', // Please select role
  'userModal.form.status': '상태', // Status
  'userModal.form.status.required': '사용자 상태를 선택하세요', // Please select user status
  'userModal.form.status.normal': '정상', // Normal
  'userModal.form.status.disabled': '비활성화', // Disabled
  'userModal.messages.fillRequired': '모든 필수 항목을 작성하세요', // Please fill all required fields
  'userModal.messages.getRoleListError': '역할 목록 가져오기 실패', // Failed to get role list

  'userModal.form.remark': '비고', // Remark
  'userModal.form.bindGoogle': 'Google 연동', // Bind Google
  'userModal.form.notBindGoogle': 'Google 미연동', // Not bound to Google
  'userModal.form.gotoBind': '연동', // Bind
  'userModal.form.click': '클릭', // Click
  'userModal.form.email.invalid': '이메일 형식이 잘못되었습니다', // Invalid email format
  'userModal.form.phone.invalid': '휴대폰 번호 형식이 잘못되었습니다', // Invalid phone format

  // UserActionDropdown Translations
  'userActionDropdown.actions': '작업', // Actions
  'userActionDropdown.actions.edit': '수정', // Edit
  'userActionDropdown.actions.resetPassword': '비밀번호 재설정', // Reset Password
  'userActionDropdown.actions.resetGoogle': 'Google 재설정', // Reset Google
  'userActionDropdown.actions.disable': '비활성화', // Disable
  'userActionDropdown.actions.delete': '삭제', // Delete

  // ResetPasswordModal Translations
  'resetPasswordModal.title': '비밀번호 재설정', // Reset Password
  'resetPasswordModal.form.newPassword': '새 비밀번호', // New Password
  'resetPasswordModal.form.newPassword.required': '새 비밀번호를 입력하세요', // Please enter new password
  'resetPasswordModal.validation.failed': '새 비밀번호를 작성하세요', // Please fill new password

  // ResetGoogleModal Translations
  'resetGoogleModal.title': 'Google 인증 재설정', // Reset Google Authentication
  'resetGoogleModal.confirmation': '이 사용자의 Google 인증을 재설정하시겠습니까?', // Confirm to reset this user's Google authentication?

  // BindGoogleModal Translations
  'bindGoogleModal.title': 'Google 인증 연동', // Bind Google Authentication
  'bindGoogleModal.button.cancel': '취소', // Cancel
  'bindGoogleModal.button.confirm': '연동 확인', // Confirm Binding
  'bindGoogleModal.text.enterKey': '수동으로 키 입력', // Please enter key manually
  'bindGoogleModal.text.key': '키: ', // Key:
  'bindGoogleModal.text.fetchFailed': 'Google 인증 정보 가져오기 실패, 다시 시도하세요', // Failed to get Google auth info, please retry
  'bindGoogleModal.form.googleCode': 'Google 인증 코드', // Google Authentication Code
  'bindGoogleModal.form.googleCode.required': 'Google 인증 코드를 입력하세요', // Please enter Google authentication code
  'bindGoogleModal.form.googleCode.placeholder': 'Google 인증기의 6자리 코드를 입력하세요', // Enter 6-digit code from Google Authenticator
  'bindGoogleModal.message.fetchFailed': 'Google 인증 코드 가져오기 실패', // Failed to get Google auth code
  'bindGoogleModal.message.fetchFailedDetail': 'Google 인증 코드 가져오기 실패:', // Failed to get Google auth code:
  'bindGoogleModal.image.qrcode': 'Google 인증 QR 코드', // Google Auth QR Code

  // Permission Admin Translations
  'permissionAdmin.table.id': 'ID', // ID
  'permissionAdmin.table.description': '설명', // Description
  'permissionAdmin.table.type': '메뉴 권한', // Menu Permission
  'permissionAdmin.table.optionType': '작업 권한', // Operation Permission
  'permissionAdmin.table.title': '중국어 제목', // Chinese Title
  'permissionAdmin.table.name': '이름', // Name
  'permissionAdmin.table.parentId': '상위 ID', // Parent ID
  'permissionAdmin.table.sort': '정렬', // Sort
  'permissionAdmin.table.path': '페이지 경로', // Page Path
  'permissionAdmin.table.component': '컴포넌트 경로', // Component Path
  'permissionAdmin.table.icon': '아이콘', // Icon
  'permissionAdmin.table.systemType': '시스템', // System
  'permissionAdmin.table.systemType.admin': '관리자', // Admin
  'permissionAdmin.table.systemType.merchant': '판매자', // Merchant
  'permissionAdmin.table.systemType.common': '공통', // Common
  'permissionAdmin.table.actions': '옵션', // Options
  'permissionAdmin.table.actions.edit': '편집', // Edit
  'permissionAdmin.table.actions.delete': '삭제', // Delete
  'permissionAdmin.actions.create': '새로 만들기', // Create New
  'permissionAdmin.messages.editSuccess': '편집 성공', // Edit succeeded
  'permissionAdmin.messages.createSuccess': '생성 성공', // Creation succeeded
  'permissionAdmin.messages.createError': '생성 실패', // Creation failed
  'permissionAdmin.messages.deleteSuccess': '삭제 성공', // Deletion succeeded
  'permissionAdmin.messages.deleteError': '삭제 실패', // Deletion failed
  'permissionAdmin.messages.operationError': '작업 실패', // Operation failed

  // Permission Modal Translations
  'permissionModal.title.edit': '권한 편집', // Edit Permission
  'permissionModal.title.create': '새 권한 생성', // Create Permission
  'permissionModal.form.systemType': '시스템', // System
  'permissionModal.form.systemType.admin': '관리자', // Admin
  'permissionModal.form.systemType.merchant': '판매자', // Merchant
  'permissionModal.form.systemType.common': '공통', // Common
  'permissionModal.form.title': '중국어 제목', // Chinese Title
  'permissionModal.form.titleKey': '다국어', // Multilingual
  'permissionModal.form.name': '이름', // Name
  'permissionModal.form.type': '메뉴 권한', // Menu Permission
  'permissionModal.form.optionType': '작업 권한', // Operation Permission
  'permissionModal.form.path': '페이지 경로', // Page Path
  'permissionModal.form.component': '프론트엔드 경로', // Frontend Path
  'permissionModal.form.description': '설명', // Description
  'permissionModal.form.parentId': '상위 ID', // Parent ID
  'permissionModal.form.sort': '정렬', // Sort
  'permissionModal.form.icon': '아이콘', // Icon
  'permissionModal.form.validation.required': '{field}을(를) 입력하세요', // Please enter {field}
  'permissionModal.form.validation.select': '{field}을(를) 선택하세요', // Please select {field}

  // Role Modal Translations
  'roleModal.title.edit': '역할 편집', // Edit Role
  'roleModal.title.create': '새 역할 생성', // Create Role
  'roleModal.form.roleName': '역할 이름', // Role Name
  'roleModal.form.roleName.required': '역할 이름을 입력하세요', // Please enter role name
  'roleModal.form.description': '설명', // Description
  'roleModal.form.description.required': '역할 설명을 입력하세요', // Please enter role description
  'roleModal.form.status': '상태', // Status
  'roleModal.form.status.required': '역할 상태를 선택하세요', // Please select role status
  'roleModal.form.status.placeholder': '상태를 선택하세요', // Please select status
  'roleModal.form.status.enabled': '활성화', // Enabled
  'roleModal.form.status.disabled': '비활성화', // Disabled
  'roleModal.validation.fillRequired': '모든 필수 항목을 작성하세요', // Please fill all required fields
};
