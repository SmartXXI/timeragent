<template>
  <div>
    <el-container direction="vertical">
      <NavMenuAuth />
      <router-view
        :key="$route.fullPath"
      />
    </el-container>
  </div>
</template>

<script>
import NavMenuAuth from './NavMenuAuth';

export default {
  components: {
    NavMenuAuth,
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

</style>
