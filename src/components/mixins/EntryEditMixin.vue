<script>
import User from '@/models/User'

export default {
  data () {
    return {
      item: null,
      routeConfig: null,
      currentUser: null,
      loadingError: false
    }
  },

  created () {
    if (this.id) {
      this.Model.Query.with().get(this.id).then(entry => {
        if (entry) {
          this.item = entry.clone()
        } else {
          this.loadingError = true
        }
      })
    } else {
      this.item = new this.Model().clone()
    }

    this.currentUser = User.Query.getCurrentUser()
  },

  computed: {
    Model () {
      return this.routeConfig.Model
    },

    routeName () {
      return this.routeConfig.routeName
    },

    messages () {
      return this.routeConfig.messages
    }
  },

  methods: {
    /*
     * called by the BeforeRouteLeaveMixin
     * to raise a alert in case of unsaved changes
     */
    $canLeaveRoute () {
      if (this.item && this.item.hasChanges()) {
        return 'Soll das Editieren beendet werden?'
      }
      return true
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
          this.Model.Query.save(this.item).then(entry => {
            if (entry) {
              this.$store.dispatch('messages/showAlert', {
                description: this.item.id ? this.messages.saveItemSuccess() : this.messages.addItemSuccess()
              })
              this.$router.push({name: this.routeName + '.show', params: {id: entry.id}, query: {tab: this.currentTab}})
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
          this.Model.Query.delete(this.item).then(result => {
            if (result) {
              this.$store.dispatch('messages/showAlert', {
                description: this.messages.deleteItemSuccess()
              })
              this.$router.push({name: this.routeName + '.list'})
            }
          })
        }
      })
    }
  }
}
</script>
