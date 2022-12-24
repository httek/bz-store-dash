export const validateName = (rule: any, value: string, callback: any) => {
  if (value.length < 2) {
    return callback(new Error('分类名称至少2个字符'))
  }

  callback()
}
