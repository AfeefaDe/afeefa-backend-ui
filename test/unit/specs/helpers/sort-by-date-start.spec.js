import sortByDateStart from '@/helpers/sort-by-date-start'

describe.only('Helpers - sort-by-date-start', () => {
  it('should sort ASC by default', () => {

    const a = { date_start: new Date('2011-04-11') }
    const b = { date_start: new Date('2011-04-12') }
    const c = { date_start: new Date('2011-04-13') }
    const d = { date_start: new Date('2011-04-10') }
    const items = [a, b, c, d]

    const sortedItems = sortByDateStart(items)

    expect(sortedItems).to.deep.equal([d, a, b, c])
  })


  it('should sort DESC if given', () => {
    const a = { date_start: new Date('2011-04-11') }
    const b = { date_start: new Date('2011-04-12') }
    const c = { date_start: new Date('2011-04-13') }
    const d = { date_start: new Date('2011-04-10') }
    const items = [a, b, c, d]

    const sortedItems = sortByDateStart(items, 'DESC')

    expect(sortedItems).to.deep.equal([c, b, a, d])
  })
})
