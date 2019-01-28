<template>
  <div class="TasksPage">
    <el-main v-loading="loading">
      <el-row>
        <el-col
          :span="16"
          :offset="4"
        >
          <AppPage/>
          <TaskList/>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script>
// import moment from 'moment';

import loading from '../../mixins/loading';

import AppPage from './tasks-page/AppPage';
import TaskList from './tasks-page/TaskList';

export default {
  components: {
    AppPage,
    TaskList,
  },
  mixins: [loading],
  data() {
    return {
      timerStarted: false,
    };
  },
  created() {
    // const date = moment().format('YYYY-MM-DD');
    // if (this.$route.params.segment === 'personal') {
    //   this.$store.dispatch('getTasks', {
    //     userUuid: this.$store.getters.user.uuid,
    //     date,
    //   });
    // }
    // if (this.$route.params.segment === 'organization') {
    //   this.$store.dispatch('getTasks', {
    //     date,
    //     orgUuid: this.$route.params.organizationUuid,
    //     userUuid: this.$store.getters.user.uuid,
    //   });
    // }
  },
  methods: {
    startTimer() {
      this.timerStarted = true;
    },
    stopTimer() {
      this.timerStarted = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/css" scoped>

    body {
        background-color: #efefef;
    }

    .container {
        margin-top: 70px;
    }

</style>
