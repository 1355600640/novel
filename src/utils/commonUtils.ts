export function stringToDate(
  dateCode: string | number,
  model: 'all' | 'date'
): string {
  if (!dateCode) return ''
  const date = new Date(dateCode)
  let dateString =
    date.getFullYear() +
    '-' +
    ((date.getMonth() >= 10 ? '' : '0') + date.getMonth()) +
    '-' +
    ((date.getDay() >= 10 ? '' : '0') + date.getDay())
  if (model == 'all') {
    dateString +=
      ' ' +
      ((date.getHours() >= 10 ? '' : '0') + date.getHours()) +
      ':' +
      ((date.getMinutes() >= 10 ? '' : '0') + date.getMinutes()) +
      ':' +
      ((date.getSeconds() >= 10 ? '' : '0') + date.getSeconds())
  }
  return dateString
}

export function normNumber(number: number, norm: number): string {
  if (norm > 4) norm = 0
  let str = ''
  str = parseInt(number / Math.pow(10, 4 - norm) + '') / 10 + ''
  return str + '万'
}
export function numberToCapital(str: string): string {
  if (!str) return str
  const capital = [
    '零',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
    '十',
    '百',
    '千',
    '万',
  ]
  const patter = /(?<=第)(?:\d*)/
  let number: string = patter.exec(str) ? (patter.exec(str) as any)[0] : ''
  if (number !== '') {
    let capitalNumber = ''
    for (let i = number.length - 1; i >= 0; i--) {
      let unit = ''
      if (i < number.length - 1) {
        unit = capital[10 + number.length - i - 2]
      }
      let num = parseInt(number.charAt(i))
      capitalNumber =
        (i == number.length - 2 && num == 1 ? '' : capital[num]) +
        unit +
        capitalNumber
    }

    str = str.replace('第' + number, '第' + capitalNumber)
    // console.log(str)
  } else if (str.indexOf('第') != 0 && str.includes('章')) {
    str = '第' + str
  }
  // console.log(str)
  return str
}
