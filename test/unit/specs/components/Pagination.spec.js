import Pagination from '@/components/Pagination'
import avoriaz, { mount } from 'avoriaz'
import { updateNow, setProperty } from '../../helpers'
import sinon from 'sinon'

import VueI18n from 'vue-i18n'
import i18n from '@/services/lang'

avoriaz.use(VueI18n)
i18n.locale = 'de'

function expectValues ($wrapper, {numItems, numPages, currentPage}) {
  const $info = $wrapper.find('.list-pagination__infoText')[0]
  expect($info.text().trim().replace(/\s+/g, ' ')).to.equal(
    `${numItems} Einträge (Seite ${currentPage} von ${numPages})`
  )

  const $navigation = $wrapper.find('.list-pagination__navigation')[0]
  if (numPages > 1) {
    const $buttons = $navigation.find('* > .list-pagination__navigationPages > a')
    expect($buttons.length).to.equal(numPages)
    for (let i = 0; i < numPages; i++) {
      if (i === currentPage - 1) {
        expect($buttons[i].hasClass('active')).to.be.true
      } else {
        expect($buttons[i].hasClass('inactive')).to.be.true
      }
    }
  } else {
    expect($navigation).to.be.undefined
  }

  const $select = $wrapper.find('.list-pagination__pagesizeSelect')[0]
  if (numItems > 15) {
    expect($select.find('option').length).to.equal(3)
  } else {
    expect($select).to.be.undefined
  }
}


describe('Components - Pagination', () => {
  it('shows sensible initial data', () => {
    expectValues(
      mount(Pagination, {i18n}),
      {numItems: 0, currentPage: 1, numPages: 0}
    )
  })

  it('shows page size selector', () => {
    expectValues(
      mount(Pagination, {i18n, propsData: {numItems: 20, page: 1, pageSize: 15}}),
      {numItems: 20, currentPage: 1, numPages: 2}
    )
  })

  it('shows a single page', () => {
    expectValues(
      mount(Pagination, {i18n, propsData: {numItems: 5, page: 4, pageSize: 15}}),
      {numItems: 5, currentPage: 1, numPages: 1}
    )
  })

  it('reflects initial values', () => {
    expectValues(
      mount(Pagination, {i18n, propsData: {numItems: 97, page: 4, pageSize: 15}}),
      {numItems: 97, currentPage: 4, numPages: 7}
    )

    expectValues(
      mount(Pagination, {i18n, propsData: {numItems: 290, page: 5, pageSize: 30}}),
      {numItems: 290, currentPage: 5, numPages: 10})
  })

  it('handles invalid initial values', () => {
    expectValues(
      mount(Pagination, {i18n, propsData: {numItems: 'abc', page: 'abc', pageSize: 'abc'}}),
      {numItems: 0, currentPage: 1, numPages: 0}
    )

    expectValues(
      mount(Pagination, {i18n, propsData: {numItems: 140, page: 20, pageSize: 15}}),
      {numItems: 140, currentPage: 1, numPages: 10}
    )
  })

  it('sets correct page size', () => {
    const $wrapper = mount(Pagination, {i18n, propsData: {numItems: 97, page: 4, pageSize: 15}})
    expectValues($wrapper, {numItems: 97, currentPage: 4, numPages: 7})

    const $select = $wrapper.find('.list-pagination__pagesizeSelect')[0]

    $select.element.value = '1000'
    $select.simulate('change')
    updateNow($wrapper)
    expectValues($wrapper, {numItems: 97, currentPage: 1, numPages: 1})

    $select.element.value = '30'
    $select.simulate('change')
    updateNow($wrapper)
    expectValues($wrapper, {numItems: 97, currentPage: 1, numPages: 4})

    $select.element.value = '15'
    $select.simulate('change')
    updateNow($wrapper)
    expectValues($wrapper, {numItems: 97, currentPage: 1, numPages: 7})
  })

  it('sets correct page', () => {
    const $wrapper = mount(Pagination, {i18n, propsData: {numItems: 97, page: 4, pageSize: 15}})
    const $navigation = $wrapper.find('.list-pagination__navigation')[0]
    $navigation.find('* > .list-pagination__navigationPages > a')[2].simulate('click')
    updateNow($wrapper)
    expectValues($wrapper, {numItems: 97, currentPage: 3, numPages: 7})

    $navigation.find('* > .list-pagination__navigationPages > a')[1].simulate('click')
    updateNow($wrapper)
    expectValues($wrapper, {numItems: 97, currentPage: 2, numPages: 7})

    $navigation.find('* > .list-pagination__navigationPages > a')[0].simulate('click')
    updateNow($wrapper)
    expectValues($wrapper, {numItems: 97, currentPage: 1, numPages: 7})
  })

  it('updates to new page property', () => {
    const $wrapper = mount(Pagination, {i18n, propsData: {numItems: 97, page: 4, pageSize: 15}})
    expectValues($wrapper, {numItems: 97, currentPage: 4, numPages: 7})

    setProperty($wrapper, 'page', 2)
    updateNow($wrapper)

    expectValues($wrapper, {numItems: 97, currentPage: 2, numPages: 7})
  })

  it('does not update to invalid page property', () => {
    const $wrapper = mount(Pagination, {i18n, propsData: {numItems: 65, page: 2, pageSize: 15}})
    expectValues($wrapper, {numItems: 65, currentPage: 2, numPages: 5})

    setProperty($wrapper, 'page', 18)
    updateNow($wrapper)

    expectValues($wrapper, {numItems: 65, currentPage: 1, numPages: 5})
  })

  it('updates to new numItems property', () => {
    const $wrapper = mount(Pagination, {i18n, propsData: {numItems: 97, page: 4, pageSize: 15}})
    expectValues($wrapper, {numItems: 97, currentPage: 4, numPages: 7})

    setProperty($wrapper, 'numItems', 70)
    updateNow($wrapper)

    expectValues($wrapper, {numItems: 70, currentPage: 4, numPages: 5})
  })

  it('does not update to invalid numItems property', () => {
    const $wrapper = mount(Pagination, {i18n, propsData: {numItems: 97, page: 4, pageSize: 15}})
    expectValues($wrapper, {numItems: 97, currentPage: 4, numPages: 7})

    setProperty($wrapper, 'numItems', 'abc')
    updateNow($wrapper)

    expectValues($wrapper, {numItems: 0, currentPage: 1, numPages: 0})
  })

  it('updates to new pageSize property', () => {
    const $wrapper = mount(Pagination, {i18n, propsData: {numItems: 97, page: 4, pageSize: 15}})
    expectValues($wrapper, {numItems: 97, currentPage: 4, numPages: 7})

    setProperty($wrapper, 'pageSize', 30)
    updateNow($wrapper)

    expectValues($wrapper, {numItems: 97, currentPage: 4, numPages: 4})
  })

  it('does not update to invalid pageSize property', () => {
    const $wrapper = mount(Pagination, {i18n, propsData: {numItems: 97, page: 4, pageSize: 15}})
    expectValues($wrapper, {numItems: 97, currentPage: 4, numPages: 7})

    setProperty($wrapper, 'pageSize', 'abc')
    updateNow($wrapper)

    expectValues($wrapper, {numItems: 97, currentPage: 1, numPages: 7})
  })

  it('hides next button on last page', () => {
    const $wrapper = mount(Pagination, {i18n, propsData: {numItems: 30, page: 1, pageSize: 15}})
    let $nextButton = $wrapper.find('.list-pagination--arrowButton i')[0]

    expect($nextButton.text()).to.equal('navigate_next')

    setProperty($wrapper, 'page', 2)
    updateNow($wrapper)
    $nextButton = $wrapper.find('.list-pagination--arrowButton i')[0]
    expect($nextButton).not.to.equal('navigate_next')
  })

  it('hides previous button on first page', () => {
    const $wrapper = mount(Pagination, {i18n, propsData: {numItems: 60, page: 2, pageSize: 15}})
    let numberOfButtons = $wrapper.find('.list-pagination--arrowButton i').length
    expect(numberOfButtons).to.equal(2)

    setProperty($wrapper, 'page', 1)
    updateNow($wrapper)
    numberOfButtons = $wrapper.find('.list-pagination--arrowButton i').length
    expect(numberOfButtons).to.equal(1)
  })

  it('dispatchs event on pagesize change', () => {
    const $wrapper = mount(Pagination, {i18n, propsData: {numItems: 97, page: 4, pageSize: 15}})

    const listener = sinon.spy()
    $wrapper.vm.$on('changed', listener)

    const $select = $wrapper.find('.list-pagination__pagesizeSelect')[0]
    $select.element.value = '30'
    $select.simulate('change')
    updateNow($wrapper)

    const {page, pageSize} = listener.lastCall.args[0]
    expect(pageSize).to.equal(30)
    expect(page).to.equal(1)
  })
})
