import router from '@/services/router'

const menuTree = {
  route: 'dashboard',
  title: 'headlines.dashboard',
  action: null,
  level: 1,
  children: [
    {
      route: 'offers.list',
      title: 'offers.name',
      icon: 'favorite',
      action: {
        name: 'Neues Angebot erstellen',
        icon: 'add_circle_outline',
        route: 'offers.new'
      },
      level: 2,
      hint: state => state.numOffers,
      children: [
        {
          route: 'offers.show',
          title: 'headlines.show',
          level: 3,
          children: [
            { route: 'offers.edit', title: 'headlines.edit', level: 4 },
            { route: 'offers.contactedit', title: 'headlines.contactEdit', level: 4 },
            { route: 'offers.contactnew', title: 'headlines.contactNew', level: 4 }
          ]
        },
        { route: 'offers.new', title: 'headlines.new', level: 3 },
        { route: 'offers.convert', title: 'headlines.newFromActor', level: 3 }
      ]
    },
    {
      route: 'orgas.list',
      title: 'headlines.organisations',
      icon: 'group',
      action: {
        name: 'Neue Orga erstellen',
        icon: 'add_circle_outline',
        route: 'orgas.new'
      },
      level: 2,
      hint: state => state.numOrgas,
      children: [
        {
          route: 'orgas.show',
          title: 'headlines.show',
          level: 3,
          children: [
            { route: 'orgas.edit', title: 'headlines.edit', level: 4 },
            { route: 'orgas.contactedit', title: 'headlines.contactEdit', level: 4 },
            { route: 'orgas.contactnew', title: 'headlines.contactNew', level: 4 }
          ]
        },
        { route: 'orgas.new', title: 'headlines.new', level: 3 }
      ]
    },
    {
      route: 'events.list',
      title: 'headlines.events',
      icon: 'date_range',
      action: {
        name: 'Neues Event erstellen',
        icon: 'add_circle_outline',
        route: 'events.new'
      },
      level: 2,
      hint: state => { return state.numEvents.upcoming },
      children: [
        {
          route: 'events.show',
          title: 'headlines.show',
          level: 3,
          children: [
            { route: 'events.edit', title: 'headlines.edit', level: 4 },
            { route: 'events.contactedit', title: 'headlines.contactEdit', level: 4 },
            { route: 'events.contactnew', title: 'headlines.contactNew', level: 4 }
          ]
        },
        { route: 'events.new', title: 'headlines.new', level: 3 }
      ]
    },
    {
      route: 'todos',
      title: 'headlines.todos',
      icon: 'done',
      action: null,
      level: 2,
      hint: state => state.numTodos
    },
    {
      route: 'chapters.list',
      title: 'headlines.chapters',
      action: {
        name: 'Neues Kapitel erstellen',
        icon: 'add_circle_outline',
        route: 'chapters.new'
      },
      level: 1,
      hint: state => { return state.numChapters },
      children: [
        { route: 'chapters.edit', title: 'headlines.edit', level: 3 },
        { route: 'chapters.new', title: 'headlines.new', level: 3 }
      ]
    },
    {
      route: 'navigation.show',
      title: 'headlines.navigation',
      action: null,
      level: 1
    },
    {
      route: 'facets.list',
      title: 'headlines.categories',
      action: null,
      level: 1
    }
  ]
}


const createPathNavigation = (node, tmpPath, currentRouteName, currentRouteParams) => {
  node = Object.assign({}, node)
  node.hint = false
  tmpPath.push(node)

  let paramsMatch = false
  if (node.params) {
    paramsMatch = JSON.stringify(node.params) === JSON.stringify(currentRouteParams)
  } else {
    paramsMatch = true
    node.params = {}
  }

  if (node.route === currentRouteName && paramsMatch) {
    node.route = null // hide link on active route
    return tmpPath
  }

  if (node.children) {
    for (let child of node.children) {
      const foundChild = createPathNavigation(child, tmpPath, currentRouteName, currentRouteParams)
      if (foundChild) {
        return tmpPath
      }
    }
  }

  tmpPath.pop()
  return false
}


const createLevel1Navigation = (state, node, level1) => {
  node = Object.assign({}, node)
  node.params = node.params || {}
  if (node.level < 3) {
    if (node.hint) {
      node.hint = node.hint(state)
    } else {
      node.hint = false
    }
    level1.push(node)
  }
  if (node.children) {
    for (let child of node.children) {
      createLevel1Navigation(state, child, level1)
    }
  }
  return level1
}


export default {
  namespaced: true,


  state: {
    numOrgas: 0,
    numEvents: 0,
    numTodos: 0,
    numOffers: 0,
    numChapters: 0,
    pathNavigation: null,
    level1Navigation: null
  },


  mutations: {
    setNumItems (state, {key, numItems}) {
      if (state[key] !== undefined) {
        state[key] = numItems
      }
    },

    setPathNavigation (state, navigation) {
      state.pathNavigation = navigation
    },

    setLevel1Navigation (state, navigation) {
      state.level1Navigation = navigation
    },

    updateNavigation (state, navigation) {
      state.level1Navigation = navigation
    }
  },


  actions: {
    setNumItemFromMetaInformation ({commit, dispatch}, {metaInformation}) {
      if (!metaInformation) return
      for (let metaInformationKey in metaInformation) {
        const numItems = metaInformation[metaInformationKey]
        const key = 'num' + metaInformationKey.charAt(0).toUpperCase() + metaInformationKey.slice(1)
        commit('setNumItems', {key, numItems})
      }
      dispatch('updateNavigation')
    },

    updateNavigation ({state, commit}) {
      const routeName = router.currentRoute.name
      const routeParams = router.currentRoute.params

      const pathNavigation = createPathNavigation(menuTree, [], routeName, routeParams) || [menuTree]
      commit('setPathNavigation', pathNavigation)

      const level1Navigation = createLevel1Navigation(state, menuTree, [])
      commit('setLevel1Navigation', level1Navigation)
    },

    initApp ({dispatch}) {
      router.afterEach((to, from) => {
        dispatch('updateNavigation')
      })
    }
  }
}
