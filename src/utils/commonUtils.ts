/**
 * 格式化data类型
 * @param dateCode 待转换参数
 * @param model all 显示全部时间
 * @returns
 */
export function stringToDate(
  dateCode: string | number,
  model: 'all' | 'date'
): string {
  if (!dateCode) return ''
  const date = new Date(dateCode)
  let dateString =
    date.getFullYear() +
    '-' +
    ((date.getMonth() + 1 >= 10 ? '' : '0') + (date.getMonth() + 1)) +
    '-' +
    ((date.getDate() >= 10 ? '' : '0') + date.getDate())
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

/**
 * 数字转换以万为单位，保留小鼠
 * @param number 待转换的数字
 * @param norm 保留位数
 * @returns
 */
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

/**
 * 计算日期到现在的具体天数,向上取整
 * @param date
 */
export function dateToNum(date: string): number {
  const nowDate = Date.now()
  const lastDate = new Date(date).valueOf()
  let day = Math.ceil((nowDate - lastDate) / 60 / 60 / 60 / 24)
  return day
}

/**
 * 移出文字最前后的空格
 * @param text 移出空格的文字
 */
export function removeOfFrontSpace(text: string): string {
  const dom = document.createElement('div')
  dom.innerHTML = text
  text = dom.innerText.trim()
  return text
}

/**
 * 将指定文字标出关键字
 * @param content 替换的文字
 * @param keyword 关键字
 * @param el 要转换的el类型
 * @param classNameList el的class列表
 * @returns
 */
export function markerKeys(
  content: string,
  keyword: string,
  el: string,
  classNameList: string[]
) {
  // 标记包含最长文字
  const patter = /([\u4e00-\u9fa50-9a-zA-Z]+)/g
  let keyWords = ''
  let r
  toTop: while ((r = patter.exec(keyword))) {
    let keys = r[0]
    for (let i = 0; i < keys.length; i++) {
      let key = '',
        longKey = ''
      for (let j = i; j < keys.length; j++) {
        key += keys[j]
        if (content.includes(key)) {
          longKey = key
        }
      }
      if (longKey) {
        keyWords = longKey
        break toTop
      }
    }
  }
  // 将标记文字替换
  if (!keyWords) return content
  let className = classNameList.join(' ')
  let reduceText = `<${el} class="${className}">${keyWords}</${el}>`
  content = content.replaceAll(keyWords, reduceText)
  return content
}

/**
 * 求出传入时间距离现在多久
 * @param data 之前时间
 * @returns 距离现在多久
 */
export function oldDataToNow(data: string): string {
  let time = new Date(data).getTime(),
    nowDate = Date.now()
  let timeDifference = parseInt((nowDate - time) / 1000 + '')
  let localToNow = ''
  if (timeDifference / 60 / 60 / 24 < 1) {
    if (timeDifference < 60 * 60 * 24) {
      localToNow += parseInt(timeDifference / (60 * 60 * 24) + '') + '小时'
    } else if (timeDifference < 60 * 60) {
      localToNow += parseInt(timeDifference / (60 * 60) + '') + '分钟'
    } else if (timeDifference > 0) {
      localToNow += timeDifference + '秒'
    }
    return localToNow + '前'
  }
  timeDifference = parseInt(timeDifference / 60 / 60 / 24 + '')
  if (timeDifference > 365) {
    let localTime = new Date(time)
    return (
      localTime.getFullYear() +
      '-' +
      (localTime.getMonth() + 1) +
      '-' +
      localTime.getDay()
    )
  } else if (timeDifference > 30) {
    localToNow += parseInt(timeDifference / 30 + '') + '月'
  } else if (timeDifference > 0) {
    localToNow += timeDifference + '天'
  }
  return localToNow + '前'
}

/**
 * 文件里类型转boob
 * @param file 文件
 * @returns
 */
export function fileToBlob(file: File) {
  return new Promise<Blob>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const blob = new Blob([reader.result as any], { type: file.type })
      resolve(blob)
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
