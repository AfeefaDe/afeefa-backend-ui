<template>
  <div class="login">
    <div class="row">
      <div class="col s12 m6 l3 push-m3">
          <img class="login__logo" src="../../assets/images/afeefa_light.svg" alt="Afeefa Logo with white background">
          <div class="mainCard">
            <afeefa-header class="small">
              <span slot="title">Login</span>
            </afeefa-header>

            <div>
              <form @submit.prevent="submitLoginForm">
                <div>
                  <label for="email">E-Mail</label>
                  <input type="email" v-model="email" id="email" class="validate browser-default" required="required">
                </div>
                <div class="formElement marginTop">
                  <label for="password">Passwort</label>
                  <input type="password" v-model="password" id="password" class="validate browser-default" required="required">
                </div>
                <div class="submit-btn-container">
                  <button class="login__submit btn waves-effect waves-light z-depth-1" type="submit">Login
                    <i class="material-icons left">lock</i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>


<script>
export default {
  data () {
    return {
      email: '',
      password: '',
      loading: false
    }
  },
  methods: {
    submitLoginForm: function () {
      var loginData = {email: this.email, password: this.password}
      this.$store.dispatch('auth/login', loginData)
    }
  }
}
</script>


<style lang="scss" scoped>
.login {
  @media only screen and (min-width: 993px) {
    .col.l3 {
      margin-left: calc(75% / 2);
    }
  }
  .formElement.marginTop {
    margin-top: 1em;
  }
  &__logo {
    height: 40vh;
    display: block;
    margin: 3em auto;
  }
  &__submit {
    display: block;
    margin: 1.5em auto 0;
  }
}
</style>
