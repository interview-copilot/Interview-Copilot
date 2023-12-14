<template>
  <div id="app">
    <el-menu :default-active="$router.currentRoute.path" mode="horizontal" :router="true">
      <el-menu-item index="/">Interview Copilot</el-menu-item>
      <el-menu-item index="/setting">Setting</el-menu-item>
    </el-menu>
    <router-view class="router_view"/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

</style>
<script>
import {mapGetters} from 'vuex';

export default {
  name: 'App',
  props: {},
  computed: {},
  beforeMount() {
  },
  mounted() {

  },
  data() {
    return {
      activeIndex: "/"
    }
  },
  methods: {}


}

</script>
<style>
.router_view {
  margin-top: 10px;
}
</style>