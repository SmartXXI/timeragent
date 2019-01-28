<template>
  <div class="TimeEntry">
    <div
      class="time-entry"
      @dblclick="showEditor"
    >
      {{ format(localTimeEntry.startTime) }} - {{ (localTimeEntry.active)
        ? 'now'
        : format(localTimeEntry.endTime) }}
    </div>
    <TimeEntryEditor
      v-if="isEditing"
      :time-entry="localTimeEntry"
      :editing-time-entry="true"
      :task-uuid="localTimeEntry.taskUuid"
      @update-time-entry="updateTimeEntry"
      @delete-time-entry="deleteTimeEntry"
      @close-editor="closeEditor"
    />
  </div>
</template>

<script>
import moment from 'moment';
import { mapActions } from 'vuex';
import TimeEntryEditor from './TimeEntryEditor';

export default {
  components: {
    TimeEntryEditor,
  },
  props: {
    timeEntry: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isEditing: false,
      editingTimeEntry: false,
      localTimeEntry: {},
    };
  },
  created() {
    this.localTimeEntry = Object.assign(this.timeEntry);
    if (this.localTimeEntry.active === true) {
      const timerId = window.setInterval(() => {
        this.localTimeEntry.endTime = moment().format('YYYY-MM-DD HH:mm:ss');
        this.setEndTime();
        const ms = moment.duration(moment(this.localTimeEntry.endTime, 'YYYY-MM-DD HH:mm:ss')
          .diff(moment(this.localTimeEntry.startTime, 'YYYY-MM-DD HH:mm:ss'))).asMilliseconds();
        document.title = moment.utc(ms).format('HH:mm:ss');
      }, 1000);
      this.setTimerId({ timerId });
      this.setActiveTimeEntry(this.timeEntry.uuid);
    }
  },
  methods: {
    ...mapActions([
      'setActiveTimeEntry',
      'setTimerId',
    ]),
    setEndTime() {
      this.$emit('set-end-time', {
        uuid: this.timeEntry.uuid,
        endTime: this.localTimeEntry.endTime,
      });
    },
    format(time) {
      return moment(time, 'YYYY-MM-DD HH:mm:ss').format('HH:mm');
    },
    showEditor() {
      this.isEditing = true;
    },
    updateTimeEntry(timeEntry) {
      this.$store.dispatch('updateTimeEntry', { timeEntry });
      this.isEditing = false;
    },
    deleteTimeEntry(timeEntry) {
      if (this.timeEntry.active === 1
        && moment().diff(moment(this.timeEntry.startTime, 'YYYY-MM-DD HH:mm:ss'), 'seconds') < 60) {
        this.$emit('stop-task');
      } else if (this.timeEntry.active === 1) {
        this.$emit('stop-task');
        this.$store.dispatch('deleteTimeEntry', { timeEntry });
      } else {
        this.$store.dispatch('deleteTimeEntry', { timeEntry });
      }
    },
    closeEditor() {
      this.isEditing = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .time-entry {
    cursor : pointer;
  }
</style>
