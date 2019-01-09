<template>
  <div>
    <el-container direction="vertical">
      <nav-menu-auth/>
      <router-view :key="$route.fullPath"/>
    </el-container>
  </div>
</template>

<script>
import NavMenuAuth from '../blocks/NavMenuAuth';

export default {
  components: {
    NavMenuAuth,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
