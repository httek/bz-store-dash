export namespace validators {
  export const nameRequiredWithMin2Len = async (rule: any, value: string, callback: any) => {
    if (value.length < 2) {
      return callback(new Error('分类名称至少2个字符'))
    }

    callback()
  }

  export const mobile = async (rule: any, value: string, callback: any) => {
    const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!reg.test(value.toString())) {
      return callback(new Error('输入正确的11位手机号码'))
    }

    callback()
  }

  export const password = (rule: any, value: string, callback: any) => {
    if (value.length < 6) {
      return callback(new Error('密码至少是6位字符'))
    }
  
    callback()
  }
}