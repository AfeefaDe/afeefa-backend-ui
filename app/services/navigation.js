import Ember from 'ember';

const menuTree = {
  route: 'protected.dashboard',
  title: 'Dashboard',
  level: 1,
  children: [
    {
      route: 'protected.todos',
      title: 'Todos',
      level: 2,
      hint: store => {
        const countOrgas = store.peekAll('orga').filter(orga => orga.get('annotations.length')).get('length');
        const countEvents = store.peekAll('event').filter(event => event.get('annotations.length')).get('length');
        return countOrgas + countEvents;
      }
    },
    {
      route: 'protected.orgas',
      title: 'Orgas',
      level: 2,
      hint: store => store.peekAll('orga').get('length'),
      children: [
        { route: 'protected.orgas.show', title: 'Anzeigen', level: 3 },
        { route: 'protected.orgas.edit', title: 'Ändern', level: 3 },
        { route: 'protected.orgas.new', title: 'Neu', level: 3 }
      ]
    },
    {
      route: 'protected.events',
      title: 'Events',
      level: 2,
      hint: store => store.peekAll('event').get('length'),
      children: [
        { route: 'protected.events.show', title: 'Anzeigen', level: 3 },
        { route: 'protected.events.edit', title: 'Ändern', level: 3 },
        { route: 'protected.events.new', title: 'Neu', level: 3 }
      ]
    },
    {
      route: 'protected.search',
      title: 'Suche',
      level: 1
    }
  ]
};


export default Ember.Service.extend(Ember.Evented, {
  EventBus: Ember.inject.service('event-bus'),
  store: Ember.inject.service(),

  pathNavigation: null,
  level1Navigation: null,

  init () {
    this.pathNavigation = [];
    this.level1Navigation = [];

    this.get('EventBus').subscribe('didTransition', this, 'onRouteChanged');
  },

  onRouteChanged () {
    const routes = this.get("router.router.state.handlerInfos");
    this.setRoute(routes);
    this.trigger('change');
  },

  setRoute (routeHandlerInfos) { // currently always an array of 3 items
    const lastIndex = routeHandlerInfos.length - 1;
    const routeName = routeHandlerInfos[lastIndex].name;
    const createPathNavigation = (node, tmpPath) => {
      node = Object.assign({}, node);
      if (node.hint) {
        node.hint = node.hint(this.get('store')) + '';
      } else {
        node.hint = false;
      }
      tmpPath.push(node);

      if (node.route === routeName) {
        node.route = null; // hide link on active route
        return tmpPath;
      }

      if (node.children) {
        for (let child of node.children) {
          const foundChild = createPathNavigation(child, tmpPath);
          if (foundChild) {
            return tmpPath;
          }
        }
      }

      tmpPath.pop();
      return false;
    };

    const createLevel1Navigation = (node, level1) => {
      node = Object.assign({}, node);
      if (node.level < 3) {
        if (node.hint) {
          node.hint = node.hint(this.get('store')) + '';
        } else {
          node.hint = false;
        }
        level1.push(node);
      }
      if (node.children) {
        for (let child of node.children) {
          createLevel1Navigation(child, level1);
        }
      }
      return level1;
    };

    this.pathNavigation = createPathNavigation(menuTree, []) || [menuTree];
    this.level1Navigation = createLevel1Navigation(menuTree, []);
  },

  getPathNavigation () {
    return this.pathNavigation;
  },

  getLevel1Navigation () {
    return this.level1Navigation;
  }
});
