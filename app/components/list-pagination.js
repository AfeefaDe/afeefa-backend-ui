import Ember from 'ember';

export default Ember.Component.extend({
  numItems: 0,
  currentPage: 1,
  pageSize: 15,

  numPages: Ember.computed('numItems', 'pageSize', function () {
    return Math.ceil(this.get('numItems') / this.get('pageSize'));
  }),

  didReceiveAttrs () {
    const numItems = parseInt(this.get('numItems')) || 0;
    let pageSize = parseInt(this.get('pageSize'));
    let currentPage = parseInt(this.get('currentPage')) || 1;
    if (!pageSize) {
       pageSize = 15;
       currentPage = 1;
    }
    currentPage = Math.max(1, currentPage);
    const numPages = Math.ceil(numItems / pageSize);
    if (currentPage > numPages) {
      currentPage = 1;
    }

    this.set('numItems', numItems);
    this.set('pageSize', pageSize);
    this.set('currentPage', currentPage);
  },

  actions: {
    goto (page) {
      this.set('currentPage', page);
      this.sendAction('changed', page);
    },

    setPageSize (pageSize) {
      pageSize = parseInt(pageSize) || 15;
      this.set('pageSize', pageSize);
      this.set('currentPage', 1);
      this.sendAction('changed', 1);
    }
  }
});
