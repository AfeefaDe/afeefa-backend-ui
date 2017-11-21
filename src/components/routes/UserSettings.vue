<template>
  <div class="row" v-if="user">
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">{{ user.name }}</h2>
        </div>
        <div>
          <form @submit.prevent="save" class="entryForm" novalidate>
            <div class="inputField__spacing input-field">
              <label for="first_name" :class="{active: user.first_name}">
                {{ $t('usersettings.first_name') }}
              </label>
              <input v-model="user.first_name" id="first_name" type="text"
                name="first_name" :data-vv-as="$t('usersettings.first_name')" v-validate.initial="'required|max: 150'"
                :class="{'validation-error': errors.has('first_name') }"/>
              <span v-show="errors.has('first_name')" class="validation-error">{{ errors.first('first_name') }}</span>
            </div>

            <div class="inputField__spacing input-field">
              <label for="last_name" :class="{active: user.last_name}">
                {{ $t('usersettings.last_name') }}
              </label>
              <input v-model="user.last_name" id="last_name" type="text"
                name="last_name" :data-vv-as="$t('usersettings.last_name')" v-validate.initial="'required|max: 150'"
                :class="{'validation-error': errors.has('last_name') }"/>
              <span v-show="errors.has('last_name')" class="validation-error">{{ errors.first('last_name') }}</span>
            </div>

            <div class="inputField__spacing input-field">
              <label for="organization" :class="{active: user.organization}">
                {{ $t('usersettings.organization') }}
              </label>
              <input v-model="user.organization" id="organization" type="text"
                name="organization" :data-vv-as="$t('usersettings.organization')" v-validate.initial="'required|max: 150'"
                :class="{'validation-error': errors.has('organization') }"/>
              <span v-show="errors.has('organization')" class="validation-error">{{ errors.first('organization') }}</span>
            </div>

            <section class="entryForm__actionFooter">
              <button v-bind:class="[{disabled: currentlySaving}, 'btn', 'waves-effect', 'waves-light', 'saveButton']" type="submit">
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
import Users from '@/resources/Users'

export default {
  data () {
    return {
      userOrig: null,
      user: null,
      currentlySaving: false
    }
  },

  beforeRouteLeave (to, from, next) {
    const hashOrig = JSON.stringify(this.userOrig.serialize())
    const hashItem = JSON.stringify(this.user.serialize())
    if (hashOrig === hashItem) {
      next()
      return
    }
    this.$store.dispatch('messages/showDialog', {
      title: 'Abbrechen?',
      message: 'Soll das Ändern des Nutzers beendet werden?'
    }).then(result => {
      if (result === 'yes') {
        next()
      }
    })
  },

  created () {
    this.initCurrentUser()
  },
  methods: {
    initCurrentUser () {
      this.userOrig = Users.getCurrentUser()
      this.user = this.userOrig.clone()
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

        this.currentlySaving = true
        Users.save(this.user).then(() => {
          this.initCurrentUser()
          this.$store.dispatch('messages/showAlert', {
            description: 'Die Nutzerdaten wurden geändert.'
          })
        }).finally(() => {
          this.currentlySaving = false
        })
      })
    }
  }
}
</script>


<style scoped>
</style>
