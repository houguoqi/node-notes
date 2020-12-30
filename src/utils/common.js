/**
 * 延迟函数
 * @param delay 延迟时间(s)
 */
export function timeout(delay) {
  return new Promise(resolve => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      resolve()
    }, delay * 1000)
  })
}


/**
 * 防抖
 * @param {Function} fn 
 * @param {number} delay 毫秒
 */
export const debounce = (fn, delay = 300) => {
  let timer = null
  return function (...args) {
    const context = this
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}

const handler = {
  base64: 'readAsDataURL',
  buffer: 'readAsArrayBuffer',
}
/**
 * file格式转换为其他格式
 * @param {any} file 
 * @param {string} format 
 * @returns {Promise<any>}
 */
export const fileTransform = (file, format = 'base64') => {
  return new Promise(resolve => {
    const fileReader = new FileReader()
    fileReader.onloadend = res => {
      resolve(res.target.result)
    }
    fileReader[handler[format]](file)
  })
}

/**
 * base64转Blob
 * @param {string} base64Data
 * @param {string} contentType
 * @param {number} sliceSize
 */
export const base64toBlob = (base64Data, contentType, sliceSize) => {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;
  const byteCharacters = atob(base64Data); // atob 解码一个 base64 字符串
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers); // 存放二进制数据
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, {
    type: contentType
  });
  return blob;
}


/**
 * 
 * @param {number} secs 传入的时间戳 传入当前时间则格式化当前时间  可以传入任意时间戳
 * @param {string} format 格式化类型：year、month、date、hour、minute  默认格式化为：年-月-日 时:分:秒
 * @example
 * 获取某个时间戳的时间格式
 * formatData(123456789)
 * 
 * 获取当前时间格式
 * formatData(new Data().getTime())
 * 
 * 获取前一天时间格式
 * formatData(new Data().getTime() - 24*60*60*1000)
 * 
 * 获取后一天时间格式
 * formatData(new Data().getTime() + 24*60*60*1000)
 */
export function formatData(secs, format) {
  let timer = new Date(secs)
  let year = timer.getFullYear()
  let month = timer.getMonth() + 1
  month < 10 && (month = '0' + month)
  let date = timer.getDate()
  date < 10 && (date = '0' + date)
  let hour = timer.getHours()
  hour < 10 && (hour = '0' + hour)
  let minute = timer.getMinutes()
  minute < 10 && (minute = '0' + minute)
  let second = timer.getSeconds()
  second < 10 && (second = '0' + second)
  if (format === 'year') {
    return year
  } else if (format === 'month') {
    return year + '-' + month
  } else if (format === 'date') {
    return year + '-' + month + '-' + date
  } else if (format === 'hour') {
    return year + '-' + month + '-' + date + ' ' + hour
  } else if (format === 'minute') {
    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute
  } else {
    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
  }
}

/**
 * 检查发票类型  0-专票 1-普票
 * @param {String} number 
 * number 不为 0/null/""
 * number长度为10或12位的String
 */
export const checkInvoiceType = (number) => {
  if (!number) {
    return false
  }
  const { length } = number
  if (length != 10 && length != 12) {
    return false
  }
  if (!isInvoiceNum(number)) {
    return false
  }
  const type = invoiceType(number)
  if (type !== "04" && type !== "10" && type !== "14") {
    // 非电子发票或者普通发票
    return 0
  }
  if (type === "04" || type === "10" || type === "14") {
    return 1
  }
}

/**
 * 检验是否为发票号码
 * @param {String} number 
 */
const isInvoiceNum = (number) => {
  const reg = /^1|0\d{11}$|^\d{6}[1-9]\d{2}0$/
  const isInvoiceNum = reg.test(number)
  if (isInvoiceNum && checkInvoiceYear(number) && invoiceType(number) !== "99") {
    return true
  } else {
    return false
  }
}

/**
 * 确认发票年份
 * @param {String} number 
 */
const checkInvoiceYear = (number) => {
  const fullYaer = new Date().getFullYear().toString().substring(2)
  const { length } = number
  let invoiceYear = null
  if (length === 12) {
    invoiceYear = number.substring(5, 7)
  } else {
    invoiceYear = number.substring(4, 6)
  }
  if (invoiceYear <= 0 || invoiceYear > fullYaer) {
    return false
  }
  return true
}

/**
 * 检验发票类型 (普票/专票)
 * 此函数来自 国家税务总局全国增值税发票查验平台
 * @param {String} a 发票号码
 */
const invoiceType = (a) => {
  var b;
  var c = "99";
  if (a.length == 12) {
    b = a.substring(7, 8);
    // for (var i = 0; i < code.length; i++) {
    //   if (a == code[i]) {
    //     c = "10";
    //     break
    //   }
    // }
    if (a == '144031539110' || a == '131001570151' || a == '133011501118' || a == '111001571071') {
      c = "10"
    }
    if (c == "99") {
      if (a.charAt(0) == '0' && a.substring(10, 12) == '11') {
        c = "10"
      }
      if (a.charAt(0) == '0' && (a.substring(10, 12) == '04' || a.substring(10, 12) == '05')) {
        c = "04"
      }
      if (a.charAt(0) == '0' && (a.substring(10, 12) == '06' || a.substring(10, 12) == '07')) {
        c = "11"
      }
      if (a.charAt(0) == '0' && a.substring(10, 12) == '12') {
        c = "14"
      }
    }
    if (c == "99") {
      if (a.substring(10, 12) == '17' && a.charAt(0) == '0') {
        c = "15"
      }
      if (c == "99" && b == 2 && a.charAt(0) != '0') {
        c = "03"
      }
    }
  } else if (a.length == 10) {
    b = a.substring(7, 8);
    if (b == 1 || b == 5) {
      c = "01"
    } else if (b == 6 || b == 3) {
      c = "04"
    } else if (b == 7 || b == 2) {
      c = "02"
    }
  }
  return c
};

/**
 * 发表金额转换大写
 * @param {Number} n 
 */
export const digitUppercase = (n) => {
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return "数据非法";
  var unit = "京亿万仟佰拾兆万仟佰拾亿仟佰拾万仟佰拾元角分",
    str = "";
  n += "00";
  var p = n.indexOf('.');
  if (p >= 0)
    n = n.substring(0, p) + n.substr(p + 1, 2);
  unit = unit.substr(unit.length - n.length);
  for (var i = 0; i < n.length; i++) str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
  return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(兆|万|亿|元)/g, "$1").replace(/(兆|亿)万/g, "$1").replace(
    /(京|兆)亿/g, "$1").replace(/(京)兆/g, "$1").replace(/(京|兆|亿|仟|佰|拾)(万?)(.)仟/g, "$1$2零$3仟").replace(/^元零?|零分/g, "").replace(
      /(元|角)$/g, "$1整");
}