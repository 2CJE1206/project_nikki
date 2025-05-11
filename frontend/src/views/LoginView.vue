<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="bg-white p-8 rounded shadow max-w-md w-full">
        <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">ログイン</h2>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ユーザーID</label>
            <input
              v-model="username"
              type="text"
              required
              class="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
            <input
              v-model="password"
              type="password"
              required
              class="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            ログイン
          </button>
          <p v-if="error" class="text-red-500 text-sm text-center mt-2">{{ error }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'

  const baseURL = process.env.VUE_APP_API_URL;
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        error: ''
      }
    },
    methods: {
      async handleLogin() {
        try {
          const res = await axios.post(`${baseURL}/api/auth/login`, {
            username: this.username,
            password: this.password
          })
          localStorage.setItem('token', res.data.token)
          window.dispatchEvent(new Event('login-success'));
          this.$router.push('/dashboard')
        } catch (err) {
          this.error = err.response?.data?.error || 'ログインに失敗しました'
        }
      }
    }
  }
  </script>
  