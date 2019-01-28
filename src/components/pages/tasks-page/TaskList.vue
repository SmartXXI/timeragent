<template>
  <div class="TaskList">
    <el-col :span="24">
      <el-card>
        <el-row justify="start">
          <el-col :span="1">
            <el-checkbox
              v-model="isCheckedAll"
              :disabled="!tasksExists"
              :indeterminate="isIndeterminate"
              @change="checkAll"
            />
          </el-col>
          <el-col :span="6">
            <div
              v-if="!checkedTasks.length"
              class="actions full-width"
            >
              <el-button
                type="primary"
                plain
                @click="showEditor"
              >
                Create task
              </el-button>
            </div>
            <div v-else>
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                @click="confirmDelete = true"
              >
                Delete
              </el-button>
            </div>
          </el-col>
        </el-row>
        <div>
          <TaskEditor
            v-if="addingTask"
            :adding-task="true"
            @add-task="createTask"
            @close-editor="closeEditor"
          />

          <div class="tasks-section">
            <div v-if="tasksExists">
              <OneTask
                v-for="(task, index) in tasks"
                :key="task.uuid"
                :task="task"
                :index="index"
                :tasks="tasks"
                :is-checked="checkedAll"
                @check-task="checkTask"
              />
            </div>
          </div>
          <div
            v-if="!tasksExists"
            class="well text-center"
          >
            No work time is recorded for this day.
          </div>
        </div>
        <el-dialog
          :visible.sync="confirmDelete"
          title="Delete tasks"
          width="30%"
        >
          <p>It will not be undone. Continue?</p>
          <span slot="footer">
            <el-button @click="confirmDelete = false">
              No
            </el-button>
            <el-button
              type="primary"
              @click="deleteTasks"
            >
              Yes
            </el-button>
          </span>
        </el-dialog>
      </el-card>
    </el-col>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters } from 'vuex';

// import TimeEntryEditor from './TimeEntryEditor';
import TaskEditor from './TaskEditor';
import OneTask from './OneTask';

export default {
  components: {
    // TimeEntryEditor,
    TaskEditor,
    OneTask,
  },
  data() {
    return {
      addingTask: false,
      timerID: null,
      time: null,
      checkedTasks: [],
      isCheckedAll: false,

      confirmDelete: false,
      isIndeterminate: false,
    };
  },
  computed: {
    ...mapGetters([
      'tasks',
    ]),
    tasksExists() {
      return this.tasks.length;
    },
    date() {
      return moment().format('YYYY-MM-DD');
    },
    checkedAll() {
      if (this.tasks.length === this.checkedTasks.length) {
        return true;
      }
      if (this.checkedTasks.length && this.checkedTasks.length < this.tasks.length) {
        return null;
      }
      return false;
    },
  },
  methods: {
    createTask(task) {
      this.closeEditor();
      this.$store.dispatch('createTask', { task });
    },
    showEditor() {
      this.addingTask = true;
    },
    closeEditor() {
      this.addingTask = false;
    },

    searchForCheck(task) {
      return task.checked === true;
    },
    currentTime() {
      return moment();
    },
    checkTask(payload) {
      if (payload.value) {
        this.checkedTasks.push(payload.taskId);
      } else {
        this.checkedTasks = this.checkedTasks.filter(taskId => taskId !== payload.taskId);
      }

      if (this.checkedTasks.length === this.tasks.length) {
        this.isCheckedAll = true;
        this.isIndeterminate = false;
      } else if (this.checkedTasks.length && this.checkedTasks.length < this.tasks.length) {
        this.isIndeterminate = true;
        this.isCheckedAll = false;
      } else {
        this.isCheckedAll = false;
        this.isIndeterminate = false;
      }
    },
    checkAll(value) {
      this.checkedTasks = [];
      this.isIndeterminate = false;
      if (value) {
        this.tasks.map((task) => {
          this.checkedTasks.push(task.uuid);
          return task;
        });
      }
    },
    isChecked(taskId) {
      return this.checkedTasks.find(locTaskId => locTaskId === taskId);
    },
    deleteTasks() {
      this.confirmDelete = false;
      if (this.$store.getters.activeTimeEntry) {
        this.stopTask();
      }
      this.$store.dispatch('deleteTask', { uuids: this.checkedTasks });
      this.checkedTasks = [];
      this.isIndeterminate = false;
      this.isCheckedAll = false;
    },
    getActiveTimeEntry() {
      let activeTimeEntry = {};
      this.$store.getters.tasks.map((task) => { // find active task in all tasks
        activeTimeEntry = task.timeEntries.find(timeEntry => (
          timeEntry.id === this.$store.getters.activeTimeEntry
        ));
        return task;
      });
      return activeTimeEntry;
    },
    stopTask() {
      const activeTimeEntry = this.getActiveTimeEntry();
      this.$store.dispatch('stopTimer');
      this.$store.dispatch('stopTask', { task: activeTimeEntry });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/css" scoped>

    .el-checkbox {
        margin: 10px 10px 10px 15px;
    }

    .tasks-section {
        margin-top: 20px;
    }

    .page-title {
        padding: 0;
        font-size: 28px;
        line-height: 33px;
        display: block;
        margin: 0 0 25px;
        height: 40px;
        word-break: break-all;
    }

    .well {
        min-height: 20px;
        padding: 19px;
        margin: 20px 0;
        background-color: #f5f5f5;
        border: 1px solid #f5f5f5;
        border-radius: 3px;
        box-shadow: none;
    }

    .task-enter-active{
        transition: opacity .5s;
    }

    .task-enter, .task-leave-to {
        opacity: 0;
    }


</style>
