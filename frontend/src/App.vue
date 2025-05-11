<template>
  <div id="app" class="min-h-screen bg-gray-50 text-gray-800">
    <header class="bg-white shadow">
      <div class="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-blue-600">Nikki App</h1>
        <nav class="p-4 bg-gray-100 flex justify-center space-x-4">
      <template v-if="isLoggedIn">
        <router-link to="/dashboard">ダッシュボード</router-link>
        <button @click="logout" class="text-red-600">ログアウト</button>
      </template>
      <template v-else>
        <router-link to="/login">ログイン</router-link>
        <router-link to="/register">登録</router-link>
      </template>
    </nav>
      </div>
    </header>

    <main class="max-w-5xl mx-auto p-4">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: !!localStorage.getItem('token')
    };
  },
  created() {
    window.addEventListener('login-success', () => {
      this.isLoggedIn = true;
    });
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.$router.push('/login');
    }
  }
}
</script>

