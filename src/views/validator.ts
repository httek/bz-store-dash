export const validateMobile = (rule: any, value: number, callback: any) => {
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!reg.test(value.toString()))  {
    return callback(new Error('输入正确的11位手机号码'))
  }

  callback()
}

export const validatePassword = (rule: any, value: string, callback: any) => {
  if (value.length < 6) {
    return callback(new Error('密码至少是6位字符'))
  }

  callback()
}
