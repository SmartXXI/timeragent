<template>
    <div>
        <div class="time-entry" @dblclick="showEditor">
            {{ format(timeEntry.startTime) }} - {{ (timeEntry.endTime) ? format(timeEntry.endTime) : 'now' }}
        </div>
        <time-entry-editor v-if="isEditing"
                           @update-time-entry="updateTimeEntry"
                           @delete-time-entry="deleteTimeEntry"
                           @close-editor="closeEditor"
                           :timeEntry="timeEntry"
                           :editingTimeEntry="true"
        ></time-entry-editor>
    </div>
</template>

<script>
    import moment from 'moment';
    import TimeEntryEditor from './TimeEntryEditor';

    export default {
        props: ['timeEntry'],
        data() {
            return {
                isEditing       : false,
                editingTimeEntry: false,
            };
        },
        methods: {
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
                    && moment().diff(moment(this.timeEntry.startTime, 'HH:mm:ss'), 'seconds') < 60) {
                    this.$emit('stop-task');
                } else if (this.timeEntry.active === 1) {
                    this.$store.dispatch('deleteTimeEntry', { timeEntry });
                } else {
                    this.$store.dispatch('deleteTimeEntry', { timeEntry });
                }
            },
            closeEditor() {
                this.isEditing = false;
            },
        },
        components: {
            TimeEntryEditor,
        },
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    .time-entry {
        cursor: pointer;
    }
</style>
