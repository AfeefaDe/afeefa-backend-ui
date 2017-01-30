import Ember from 'ember';

export default Ember.Mixin.create({
  currentPage: 1,
  pageSize: 5,

  getAllItems () {
    return [];
  },

  currentPageItems: Ember.computed('currentPage', 'pageSize', function () {
    const pageSize = this.get('pageSize');
    const currentPage = this.get('currentPage');

    let items = this.getAllItems();
    const numItems = items.get('length');
    const pageNumber = Math.min(Math.max(1, currentPage), Math.ceil(numItems / pageSize));
    const index = (pageNumber - 1) * pageSize;
    items = items.slice(index, index + pageSize);
    return items;
  }),

  actions: {
    setPage (page) {
      this.set('currentPage', page);
    }
  }
});
