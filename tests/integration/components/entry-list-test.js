import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('entry-list', 'Integration | Component | entry list', {
  integration: true,

  beforeEach () {
    const instances = [];
    for (let i = 0; i < 22; i++) {
      instances.push({
        title: `Instance${i + 1}`,
        createdAt: i
      });
    }
    this.set('instances', instances);
    this.set('attributes', []);
  }
});

function assertPageNavigation(assert, $, { numItems, numPages, currentPage }) {
  assert.equal(
    this.$('.list-pagination__info').text().trim(),
    `${numItems} Einträge (Seite ${currentPage} von ${numPages})`
  );
}


test('it shows page navigation if pagination is set', function(assert) {
  this.render(hbs`{{entry-list pagination=true}}`);

  assertPageNavigation(assert, this.$, {
    numItems: 0,
    currentPage: 1,
    numPages: 0
  });
});


test('it does not show page navigation initially', function(assert) {
  this.render(hbs`{{entry-list}}`);

  assert.equal(this.$('.list-pagination').html(), undefined);
});


test('it shows page navigation with right values', function(assert) {
  this.render(hbs`{{entry-list instances=instances attributes=attributes sortOrder='createdAt:desc' pagination=true pageSize=5}}`);

  assertPageNavigation(assert, this.$, {
    numItems: 22,
    currentPage: 1,
    numPages: 5
  });

  assert.equal(this.$('.entryList').children().length, 5);
  assert.equal(this.$('.entryList').find('h4').eq(0).text(), 'Instance22');
  assert.equal(this.$('.entryList').find('h4').eq(4).text(), 'Instance18');

  this.render(hbs`{{entry-list instances=instances attributes=attributes sortOrder='createdAt:desc' pagination=true pageSize=15}}`);

  assertPageNavigation(assert, this.$, {
    numItems: 22,
    currentPage: 1,
    numPages: 2
  });

  assert.equal(this.$('.entryList').children().length, 15);
  assert.equal(this.$('.entryList').find('h4').eq(0).text(), 'Instance22');
  assert.equal(this.$('.entryList').find('h4').eq(14).text(), 'Instance8');
});


test('it navigates pages', function(assert) {
  this.render(hbs`{{entry-list instances=instances attributes=attributes sortOrder='createdAt:desc' pagination=true pageSize=5}}`);

  this.$('.list-pagination__navigation').children().eq(2).click();

  assertPageNavigation(assert, this.$, {
    numItems: 22,
    currentPage: 3,
    numPages: 5 // page size = 5 (@see entry-form)
  });

  assert.equal(this.$('.entryList').children().length, 5);
  assert.equal(this.$('.entryList').find('h4').eq(0).text(), 'Instance12');
  assert.equal(this.$('.entryList').find('h4').eq(4).text(), 'Instance8');

  this.$('.list-pagination__navigation').children().eq(4).click();

  assertPageNavigation(assert, this.$, {
    numItems: 22,
    currentPage: 5,
    numPages: 5 // page size = 5 (@see entry-form)
  });

  assert.equal(this.$('.entryList').children().length, 2);
  assert.equal(this.$('.entryList').find('h4').eq(0).text(), 'Instance2');
  assert.equal(this.$('.entryList').find('h4').eq(1).text(), 'Instance1');
});


test('it shows correct page size', function(assert) {
  this.render(hbs`{{entry-list instances=instances attributes=attributes sortOrder='createdAt:desc' pagination=true}}`);

  // all items
  this.$('.list-pagination__pagesize').val('1000').trigger('change');

  assertPageNavigation(assert, this.$, {
    numItems: 22,
    currentPage: 1,
    numPages: 1
  });

  assert.equal(this.$('.entryList').children().length, 22);
  assert.equal(this.$('.entryList').find('h4').eq(0).text(), 'Instance22');
  assert.equal(this.$('.entryList').find('h4').eq(21).text(), 'Instance1');

  // 8 items
  this.$('.list-pagination__pagesize').val('15').trigger('change');

  assertPageNavigation(assert, this.$, {
    numItems: 22,
    currentPage: 1,
    numPages: 2
  });

  assert.equal(this.$('.entryList').children().length, 15);
  assert.equal(this.$('.entryList').find('h4').eq(0).text(), 'Instance22');
  assert.equal(this.$('.entryList').find('h4').eq(14).text(), 'Instance8');
});
