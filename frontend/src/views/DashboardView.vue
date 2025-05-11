<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">投稿一覧</h2>
    <div class="mb-4">
      <label class="mr-2 font-semibold">並び順:</label>
      <select v-model="sortOrder" class="border p-1 rounded">
      <option value="desc">新しい順</option>
      <option value="asc">古い順</option>
      </select>
    </div>
    

    <form @submit.prevent="createPost" class="mb-6 bg-white p-4 shadow rounded">
      <input v-model="title" placeholder="タイトル" class="border p-2 w-full mb-2 rounded" />
      <textarea v-model="content" placeholder="本文" class="border p-2 w-full mb-2 rounded"></textarea>
      <button
        type="submit"
        :disabled="!title || !content"
        :class="[
        'px-4 py-2 rounded text-white',
        (!title || !content)
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-blue-500 hover:bg-blue-600']"
        >投稿
      </button>
    </form>

    <div v-for="post in sortedPosts" :key="post._id" class="bg-white p-4 mb-4 shadow rounded">
      <h3 class="text-lg font-semibold">{{ post.title }}</h3>
      <p class="mt-1 text-gray-700">{{ post.content }}</p>
      <p class="text-sm text-gray-500 mt-2">投稿: {{ formatDate(post.createdAt) }}</p>
      <button @click="deletePost(post._id)" class="mt-2 text-sm text-red-500 hover:underline">
        削除
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

const baseURL = process.env.VUE_APP_API_URL;

export default {
  data() {
    return {
      posts: [],
      title: '',
      content: '',
      sortOrder: 'desc'  // 初期状態は新しい順
    }
  },
  methods: {
    async fetchPosts() {
      const res = await axios.get(`${baseURL}/api/posts`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      this.posts = res.data
    },
    async createPost() {
      await axios.post(`${baseURL}/api/posts`, {
        title: this.title,
        content: this.content
      }, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      this.title = ''
      this.content = ''
      this.fetchPosts()
    },
    async deletePost(id) {
      await axios.delete(`${baseURL}/api/posts/${id}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      })
      this.fetchPosts()
    },
    formatDate(iso) {
      const postTime = dayjs(iso)
      return dayjs().diff(postTime, 'hour') < 24
        ? postTime.fromNow()
        : postTime.format('YYYY/MM/DD HH:mm')
    }
  },
  computed: {
  sortedPosts() {
    return [...this.posts].sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime()
      const timeB = new Date(b.createdAt).getTime()
      return this.sortOrder === 'asc' ? timeA - timeB : timeB - timeA
    })
  }
  },

  mounted() {
    this.fetchPosts()
  }
}
</script>
