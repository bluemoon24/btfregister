function clone (object, data = null, fields = []) {
  for (var f = 0; f < fields.length; f++) {
    let k = fields[f]
    if (data && data.hasOwnProperty(k)) {
      // console.log('cloning', k, data[k])
      object[k] = data[k]
      if (Array.isArray(data[k])) object[k] = Array.from(data[k])
    } else {
      object[k] = ''
    }
  }
}

// export class DerivedClass {
//   constructor (data = null) {
//     clone(this, data, ['id', 'name', 'mobile', 'instrument', 'allergies', 'managerof', 'memberof'])
//     return this
//   }
// }

export class Person {
  constructor (data = null) {
    this.fields = ['id', 'name', 'mobile', 'instrument', 'allergies', 'managerof', 'memberof']
    // console.log('new Person', data)
    clone(this, data, this.fields)
    if (!Array.isArray(this.memberof)) this.memberof = []
    if (!Array.isArray(this.managerof)) this.managerof = []
    return this
  }
  toNeoProps (pvar = 'p') {
    let list = []
    for (let k in this) {
      if (!this.hasOwnProperty(k) || Array.isArray(this[k])) continue
      // console.log('Person', k, this[k])
      if (this.fields.indexOf(k) < 0) continue
      let str = typeof this[k] === 'string' ? this[k].replace("'", "\\'") : this[k]
      list.push(pvar + '.' + k + " = '" + str + "'")
    }
    return list.join()
  }
}

export class Group {
  constructor (data = null) {
    // const fields = ['name', 'email', 'mobile', 'role', 'url',
    //   'postaladdress', 'members', 'socials', 'publicity', 'travel', 'eventinfo']
    clone(this, data, ['id', 'name', 'email', 'mobile', 'role', 'url', 'postaladdress', 'comments', 'accomodation'])
    // this.name = 'New'
    //   } else if (k === 'socials') {
    //   } else if (k === 'publicity') {
    //   } else if (k === 'travel') {
    //   } else if (k === 'eventinfo') {
    //   } else {
    //     this[k] = data[k]
    //   }
    // } else {
    //   this[k] = null
    // }
    return this
  }
  toNeoProps (gvar = 'g') {
    let list = []
    for (let k in this) {
      if (!this.hasOwnProperty(k)) continue
      let str = typeof this[k] === 'string' ? this[k].replace("'", "\\'") : this[k]
      list.push(gvar + '.' + k + " = '" + str + "'")
    }
    return list.join()
  }
}

export class Tbevent {
  constructor (type, payload = null) {
    this.type = type
    this.payload = payload
  }
}

export class DbError {
  constructor (message, payload = null) {
    this.message = message
    this.error = payload
  }
}

export class Travel {
  constructor (data = null) {
    clone(this, data, ['arrival', 'departure', 'flightid', 'arrivalat', 'goesby', 'staysat'])
    return this
  }
  toNeoProps (pvar = 't') {
    let list = []
    for (let k in this) {
      if (!this.hasOwnProperty(k) || Array.isArray(this[k])) continue
      // console.log('Person', k, this[k])
      let str = typeof this[k] === 'string' ? this[k].replace("'", "\\'") : this[k]
      list.push(pvar + '.' + k + " = '" + str + "'")
    }
    return list.join()
  }
}

export class Social {
  constructor (data = null) {
    clone(this, data, ['url', 'name'])
    return this
  }
}

export class Support {
  constructor (data = null) {
    clone(this, data, ['pickuptime', 'pickuploc', 'drivername', 'drivermobile', 'padding', 'leavingtime', 'dinnertime'])
    return this
  }
}

export class Performance {
  constructor (data = null) {
    clone(this, data, ['type', 'start', 'end', 'location', 'soundcheck', 'numberofsets'])
    return this
  }
}

export class Eventinfo {
  constructor (data = null) {
    // console.log('Eventinfo constructor got:', data)
    if (!data) {
      data = {
        location: {},
        targetloc: {},
        name: 'New Event',
        type: '',
        starts: '2018-04-27T15:00',
        ends: '2018-05-01T01:00',
        involved: [],
        evtdescription: '',
        level: 'medium'
      }
    }
    clone(this, data, ['id', 'name', 'type', 'level', 'starts', 'ends', 'location', 'targetloc', 'involved', 'key', 'evtdescription'])
    // console.log('Eventinfo constructor cloned', this)
    return this
  }
  toNeoProps (lvar = 'e') {
    let list = []
    for (let k in this) {
      if (!this.hasOwnProperty(k)) continue
      let str = typeof this[k] === 'string' ? this[k].replace("'", "\\'") : this[k]
      list.push(lvar + '.' + k + " = '" + str + "'")
    }
    return list.join()
  }
  toSearch () {
    let inv = ''
    if (Array.isArray(this.involved)) inv = this.involved.map(e => e.name).join('')
    let str = inv + this.name + this.key + this.type + (this.location ? this.location.name : '')
    // console.log('toSearch', str)
    return str.toLowerCase()
  }
  involvedUids () {
    let list = []
    if (Array.isArray(this.involved)) list = this.involved.map(e => e.id)
    // console.log('involvedUids', list)
    return list
  }
}

export class Location {
  constructor (data = null) {
    clone(this, data, ['id', 'name', 'address', 'placeid', 'phone', 'type'])
    return this
  }
  toNeoProps (lvar = 'l') {
    let list = []
    for (let k in this) {
      if (!this.hasOwnProperty(k)) continue
      let str = this[k].replace("'", "\\'")
      list.push(lvar + '.' + k + " = '" + str + "'")
    }
    return list.join()
  }
}

export function Util () {}

Util.createUid = function (uids) {
  let uid = '' + Math.floor(Math.random() * 100000)
  while (uids.includes(uid)) uid = '' + Math.floor(Math.random() * 100000)
  return uid
}

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

Util.parseResult = function (results) {
  // parse NEO result structure to col:value objects
  // [ result per statement
  //   [ data per result  (rows and meta)
  //     {g:row[0], p:row[1]}, // (col1:row[col1], col2:row[col2], ...})
  //     {g:row[0], p:row[1]},
  //     {g:row[0], p:row[1]}
  //     ]
  // ]
  let retvals = []
  for (var i = 0; i < results.length; i++) {
    let result = results[i]
    let retval = []
    for (var j = 0; j < result.data.length; j++) {
      let datum = result.data[j]
      let obj = {}
      for (var c = 0; c < result.columns.length; c++) {
        let colname = result.columns[c]
        obj[colname] = datum.row[c]
      }
      retval.push(obj)
    }
    retvals.push(retval)
  }
  return retvals
}
