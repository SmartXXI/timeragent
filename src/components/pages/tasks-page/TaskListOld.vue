<template>
  <div class="TaskListOld">
    <OneTask
      v-for="(task, index) in tasks"
      :key="task.id"
      :task="task"
      :index="index"
      :tasks="tasks"
    />
  </div>
</template>

<script>
import OneTask from './OneTask';

export default {
  components: {
    OneTask,
  },
  computed: {
    tasks() {
      return this.$store.getters.tasks;
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/css" scoped>


</style>
