export const validateName = async (rule: any, value: string, callback: any) => {

  if (!value || value.length < 2) {
    return callback(new Error('名称至少2个字符'))
  }

  callback()
}

export const validateUnSelected = (rule: any, value: undefined | number, callback: any) => {
  if (!value) return callback(new Error('请选择'))

  callback()
}


export const validateCovers = (rule: any, value: undefined | Array<string>, callback: any) => {
  if (!value || !value.length) return callback(new Error('请上传图片'))

  callback()
}
