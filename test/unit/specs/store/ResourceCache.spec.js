import ResourceCache from '@/store/api/ResourceCache'

describe('Store - ResourceCache', () => {
  it('creates resource cache', () => {
    const cache = new ResourceCache()
    expect(cache).to.be.an.instanceof(ResourceCache)
    expect(cache.hasItem('randomkey')).to.be.false
  })


  it('should have and return added item', () => {
    const cache = new ResourceCache()
    const item = {id: 1}
    cache.addItem('key', item)
    expect(cache.hasItem('key', 1)).to.be.true
    expect(cache.getItem('key', 1)).to.equal(item)
  })


  it('should allow multiple items', () => {
    const cache = new ResourceCache()
    const item = {id: 1}
    const item2 = {id: 2}
    cache.addItem('key', item)
    cache.addItem('key', item2)

    expect(cache.hasItem('key', 1)).to.be.true
    expect(cache.getItem('key', 1)).to.equal(item)
    expect(cache.hasItem('key', 2)).to.be.true
    expect(cache.getItem('key', 2)).to.equal(item2)
  })


  it('should purge item', () => {
    const cache = new ResourceCache()
    const item = {id: 1}
    cache.addItem('key', item)
    expect(cache.hasItem('key', 1)).to.be.true

    cache.purgeItem('key', 1)
    expect(cache.hasItem('key', 1)).to.be.false
  })


  it('should have and return added list', () => {
    const cache = new ResourceCache()
    const list = []
    cache.addList('key', 'url', list)
    expect(cache.hasList('key', 'url')).to.be.true
    expect(cache.getList('key', 'url')).to.equal(list)
  })


  it('allows multiple lists per key', () => {
    const cache = new ResourceCache()
    const list = []
    const list2 = []
    cache.addList('key', 'url1', list)
    cache.addList('key', 'url2', list2)
    expect(cache.hasList('key', 'url1')).to.be.true
    expect(cache.hasList('key', 'url2')).to.be.true
  })


  it('purges single list', () => {
    const cache = new ResourceCache()
    const list = []
    const list2 = []
    cache.addList('key', 'url1', list)
    cache.addList('key', 'url2', list2)
    expect(cache.hasList('key', 'url1')).to.be.true
    expect(cache.hasList('key', 'url2')).to.be.true

    cache.purgeList('key', 'url1')
    expect(cache.hasList('key', 'url1')).to.be.false
    expect(cache.hasList('key', 'url2')).to.be.true
  })


  it('purges all lists of a given key', () => {
    const cache = new ResourceCache()
    const list = []
    const list2 = []
    cache.addList('key', 'url1', list)
    cache.addList('key', 'url2', list2)
    expect(cache.hasList('key', 'url1')).to.be.true
    expect(cache.hasList('key', 'url2')).to.be.true

    cache.purgeList('key')
    expect(cache.hasList('key', 'url1')).to.be.false
    expect(cache.hasList('key', 'url2')).to.be.false
  })


  it('does not fail when purging nonexisting list', () => {
    const cache = new ResourceCache()
    cache.purgeList('key')
  })


  it('adds all items of a list', () => {
    const cache = new ResourceCache()
    const list = [
      {id: 1, type: 'key1'},
      {id: 2, type: 'key1'},
      {id: 3, type: 'key1'},
      {id: 4, type: 'key2'}
    ]

    cache.addList('list_type', 'url1', list)
    expect(cache.hasItem('key1', 1)).to.be.true
    expect(cache.hasItem('key1', 2)).to.be.true
    expect(cache.hasItem('key1', 3)).to.be.true
    expect(cache.hasItem('key1', 4)).to.be.false

    expect(cache.hasItem('key2', 3)).to.be.false
    expect(cache.hasItem('key2', 4)).to.be.true

    expect(cache.hasItem('list_type', 3)).to.be.false
    expect(cache.hasItem('list_type', 4)).to.be.false
  })
})
