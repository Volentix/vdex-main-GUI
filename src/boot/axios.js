import Vue from 'vue'
import axios from 'axios'
import axiosRetry from 'axios-retry'

axiosRetry(axios, { retries: 10 })
Vue.prototype.$axios = axios
