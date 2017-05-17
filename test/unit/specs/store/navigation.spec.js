const NavigationInjector = require('inject-loader!@/store/navigation')

let navigation, router

const mockRouterInNavigation = () => {
  router = {
    afterEachCallback: null,
    currentRoute: {
      name: null
    },
    afterEach (callback) {
      this.afterEachCallback = callback
    },
    push (name) {
      this.currentRoute.name = name
      this.afterEachCallback()
    }
  }

  navigation = NavigationInjector({
    '@/services/router': router
  }).default
}

const commit = (key, value) => {
  navigation.mutations[key](navigation.state, value)
}

const dispatch = key => {
  navigation.actions[key]({state: navigation.state, commit})
}

const assertNavigation = (expected, result) => {
  expect(result.length).to.equal(expected.length)
  let i = 0
  for (let [route, title, hint] of expected) {
    expect(result[i].route).to.equal(route)
    expect(result[i].title).to.equal(title)
    expect(result[i].hint).to.equal(hint)
    i++
  }
}

describe('Store - navigation', () => {
  beforeEach(mockRouterInNavigation)

  it('has navigation', () => {
    expect(navigation).not.to.be.undefined

    expect(navigation.state.level1Navigation).to.be.null
    expect(navigation.state.pathNavigation).to.be.null
  })


  it('has default navigation', () => {
    navigation.actions.updateNavigation({state: navigation.state, commit})

    assertNavigation([
      ['dashboard', 'headlines.dashboard', false],
      ['todos', 'headlines.todos', 0],
      ['orgas.list', 'headlines.organisations', 0],
      ['events.list', 'headlines.events', 0],
      ['search', 'headlines.search', false]
    ], navigation.state.level1Navigation)

    assertNavigation([
      ['dashboard', 'headlines.dashboard', undefined]
    ], navigation.state.pathNavigation)
  })


  it('updates after route change', () => {
    navigation.actions.initApp({dispatch})

    router.push('dashboard')
    assertNavigation([
      [null, 'headlines.dashboard', false]
    ], navigation.state.pathNavigation)

    router.push('orgas.edit')
    assertNavigation([
      ['dashboard', 'headlines.dashboard', false],
      ['orgas.list', 'headlines.organisations', false],
      [null, 'headlines.edit', false]
    ], navigation.state.pathNavigation)

    router.push('todos')
    assertNavigation([
      ['dashboard', 'headlines.dashboard', false],
      [null, 'headlines.todos', false]
    ], navigation.state.pathNavigation)
  })


  it.skip('updates after num items change', () => {
    navigation.actions.updateNumItems({commit, dispatch}, {
      type: 'orgas',
      numItems: 10
    })
    assertNavigation([
      ['dashboard', 'headlines.dashboard', false],
      ['todos', 'headlines.todos', 0],
      ['orgas.list', 'headlines.organisations', 10],
      ['events.list', 'headlines.events', 0],
      ['search', 'headlines.search', false]
    ], navigation.state.level1Navigation)

    navigation.actions.updateNumItems({commit, dispatch}, {
      type: 'todos',
      numItems: 7
    })
    assertNavigation([
      ['dashboard', 'headlines.dashboard', false],
      ['todos', 'headlines.todos', 7],
      ['orgas.list', 'headlines.organisations', 10],
      ['events.list', 'headlines.events', 0],
      ['search', 'headlines.search', false]
    ], navigation.state.level1Navigation)
  })
})
