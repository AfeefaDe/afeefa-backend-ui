<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">{{ $t('headlines.translations') }}</h2>
        </div>
        <div>
          <form @submit.prevent="syncTranslations">
            <button class="btn waves-effect waves-light" type="submit">Übersetzungen auslösen</button>
          </form>
        </div>
        <div>
          <p v-if="loading">
            <spinner :show="true" :width="1" :radius="5" :length="3" /> Löse Übersetzungen aus
          </p>
          <div v-else-if="loaded">
            Die Übersetzungen wurden erfolgreich ausgelöst.
          </div>
          <div v-else-if="error">
            Die Übersetzungen konnten leider nicht ausgelöst werden.
          </div>
          <div v-else>
            Um die Übersetzungen auszulösen bitte den Button "Übersetzungen auslösen" klicken.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Vue from 'vue'
import { BASE } from '@/store/api'
import Spinner from '@/components/Spinner'


export default {
  data () {
    return {
      loaded: false,
      error: false,
      loading: false
    }
  },

  methods: {
    syncTranslations () {
      let url = BASE + 'translations'
      this.loading = true
      this.loaded = false
      this.error = false
      let request = Vue.http.post(url, {token: 'MapCat_050615'})
      request.then(result => {
        this.loading = false
        this.loaded = true
      }).catch(e => {
        this.loading = false
        this.error = true
        console.log('sync translations error', e)
      })
    }
  },

  components: {
    Spinner
  }
}
</script>


<style scoped>
  form {
    margin-top: 10px;
  }
</style>
