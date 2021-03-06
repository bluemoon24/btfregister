import Vue from 'vue'
import axios from 'axios'
import { Eventinfo, Group, DbError, Util } from '~/components/Classes.js'
import Auth from '../mixins/Auth'

Vue.mixin(Auth)

console.log('we run in', process.env.NODE_ENV, 'mode. console output is ', process.env.NODE_ENV === 'production' ? 'off' : 'on')

// let Neo4j = require('simple-neo4j')
if (process.env.NODE_ENV === 'production') console.log = function () {} // supress console in production

export const HTTP = {
  get: function (what) {
    switch (what) {
      // case 'locations': return {}
      //   break
      // case 'eventinfo': return {}
      //   break
      default: return {}
    }
  },
  post: function () {}
}

export const NEO = (process.env.NODE_ENV === 'production')
  ? axios.create({
    baseURL: `http://82.165.102.48:7474/db/data/transaction/commit/`, // prod
    headers: {
      'Authorization': 'Basic bmVvNGo6Mk1hbnlTZWNyZXRz',
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json; charset=utf-8'
    }
  })
  : axios.create({
    // baseURL: `http://0.0.0.0:7474/db/data/transaction/commit/`, // dev
    baseURL: `http://82.165.102.48:7474/db/data/transaction/commit/`, // prod
    headers: {
      'Authorization': 'Basic bmVvNGo6Mk1hbnlTZWNyZXRz',
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
    // console.log('setEventinfoData', typeof data.involved)
    // state.eventinfoData.involved = JSON.parse(data.involved)
    console.log('***** mutation eventinfo data', data)
  },

  setTargetLocation (state, el) {
    let [eid, loc] = el
    console.log('setTargetLocation', eid, loc)
    let idx = state.eventinfoData.findIndex((e) => (e.id === eid))
    if (idx < 0) console.log('***** event not found:', eid, 'in', state.eventinfoData)
    state.eventinfoData[idx].targetloc = loc
    console.log('*******>>>>>>', state.eventinfoData)
  },

  setEventLocation (state, el) {
    let [eid, loc] = el
    console.log('setEventLocation', eid, loc)
    let idx = state.eventinfoData.findIndex((e) => (e.id === eid))
    if (idx < 0) console.log('***** event not found:', eid, 'in', state.eventinfoData)
    state.eventinfoData[idx].location = loc
    console.log('*******>>>>>>', state.eventinfoData)
  },
  setAccomodationData (state, data) {
    console.log('setAccomodationData', data)
    state.udata.accomodation = data
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
  setMembers (state, data) {
    // console.log('setMembers')
    let [uid, members] = data
    if (state.uid !== uid) console.log('uid mismatch, implement privileged?')
    // if (!Array.isArry(state.udata.members)) state.udata.members = []
    state.udata.members = members
    // console.log('setMembers:', state.udata)
  },
  setManager (state, data) {
    // console.log('setMembers')
    let [uid, manager] = data
    if (state.uid !== uid) console.log('uid mismatch, implement privileged?')
    // if (!Array.isArry(state.udata.members)) state.udata.members = []
    state.udata.managedby = manager
    // console.log('setMembers:', state.udata)
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
        state.privileged = state.privileged || data.privileged
        continue
      }
    }
    state.loaded = true
  },
  setRealUser (state, id) {
    state.realUid = id
    state.privileged = state.uids.find(e => (e.id === id)).privileged
    console.log('setRealUser', id, state.privileged)
  }
}

export const getters = {
  udata: state => state.udata,
  loaded: state => state.loaded,
  saved: state => state.saved
}

export const actions = {

  async nuxtServerInit ({ commit, state }) {
    console.log('\n\n**************** server init list of ids. *****************\n')
    await this.dispatch('getUids')
    // await this.dispatch('getLocationData')
  },

  async getUids ({commit, state}) {
    let statements = {
      statements: [
        { statement: 'MATCH (g:Group) RETURN {id:g.id, privileged: g.privileged, name: g.name, email: g.email, mobile: g.mobile, role: g.role, comments: g.comments}' }
      ]
    }
    const { data } = await NEO.post('', statements)
    if (data.errors.length > 0) throw new DbError('Command failed', data.errors)
    console.log('data.result', data.results)
    let result = data.results[0].data.map(d => (d.row[0]))
    console.log('data', result)
    commit('setUids', result)
  },

  // async getNeo ({state}, name) {
  //   let statements = {
  //     statements: [
  //       { statement: 'MATCH (p:Person)-[:MEMBEROF]->(g:Group {name: $name}) RETURN DISTINCT p',
  //         parameters: { name: name }
  //       }
  //     ]
  //   }
  //   // let json = statements.replace(/"([^,]+?)":/g, '$1:')
  //   console.log('get groups statements', statements)
  //   const { data } = await NEO.post('', statements)
  //   console.log('data.results', data.results[0].data)
  // },

  // async storeGroup ({ commit, state }, obj) {
  //   let statements = {
  //     statements: [ {
  //       statement: 'CREATE (g:Group ' + JSON.stringify(obj).replace(/"([^,]+?)":/g, '$1:') + ' ) RETURN g '
  //     } ]
  //   }
  //   // let json = statements.replace(/"([^,]+?)":/g, '$1:')
  //   console.log('statements', statements)
  //   const { data } = await NEO.post('', statements)
  //   console.log(data)
  // },

  async setEventInvolved ({ commit, state }, obj) {
    let [evid, ...gid] = obj
    console.log('setEventInvolved', gid)
    let statements = {
      statements: [
        { statement: 'MATCH (e:Eventinfo {id: "' + evid + '"}), (g:Group), (e)-[r:INVOLVES]->(g) DETACH DELETE r' },
        { statement: 'MATCH (e:Eventinfo {id: "' + evid + '"}), (g:Group) WHERE g.id IN [' + gid + '] MERGE (e)-[r:INVOLVES]->(g) RETURN e,g' },

        { statement: 'MATCH (e:Eventinfo {id: "' + evid + '"}), (g:Group), (g)-[r:INVOLVEDIN]->(e) DETACH DELETE r' },
        { statement: 'MATCH (e:Eventinfo {id: "' + evid + '"}), (g:Group) WHERE g.id IN [' + gid + '] MERGE (g)-[r:INVOLVEDIN]->(e) RETURN e,g ' }
      ]
    }
    // let json = statements.replace(/"([^,]+?)":/g, '$1:')
    console.log('statements', statements)
    const { data } = await NEO.post('', statements)
    console.log(data)
  },

  async setTargetLocation ({ commit, state }, obj) {
    let [evid, locid] = obj
    console.log('setTargetLocation', evid, locid)
    let statements = {
      statements: [
        { statement: 'MATCH (e:Eventinfo {id: "' + evid + '"}), (l:Location {id: "' + locid + '"}) MERGE (e)-[r:TO]->(l) RETURN e,l' },
        { statement: 'MATCH (e:Eventinfo {id: "' + evid + '"}), (l:Location {id: "' + locid + '"}) MERGE (l)-[r:FROM]->(e) RETURN e,l ' }
      ]
    }
    // let json = statements.replace(/"([^,]+?)":/g, '$1:')
    console.log('statements', statements)
    const { data } = await NEO.post('', statements)
    console.log(data.errors)
  },

  async setEventLocation ({ commit, state }, obj) {
    let [evid, locid] = obj
    console.log('setEventLocation', evid, locid)
    let statements = {
      statements: [
        { statement: 'MATCH (e:Eventinfo {id: "' + evid + '"}), (l:Location {id: "' + locid + '"}) MERGE (e)-[r:AT]->(l) RETURN e,l' },
        { statement: 'MATCH (e:Eventinfo {id: "' + evid + '"}), (l:Location {id: "' + locid + '"}) MERGE (l)-[r:HASEVENT]->(e) RETURN e,l ' }
      ]
    }
    // let json = statements.replace(/"([^,]+?)":/g, '$1:')
    console.log('statements', statements)
    const { data } = await NEO.post('', statements)
    console.log(data.errors)
  },

  async getId (obj, type) {
    let statements = {
      statements: [ {
        statement: 'MATCH (n:' + type + ') return max(toInteger(n.id)) as max'
      } ]
    }
    const { data } = await NEO.post('', statements)
    if (data.errors.length !== 0) {
      console.log('Error in getId for node type' + type, data.errors)
      return null
    }
    return '' + (Util.parseResult(data.results)[0][0].max + 1)
  },

  async updatePerson ({ commit, state }, obj) {
    let [person, gid] = obj
    console.log('updatePerson 1', person, gid)
    if (!person.id || person.id === '') person.id = await this.dispatch('getId', 'Person')
    if (!person.id) {
      console.log('Could not get ID for Person', person)
      return
    }

    console.log('updatePerson', person, gid)
    let set = person.toNeoProps('p')
    let statements = {
      statements: [ {
        statement: 'MERGE (p:Person {id: "' + person.id + '"}) SET ' + set
      } ]
    }
    // MATCH (n { name: 'Andres' }) SET n.position = 'Developer', n.surname = 'Taylor'
    console.log('updatePerson statements', statements)
    const { data } = await NEO.post('', statements)
    if (data.errors.length !== 0) console.log('Error in updatePerson', data.errors)
    else {
      // commit('setPersonData', person)
      if (person.isManager) this.dispatch('setManagerRelation', [person.id, gid])
      this.dispatch('setMemberRelation', [person.id, gid])
    }
  },
  // MATCH (g:Group { id: '63021' }),(p:Person { id: '3' })
  // MERGE (g)-[r:MANAGEDBY]->(p)
  // RETURN g,p
  async setManagerRelation ({ commit, state }, obj) {
    let [pid, gid] = obj
    let statements = {
      statements: [
        { statement: 'MATCH (p:Person)-[r:MANAGES]->(g:Group {id: "' + gid + '"}) DELETE r' },
        { statement: 'MATCH (p:Person)<-[r:MANAGEDBY]-(g:Group {id: "' + gid + '"}) DELETE r' },
        { statement: 'MATCH (p:Person {id: "' + pid + '"}), (g:Group {id: "' + gid + '"}) MERGE (p)-[r:MANAGES]->(g) RETURN p,g ' },
        { statement: 'MATCH (p:Person {id: "' + pid + '"}), (g:Group {id: "' + gid + '"}) MERGE (g)-[r:MANAGEDBY]->(p) RETURN p,g ' }
      ]
    }
    // let json = statements.replace(/"([^,]+?)":/g, '$1:')
    console.log('setManagerRelation statements', statements)
    const { data } = await NEO.post('', statements)
    console.log('setManagerRelation result', data)
  },

  async setMemberRelation ({ commit, state }, obj) {
    let statements = {
      statements: [
        { statement: 'MATCH (p:Person {id: "' + obj[0] + '"}), (g:Group {id: "' + obj[1] + '"}) MERGE (p)-[r:MEMBEROF]->(g) RETURN p,g ' },
        { statement: 'MATCH (p:Person {id: "' + obj[0] + '"}), (g:Group {id: "' + obj[1] + '"}) MERGE (g)-[r:HASMEMBER]->(p) RETURN p,g ' }
      ]
    }
    // let json = statements.replace(/"([^,]+?)":/g, '$1:')
    console.log('setMemberRelation statements', statements)
    const { data } = await NEO.post('', statements)
    console.log(data)
  },

  async storeEventinfo ({ commit, state }, obj) {
    let statements = {
      statements: [ {
        statement: 'CREATE (e:Eventinfo ' + JSON.stringify(obj).replace(/"([^,]+?)":/g, '$1:') + ' ) RETURN e '
      } ]
    }
    console.log('statements', statements.statements[0].statement)
    const { data } = await NEO.post('', statements)
    console.log(data)
  },

  async storeLocation ({ commit, state }, obj) {
    let statements = {
      statements: [ {
        statement: 'CREATE (l:Location ' + JSON.stringify(obj).replace(/"([^,]+?)":/g, '$1:') + ' ) RETURN l '
      } ]
    }
    // let json = statements.replace(/"([^,]+?)":/g, '$1:')
    console.log('statements', statements)
    const { data } = await NEO.post('', statements)
    console.log(data)
  },

  async updateEventinfoData ({ commit, state }, obj) {
    if (!obj.id || obj.id === '') obj.id = await this.dispatch('getId', 'Eventinfo')
    if (!obj.id) {
      console.log('Could not get ID for Eventinfo', obj)
      return
    }

    console.log('**** updateEventinfoData', obj)
    let ev = new Eventinfo(obj)
    delete ev.involved
    delete ev.location
    console.log('**** updateEventinfoData (2)', obj)
    let set = ev.toNeoProps('e')
    let statements = {
      statements: [ {
        statement: 'MERGE (e:Eventinfo {id: "' + ev.id + '"}) SET ' + set
      } ]
    }
    // MATCH (n { name: 'Andres' }) SET n.position = 'Developer', n.surname = 'Taylor'
    console.log('updateEventinfoData:statements', statements)
    const { data } = await NEO.post('', statements)
    if (data.errors.length !== 0) {
      console.log('Error in updateGroup', data.errors)
      return
    }
    if (obj.location !== '') await this.dispatch('setEventLocation', [ev.id, obj.location])
    if (obj.targetloc !== '') await this.dispatch('setTargetLocation', [ev.id, obj.targetloc])
    if (obj.involved !== '') await this.dispatch('setEventInvolved', [ev.id, obj.involved.map(e => ('"' + e + '"'))])
    //   commit('setUserData', obj)
    //   this.dispatch('getUids')
    // }
  },

  async deleteEventinfoData ({ commit, state }, evid) {
    let statements = {
      statements: [
        { statement: 'MATCH (e:Eventinfo {id: $evid}) DETACH DELETE e',
          parameters: { evid: evid }
        }
      ]
    }
    console.log('deleteEventinfoData statements', statements)
    const { data } = await NEO.post('', statements)
    if (data.errors.length !== 0) console.log('Error in deleteEventinfoData', data.errors)
    let results = Util.parseResult(data.results)
    console.log('deleteEventinfoData results', results)
    await this.dispatch('getEventinfoData')
  },

  async getEventinfoData ({ commit, state }) {
    let statements = {
      statements: [
        { statement: 'MATCH (e:Eventinfo)-[r:INVOLVES|AT|TO]-(l) WITH r,e,l ORDER BY e.starts return type(r) as r, e, l' }
      ]
    }
    console.log('geEventinfoData statements', statements)
    const { data } = await NEO.post('', statements)
    let results = Util.parseResult(data.results)

    // console.log('geEventinfoData data.results', data.results)
    let evtinf = {}
    for (let result of results[0]) {
      let id = result.e.id
      evtinf[id] = evtinf[id] || result.e
      let evt = evtinf[id]
      switch (result.r) {
        case 'AT':
          evt.location = result.l
          // console.log('geEventinfoData', result.e.id, result.r, result.l.name)
          break
        case 'INVOLVES':
          evt.involved = evt.involved || []
          evt.involved.push(result.l)
          // console.log('geEventinfoData', result.e.id, result.r, result.l.name)
          break
        case 'TO':
          evt.targetloc = result.l
          // console.log('geEventinfoData', result.e.id, result.r, result.l.name)
          break
        default:
          console.log('geEventinfoData unknown', result.r)
      }
    }
    let evts = Object.values(evtinf).sort((e1, e2) => (e1.starts > e2.starts ? +1 : e1.starts === e2.starts ? 0 : -1))
    // console.log('geEventinfoData done', evts)
    commit('setEventinfoData', evts)
  },

  async getEventinfoDataOld ({ commit, state }) {
    let statements = {
      statements: [
        { statement: 'MATCH (e:Eventinfo) WITH e ORDER BY e.starts RETURN  e' },
        { statement: 'MATCH (el:Eventinfo)-[:AT]->(l:Location) RETURN  el,l' },
        { statement: 'MATCH (eg:Eventinfo)-[:INVOLVES]->(g:Group) RETURN  eg,g' },
        { statement: 'MATCH (et:Eventinfo)-[:TO]->(t:Location) RETURN  et,t' }
      ]
    }
    console.log('getEventinfoData statements', statements)
    const { data } = await NEO.post('', statements)

    // console.log('getEventinfoData results', data.results)

    let results = Util.parseResult(data.results)
    let evts = results[0].map(d => (d.e))
    let evlocs = results[1].map(d => ({e: d.el, l: d.l}))
    let evgroup = results[2].map(d => ({e: d.eg, g: d.g}))
    let evtgts = results[3].map(d => ({e: d.et, t: d.t}))
    // console.log('getEventinfoData:parsed', evts, evlocs, evgroup)
    for (var i = 0; i < evlocs.length; i++) {
      if (!evlocs[i].e) continue
      let evt = evts.find((e) => (e.id === evlocs[i].e.id))
      evt.location = evlocs[i].l
    }
    for (i = 0; i < evtgts.length; i++) {
      if (!evtgts[i].e) continue
      let evt = evts.find((e) => (e.id === evtgts[i].e.id))
      evt.targetloc = evtgts[i].t
    }
    for (i = 0; i < evgroup.length; i++) {
      if (!evgroup[i].e) continue
      let evt = evts.find((e) => (e.id === evgroup[i].e.id))
      if (!evt.involved || !Array.isArray(evt.involved)) evt.involved = []
      evt.involved.push(evgroup[i].g)
    }
    console.log('getEventinfoData result', evts)
    commit('setEventinfoData', evts)
  },

  async getLocationData ({ commit, state }) {
    console.log('getLocationData (from NEO)')
    let statements = {
      statements: [
        { statement: 'MATCH (l:Location) WITH l ORDER BY l.name RETURN l' }
      ]
    }
    console.log('getLocationData statements', statements)
    const { data } = await NEO.post('', statements)
    commit('setLocationData', data.results[0].data.map(d => (d.row[0])))
  },

  async updateLocationData ({ commit, state }, loc) {
    if (!loc.id || loc.id === '') loc.id = await this.dispatch('getId', 'Location')
    if (!loc.id) {
      console.log('Could not get ID for Location', loc)
      return
    }
    let set = loc.toNeoProps('l')
    let statements = {
      statements: [ {
        statement: 'MERGE (l:Location {id: "' + loc.id + '"}) SET ' + set
      } ]
    }
    // MATCH (n { name: 'Andres' }) SET n.position = 'Developer', n.surname = 'Taylor'
    console.log('updateLocationData:statements', statements)
    const { data } = await NEO.post('', statements)
    if (data.errors.length !== 0) console.log('Error in updateLocationData', data.errors)
    else {
      await this.dispatch('getLocationData')
    }
  },

  async deleteLocationData ({ commit, state }, locid) {
    let statements = {
      statements: [
        { statement: 'MATCH (l:Location {id: $locid}) DETACH DELETE l',
          parameters: { locid: locid }
        }
      ]
    }
    console.log('deleteLocation statements', statements)
    const { data } = await NEO.post('', statements)
    if (data.errors.length !== 0) console.log('Error in deleteLocationData', data.errors)
    let results = Util.parseResult(data.results)
    console.log('deleteLocation results', results)
    await this.dispatch('getLocationData')
  },

  // async uploadLocationData ({ commit, state }, obj) {
  //   var updurl = '/location/update'
  //   const { data } = await HTTP.post(updurl, {body: obj})
  //   if (!data) return null
  //   commit('setLocationData', obj)
  //   // console.log('response after update', data)
  // },

  // async uploadPersonData ({ commit, state }, obj) {
  //   var updurl = '/person/update'
  //   let person = new Person(obj)
  //   person.memberof = JSON.stringify(obj.memberof)
  //   person.managerof = JSON.stringify(obj.managerof)
  //   const { data } = await HTTP.post(updurl, {body: person})
  //   if (!data) return null
  //   console.log('from uploadPersonData')
  //   commit('setPersonData', obj)
  //   // console.log('response after update', data)
  // },
  //
  async deletePerson ({ commit, state }, pid) {
    let statements = {
      statements: [
        { statement: 'MATCH (p:Person {id: $pid}) DETACH DELETE p',
          parameters: { pid: pid }
        }
      ]
    }
    console.log('deletePerson statements', statements)
    const { data } = await NEO.post('', statements)
    let results = Util.parseResult(data.results)
    console.log('deletePerson results', results)
  },

  async deleteMember ({ commit, state }, obj) {
    let [pid, gid] = obj
    console.log('deleteMember (from NEO)', pid, gid)
    let statements = {
      statements: [
        { statement: 'MATCH (p:Person {id: $pid})<-[r:HASMEMBER|MEMBEROF]->(g:Group {id: $gid}) DELETE r',
          parameters: { pid: pid, gid: gid }
        },
        { statement: 'MATCH (p:Person {id: $pid})<-[r]->() RETURN count(*) as count',
          parameters: { pid: pid }
        }
      ]
    }
    console.log('deleteMember statements', statements)
    const { data } = await NEO.post('', statements)
    console.log('data.results', data.results)
    let results = Util.parseResult(data.results)
    console.log('deleteMember results', results, results[1][0].count)
    if (results[1][0].count === 0) this.dispatch('deletePerson', pid)
  },

  async getMembers ({ commit, state }, uid) {
    console.log('getMembes (from NEO)', uid)
    let statements = {
      statements: [
        { statement: 'MATCH (g:Group {id: $uid})-[:HASMEMBER]->(p:Person) RETURN  p',
          parameters: { uid: uid }
        },
        { statement: 'MATCH (g:Group {id: $uid})-[:MANAGEDBY]->(p:Person) RETURN  p',
          parameters: { uid: uid }
        }
      ]
    }
    // let json = statements.replace(/"([^,]+?)":/g, '$1:')
    const { data } = await NEO.post('', statements)
    let results = Util.parseResult(data.results)

    let members = results[0].map(d => (d.p))
    console.log('data.final members', members)
    let manager = results[1][0].p || {}
    console.log('data.final manager', manager)
    commit('setMembers', [uid, members])
    commit('setManager', [uid, manager])
  },

  async getUserData ({ commit, state }, uid) {
    var p = state.privileged
    // if (!state.uid) state.uid = uid
    console.log('getUserData (from NEO)', uid)
    if (uid > '0') {
      let statements = {
        statements: [
          { statement: 'MATCH (g:Group {id: $uid}) RETURN DISTINCT g',
            parameters: { uid: uid }
          },
          { statement: 'MATCH (g:Group {id: $uid})-[:HASMEMBER]->(p:Person) RETURN  g, p',
            parameters: { uid: uid }
          },
          { statement: 'MATCH (g:Group {id: $uid})-[:MANAGEDBY]->(p:Person) RETURN  g, p',
            parameters: { uid: uid }
          },
          { statement: 'MATCH (g:Group {id: $uid})-[:STAYSAT]->(l:Location) RETURN g, l',
            parameters: { uid: uid }
          }
        ]
      }
      const { data } = await NEO.post('', statements)

      // console.log('index:getUserData data.results', JSON.stringify(data.results))

      let results = Util.parseResult(data.results)
      let members = results[1] ? results[1].map((m) => (m.p)) : []
      let manager = results[2].length > 0 ? results[2][0].p : {}
      let accomod = results[3].length > 0 ? results[3][0].l : {}

      // console.log('parsedResult', JSON.stringify(results))
      // console.log('****groups', results[0][0].g)
      // console.log('****members', members)
      // console.log('****managers', manager)
      // console.log('****accomodation', accomod)

      commit('setUserData', results[0][0].g)
      commit('setMembers', [uid, members])
      commit('setManager', [uid, manager])
      commit('setAccomodationData', accomod)
    } else {
      commit('clearUserData', p)
    }
  },

  async deleteGroup ({ commit, state }, uid) {
    let statements = {
      statements: [ {
        statement: 'MATCH (g:Group {id: "' + uid + '"}) DETACH DELETE g'
      } ]
    }
    console.log('deleteGroup:statements', statements)
    const { data } = await NEO.post('', statements)
    if (data.errors.length !== 0) console.log('Error in deleteGroup', data.errors)
    else {
      this.dispatch('getUserData', this.realUid)
      this.dispatch('getUids')
    }
  },

  async updateGroup ({ commit, state }, obj) {
    let set = obj.toNeoProps('g')
    let statements = {
      statements: [ {
        statement: 'MERGE (g:Group {id: "' + obj.id + '"}) SET ' + set
      } ]
    }
    // MATCH (n { name: 'Andres' }) SET n.position = 'Developer', n.surname = 'Taylor'
    console.log('statements', statements)
    const { data } = await NEO.post('', statements)
    if (data.errors.length !== 0) console.log('Error in updateGroup', data.errors)
    else {
      commit('setUserData', obj)
      this.dispatch('getUids')
    }
  },

  async resendLink ({ commit }, obj) {
    console.log('try to find', obj)
  },

  setRealUser ({ commit }, id) {
    commit('setRealUser', id)
    this.dispatch('getUserData', id)
  }
}
