<template>
  <afeefa-page>

    <afeefa-header slot="header">
      <div slot="title">{{ user.name }}</div>
    </afeefa-header>

    <div slot="content" v-if="user">
      <form @submit.prevent="save" class="entryForm" novalidate>

        <input-field
          field-name="first_name"
          v-model="user.first_name"
          validate="required|max:20"
          :label="$t('usersettings.first_name')">
        </input-field>

        <input-field
          class="formElement marginTop"
          field-name="last_name"
          v-model="user.last_name"
          validate="required|max:20"
          :label="$t('usersettings.last_name')">
        </input-field>

        <input-field
          class="formElement marginTop"
          field-name="organization"
          v-model="user.organization"
          validate="required|max:20"
          :label="$t('usersettings.organization')">
        </input-field>

        <h2>Passwort ändern (optional)</h2>

        Um das Passwort zu ändern, bitte beide Felder ausfüllen.<br>
        Andernfalls einfach leer lassen.

        <input-field
          class="formElement marginTop"
          field-name="password"
          type="password"
          v-model="user.password"
          validate="min:8|max:40"
          label="Neues Passwort">
        </input-field>

        <input-field
          class="passwordConfirm"
          field-name="password_confirm"
          type="password"
          v-model="passwordConfirm"
          validate="password-confirm:#password"
          label="Passwortbestätigung">
        </input-field>

        <entry-edit-footer
          :item="user"
          :hasCancel="false"
          :hasRemove="false"
          @save="save" />
      </form>
    </div>

  </afeefa-page>
</template>


<script>
import User from '@/models/User'
import BeforeRouteLeaveMixin from '@/components/mixins/BeforeRouteLeaveMixin'
import EntryEditFooter from '@/components/entry/edit/EntryEditFooter'

export default {
  mixins: [BeforeRouteLeaveMixin],

  data () {
    return {
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
      this.user = User.Query.getCurrentUser().clone()
    },

    $canLeaveRoute () {
      if (this.user && this.user.hasChanges()) {
        return 'Soll das Ändern des Nutzers beendet werden?'
      }
      return true
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

        User.Query.save(this.user).then(() => {
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
    EntryEditFooter
  }
}
</script>


<style scoped>
.passwordConfirm {
  margin-top: .5em;
}

.formElement.marginTop {
  margin-top: 1em;
}

* /deep/ input {
  width: 300px;
}
</style>
