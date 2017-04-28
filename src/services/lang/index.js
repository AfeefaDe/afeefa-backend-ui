import Vue from 'vue'
import VueI18n from 'vue-i18n'
import de from './de'
import en from './en'
import test from './test'

Vue.use(VueI18n)

export default new VueI18n({
  locale: 'de', // set locale
  fallbackLocale: 'de',
  messages: {
    de,
    en,
    test
  }
})
