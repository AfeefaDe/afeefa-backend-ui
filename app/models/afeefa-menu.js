export default {

  pathNavigation: [],
  level1Navigation: null,

  menuTree: {
    route: 'protected.dashboard',
    title: 'Dashboard',
    level: 1,
    children: [
      { route: 'protected.todos', title: 'Todos', level: 1 },
      {
        route: 'protected.orgas',
        title: 'Orgas',
        level: 1,
        children: [
          { route: 'protected.orga', title: 'Anzeigen', level: 2 },
          { route: 'protected.editorga', title: 'Ändern', level: 2 },
          { route: 'protected.neworga', title: 'Neu', level: 2 }
        ]
      },
      {
        route: 'protected.events',
        title: 'Events',
        children: [
          { route: 'protected.event', title: 'Anzeigen', level: 2 },
          { route: 'protected.editevent', title: 'Ändern', level: 2 },
          { route: 'protected.newevent', title: 'Neu', level: 2 }
        ]
      },
      { route: 'protected.search', title: 'Suche', level: 1 }
    ]
  },

  setRoute (routeHandlerInfos) { // currently always an array of 3 items
    const routeName = routeHandlerInfos[2].name;

    const createPathNavigation = (node, tmpPath) => {
      node = Object.assign({}, node);
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
    }

    this.pathNavigation = createPathNavigation(this.menuTree, []) || [this.menuTree];
  },

  getPathNavigation () {
    return this.pathNavigation;
  },

  getLevel1Navigation () {
    if (!this.level1Navigation) {
      const createLevel1Navigation = (node, level1) => {
        node = Object.assign({}, node);
        if (node.level === 1) {
          level1.push(node);
        }
        if (node.children) {
          for (let child of node.children) {
            createLevel1Navigation(child, level1);
          }
        }
        return level1;
      }
      this.level1Navigation = createLevel1Navigation(this.menuTree, []);
    }
    return this.level1Navigation;
  }

};
