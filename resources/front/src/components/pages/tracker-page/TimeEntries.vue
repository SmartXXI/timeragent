<template>
    <div>
        <div class="col-md-12">
            <div class="panel panel-default panel-time-entries">
                <div class="panel-heading flex-container">
                    <label class="table-checkbox">
                        <input type="checkbox" v-bind:disabled="!tasksExists" 
                         v-bind:checked="isChecked">
                    </label>
                    <span v-if="checkedTasks">Selected {{ checkedTasks }} </span>
                    <!-- ngIf: !controller.selectedItemsCount -->
                    <div v-if="!isChecked" class="actions full-width">
                        <button
                                @click="showEditor"
                                class="btn btn-default" type="button"
                        >
                            Add Time Entry
                        </button>
                        <button class="btn btn-default disabled" type="button">
                            Add Break
                        </button>
                        <button class="btn btn-icon-default flex-item-pull-right hidden"><i
                                class="fa fa-sort-amount-desc"></i></button>
                    </div>
                </div>
                <div class="panel-body clear-padding">
                        <time-entry-editor
                                v-if="AddingTimeEntry"
                                @close-editor="closeEditor"
                                @add-time-entry="AddTimeEntry"
                                :addingTimeEntry="true"
                        ></time-entry-editor>

                    <div class="tasks-section">
                        <transition name="task">
                            <tasks-list v-if="tasksExists"></tasks-list>
                        </transition>
                    </div>
                    <transition name="task">
                        <div v-if="!tasksExists" class="well text-center">
                            No work time is recorded for this day.
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import TimeEntryEditor from './TimeEntryEditor';
    import TasksList from './TaksList';

    export default {
        data() {
            return {
                AddingTimeEntry: false,
                checkedTasks   : 0,
                timerID        : null,
                time           : null,
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
        },
        methods: {
            showEditor() {
                this.AddingTimeEntry = true;
            },
            closeEditor() {
                this.AddingTimeEntry = false;
            },

            searchForCheck(task) {
                return task.checked === true;
            },
            currentTime() {
                return moment();
            },
            AddTimeEntry(task) {
                task.spendTime = moment(task.spendTime, 'HH [h] mm [min]').format('HH:mm:ss'); //eslint-disable-line

                this.$store.dispatch('addTimeEntry', task);
                this.AddingTimeEntry = false;
            },
            // checkAll() {
            //     this.tasks.forEach(task => (task.checked = true));//eslint-disable-line
            // },
            // unCheckAll() {
            //     this.tasks.forEach(task => (task.checked = false)); //eslint-disable-line
            // },
            // numberOfTasks() {
            //     this.tasks.forEach(this.counterTasks);//eslint-disable-line
            // },
            // counterTasks(task) {
            //     if (task.checked === true) {
            //         this.checkedTasks = this.checkedTasks + 1;
            //     }
            // },
        },
        components: {
            TimeEntryEditor, TasksList,
        },
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/css" scoped>

    .page-title {
        padding: 0;
        font-size: 28px;
        line-height: 33px;
        display: block;
        margin: 0 0 25px;
        height: 40px;
        word-break: break-all;
    }

    .bold {
        font-weight: 700 !important;
    }

    .btn-calendar {

        color: inherit;
        text-decoration: none;
    }

    .btn-calendar:hover {
        text-decoration: none;
    }

    .btn-icon-default {
        background: none;
        border-radius: 50%;
    }

    .btn-icon-default:hover {
        background: #DDDDDD;
    }

    .btn-icon-default:focus {
        background: #DDDDDD;
    }

    .flex-container-space-between {
        display: flex;
        justify-content: space-between;
    }

    .flex-container {
        display: flex !important;
        flex-flow: row nowrap;
        align-items: center;
    }

    .panel-default {
        border-color: #e0e0e0;

        .panel-heading {
            color: #525252;
            background-color: #fff;
            border-color: #e0e0e0;
        }
    }

    .panel-heading {
        padding: 20px;
    }

    .panel {
        margin-bottom: 20px;
        background-color: #fff;
        border: 1px solid transparent;
        border-radius: 3px;
        -webkit-box-shadow: 0 2px 6px 0 rgba(47, 47, 47, .15);
        box-shadow: 0 2px 6px 0 rgba(47, 47, 47, .15);
    }

    .panel-title {
        font-weight: 300;
        font-size: 22px;
    }

    .panel-body {
        padding: 0;
    }

    .table-checkbox {
        margin: 9px 0;
        width: 18px !important;
        height: 16px;
        display: flex;
        padding: 0 !important;
        background-color: transparent;
    }

    .actions {
        display: flex;
        align-items: center;
        text-align: left;
    }

    .actions > :not(:last-child) {
        margin-right: 12px;
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
