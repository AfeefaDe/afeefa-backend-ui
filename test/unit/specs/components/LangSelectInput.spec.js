import LangSelectInput from '@/components/LangSelectInput'
import LangResource from '@/helpers/iso_639_languages'
import avoriaz, { mount } from 'avoriaz'

import sinon from 'sinon'

import VueI18n from 'vue-i18n'
import i18n from '@/services/lang'

avoriaz.use(VueI18n)
i18n.locale = 'de'


function mountComponent (props = {}) {
  return mount(LangSelectInput, {i18n, propsData: props})
}


describe('Components - LangSelectInput', () => {
  // @input="updateSpokenLanguages" :entryValue="item.contact.spokenLanguages"
  const langKeyFromResource = LangResource.data

  it('loads the locales from helpers/iso_639_languages', () => {
    const wrapper = mountComponent()
    const componentsKeys = wrapper.instance().possibleLanguages
    expect(langKeyFromResource).to.have.length(componentsKeys.length)
  })

  it('shows all possible locales in the mulitselect component', () => {
    // test depends on the internal classes of the multiselect component
    const wrapper = mountComponent()
    const langOptions = wrapper.find('.multiselect__element')
    expect(langKeyFromResource).to.have.length(langOptions.length)
  })

  it('selects no elements for empty entryValue', () => {
    // item.contact.spokenLanguages is null
    const wrapper = mountComponent({entryValue: null})
    const chosenLanguages = wrapper.instance().chosenLanguages
    expect(chosenLanguages).to.have.length(0)
  })

  it('selects the passed down value(s)', () => {
    const mockedInput = ['de', 'ar'].join(',')
    const mockedData = [LangResource.getLanguageFromCode('de'), LangResource.getLanguageFromCode('ar')]
    const wrapper = mountComponent({entryValue: mockedInput})
    const chosenLanguages = wrapper.instance().chosenLanguages
    // two objects
    expect(chosenLanguages).to.have.length(2)
    // the correct objects from the LangResource
    expect(chosenLanguages).to.have.members(mockedData)
  })

  // @todo
  it('adds the selected language to the entryValue by emitting the input action', done => {
    const wrapper = mountComponent({entryValue: null})
    const listener = sinon.spy()
    wrapper.vm.$on('input', listener)

    wrapper.vm.$el.querySelector('.multiselect').dispatchEvent(new window.Event('focus'))
    wrapper.vm.$nextTick(() => {
      wrapper.find('.multiselect__option')[23].simulate('click')
      listener.should.not.have.been.called
      listener.should.have.been.called
      done()
    })
  })
})
