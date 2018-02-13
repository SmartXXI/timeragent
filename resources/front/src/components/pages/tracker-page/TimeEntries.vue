<template>
    <div>
        <el-col :span="24">
            <el-card>
                <el-row justify="start">
                    <el-col :span="1">
                            <el-checkbox v-bind:disabled="!tasksExists"
                                         v-bind:checked="isChecked"></el-checkbox>
                    </el-col>
                    <el-col :span="6">
                        <div v-if="!isChecked" class="actions full-width">
                            <el-button
                                    @click="showEditor"
                                    type="primary"
                                    plain
                            >
                                Create task
                            </el-button>
                            <el-button plain disabled>
                                Add Break
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
                <div>
                    <task-editor v-if="addingTask"
                                 @add-task="createTask"
                                 @close-editor="closeEditor"
                                 :addingTask="true"
                    ></task-editor>

                    <div class="tasks-section">
                        <tasks-list v-if="tasksExists"></tasks-list>
                    </div>
                    <div v-if="!tasksExists" class="well text-center">
                        No work time is recorded for this day.
                    </div>
                </div>
            </el-card>
        </el-col>
    </div>
</template>

<script>
    import moment from 'moment';
    import TimeEntryEditor from './TimeEntryEditor';
    import TasksList from './TaksList';
    import TaskEditor from './TaskEditor';

    export default {
        data() {
            return {
                addingTask  : false,
                timerID     : null,
                time        : null,
                checkedTasks: 0,
            };
        },
        computed: {
            isChecked() {
                return this.tasks.some(this.searchForCheck);
            },
            tasks() {
                return this.$store.getters.tasks;
            },
            tasksExists() {
                return this.$store.getters.tasks.length;
            },
            date() {
                return moment().format('YYYY-MM-DD');
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
        },
        components: {
            TimeEntryEditor, TasksList, TaskEditor,
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
