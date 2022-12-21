export const validateMobile = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入账号'))
  }

  if (!Number.isInteger(value)) {
    callback(new Error('Please input digits'))
  } else {
    if (value < 18) {
      callback(new Error('Age must be greater than 18'))
    } else {
      callback()
    }
  }
}


export const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  }

  callback()
}
