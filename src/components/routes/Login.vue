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
      <transition name="fade">
        <div v-if="loading" class="loadingOverlay">
          <div>
            <div class="spinner"></div>
            <p>{{$t('messages.loading')}}</p>
          </div>
        </div>
      </transition>
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
      this.loading = true
      this.$store.dispatch('auth/login', loginData).then(() => {
        this.loading = false
      })
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
.loadingOverlay {
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 100;
  background-color: rgba(0,0,0,0.5);
  & > {
    display: block;
    text-align: center;
    margin: 50vh auto;
    color: white;
    font-size: 1.2rem;
    line-height: 200%;
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}

// from http://codepen.io/brunjo/pen/WbrjKw
.spinner {
  margin: 0 auto;
  height: 50px;
  width: 50px;
  animation: rotate 0.8s infinite linear;
  border: 8px solid white;
  border-right-color: transparent;
  border-radius: 50%;
}
@keyframes rotate {
  0%    { transform: rotate(0deg); }
  100%  { transform: rotate(360deg); }
}
</style>
