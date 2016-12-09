export default {

  navigation: [],

  menuTree: {
    route: 'protected.dashboard',
    title: 'Dashboard',
    children: [
      {
        route: 'protected.orgas',
        title: 'Orgas',
        children: [
          { route: 'protected.orga', title: 'Anzeigen' },
          { route: 'protected.editorga', title: 'Ändern' },
          { route: 'protected.neworga', title: 'Neu' }
        ]
      },
      {
        route: 'protected.events',
        title: 'Events',
        children: [
          { route: 'protected.event', title: 'Anzeigen' },
          { route: 'protected.editevent', title: 'Ändern' },
          { route: 'protected.newevent', title: 'Neu' }
        ]
      },
      { route: 'protected.search', title: 'Suche' },
      { route: 'protected.todos', title: 'Todos' }
    ]
  },

  setRoute (routeHandlerInfos) { // currently always an array of 3 items
    const routeName = routeHandlerInfos[2].name;
    function traverseMenuTree (node, tempPath) {
      node = Object.assign({}, node);
      tempPath.push(node);
      node.link = node.route;

      if (node.route === routeName) {
        node.link = null; // hide link on active link
        return tempPath;
      }

      if (node.children) {
          for (let child of node.children) {
          const foundChild = traverseMenuTree(child, tempPath);
          if (foundChild) {
            return tempPath;
          }
        }
      }

      tempPath.pop();
      return false;
    }

    this.navigation = traverseMenuTree(this.menuTree, []) || [this.menuTree];
  },

  getNavigation () {
    return this.navigation;
  }

}
