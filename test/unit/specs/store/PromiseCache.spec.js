import PromiseCache from '@/store/api/PromiseCache'

function newPromise () {
  return new Promise((resolve, reject) => {})
}

describe('Store - PromiseCache', () => {
  it('creates cache', () => {
    const cache = new PromiseCache()
    expect(cache).to.be.an.instanceof(PromiseCache)
    expect(cache.hasItem('randomkey')).to.be.false
  })


  it('should has and return added item', () => {
    const cache = new PromiseCache()
    const promise = newPromise()
    cache.addItem('myp', promise)
    expect(cache.hasItem('myp')).to.be.true
    expect(cache.getItem('myp')).to.equal(promise)
  })


  it('throws error if no promise is given', () => {
    const cache = new PromiseCache()

    expect(() => {
      cache.addItem('myp')
    }).to.throw()

    expect(() => {
      cache.addItem('myp', null)
    }).to.throw()

    expect(() => {
      cache.addItem('myp', {})
    }).to.throw()
  })


  it('does not throw error if promise interface given', () => {
    const cache = new PromiseCache()

    expect(() => {
      cache.addItem('myp', newPromise())
    }).to.not.throw()

    expect(() => {
      cache.addItem('myp', {
        then () {
          return {
            catch () {}
          }
        }
      })
    }).to.not.throw()
  })


  it('should remove item', () => {
    const cache = new PromiseCache()
    const promise = newPromise()
    const promise2 = newPromise()
    cache.addItem('p1', promise)
    cache.addItem('p2', promise2)

    expect(cache.hasItem('p1')).to.be.true
    expect(cache.getItem('p1')).to.equal(promise)
    expect(cache.hasItem('p2')).to.be.true
    expect(cache.getItem('p2')).to.equal(promise2)

    cache.purgeItem('p1')
    expect(cache.hasItem('p1')).to.be.false
    expect(cache.getItem('p1')).to.equal(undefined)
    expect(cache.hasItem('p2')).to.be.true
    expect(cache.getItem('p2')).to.equal(promise2)

    cache.purgeItem('p2')
    expect(cache.hasItem('p1')).to.be.false
    expect(cache.getItem('p1')).to.equal(undefined)
    expect(cache.hasItem('p2')).to.be.false
    expect(cache.getItem('p2')).to.equal(undefined)
  })


  it('should remove item when promises resolves', async () => {
    const cache = new PromiseCache()
    let pResolve
    const promise = new Promise((resolve, reject) => {
      pResolve = resolve
    })

    cache.addItem('p', promise)
    expect(cache.hasItem('p')).to.be.true
    expect(cache.getItem('p')).to.equal(promise)

    pResolve()
    await promise

    expect(cache.hasItem('p')).to.be.false
    expect(cache.getItem('p')).to.equal(undefined)
  })


  it('should remove item when promises rejects', done => {
    const cache = new PromiseCache()

    let pReject
    const promise = new Promise((resolve, reject) => {
      pReject = reject
    })

    cache.addItem('p', promise)
    expect(cache.hasItem('p')).to.be.true
    expect(cache.getItem('p')).to.equal(promise)

    pReject()

    promise.then(() => {
      done(new Error('Promise not rejected, but should'))
    }).catch(() => {
      expect(cache.hasItem('p')).to.be.false
      expect(cache.getItem('p')).to.equal(undefined)
      done()
    })
  })
})
