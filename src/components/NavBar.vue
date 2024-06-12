<template>
  <nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
    <router-link class="navbar-brand" to="/">
      my travel assistant
    </router-link>

    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon" />
    </button>

    <div id="navbarSupportedContent" class="navbar-collapse collapse">
      <div class="ml-auto d-flex align-items-center">
        <template v-if="isAuthenticated && user">
          <router-link to="#" class="text-white mr-3">
            {{ user.name }} 您好
          </router-link>
          <button type="button" class="btn btn-sm btn-outline-success my-2 my-sm-0" @click="handleLogout">
            登出
          </button>
        </template>
        <template v-else>
          <router-link to="/signin" class="btn btn-sm btn-outline-success my-2 my-sm-0">
            登入
          </router-link>
          <router-link to="/signup" class="btn btn-sm btn-outline-primary my-2 my-sm-0 ml-2">
            註冊
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['isAuthenticated', 'user'])
  },
  methods: {
    ...mapActions(['logout']),
    handleLogout () {
      this.logout()
      this.$router.push('/signin')
    }
  }
}
</script>
