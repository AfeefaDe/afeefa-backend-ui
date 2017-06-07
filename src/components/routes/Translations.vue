<template>
  <div class="row">
    <div class="col s12 m12">
      <div class="mainCard">
        <div class="mainCard__header">
          <h2 class="mainCard__headerTitle">{{ $t('headlines.translations') }}</h2>
        </div>
        <div>
          <p v-if="lastRefresh">Letzte Auslösung: {{lastRefresh | formatDateAbsolute}}</p>
          <form @submit.prevent="syncTranslations">
            <button class="btn waves-effect waves-light" type="submit">Übersetzungen auslösen</button>
          </form>
        </div>
        <div>
          <p v-if="loading">
            <spinner :show="true" :width="1" :radius="5" :length="3" /> Löse Übersetzungen aus
          </p>
          <div v-else-if="loaded">
            Die Übersetzungen wurden erfolgreich ausgelöst:<br>
            <b>{{responseMessage}}</b>
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
      loading: false,
      responseMessage: '',
      lastRefresh: null,
      url: BASE + 'translations'
    }
  },

  created () {
    let request = Vue.http.get(this.url, {token: 'MapCat_050615'})
    request.then(result => {
      if (result.body.updated_at) {
        const date = new Date(result.body.updated_at)
        this.lastRefresh = date
      }
    }).catch(error => {
      console.log('sync translations error', error)
    })
  },

  methods: {
    syncTranslations () {
      this.loading = true
      this.loaded = false
      this.error = false
      let request = Vue.http.post(this.url, {token: 'MapCat_050615'})
      request.then(result => {
        if (result.body.msg) {
          this.responseMessage = result.body.msg
        }
        this.loading = false
        this.loaded = true
      }).catch(error => {
        this.loading = false
        this.error = true
        console.log('sync translations error', error)
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
