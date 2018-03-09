function clone (object, data = null, fields = []) {
  for (var f = 0; f < fields.length; f++) {
    let k = fields[f]
    if (data && data.hasOwnProperty(k)) {
      object[k] = data[k]
      if (Array.isArray(data[k])) object[k] = Array.from(data[k])
    } else {
      object[k] = ''
    }
  }
}
// function toString (object) {
//   console.log('toString called', object)
//   let str = ''
//   for (let k in object) {
//     console.log('key', k)
//     if (!object.hasOwnProperty(k) || k === 'toString') continue
//     let value = object[k]
//     console.log('a value is', value)
//     if (Array.isArray(value)) {
//       str += '['
//       // we assume that we don't have type mixed arrays
//       if (typeof value[0] === 'object') str += this.toString(value)
//       else str += value.join(',')
//       str += ']'
//     } else {
//       str += '' + value
//     }
//   }
//   return 'my string: {' + str + '}'
// }

export class DerivedClass {
  constructor (data = null) {
    const fields = ['id', 'name', 'mobile', 'instrument', 'allergies', 'managerof', 'memberof']
    clone(this, data, fields)
    // this.toString = function () { return toString(this) }
    // this.toJSON = function (key) {
    //   const cloneObj = { ...this }
    //
    // }
    return this
  }
}

export class Person {
  constructor (data = null) {
    const fields = ['id', 'name', 'mobile', 'instrument', 'allergies', 'managerof', 'memberof']
    for (var f = 0; f < fields.length; f++) {
      let k = fields[f]
      if (data && data.hasOwnProperty(k)) {
        this[k] = data[k]
        if (Array.isArray(data[k])) this[k] = Array.from(data[k])
      } else {
        this[k] = ''
        if (k === 'memberof') this[k] = []
        if (k === 'managerof') this[k] = []
      }
    }
    return this
  }
}

export class Group {
  constructor (data = null) {
    // const fields = ['name', 'email', 'mobile', 'role', 'url',
    //   'postaladdress', 'members', 'socials', 'publicity', 'travel', 'eventinfo']
    const fields = ['name', 'email', 'mobile', 'role', 'url',
      'postaladdress', 'comments']
    this.members = []
    for (var f = 0; f < fields.length; f++) {
      let k = fields[f]
      if (data && data.hasOwnProperty(k)) {
        if (k === 'members') {
          this.members = []
          // console.log('typeof 1', typeof data.members)
          if (typeof data.members === 'string') data.members = JSON.parse(data.members)
          // console.log('typeof 2', typeof data.members)
          for (var i = 0; i < data.members.length; i++) {
            let person = new Person(data.members[i])
            this.members.push(person)
          }
        } else if (k === 'socials') {
        } else if (k === 'publicity') {
        } else if (k === 'travel') {
        } else if (k === 'eventinfo') {
        } else {
          this[k] = data[k]
        }
      } else {
        this[k] = null
      }
    }
  }
}

export class Tbevent {
  constructor (type, payload = null) {
    this.type = type
    this.payload = payload
  }
}

export class Travel {
  constructor (data = null) {
    const fields = ['arrival', 'departure', 'flightid', 'arrivalat', 'traveltype', 'transport']
    for (var f = 0; f < fields.length; f++) {
      let k = fields[f]
      if (data && data.hasOwnProperty(k)) {
        this[k] = data[k]
      } else {
        this[k] = ''
      }
    }
    return this
  }
}

export class Social {
  constructor (data = null) {
    const fields = ['url', 'name']
    for (var f = 0; f < fields.length; f++) {
      let k = fields[f]
      if (data && data.hasOwnProperty(k)) {
        this[k] = data[k]
      } else {
        this[k] = ''
      }
    }
    return this
  }
}

export class Support {
  constructor (data = null) {
    const fields = ['pickuptime', 'pickuploc', 'drivername', 'drivermobile', 'padding', 'leavingtime', 'dinnertime']
    for (var f = 0; f < fields.length; f++) {
      let k = fields[f]
      if (data && data.hasOwnProperty(k)) {
        this[k] = data[k]
      } else {
        this[k] = ''
      }
    }
    return this
  }
}

export class Performance {
  constructor (data = null) {
    const fields = ['type', 'start', 'end', 'location', 'soundcheck', 'numberofsets']
    for (var f = 0; f < fields.length; f++) {
      let k = fields[f]
      if (data && data.hasOwnProperty(k)) {
        this[k] = data[k]
      } else {
        this[k] = ''
      }
    }
    return this
  }
}

export class Eventinfo {
  constructor (data = null) {
    const fields = ['id', 'name', 'type', 'start', 'end', 'location', 'involved']
    for (var f = 0; f < fields.length; f++) {
      let k = fields[f]
      if (data && data.hasOwnProperty(k)) {
        this[k] = data[k]
      } else {
        this[k] = ''
      }
    }
    return this
  }
}

export class Location {
  constructor (data = null) {
    const fields = ['id', 'name', 'address', 'placeid', 'phone']
    for (var f = 0; f < fields.length; f++) {
      let k = fields[f]
      if (data && data.hasOwnProperty(k)) {
        this[k] = data[k]
      } else {
        this[k] = ''
      }
    }
    return this
  }
}

export function Util () {}

Util.formatDateTime = function (date) {
  let [y, m, d, h, min] = [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()]
  d = (d < 9 ? '0' : '') + d
  m = (m++ < 9 ? '0' : '') + m
  h = (h < 9 ? '0' : '') + h
  min = (min < 9 ? '0' : '') + min
  let result = {}
  result.date = [y, m, d].join('-')
  result.time = [h, min].join(':')
  result.datetime = [result.date, result.time].join('T')
  return result
}

Util.isValidDate = function (value) {
  let x = ''
  try {
    x = new Date(value).toISOString().substr(0, 10)
    return x === value
  } catch (e) {
    return false
  }
}
