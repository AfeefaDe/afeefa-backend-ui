<template>
  <div class="row" v-if="user">
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">{{ user.name }}</h2>
        </div>
        <div>
          <form @submit.prevent="save" class="entryForm" novalidate>

            <input-field
              field-name="first_name"
              v-model="user.first_name"
              validate="required|max:20"
              :label="$t('usersettings.first_name')">
            </input-field>

            <input-field
              field-name="last_name"
              v-model="user.last_name"
              validate="required|max:20"
              :label="$t('usersettings.last_name')">
            </input-field>

            <input-field
              field-name="organization"
              v-model="user.organization"
              validate="required|max:20"
              :label="$t('usersettings.organization')">
            </input-field>

            <h2>Passwort ändern (optional)</h2>

            Um das Passwort zu ändern, bitte beide Felder ausfüllen. Andernfalls einfach leer lassen.

            <input-field
              field-name="password"
              type="password"
              v-model="user.password"
              validate="min:8|max:40"
              label="Neues Passwort">
            </input-field>

            <input-field
              field-name="password_confirm"
              type="password"
              v-model="passwordConfirm"
              validate="password-confirm:#password"
              label="Passwortbestätigung">
            </input-field>

            <section class="entryForm__actionFooter">
              <button class="btn waves-effect waves-light saveButton" type="submit">
                <i class="material-icons left">done</i>
                Speichern
              </button>
            </section>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import InputField from '@/components/InputField'
import Users from '@/resources/Users'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'

export default {
  mixins: [BeforeRouteLeaveMixin],

  data () {
    return {
      userOrig: null,
      user: null,
      passwordConfirm: null
    }
  },

  created () {
    this.initCurrentUser()
  },

  watch: {
    // hack to trigger pw_confirm validation on each pw change
    // pw_confirm validation get triggered by vee-validate only if set to required
    // and we do not require pw_confirm if no pw is typed
    'user.password' () {
      const passwordConfirmField = this.$validator.fields.find({name: 'password_confirm'})
      passwordConfirmField.rules.required = !!this.user.password
      this.$validator.validate('password_confirm', this.passwordConfirm)
    }
  },

  methods: {
    initCurrentUser () {
      this.userOrig = Users.getCurrentUser()
      this.user = this.userOrig.clone()
    },

    $canLeaveRoute () {
      const hashOrig = JSON.stringify(this.userOrig.serialize())
      const hashItem = JSON.stringify(this.user.serialize())
      if (hashOrig === hashItem) {
        return true
      }
      return 'Soll das Ändern des Nutzers beendet werden?'
    },

    save () {
      this.$validator.setLocale(this.$i18n.locale)

      this.$validator.validateAll().then(result => {
        if (!result) {
          const errorBag = this.$validator.errors
          let errorString = '\n\n'
          for (let error of errorBag.items) {
            errorString += error.msg + '\n'
          }
          this.$store.dispatch('messages/showAlert', {
            isError: true,
            autoHide: false,
            description: 'Es sind leider noch Fehler im Formular!' + errorString
          })
          return
        }

        Users.save(this.user).then(() => {
          const pwChanged = this.passwordConfirm ? 'und das Passwort ' : ''
          this.$store.dispatch('messages/showAlert', {
            description: `Die Nutzerdaten ${pwChanged}wurden geändert.`
          })
          this.initCurrentUser()
          this.passwordConfirm = null
        })
      })
    }
  },

  components: {
    InputField
  }
}
</script>


<style scoped>
</style>
