<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="bg-white p-8 rounded shadow max-w-md w-full">
        <h2 class="text-2xl font-bold text-center text-blue-600 mb-6">ユーザー登録</h2>
  
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- ユーザーID入力 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ユーザーID</label>
            <input
              v-model="username"
              type="text"
              required
              class="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
            <p class="text-sm mt-1" :class="usernameValid ? 'text-green-600' : 'text-red-500'">
              {{ usernameStatus }}
            </p>
          </div>
  
          <!-- パスワード入力 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
            <input
              v-model="password"
              type="password"
              required
              class="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
            <p v-if="password && !isPasswordValid" class="text-red-500 text-sm mt-1">
                パスワードは6文字以上で入力してください
            </p>
          </div>
  
          <!-- 登録ボタン -->
          <button
            type="submit"
            :disabled="!canSubmit"
            :class="[
              'w-full py-2 rounded text-white transition',
              (!canSubmit)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            ]"
          >
            登録
          </button>
  
          <!-- エラー・成功メッセージ -->
          <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
          <p v-if="message" class="text-green-500 text-sm text-center">{{ message }}</p>
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
      usernameStatus: '',
      usernameValid: false,
      typingTimer: null,
      cooldown: false,
      error: '',
      message: ''
    }
  },
  computed: {
    //  パスワードが6文字以上かどうか
    isPasswordValid() {
      return this.password.length >= 6;
    },
    //  登録ボタンを押せるかどうかの総合判定
    canSubmit() {
      return this.usernameValid && this.isPasswordValid && !this.cooldown;
    }
  },
  watch: {
    //  ユーザー名入力時のリアルタイム重複チェック
    username(newVal) {
      this.usernameStatus = '';
      this.usernameValid = false;

      clearTimeout(this.typingTimer);
      if (newVal.length < 5) {
        this.usernameStatus = '5文字以上で入力してください';
        return;
      }

      this.typingTimer = setTimeout(async () => {
        try {
          const res = await axios.get(`${baseURL}/api/auth/check-username/${newVal}`);
          if (res.data.exists) {
            this.usernameStatus = 'このユーザーIDはすでに使われています';
            this.usernameValid = false;
          } else {
            this.usernameStatus = 'このIDは利用可能です';
            this.usernameValid = true;
          }
        } catch (err) {
          console.error('重複チェック失敗:', err);
          this.usernameStatus = '確認に失敗しました';
        }
      }, 500);
    }
  },
  methods: {
    async handleRegister() {
      if (!this.canSubmit) return;

      this.cooldown = true;
      setTimeout(() => {
        this.cooldown = false;
      }, 5000);

      try {
        await axios.post(`${baseURL}/api/auth/register`, {
          username: this.username,
          password: this.password
        });
        this.message = '登録成功！ログインしてください。';
        this.error = '';
      } catch (err) {
        this.error = err.response?.data?.error || '登録に失敗しました';
        this.message = '';
      }
    }
  }
}
</script>



