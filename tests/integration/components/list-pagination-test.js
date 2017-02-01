import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('list-pagination', 'Integration | Component | list pagination', {
  integration: true
});


function assertValues(assert, $, { numItems, numPages, currentPage }) {
  assert.equal(
    this.$('.list-pagination__info').text().trim(),
    `${numItems} Einträge (Seite ${currentPage} von ${numPages})`
  );

  if (numPages > 1) {
    assert.equal(this.$('.list-pagination__navigation').children().length, numPages, `num pages are: ${numPages}`);
    for (let i = 0; i < numPages; i++) {
      if (i === currentPage - 1) {
        assert.ok(this.$('.list-pagination__navigation').children().eq(i).hasClass('active'), `page ${i + 1} is active`);
      } else {
        assert.ok(this.$('.list-pagination__navigation').children().eq(i).hasClass('inactive'), `page ${i + 1} is inactive`);
      }
    }
  } else {
    assert.equal(this.$('.list-pagination__navigation').html(), undefined, 'page navigation not shown');
  }

  assert.equal(this.$('.list-pagination__pagesize').children().length, 3);
}


test('it renders', function(assert) {
  this.render(hbs`{{list-pagination}}`);

  assertValues(assert, this.$, {
    numItems: 0,
    currentPage: 1,
    numPages: 0
  });
});


test('test for 1 page', function(assert) {
  this.render(hbs`{{list-pagination numItems=5 currentPage=4 pageSize=20}}`);

  assertValues(assert, this.$, {
    numItems: 5,
    currentPage: 1,
    numPages: 1
  });
});


test('test initial values', function(assert) {
  this.render(hbs`{{list-pagination numItems=97 currentPage=4 pageSize=20}}`);

  assertValues(assert, this.$, {
    numItems: 97,
    currentPage: 4,
    numPages: 5
  });

  // set last page
  this.render(hbs`{{list-pagination numItems=22 currentPage=5 pageSize=5}}`);

  assertValues(assert, this.$, {
    numItems: 22,
    currentPage: 5,
    numPages: 5
  });
});


test('test wrong initial values', function(assert) {
  // not numbers
  this.render(hbs`{{list-pagination numItems=abc currentPage=abc pageSize=abc}}`);
  assertValues(assert, this.$, {
    numItems: 0,
    currentPage: 1,
    numPages: 0
  });

  // unavailable page
  this.render(hbs`{{list-pagination numItems=10 currentPage=3 pageSize=5}}`);
  assertValues(assert, this.$, {
    numItems: 10,
    currentPage: 1,
    numPages: 2
  });

  // unavailable page
  this.render(hbs`{{list-pagination numItems=10 currentPage=-3 pageSize=5}}`);
  assertValues(assert, this.$, {
    numItems: 10,
    currentPage: 1,
    numPages: 2
  });
});


test('test set page size', function(assert) {
  this.render(hbs`{{list-pagination numItems=97 currentPage=4 pageSize=20}}`);

  this.$('.list-pagination__pagesize').val('15').trigger('change');
  assertValues(assert, this.$, {
    numItems: 97,
    currentPage: 1,
    numPages: 7
  });

  this.$('.list-pagination__pagesize').val('1000').trigger('change');
  assertValues(assert, this.$, {
    numItems: 97,
    currentPage: 1,
    numPages: 1
  });

  // wrong page size
  this.$('.list-pagination__pagesize').val('-5').trigger('change');
  assertValues(assert, this.$, {
    numItems: 97,
    currentPage: 1,
    numPages: 7 // 15 is default page size
  });
});


test('test set page', function(assert) {
  this.render(hbs`{{list-pagination numItems=97 currentPage=4 pageSize=20}}`);

  this.$('.list-pagination__navigation').children().eq(2).click();
  assertValues(assert, this.$, {
    numItems: 97,
    currentPage: 3,
    numPages: 5
  });

  this.$('.list-pagination__navigation').children().eq(0).click();
  assertValues(assert, this.$, {
    numItems: 97,
    currentPage: 1,
    numPages: 5
  });

  this.render(hbs`{{list-pagination numItems=22 currentPage=2 pageSize=5}}`);

  this.$('.list-pagination__navigation').children().eq(4).click();
  assertValues(assert, this.$, {
    numItems: 22,
    currentPage: 5,
    numPages: 5
  });
});


test('test update properties', function(assert) {
  const reset = () => {
    this.set('numItems', 97);
    this.set('currentPage', 4);
    this.set('pageSize', 20);
    this.render(hbs`{{list-pagination numItems=numItems currentPage=currentPage pageSize=pageSize}}`);

    assertValues(assert, this.$, {
      numItems: 97,
      currentPage: 4,
      numPages: 5
    });
  };

  reset();

  this.set('currentPage', 2);
  assertValues(assert, this.$, {
    numItems: 97,
    currentPage: 2,
    numPages: 5
  });

  reset();

  // not numbers
  this.set('numItems', 'abc');
  assertValues(assert, this.$, {
    numItems: 0,
    currentPage: 1,
    numPages: 0
  });

  reset();

  // unavailable page
  this.set('currentPage', 100);
  assertValues(assert, this.$, {
    numItems: 97,
    currentPage: 1,
    numPages: 5
  });

  reset();

  // unavailable page
  this.set('currentPage', -5);
  assertValues(assert, this.$, {
    numItems: 97,
    currentPage: 1,
    numPages: 5
  });

  reset();

  // wrong page size
  this.set('pageSize', 0);
  assertValues(assert, this.$, {
    numItems: 97,
    currentPage: 1,
    numPages: 7 // default 15 per page
  });

  reset();

  // page size that causes invalid current page
  this.set('pageSize', 50);
  assertValues(assert, this.$, {
    numItems: 97,
    currentPage: 1,
    numPages: 2
  });
});
