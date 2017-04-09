import DatePicker from '@/components/DatePicker'
import avoriaz, { mount } from 'avoriaz'
import { updateNow } from '../../helpers'

import sinon from 'sinon'

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
  const $wrapper = mount(DatePicker, {i18n, propsData})
  // mock date pickers next tick function
  $wrapper.vm.$nextTick = callback => {
    updateNow($wrapper)
    callback()
  }
  return $wrapper
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


  it('removes picker popups on body click', () => {
    const date = new Date()

    const $wrapper = mountPicker({dateStart: date, hasTimeStart: false, dateEnd: date, hasTimeEnd: false})

    const startDatePicker = document.querySelectorAll('body > div.flatpickr-calendar')[0]
    expect(startDatePicker.className).to.not.contain('open')

    $wrapper.find('.showDate-button')[0].simulate('click')
    updateNow($wrapper)
    expect(startDatePicker.className).to.contain('open')

    var event = new Event('click', {'bubbles': true})
    document.querySelector('body').dispatchEvent(event)
    updateNow($wrapper)

    expect(startDatePicker.className).to.not.contain('open')
  })


  const datesSame = (date1, date2) => {
    return date1.toString() === date2.toString()
  }

  const openStartDate = ($wrapper) => {
    $wrapper.find('.showDate-button')[0].simulate('click')
  }

  const openEndDate = ($wrapper) => {
    $wrapper.find('.showDate-button')[1].simulate('click')
  }

  const createOrRemoveStartTime = ($wrapper) => {
    const $button = $wrapper.find('.showTime-button')[0]
    $button.simulate('click')
  }

  const createOrRemoveEndTime = ($wrapper) => {
    const $button = $wrapper.find('.showTime-button')[1]
    $button.simulate('click')
  }

  const close = ($wrapper) => {
    var event = new Event('click', {'bubbles': true})
    document.querySelector('body').dispatchEvent(event)
  }

  it('dispatchs change on close', () => {
    const checkEventData = () => {
      let [dateStart, dateEnd, hasTimeStart, hasTimeEnd] = listener.getCall(0).args
      expect(datesSame(dateStart, mDate.startOf('day').toDate())).to.be.true
      expect(datesSame(dateEnd, mDate.startOf('day').toDate())).to.be.true
      expect(hasTimeStart).to.be.false
      expect(hasTimeEnd).to.be.false
    }

    const mDate = moment('2013-02-08 09:30:26')

    const date = mDate.toDate()
    const $wrapper = mountPicker({dateStart: date, hasTimeStart: false, dateEnd: date, hasTimeEnd: false})

    const listener = sinon.spy()
    $wrapper.vm.$on('update', listener)

    close($wrapper)
    listener.should.not.have.been.called

    openStartDate($wrapper)
    close($wrapper)
    listener.should.have.been.calledOnce
    checkEventData()

    createOrRemoveStartTime($wrapper)
    close($wrapper)
    listener.should.have.been.calledTwice
    checkEventData()

    close($wrapper)
    listener.should.have.been.calledTwice

    openEndDate($wrapper)
    close($wrapper)
    listener.should.have.been.calledThrice
    checkEventData()

    createOrRemoveEndTime($wrapper)
    close($wrapper)
    listener.should.have.callCount(4)
    checkEventData()

    close($wrapper)
    listener.should.have.callCount(4)
  })


  const clickDay = day => {
    const days = document.querySelectorAll('.flatpickr-day')
    const dayButton = [...days].filter(element => element.innerText === '' + day)[0]
    var event = new Event('click', {'bubbles': true})
    dayButton.dispatchEvent(event)
  }


  const addCurrentTime = mDate => {
    const time = moment()
    mDate.hours(time.hours())
    mDate.minutes(time.minutes() - time.minutes() % 5)
    return mDate
  }


  it('updates to the selected dates and times', () => {
    const checkEventData = () => {
      let [dateStart, dateEnd, hasTimeStart, hasTimeEnd] = listener.lastCall.args
      expect(dateStart.toString()).to.equal(expectedDateStart.toString())
      expect(dateEnd.toString()).to.equal(expectedDateEnd.toString())
      expect(hasTimeStart).to.equal(expectedHasTimeStart)
      expect(hasTimeEnd).to.equal(expectedHasTimeEnd)
    }

    const mDateStart = moment('2013-02-08 09:30:26')
    const mDateEnd = moment('2013-02-09 17:11:51')
    const $wrapper = mountPicker({
      dateStart: mDateStart.toDate(),
      hasTimeStart: false,
      dateEnd: mDateEnd.toDate(),
      hasTimeEnd: false
    })

    const listener = sinon.spy()
    $wrapper.vm.$on('update', listener)

    let expectedDateStart = mDateStart.startOf('day').toDate()
    let expectedDateEnd = mDateEnd.startOf('day').toDate()
    let expectedHasTimeStart = false
    let expectedHasTimeEnd = false

    openStartDate($wrapper)
    close($wrapper)
    checkEventData()

    openStartDate($wrapper)
    clickDay(15)
    expectedDateStart = moment('2013-02-15').toDate()
    checkEventData()

    createOrRemoveStartTime($wrapper)
    close($wrapper)
    expectedDateStart = addCurrentTime(moment('2013-02-15')).toDate()
    expectedHasTimeStart = true
    checkEventData()

    openEndDate($wrapper)
    clickDay(24)
    expectedDateEnd = moment('2013-02-24').toDate()
    checkEventData()

    createOrRemoveEndTime($wrapper)
    close($wrapper)
    expectedDateEnd = addCurrentTime(moment('2013-02-24')).toDate()
    expectedHasTimeEnd = true
    checkEventData()
  })


  it('shows same day label if start and end day are equal', () => {
    const checkDateEndLabel = sameDay => {
      const $endDateInput = $wrapper.find('input#endDate')[0]
      const $sameDayLabel = $wrapper.find('.is-same-day-label')[0]
      if (sameDay) {
        expect($endDateInput.hasClass('hide-picker')).to.be.true
        expect($sameDayLabel.hasClass('hide-span')).to.be.false
      } else {
        expect($endDateInput.hasClass('hide-picker')).to.be.false
        expect($sameDayLabel.hasClass('hide-span')).to.be.true
      }
    }

    const mDateStart = moment('2013-02-08 09:30:26')
    const mDateEnd = moment('2013-02-09 17:11:51')
    const $wrapper = mountPicker({
      dateStart: mDateStart.toDate(),
      hasTimeStart: false,
      dateEnd: mDateEnd.toDate(),
      hasTimeEnd: false
    })

    const listener = sinon.spy()
    $wrapper.vm.$on('update', listener)

    // initial
    checkDateEndLabel(false)

    // change start to some day != end
    openStartDate($wrapper)
    clickDay(15)
    updateNow($wrapper)
    checkDateEndLabel(false)

    // change start to end
    openStartDate($wrapper)
    clickDay(9)
    updateNow($wrapper)
    checkDateEndLabel(true)

    // change start to some day != end
    openStartDate($wrapper)
    clickDay(10)
    updateNow($wrapper)
    checkDateEndLabel(true)

    // change end to start
    openEndDate($wrapper)
    clickDay(10)
    updateNow($wrapper)
    checkDateEndLabel(true)

    // change end to some day != start
    openEndDate($wrapper)
    clickDay(19)
    updateNow($wrapper)
    checkDateEndLabel(false)

    // change end to start
    openEndDate($wrapper)
    clickDay(10)
    updateNow($wrapper)
    checkDateEndLabel(true)
  })


  it('sets and removes time information on time button click', () => {
    const checkEventData = () => {
      let [dateStart, dateEnd, hasTimeStart, hasTimeEnd] = listener.lastCall.args
      expect(dateStart.toString()).to.equal(expectedDateStart.toString())
      expect(dateEnd.toString()).to.equal(expectedDateEnd.toString())
      expect(hasTimeStart).to.equal(expectedHasTimeStart)
      expect(hasTimeEnd).to.equal(expectedHasTimeEnd)
    }

    const mDateStart = moment('2013-02-08 09:30:26')
    const mDateEnd = moment('2013-02-09 17:11:51')
    const $wrapper = mountPicker({
      dateStart: mDateStart.toDate(),
      hasTimeStart: false,
      dateEnd: mDateEnd.toDate(),
      hasTimeEnd: false
    })

    const listener = sinon.spy()
    $wrapper.vm.$on('update', listener)

    let expectedDateStart = mDateStart.startOf('day').toDate()
    let expectedDateEnd = mDateEnd.startOf('day').toDate()
    let expectedHasTimeStart = false
    let expectedHasTimeEnd = false

    let $button = $wrapper.find('.showTime-button')[0]
    $button.simulate('click')
    expectedDateStart = addCurrentTime(moment('2013-02-08')).toDate()
    expectedHasTimeStart = true
    checkEventData()

    $button.simulate('click')
    expectedDateStart = moment('2013-02-08').toDate()
    expectedHasTimeStart = false
    checkEventData()

    $button = $wrapper.find('.showTime-button')[1]
    $button.simulate('click')
    expectedDateEnd = addCurrentTime(moment('2013-02-09')).toDate()
    expectedHasTimeEnd = true
    checkEventData()

    $button.simulate('click')
    expectedDateEnd = moment('2013-02-09').toDate()
    expectedHasTimeEnd = false
    checkEventData()
  })


  const setTime = (hour, minute) => {
    const hourInput = document.querySelector('.flatpickr-hour')
    hourInput.value = hour
    const minuteInput = document.querySelector('.flatpickr-minute')
    minuteInput.value = minute

    const closeButton = document.querySelector('.flatpickr-time > div > button')
    var event = new Event('click', {'bubbles': true})
    closeButton.dispatchEvent(event)
  }


  it('sets time appropriately', () => {
    const checkEventData = () => {
      let [dateStart, dateEnd, hasTimeStart, hasTimeEnd] = listener.lastCall.args
      expect(dateStart.toString()).to.equal(expectedDateStart.toString())
      expect(dateEnd.toString()).to.equal(expectedDateEnd.toString())
      expect(hasTimeStart).to.equal(expectedHasTimeStart)
      expect(hasTimeEnd).to.equal(expectedHasTimeEnd)
    }

    const mDateStart = moment('2013-02-08 09:30:26')
    const mDateEnd = moment('2013-02-09 17:11:51')
    const $wrapper = mountPicker({
      dateStart: mDateStart.toDate(),
      hasTimeStart: false,
      dateEnd: mDateEnd.toDate(),
      hasTimeEnd: false
    })

    const listener = sinon.spy()
    $wrapper.vm.$on('update', listener)

    let expectedDateStart = mDateStart.startOf('day').toDate()
    let expectedDateEnd = mDateEnd.startOf('day').toDate()
    let expectedHasTimeStart = false
    let expectedHasTimeEnd = false

    // start time

    createOrRemoveStartTime($wrapper)
    setTime(10, 15)
    expectedDateStart = addCurrentTime(moment('2013-02-08 10:15')).toDate()
    expectedHasTimeStart = true
    checkEventData()

    setTime(20, 1)
    expectedDateStart = addCurrentTime(moment('2013-02-08 20:01')).toDate()
    expectedHasTimeStart = true
    checkEventData()

    createOrRemoveStartTime($wrapper)
    expectedDateStart = moment('2013-02-08').toDate()
    expectedHasTimeStart = false
    checkEventData()

    // end time

    createOrRemoveEndTime($wrapper)
    setTime(7, 37)
    expectedDateEnd = addCurrentTime(moment('2013-02-09 07:37')).toDate()
    expectedHasTimeEnd = true
    checkEventData()

    setTime(20, 1)
    expectedDateEnd = addCurrentTime(moment('2013-02-09 20:01')).toDate()
    expectedHasTimeEnd = true
    checkEventData()

    createOrRemoveEndTime($wrapper)
    expectedDateEnd = moment('2013-02-09').toDate()
    expectedHasTimeEnd = false
    checkEventData()
  })
})
