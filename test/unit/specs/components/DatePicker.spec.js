import DatePicker from '@/components/DatePicker'
import avoriaz, { mount } from 'avoriaz'
import { updateNow } from '../../helpers'

import VueI18n from 'vue-i18n'
import i18n from '@/services/lang'
import moment from 'moment'

avoriaz.use(VueI18n)
i18n.locale = 'de'


const toRoundedTimeString = moment => {
  const minutes = moment.minutes()
  moment.minutes(minutes - minutes % 5)
  return moment.format('HH:mm')
}

const mountPicker = propsData => {
  return mount(DatePicker, {i18n, propsData})
}


function expectValues ($wrapper, {mStartDate, hasTimeStart, mEndDate, hasTimeEnd}) {
  // start date
  const $startDateInput = $wrapper.find('#startDate')[0]
  if (mStartDate) {
    const date = mStartDate.format('DD.MM.YYYY')
    expect($startDateInput.element.value).to.equal(date)
  } else {
    expect($startDateInput.element.value).to.equal('')
  }

  const $startTimeInput = $wrapper.find('#startTime')[0]
  if (hasTimeStart) {
    const time = toRoundedTimeString(mStartDate)
    expect($startTimeInput.element.value).to.equal(time)
  } else {
    expect($startTimeInput).to.be.undefined
  }

  // end date
  const $endDateInput = $wrapper.find('#endDate')[0]
  if (mEndDate) {
    const date = mEndDate.format('DD.MM.YYYY')
    expect($endDateInput.element.value).to.equal(date)
  } else {
    expect($endDateInput.element.value).to.equal('')
  }

  const $endTimeInput = $wrapper.find('#endTime')[0]
  if (hasTimeEnd) {
    const time = toRoundedTimeString(mEndDate)
    expect($endTimeInput.element.value).to.equal(time)
  } else {
    expect($endTimeInput).to.be.undefined
  }
}


describe('Components - DatePicker', () => {
  afterEach(() => {
    // clear all popups
    document.body.innerHTML = ''
  })

  it('shows sensible initial data', () => {
    const mDate = moment()

    expectValues(
      mountPicker(),
      {mStartDate: mDate, hasTimeStart: false, mEndDate: mDate, hasTimeEnd: false}
    )
    expect(document.querySelectorAll('body > div.flatpickr-calendar').length).to.equal(2)
    expect(document.querySelectorAll('body > div.flatpickr-calendar.hasTime').length).to.equal(0)
  })


  it('shows the date given', () => {
    const date = new Date()
    const mDate = moment(date)
    expectValues(
      mountPicker({dateStart: date, hasTimeStart: true, dateEnd: date, hasTimeEnd: true}),
      {mStartDate: mDate, hasTimeStart: true, mEndDate: mDate, hasTimeEnd: true}
    )
    expect(document.querySelectorAll('body > div.flatpickr-calendar').length).to.equal(4)
    expect(document.querySelectorAll('body > div.flatpickr-calendar.hasTime').length).to.equal(2)

    // clear all popups
    document.body.innerHTML = ''

    const mDateEnd = moment(date).add(7, 'days').add(1, 'months').add(17, 'minutes')
    expectValues(
      mountPicker({dateStart: date, hasTimeStart: true, dateEnd: mDateEnd.toDate(), hasTimeEnd: true}),
      {mStartDate: mDate, hasTimeStart: true, mEndDate: mDateEnd, hasTimeEnd: true}
    )
    expect(document.querySelectorAll('body > div.flatpickr-calendar').length).to.equal(4)
    expect(document.querySelectorAll('body > div.flatpickr-calendar.hasTime').length).to.equal(2)
  })


  it('activates and deactivates time picker on button click', () => {
    const date = new Date()
    const mDate = moment(date)

    const $wrapper = mountPicker({dateStart: date, hasTimeStart: false, dateEnd: date, hasTimeEnd: false})
    expectValues(
      $wrapper,
      {mStartDate: mDate, hasTimeStart: false, mEndDate: mDate, hasTimeEnd: false}
    )

    let $button = $wrapper.find('.showTime-button')[0]
    $button.simulate('click')
    updateNow($wrapper)
    expectValues(
      $wrapper,
      {mStartDate: mDate, hasTimeStart: true, mEndDate: mDate, hasTimeEnd: false}
    )

    $button.simulate('click')
    updateNow($wrapper)
    expectValues(
      $wrapper,
      {mStartDate: mDate, hasTimeStart: false, mEndDate: mDate, hasTimeEnd: false}
    )

    $button = $wrapper.find('.showTime-button')[1]
    $button.simulate('click')
    updateNow($wrapper)
    expectValues(
      $wrapper,
      {mStartDate: mDate, hasTimeStart: false, mEndDate: mDate, hasTimeEnd: true}
    )

    $button.simulate('click')
    updateNow($wrapper)
    expectValues(
      $wrapper,
      {mStartDate: mDate, hasTimeStart: false, mEndDate: mDate, hasTimeEnd: false}
    )
  })


  it('opens and closes date picker on button click', () => {
    const date = new Date()

    const $wrapper = mountPicker({dateStart: date, hasTimeStart: false, dateEnd: date, hasTimeEnd: false})

    const startDatePicker = document.querySelectorAll('body > div.flatpickr-calendar')[0]
    const endDatePicker = document.querySelectorAll('body > div.flatpickr-calendar')[1]

    expect(startDatePicker.className).to.not.contain('open')
    expect(endDatePicker.className).to.not.contain('open')

    $wrapper.find('.showDate-button')[0].simulate('click')
    updateNow($wrapper)

    expect(startDatePicker.className).to.contain('open')
    expect(endDatePicker.className).to.not.contain('open')

    $wrapper.find('.showDate-button')[0].simulate('click')
    updateNow($wrapper)

    expect(startDatePicker.className).to.not.contain('open')
    expect(endDatePicker.className).to.not.contain('open')

    $wrapper.find('.showDate-button')[0].simulate('click')
    updateNow($wrapper)

    expect(startDatePicker.className).to.contain('open')
    expect(endDatePicker.className).to.not.contain('open')
  })


  it('opens date or time picker and closes other instances', () => {
    const date = new Date()

    const $wrapper = mountPicker({dateStart: date, hasTimeStart: true, dateEnd: date, hasTimeEnd: true})

    const startDatePicker = document.querySelectorAll('body > div.flatpickr-calendar')[0]
    const startTimePicker = document.querySelectorAll('body > div.flatpickr-calendar')[1]
    const endDatePicker = document.querySelectorAll('body > div.flatpickr-calendar')[2]
    const endTimePicker = document.querySelectorAll('body > div.flatpickr-calendar')[3]

    expect(startDatePicker.className).to.not.contain('open')
    expect(startTimePicker.className).to.not.contain('open')
    expect(endDatePicker.className).to.not.contain('open')
    expect(endTimePicker.className).to.not.contain('open')

    $wrapper.find('.start-date-field')[0].simulate('click')
    updateNow($wrapper)

    expect(startDatePicker.className).to.contain('open')
    expect(startTimePicker.className).to.not.contain('open')
    expect(endDatePicker.className).to.not.contain('open')
    expect(endTimePicker.className).to.not.contain('open')

    $wrapper.find('.start-time-field')[0].simulate('click')
    updateNow($wrapper)

    expect(startDatePicker.className).to.not.contain('open')
    expect(startTimePicker.className).to.contain('open')
    expect(endDatePicker.className).to.not.contain('open')
    expect(endTimePicker.className).to.not.contain('open')

    $wrapper.find('.end-time-field')[0].simulate('click')
    updateNow($wrapper)

    expect(startDatePicker.className).to.not.contain('open')
    expect(startTimePicker.className).to.not.contain('open')
    expect(endDatePicker.className).to.not.contain('open')
    expect(endTimePicker.className).to.contain('open')

    $wrapper.find('.showDate-button')[0].simulate('click')
    updateNow($wrapper)

    expect(startDatePicker.className).to.contain('open')
    expect(startTimePicker.className).to.not.contain('open')
    expect(endDatePicker.className).to.not.contain('open')
    expect(endTimePicker.className).to.not.contain('open')
  })


  it('removes time picker instances on button click', () => {
    const date = new Date()

    const $wrapper = mountPicker({dateStart: date, hasTimeStart: false, dateEnd: date, hasTimeEnd: false})

    expect(document.querySelectorAll('body > div.flatpickr-calendar').length).to.equal(2)

    let $button = $wrapper.find('.showTime-button')[0]
    $button.simulate('click')
    updateNow($wrapper)
    expect(document.querySelectorAll('body > div.flatpickr-calendar').length).to.equal(3)

    $button.simulate('click')
    updateNow($wrapper)
    expect(document.querySelectorAll('body > div.flatpickr-calendar').length).to.equal(2)

    $button = $wrapper.find('.showTime-button')[1]
    $button.simulate('click')
    updateNow($wrapper)
    expect(document.querySelectorAll('body > div.flatpickr-calendar').length).to.equal(3)

    $button.simulate('click')
    updateNow($wrapper)
    expect(document.querySelectorAll('body > div.flatpickr-calendar').length).to.equal(2)
  })
})
