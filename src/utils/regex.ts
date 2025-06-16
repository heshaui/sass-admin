// 校验手机
export function validatePhone(phone: string) : boolean {
  const reg = /^1[3456789]\d{9}$/;
  return reg.test(phone);
}

// 校验邮箱
export function validateEmail(email: string):  boolean {
  const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return reg.test(email);
}
