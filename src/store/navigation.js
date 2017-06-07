import router from '@/services/router'

const menuTree = {
  route: 'dashboard',
  title: 'headlines.dashboard',
  action: null,
  level: 1,
  children: [
    {
      route: 'todos',
      title: 'headlines.todos',
      action: null,
      level: 2,
      hint: state => state.numTodos
    },
    {
      route: 'orgas.list',
      title: 'headlines.organisations',
      action: {
        name: 'Neue Orga erstellen',
        icon: 'add_circle_outline',
        route: 'orgas.new'
      },
      level: 2,
      hint: state => state.numOrgas,
      children: [
        { route: 'orgas.show', title: 'headlines.show', level: 4 },
        { route: 'orgas.edit', title: 'headlines.edit', level: 4 },
        { route: 'orgas.new', title: 'headlines.new', level: 4 }
      ]
    },
    {
      route: 'events.list',
      title: 'headlines.events',
      action: {
        name: 'Neues Event erstellen',
        icon: 'add_circle_outline',
        route: 'events.new'
      },
      level: 2,
      hint: state => state.numEvents.upcoming,
      children: [
        {
          route: 'events.past',
          title: 'headlines.pastEventsShort',
          level: 3,
          hint: state => state.numEvents.past
        },
        { route: 'events.show', title: 'headlines.show', level: 4 },
        { route: 'events.edit', title: 'headlines.edit', level: 4 },
        { route: 'events.new', title: 'headlines.new', level: 4 }
      ]
    },
    {
      route: 'search',
      title: 'headlines.search',
      action: null,
      level: 1
    },
    {
      route: 'translations',
      title: 'headlines.translations',
      action: null,
      level: 1
    }
  ]
}


const createPathNavigation = (node, tmpPath, currentRouteName) => {
  node = Object.assign({}, node)
  node.hint = false
  tmpPath.push(node)

  if (node.route === currentRouteName) {
    node.route = null // hide link on active route
    return tmpPath
  }

  if (node.children) {
    for (let child of node.children) {
      const foundChild = createPathNavigation(child, tmpPath, currentRouteName)
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
  if (node.level < 4) {
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

      const pathNavigation = createPathNavigation(menuTree, [], routeName) || [menuTree]
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
