<template>
  <div class="login">
    <div class="row">
      <div class="col s12 m12 l4 push-l4">
          <img class="login__logo" src="../../assets/images/afeefa_light.svg" alt="Afeefa Logo with white background">
          <div class="mainCard">
            <div class="mainCard__header">
              <h2 class="mainCard__headerTitle">Login</h2>
            </div>
            <div>
              <form @submit.prevent="submitLoginForm">
                <div class="input-field">
                  <input type="email" v-model="email" id="email" class="validate" required="required">
                  <label for="email">E-Mail</label>
                </div>
                <div class="input-field">
                  <input type="password" v-model="password" id="password" class="validate" required="required">
                  <label for="password">Passwort</label>
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
      password: ''
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
  &__logo {
    height: 40vh;
    display: block;
    margin: 3em auto;
  }
  &__submit {
    display: block;
    margin: 0 auto;
  }
}
</style>
