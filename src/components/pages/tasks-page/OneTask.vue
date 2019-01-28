<template>
  <div class="OneTask">
    <el-row v-if="!isEditing">
      <el-col :span="1">
        <el-checkbox
          v-model="checked"
          @change="checkTask"
        />
      </el-col>
      <el-col :span="(task.project) ? 6 : 11">
        <span
          v-if="task.description != null"
          class="description"
          @dblclick="showEditor"
        >{{ task.description }}</span>
        <span
          v-else
          @dblclick="showEditor"> (no description) </span>
        <transition name="editor">
          <el-tag
            v-if="active"
            type="success"
            size="medium"
            class="active-tag"
            color="#5daf34"
          >Active
          </el-tag>
        </transition>
      </el-col>
      <el-col
        v-if="task.project"
        :span="5"
        class="gray-text">
        <span title="Project">
          <i class="fas fa-project-diagram"/>
          {{ task.project.name }}
        </span>
      </el-col>
      <el-col
        v-show="false"
        :span="2">
        <span v-if="task.eta">Progress: {{ taskProgress }}%</span>
      </el-col>
      <el-col :span="6">
        <div v-if="task.timeEntries.length > 0 || task.total">
          <span v-if="date !== today">
            <span
              v-show="date !== today"
              class="gray-text">
              Total:
              <span :class="{ 'red': limited }">
                {{ formatTotal(task.total) }}
              </span>
            </span>
          </span>
          <span v-if="date === today && task.total">
            <span
              v-show="date === today"
              class="gray-text">
              Total:
              <span :class="{ 'red': limited }">
                {{ formatTotal(task.total) }}
              </span>
            </span><br>
          </span>
          <span v-if="date === today">
            Today:
            <span :class="{ 'red': limited }">
              {{ formatTodayTotal(todayTotal) }}
            </span>
          </span>
        </div>
        <div v-else>
          <span class="gray-text">0 min</span>
        </div>
      </el-col>
      <el-col :span="2">
        <span title="Stop task">
          <el-button
            v-if="active"
            type="danger"
            plain
            class="stop-button"
            @click="stopTask"
          >
            <i class="fa fa-stop"/>
          </el-button>
        </span>
        <span title="Continue task">
          <el-button
            v-if="!active"
            type="success"
            plain
            class="start-button"
            @click="prepareContinue"
          >
            <i class="fa fa-play"/>
          </el-button>
        </span>
      </el-col>
      <el-col :span="2">
        <el-popover
          ref="menu"
          v-model="visibleMenu"
          placement="top"
          trigger="hover"
        >
          <el-button
            type="plain"
            class="stop-button"
            plain
            @click.prevent="showEditor"
          >
            <i class="el-icon-edit"/>
          </el-button>
          <el-button
            type="danger"
            class="stop-button"
            plain
            @click.prevent="dialogVisible = true"
          >
            <i class="el-icon-delete"/>
          </el-button>
        </el-popover>

        <span
          v-popover:menu
        >
          <i class="el-icon-more"/>
        </span>
      </el-col>
      <el-col :span="2">
        <i
          v-if="!showTimeEntries"
          class="el-icon-arrow-down"
          @click="showTimeEntries = true"
        />
        <i
          v-if="showTimeEntries"
          class="el-icon-arrow-up"
          @click="showTimeEntries = false"
        />
      </el-col>
    </el-row>
    <el-row v-show="showTimeEntries">
      <el-row>
        <el-col :span="20">
          <template v-if="task.timeEntries.length">
            <div
              v-for="timeEntry in task.timeEntries"
              :key="timeEntry.uuid"
            >
              <one-time-entry
                :time-entry="timeEntry"
                @set-end-time="setEndTime"
                @stop-task="stopTask"
              />
            </div>
          </template>
          <div
            v-if="!task.timeEntries.length"
            class="gray-text">
            No time has been recorded yet
          </div>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            size="mini"
            plain
            @click="showTimeEntryCreator"
          >
            Add Time Entry
          </el-button>
        </el-col>
      </el-row>
      <el-row v-if="task.eta">
        <el-progress
          :percentage="taskProgress"
          :status="limited ? 'exception' : null"
        />
        <div>
          <div class="total">
            {{ formatTotal(task.total) }} / {{ formatTime(task.eta) }}
          </div>
        </div>
      </el-row>
    </el-row>
    <el-row v-if="addingTimeEntry || isEditing">
      <!--<el-col :span="20">-->
      <time-entry-editor
        v-if="addingTimeEntry"
        :task-uuid="task.uuid"
        :adding-time-entry="true"
        @create-time-entry="createTimeEntry"
        @close-editor="closeEditor"
      />
      <!--</el-col>-->
      <task-editor
        v-if="isEditing"
        :editing-task="true"
        :task="task"
        @update-task="updateTask"
        @close-editor="closeEditor"
        @delete-task="dialogVisible = true"
      />
    </el-row>
    <!--Confirm dialog-->
    <el-dialog
      :visible.sync="dialogVisible"
      title="Delete task"
      width="30%">
      <span>It will not be undone. Continue?</span>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button @click="dialogVisible = false">No</el-button>
        <el-button
          type="primary"
          autofocus
          @click="deleteTask">Yes</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="confirmStopActiveTask"
      title="Stop current active task"
      width="30%">
      <span>Stop previous active task?</span>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button @click="confirmStopActiveTask = false">No</el-button>
        <el-button
          type="primary"
          autofocus
          @click="continueTask({ stopTask: true })"
        >Yes</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import { mapGetters, mapActions } from 'vuex';
import TimeEntryEditor from './TimeEntryEditor';
import TaskEditor from './TaskEditor';
import OneTimeEntry from './TimeEntry';
import notification from '../../../mixins/notification';
import TimeEntry from '../../../models/TimeEntry';

export default {
  components: {
    TimeEntryEditor, TaskEditor, OneTimeEntry,
  },
  mixins: [notification],
  props: {
    task: {
      type: Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: () => {},
    },
    tasks: {
      type: Array,
      default: () => {},
    },
    isChecked: {
      type: Boolean,
      default: () => {},
    },
  },
  data() {
    return {
      isEditing: false,
      addingTimeEntry: false,
      dialogVisible: false,
      visibleMenu: false,
      confirmStopActiveTask: false,
      showTimeEntries: false,
      limited: false,

      checked: false,
    };
  },
  computed: {
    ...mapGetters([
      'activeTimeEntry',
      'date',
      'timerId',
    ]),
    spendTime() {
      let spendTime;
      if (this.task.endTime == null) {
        spendTime = moment.duration(this.task.spendTime);
      }
      if (this.task.endTime !== null) {
        spendTime = moment.duration(moment(this.task.endTime, 'HH:mm:ss').diff(moment(this.task.startTime, 'HH:mm:ss')));
      }
      const hours = spendTime.hours();
      const minutes = spendTime.minutes();
      return `${(hours > 0 ? `${hours} h ` : '')} ${minutes} min`;
    },
    todayTotal() {
      if (this.task.timeEntries.length === 0) return moment.duration(0, 'seconds');
      const total = this.task.timeEntries.reduce((prev, cur) => {
        let { endTime } = cur;
        if (!endTime) endTime = moment().format('YYYY-MM-DD HH:mm:ss');
        return moment.duration(moment(endTime, 'YYYY-MM-DD HH:mm:ss')
          .diff(moment(cur.startTime, 'YYYY-MM-DD HH:mm:ss'))).add(prev);
      }, null);

      return total;
    },
    taskProgress() {
      let percentages = 0;
      const { eta } = this.task;
      const total = this.canculateTotal(this.task.total);
      percentages = (total.asSeconds() / eta) * 100;
      if (Math.round(percentages) > 100 && !this.limited) {
        this.showWarning(`Task <b>${this.task.description}</b> reached time limit`);
        this.setLimited(true); // set limited to the true
      }
      if (Math.round(percentages) < 100 && this.limited) this.setLimited(false);
      return (Math.round(percentages) < 100) ? Math.round(percentages) : 100;
    },
    active() {
      return !!this.task.timeEntries.find(timeEntry => timeEntry.active === true);
    },
    today() {
      return moment().format('YYYY-MM-DD');
    },
  },
  watch: {
    isChecked(value) {
      if (value === null) return;
      this.checked = value;
    },
  },
  methods: {
    ...mapActions([
      'updateTimeEntry',
      'deleteTimeEntry',
      'setTimerId',
    ]),
    setEndTime({ uuid, endTime }) {
      const timeEntry = this.task.timeEntries
        .find(entry => entry.uuid === uuid);
      timeEntry.endTime = endTime;
    },
    showEditor() {
      this.isEditing = true;
    },
    canculateTotal(time) {
      let total = moment.duration(0, 'seconds');
      if (time) {
        total = moment.duration(parseInt(time, 10), 'seconds');
      }
      return moment.duration(total.asSeconds() + this.todayTotal.asSeconds(), 'seconds');
    },
    formatTotal(time) {
      const total = this.canculateTotal(time);
      return `${(total.hours() > 0 ? `${total.hours()}  h ` : '')} ${total.minutes()} min `;
    },
    formatTodayTotal(total) {
      const hours = total.hours();
      const minutes = total.minutes();
      if (total.asMinutes() < 1) {
        const seconds = total.asSeconds();
        return `${seconds} sec`;
      }
      return `${(hours > 0 ? `${hours}  h ` : '')} ${minutes} min `;
    },
    formatTime(time) {
      const duration = moment.duration(time, 'seconds');
      return `${(duration.hours() > 0 ? `${duration.hours()}  h ${duration.minutes()} min` : `${duration.asMinutes()} min `)}`;
    },
    showTimeEntryCreator() {
      this.addingTimeEntry = true;
    },
    closeEditor() {
      this.isEditing = false;
      this.addingTimeEntry = false;
    },
    updateTask(task) {
      this.$store.dispatch('updateTask', { task, date: this.date });
      // this.task = Object.assign({}, task);
      this.isEditing = false;
    },
    startTask() {
      const timeEntry = new TimeEntry();
      timeEntry.active = true;
      timeEntry.startTime = moment().format('YYYY-MM-DD HH:mm:ss');
      timeEntry.taskUuid = this.task.uuid;
      this.createTimeEntry(timeEntry);
    },
    stopTask() {
      const timeEntry = Object.assign(this.getActiveTimeEntry());
      if (moment().diff(moment(timeEntry.startTime, 'YYYY-MM-DD HH:mm:ss'), 'seconds') < 60) {
        this.deleteTimeEntry({ timeEntry })
          .then(() => {
            this.clearInterval();
          });
        return;
      }
      timeEntry.active = false;
      timeEntry.endTime = moment().format('YYYY-MM-DD HH:mm:ss');
      this.updateTimeEntry({ timeEntry })
        .then(() => {
          this.clearInterval();
        });
    },
    clearInterval() {
      clearInterval(this.timerId);
      document.title = this.$route.meta.name;
      this.setTimerId({ timerId: 0 });
    },
    prepareContinue() {
      // Check for active task
      if (this.activeTimeEntry !== null) {
        this.confirmStopActiveTask = true;
      } else {
        this.continueTask({ stopTask: false });
      }
    },
    // if stopTask === true active task should be stopped
    continueTask({ stopTask }) {
      if (this.date !== this.today) {
        this.getTodayTasks()
          .then(() => {
            this.confirmStopActiveTask = false;
            if (stopTask === true) {
              this.stopTask();
            }
            this.startTask();
            this.getTodayTasks();
          });
      } else {
        this.confirmStopActiveTask = false;
        if (stopTask) {
          this.stopTask();
        }
        this.startTask();
      }
    },
    getActiveTimeEntry() {
      let activeTimeEntry = '';
      this.$store.getters.tasks.map((task) => { // find active task in all tasks
        if (!activeTimeEntry) {
          activeTimeEntry = task.timeEntries.find(timeEntry => (
            timeEntry.uuid === this.activeTimeEntry
          ));
        }
        return task;
      });
      return activeTimeEntry;
    },
    createTimeEntry(timeEntry) {
      this.$store.dispatch('createTimeEntry', { timeEntry });
      this.closeEditor();
    },
    getTodayTasks() {
      return new Promise((resolve) => {
        if (this.$route.params.segment === 'personal') {
          this.$store.dispatch('getTasks', {
            date: this.today,
            userUuid: this.$store.getters.user.uuid,
          })
            .then(() => resolve());
        }
        if (this.$route.params.segment === 'organization') {
          this.$store.dispatch('getTasks', {
            date: this.today,
            orgUuid: this.$route.params.organizationUuid,
            userUuid: this.$store.getters.user.uuid,
          })
            .then(() => resolve());
        }
      });
    },
    deleteTask() {
      this.dialogVisible = false;
      this.$store.dispatch('deleteTask', { uuid: this.task.uuid });
      this.checkTask(false); // uncheck task
    },
    currentTime() {
      return moment();
    },
    time(time) {
      return moment(time, 'HH:mm:ss').format('HH:mm');
    },
    checkTask(value) {
      this.$emit('check-task', {
        taskId: this.task.id,
        value,
      });
    },
    setLimited(value) {
      this.limited = value;
    },
  },
};
</script>

<style lang="scss"
       rel="stylesheet/css"
       scoped>
  .el-icon-more {
    margin : 5px;
  }

  .el-col {
    padding     : 15px;
    line-height : 28px;
  }

  .el-icon-caret-right {
    font-size : 20px;
    cursor    : pointer;
  }

  .start-button {
    padding : 5px;
  }

  .stop-button {
    padding : 5px;
  }

  .active-tag {
    color : #fff;
  }

  .description {
    cursor         : pointer;
    vertical-align : middle;
    display        : inline-block;
  }

  .red {
    color : #f56c6c;
  }

  .editor-enter-active {
    transition : opacity .5s;
  }

  .editor-enter, .editor-leave-to {
    opacity : 0;
  }

  .total {
    float        : right;
    margin-right : 50px;
  }
</style>

<style>
  .el-icon-arrow-down, .el-icon-arrow-up, .el-icon-more {
    cursor : pointer;
  }

  .el-popover {
    min-width : 65px;
  }

</style>
