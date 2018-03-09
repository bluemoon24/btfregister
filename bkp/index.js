import axios from 'axios'
import { Group, Person } from '~/components/Classes.js'

export const HTTP = axios.create({
  // baseURL: `http://vip-registration.tangofestival-bonn.de/service/`,
  baseURL: `http://services.tangofestival-bonn.de`,
  headers: {
  // Authorization: 'Bearer {token}'
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': 'application/json'
  }
})

export const NEO = axios.create({
  // baseURL: `http://vip-registration.tangofestival-bonn.de/service/`,
  baseURL: `http://localhost:7474/db/data/transaction/commit/`,
  headers: {
  // Authorization: 'Bearer {token}'
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': 'application/json; charset=utf-8'
  }
})

export const state = () => ({
  privileged: false,
  realUid: '',
  uids: [],
  sidebar: false,
  loaded: false,
  saved: false,
  uid: '',
  user: '',
  locationData: [],
  eventinfoData: [],
  personData: [],
  udata: {
    // name: { tdata: '', json: false },
    // email: { tdata: '', json: false },
    // mobile: { tdata: '', json: false },
    // role: { tdata: '', json: false },
    // url: { tdata: '', json: false },
    // postaladdress: { tdata: '', json: false },
    // members: {
    //   tdata: [{
    //     common: {
    //       name: 'my name',
    //       arrival: '',
    //       flightid: '',
    //       departure: '',
    //       allergies: '',
    //       mobile: ''
    //     },
    //     musician: {
    //       instrument: { text: '', helper: 'your role (instrument) in the group', placeholder: 'bandoneon' }
    //     },
    //     dancer: {
    //     }
    //   }],
    //   json: true },
    // social: { tdata: [], json: true },
    // // manager: { tdata: '', json: false },
    // publicity: {
    //   tdata: [{
    //     // pix: { tdata: '', json: false },
    //     // press: { tdata: '', json: false }
    //   }],
    //   json: true
    // },
    // travel: {
    //   tdata: {
    //     arrival: { tdata: '', json: false },
    //     departure: { tdata: '', json: false },
    //     flightid: { tdata: '', json: false },
    //     arrivalat: { tdata: '', json: false },
    //     traveltype: { tdata: '', json: false },
    //     transport: { tdata: '', json: false },
    //     accomodation: { tdata: '', json: false },
    //     shuttle: { tdata: '', json: false }
    //   },
    //   json: true
    // },
    // eventinfo: {
    //   tdata: [{
    //     performing: {
    //       type: { text: '', helper: 'workshop/concert/show', placeholder: '' },
    //       start: { text: '', helper: 'start of performance', placeholder: '' },
    //       end: { text: '', helper: 'end of performance', placeholder: '' },
    //       location: { text: '', helper: 'location of performance', placeholder: '' },
    //       soundcheck: { text: '', helper: 'minimum time needed for soundcheck', placeholder: '' },
    //       numberofsets: { text: '', helper: 'number of sets to play', placeholder: '' }
    //     },
    //     support: {
    //       pickuptime: { text: '', helper: 'pickup time', placeholder: '' },
    //       pickuploc: { text: '', helper: 'pickup location', placeholder: '' },
    //       drivername: { text: '', helper: 'name of driver/contact', placeholder: '' },
    //       drivermobile: { text: '', helper: 'mobile phone of driver', placeholder: '' },
    //       paddingstart: { text: '', helper: 'minutes before start', placeholder: '' },
    //       leavingtime: { text: '', helper: 'time for leaving', placeholder: '' },
    //       dinnertime: { text: '', helper: 'before/during/after performance', placeholder: '' }
    //     }
    //   }],
    //   json: true
    // }
  }
})

export const mutations = {
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  },
  setUids (state, uids) {
    state.uids = uids
    // state.udata = uids
    // console.log('uids', uids)
  },
  clearUserData (state, priv) {
    state.udata = new Group()
    // for (var k in state.udata) {
    //   state.udata[k].tdata = ''
    // }
    state.privileged = priv
    state.uid = ''
  },
  setEventinfoData (state, data) {
    state.eventinfoData = data
    console.log('setEventinfoData', typeof data.involved)
    // state.eventinfoData.involved = JSON.parse(data.involved)
    console.log('mutation eventinfo data', data)
  },
  setLocationData (state, data) {
    state.locationData = data
    console.log('mutation location data', data)
  },
  setPersonData (state, data) {
    console.log('setPersonData', data)
    for (var i = 0; i < data.length; i++) {
      let person = data[i]
      for (var j = 0; j < person.memberof.length; j++) {
        let groupid = person.memberof[j]
        let group = state.uids.find((e) => (e.id === groupid))
        console.log('group found for member', group, groupid, person.memberof)
        if (!Array.isArray(group.members)) group.members = []
        if (group) {
          group.members.push({person: person})
        }
        console.log('person member of', groupid, group)
      }
      for (j = 0; j < person.managerof.length; j++) {
        let groupid = person.managerof[j]
        let group = state.uids.find((e) => (e.id === groupid))
        console.log('group found for manager', group, groupid, person.managerof)
        // if (!Array.isArray(group.members)) group.members = []
        if (group) {
          group.manager = person
        }
        console.log('person manager of', groupid, group)
      }
    }
    state.personData = data
  },
  setUserData (state, data) {
    // console.log('***>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> data', data.members)
    state.udata = data
    console.log('store', state.udata)
    for (var k in data) {
      // console.log(k, obj[k])
      if (k === 'id') {
        state.uid = data.id
        continue
      } else if (k === 'privileged') {
        state.privileged = state.privileged || data.privileged === '1'
        continue
      }
    }
    state.loaded = true
  },
  setRealUser (state, id) {
    state.realUid = id
  }
}

export const getters = {
  udata: state => state.udata,
  loaded: state => state.loaded,
  saved: state => state.saved
}

export const actions = {

  async nuxtServerInit ({ commit }) {
    // console.log('server init list of ids')
    const { data } = await HTTP.post('2e104a89-5a16-4a50-a8b0-7442f43b7633')
    // console.log('init data', data)
    commit('setUids', data.uids)
    commit('setLocationData', data.locations)

    for (var i = 0; i < data.persons.length; i++) {
      // console.log('**** persons', data.persons[i].managerof)
      data.persons[i].memberof = JSON.parse(data.persons[i].memberof)
      data.persons[i].managerof = JSON.parse(data.persons[i].managerof)
    }
    // console.log('from nuxtServerInit')
    commit('setPersonData', data.persons)
  },

  async storeGroup ({ commit, state }, obj) {
    let statements = {
      statements: [ {
        statement: 'CREATE (n: Group ' + JSON.stringify(obj).replace(/"([^,]+?)":/g, '$1:') + ' ) RETURN id(n) '
      } ]
    }
    // let json = statements.replace(/"([^,]+?)":/g, '$1:')
    console.log('statements', statements)
    const { data } = await NEO.post('', statements)
    console.log(data)
  },
  // MATCH (p {id: '4'}), (g {id: '63021'}) CREATE(g)-[r:MANAGEDBY]->(p)
  async setManagerRelation ({ commit, state }, obj) {
    let statements = {
      statements: [
        { statement: 'MATCH (p {id: "' + obj[0] + '"}), (g {id: "' + obj[1] + '"}) CREATE (p)-[r:MANAGES]->(g) RETURN p,g ' },
        { statement: 'MATCH (p {id: "' + obj[0] + '"}), (g {id: "' + obj[1] + '"}) CREATE (g)-[r:MANAGEDBY]->(p) RETURN p,g ' }
      ]
    }
    // let json = statements.replace(/"([^,]+?)":/g, '$1:')
    console.log('statements', statements)
    const { data } = await NEO.post('', statements)
    console.log(data)
  },

  async setMemberRelation ({ commit, state }, obj) {
    let statements = {
      statements: [
        { statement: 'MATCH (p {id: "' + obj[0] + '"}), (g {id: "' + obj[1] + '"}) CREATE (p)-[r:MEMBEROF]->(g) RETURN p,g ' },
        { statement: 'MATCH (p {id: "' + obj[0] + '"}), (g {id: "' + obj[1] + '"}) CREATE (g)-[r:HASMEMBER]->(p) RETURN p,g ' }
      ]
    }
    // let json = statements.replace(/"([^,]+?)":/g, '$1:')
    console.log('statements', statements)
    const { data } = await NEO.post('', statements)
    console.log(data)
  },

  async storePerson ({ commit, state }, obj) {
    let statements = {
      statements: [ {
        statement: 'CREATE (n: Person ' + JSON.stringify(obj).replace(/"([^,]+?)":/g, '$1:') + ' ) RETURN id(n) '
      } ]
    }
    // let json = statements.replace(/"([^,]+?)":/g, '$1:')
    console.log('statements', statements)
    const { data } = await NEO.post('', statements)
    console.log(data)
  },

  async getEventinfoData ({ commit, state }) {
    const { data } = await HTTP.get('eventinfo')
    for (var i = 0; i < data.length; i++) {
      // console.log('>>>>>>event', data[i])
      // if (data[i].involved && data[i].involved !== '')
      data[i].involved = JSON.parse(data[i].involved)
    }
    commit('setEventinfoData', data)
  },

  async uploadEventinfoData ({ commit, state }, obj) {
    var updurl = '/eventinfo/update'
    const { data } = await HTTP.post(updurl, {body: obj})
    if (!data) return null
    commit('setEventinfoData', obj)
    // console.log('response after update', data)
  },

  async getLocationData ({ commit, state }) {
    const { data } = await HTTP.get('locations')
    // console.log('>>>>>>locations', data)
    commit('setLocationData', data)
  },

  async uploadLocationData ({ commit, state }, obj) {
    var updurl = '/location/update'
    const { data } = await HTTP.post(updurl, {body: obj})
    if (!data) return null
    commit('setLocationData', obj)
    // console.log('response after update', data)
  },

  async uploadPersonData ({ commit, state }, obj) {
    var updurl = '/person/update'
    let person = new Person(obj)
    person.memberof = JSON.stringify(obj.memberof)
    person.managerof = JSON.stringify(obj.managerof)
    const { data } = await HTTP.post(updurl, {body: person})
    if (!data) return null
    console.log('from uploadPersonData')
    commit('setPersonData', obj)
    // console.log('response after update', data)
  },

  async getUserData ({ commit, state }, uid) {
    var p = state.privileged
    console.log('getUserData', uid)
    if (uid !== '0') {
      const { data } = await HTTP.get('hello/' + uid)
      commit('setUserData', data)
    } else {
      commit('clearUserData', p)
    }
  },

  async uploadUserData ({ commit, state }, obj) {
    var body = null
    // if (Array.isArray(obj.memberof)) obj.memberof = JSON.stringify(obj.memberof)
    // else obj.memberof = '[]'
    for (var k in obj) {
      console.log('uploadUserData', k, obj[k], state.udata[k])
      if (body === null) body = {}
      body[k] = obj[k]
    }
    state.saved = false
    console.log('body for update', body)
    // var body = obj.obj
    var updurl = '/update' + (state.uid !== '' ? '/' : '') + state.uid
    const { data } = await HTTP.post(updurl, {body: body})
    if (!data) return null
    obj['uid'] = data
    commit('setUserData', obj)
    // console.log('response after update', data)
  },

  async resendLink ({ commit }, obj) {
    console.log('try to find', obj)
  },

  setRealUser ({ commit }, id) {
    commit('setRealUser', id)
  },

  updateMember (context, obj) {
    console.log('updateMemeber', obj)
    var idx = obj.index
    if (obj.person !== null) {
      context.state.udata.members.tdata[idx] = obj.person
    } else {
      context.state.udata.members.tdata.splice(1, idx)
    }
    console.log('updateMember 2', context.state.udata.members.tdata)
    // context.commit('uploadUserData')
    // console.log('uid in main', state.uid) // , this.$route.params.id)
  },
  addMember (context, obj) {
    context.state.udata.members.tdata.push(obj)
    // context.commit('uploadUserData')
  }
}
