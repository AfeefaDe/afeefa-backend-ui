<script>
/**
 * The mixin provides all necessary functions to load,
 * validate and save entries.
 */
import RouteConfigAwareMixin from '@/components/mixins/RouteConfigAwareMixin'
import Orga from '@/models/Orga'
import User from '@/models/User'
import sortByTitle from '@/helpers/sort-by-title'
import LoadingStrategy from '@/store/api/LoadingStrategy'

export default {
  mixins: [RouteConfigAwareMixin],

  data () {
    return {
      origItem: null,
      item: null,
      orgas: [],
      currentUser: null,
      hasItemLoadingError: false
    }
  },

  created () {
    this.Resource.get(this.id, null, null, {
      'fetchParentOrga': LoadingStrategy.LOAD_IF_NOT_FULLY_LOADED
    }).then(entry => {
      if (entry) {
        this.origItem = entry
        this.item = entry.clone()
        Orga.getAll().then(orgas => {
          this.orgas = sortByTitle(orgas)
        })
      } else {
        console.log('error loading item')
        this.hasItemLoadingError = true
      }
    })

    this.currentUser = User.getCurrentUser()
  },

  methods: {
    /*
     * called by the BeforeRouteLeaveMixin
     * to raise a alert in case of unsaved changes
     */
    $canLeaveRoute () {
      if (!this.item) { // loading error
        return true
      }
      const hashOrig = JSON.stringify(this.origItem.serialize())
      const hashItem = JSON.stringify(this.item.serialize())

      if (hashOrig === hashItem) {
        return true
      }
      return 'Soll das Editieren beendet werden?'
    },

    validateCustomFields (validationErrors) {
      // validate and add results to the errors list
    },

    save () {
      this.$validator.setLocale(this.$i18n.locale)

      this.$validator.validateAll().then(result => {
        let validationErrors = []
        if (!result) {
          validationErrors = this.$validator.errors.items
        }
        this.validateCustomFields(validationErrors)

        // prepare errorString from all validationErrors
        let errorString = '\n\n'
        for (let validationError of validationErrors) {
          errorString += validationError.msg + '\n'
        }

        // at least one error occured during the validation
        if (validationErrors.length) {
          this.$store.dispatch('messages/showAlert', {
            isError: true,
            autoHide: false,
            description: 'Es sind leider noch Fehler im Formular!' + errorString
          })
        } else {
          // actual save routine on the resource
          this.Resource.save(this.item).then(entry => {
            if (entry) {
              this.$store.dispatch('messages/showAlert', {
                description: this.origItem.id ? this.messages.saveItemSuccess() : this.messages.addItemSuccess()
              })
              this.origItem = this.item // prevent route leave dialog after save
              this.$router.push({name: this.routeName + '.show', params: {id: this.item.id}, query: {tab: this.currentTab}})
            }
          })
        }
      })
    },

    remove () {
      this.$store.dispatch('messages/showDialog', {
        title: this.messages.deleteItemDialogTitle(),
        message: this.messages.deleteItemDialogMessage(this.item)
      }).then(result => {
        if (result === 'yes') {
          this.Resource.delete(this.item).then(result => {
            if (result) {
              this.$store.dispatch('messages/showAlert', {
                description: this.messages.deleteItemSuccess()
              })
              this.origItem = this.item // prevent route leave dialog after save
              this.$router.push({name: this.routeName + '.list'})
            }
          })
        }
      })
    }
  }
}
</script>
