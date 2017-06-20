/*
* ?id=12345&a=b
* return {id:12345,a:b}
*/
export function urlParse() {
  let url = window.location.search
  let reg = /^[?&][^?&]+=[^?&]+/g
  let arrNew = url.match(reg)
  let obj = {}
  arrNew.forEach((item) => {
    let arrTemp = item.substr(1).split('=')
    let key = arrTemp[0]
    let value = arrTemp[1]
    obj[key] = value
  })
  return obj
}
