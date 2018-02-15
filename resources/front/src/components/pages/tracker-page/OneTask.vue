<template>
	<div>
		<el-row v-if="!isEditing">
			<el-col :span="2">
				<el-checkbox v-model="tasks[index].checked"></el-checkbox>
			</el-col>
			<el-col :span="10">
				<span v-if="task.description != null " class="description" @dblclick="showEditor">{{ task.description }}</span>
				<span v-else @dblclick="showEditor"> (no description) </span>
				<transition name="editor">
					<el-tag v-if="active" type="success" size="medium" class="active-tag" color="#5daf34">Active</el-tag>
				</transition>
			</el-col>
			<!--<el-col :span="4">-->
				<!--<small v-if="task.startTime !== null" class="text-muted"> {{ time(task.startTime) }} - <span v-if="task.endTime == null">now</span> <span v-else >{{ time(task.endTime) }}</span> </small>-->
			<!--</el-col>-->
			<el-col :span="2" v-show="false">
				<span v-if="task.eta">Progress: {{ taskProgress }}%</span>
			</el-col>
            <el-col :span="6">
                <div v-if="task.time_entries.length > 0 || task.total">
                    <span v-if="$store.getters.date !== date">
                        <span v-show="$store.getters.date !== date">
                            Total: <span :class="{ 'red': limited }">{{ formatTotal(task.total) }}</span>
                        </span>
                    </span>
                    <span v-if="$store.getters.date === date && task.total">
                        <span v-show="$store.getters.date !== date">
                            Total: <span :class="{ 'red': limited }"> {{ formatTotal(task.total) }}</span>
                        </span>
                    </span>
                    <span v-if="$store.getters.date === date">Today:
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
					<el-button type="danger" plain v-if="active" @click="stopTask" class="stop-button">
						<!--<i class="el-icon-close"></i>-->
                        <i class="fa fa-stop"></i>
					</el-button>
				</span>
				<span title="Continue task">
					<el-button type="success"  v-if="!active" @click="checkForActive" plain class="start-button">
                    	<i class="fa fa-play"></i>
					</el-button>
				</span>
			</el-col>
			<el-col :span="2">
                <el-popover
                    ref="menu"
                    placement="top"
                    v-model="visibleMenu"
                    trigger="hover"
                >
                    <el-button type="plain"
                        class="stop-button"
                        plain
                        @click.prevent="showEditor"
                    >
                        <i class="el-icon-edit"></i>
                    </el-button>
                    <el-button type="danger"
                               class="stop-button"
                               plain
                               @click.prevent="dialogVisible = true"
                    >
                        <i class="el-icon-delete"></i>
                    </el-button>
                </el-popover>

                <span
                      v-popover:menu
                >
                    <i class="el-icon-more"></i>
                </span>
			</el-col>
            <el-col :span="2">
                <i class="el-icon-arrow-down"
                   v-if="!showTimeEntries"
                   @click="showTimeEntries = true"
                ></i>
                <i class="el-icon-arrow-up"
                   v-if="showTimeEntries"
                   @click="showTimeEntries = false"
                ></i>
            </el-col>
		</el-row>
		<el-row v-if="showTimeEntries">
            <el-row>
            <el-col :span="20">
                <div v-if="task.time_entries.length"
                     v-for="timeEntry in task.time_entries"
                >
                    <time-entry :timeEntry="timeEntry" @stop-task="stopTask"></time-entry>
                </div>
                <div v-if="!task.time_entries.length" class="gray-text">
                    No time has been recorded yet
                </div>
            </el-col>
            <el-col :span="4">
                <el-button
                        @click="showTimeEntryCreator"
                        type="primary"
                        size="mini"
                        plain
                >
                    Add Time Entry
                </el-button>
            </el-col>
            </el-row>
            <el-row v-if="task.eta">
                    <el-progress :percentage="taskProgress" :status="limited ? 'exception' : null"></el-progress>
                    <!--<div v-if="$store.getters.date !== date">-->
                            <!--<div class="total">-->
                                <!--{{ formatTotal(task.total) }} / {{ formatTime(task.eta) }}-->
                            <!--</div>-->
                        <!--</div>-->
                    <div>
                            <div  class="total">
                                {{ formatTotal(task.total) }} / {{ formatTime(task.eta) }}
                            </div>
                    </div>
            </el-row>
		</el-row>
        <el-row>
            <el-col :span="20">
                <time-entry-editor v-if="addingTimeEntry"
                                   @add-time-entry="addTimeEntry"
                                   @close-editor="closeEditor"
                                   :taskId="task.id"
                                   :addingTimeEntry="true"
                ></time-entry-editor>
            </el-col>
			<task-editor v-if="isEditing"
                         @update-task="updateTask"
                         @close-editor="closeEditor"
                         @delete-task="dialogVisible = true"
                         :editingTask="true"
                         :task="task"
            ></task-editor>
        </el-row>
        <!--Confirm dialog-->
        <el-dialog
                title="Delete task"
                :visible.sync="dialogVisible"
                width="30%">
            <span>It will not be undone. Continue?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">No</el-button>
                <el-button type="primary" @click="deleteTask" autofocus>Yes</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="Stop current active task"
                :visible.sync="confirmStopActive"
                width="30%">
            <span>Stop previous active task?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="confirmStopActive = false">No</el-button>
                <el-button type="primary" @click="continueTask(stopActive)" autofocus>Yes</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import moment from 'moment';
import TimeEntryEditor from './TimeEntryEditor';
import TaskEditor from './TaskEditor';
import TimeEntry from './TimeEntry';
import notification from '../../../mixins/notification';

export default {
    props : ['task', 'index', 'tasks'],
    mixins: [notification],
    data() {
        return {
            isEditing        : false,
            addingTimeEntry  : false,
            dialogVisible    : false,
            visibleMenu      : false,
            confirmStopActive: false,
            stopActive       : true,
            showTimeEntries  : false,
            limited          : false,
        };
    },
    computed: {
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
            if (this.task.time_entries.length === 0) return moment.duration(0, 'seconds');
            const total = this.task.time_entries.reduce((prev, cur) => {
                let { endTime } = cur;
                const spendTime = (cur.spendTime) ? cur.spendTime : ''; //eslint-disable-line
                if (!endTime) endTime = moment().format('YYYY-MM-DD HH:mm:ss');
                return moment.duration(moment(endTime, 'YYYY-MM-DD HH:mm:ss')
                    .diff(moment(cur.startTime, 'YYYY-MM-DD HH:mm:ss'))).add(prev);
            }, null);

            return total;
        },
        taskProgress() {
            let percentages = 0;
            const eta = moment.duration(this.task.eta).asSeconds();
            const total = this.canculateTotal(this.task.total);
            percentages = (total.asSeconds() / eta) * 100;
            if (Math.round(percentages) > 100 && !this.limited) {
                this.showWarning(`Task <b>${this.task.description}</b> reached time limit`);
                this.limited = true;
            }
            if (Math.round(percentages) < 100 && this.limited) this.limited = false;
            return (Math.round(percentages) < 100) ? Math.round(percentages) : 100;
        },
        active() {
            return !!this.task.time_entries.find(timeEntry => timeEntry.active === 1);
        },
        date() {
            return moment().format('YYYY-MM-DD');
        },
    },
    methods: {
        showEditor() {
            this.isEditing = true;
        },
        canculateTotal(time) {
            let total = moment.duration(0, 'seconds');
            if (time !== null) {
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
            const duration = moment.duration(time);
            return `${(duration.hours() > 0 ? `${duration.hours()}  h ` : '')} ${duration.minutes()} min `;
        },
        showTimeEntryCreator() {
            this.addingTimeEntry = true;
        },
        closeEditor() {
            this.isEditing = false;
            this.addingTimeEntry = false;
        },
        updateTask(task) {
            const lTask = task;
            lTask.spendTime = moment(lTask.spendTime, 'h [h] mm [min]').format('HH:mm:ss');
            this.$store.dispatch('updateTask', { task: lTask, index: this.index });
            // this.task = Object.assign({}, task);
            this.isEditing = false;
        },
        stopTask() {
            const activeTimeEntry = this.getActiveTimeEntry();
            this.$store.dispatch('stopTimer');
            this.$store.dispatch('stopTask', { task: activeTimeEntry });
        },
        checkForActive() {
            if (this.$store.getters.activeTask !== null) {
                this.confirmStopActive = true;
            } else {
                this.continueTask(!this.stopActive);
            }
        },
        continueTask(stopTask) {
            if (this.$store.state.date !== this.date) {
                this.getTodayTasks()
                    .then(() => {
                        this.confirmStopActive = false;
                        if (stopTask) {
                            const activeTimeEntry = this.getActiveTimeEntry();
                            this.$store.dispatch('stopTimer');
                            this.$store.dispatch('stopTask', { task: activeTimeEntry });
                        }
                        this.$store.dispatch('startTask', { task: this.task });
                        this.$store.dispatch('startTimer');
                    });
            } else {
                this.confirmStopActive = false;
                if (stopTask) {
                    const activeTimeEntry = this.getActiveTimeEntry();
                    this.$store.dispatch('stopTimer');
                    this.$store.dispatch('stopTask', { task: activeTimeEntry });
                }
                this.$store.dispatch('startTask', { task: this.task });
                this.$store.dispatch('startTimer');
            }
        },
        getActiveTimeEntry() {
            let activeTimeEntry = {};
            this.$store.getters.tasks.map((task) => { // find active task in all tasks
                activeTimeEntry = task.time_entries.find(timeEntry => (
                    timeEntry.id === this.$store.getters.activeTask
                ));
                return task;
            });
            return activeTimeEntry;
        },
        addTimeEntry(timeEntry) {
            this.$store.dispatch('addTimeEntry', timeEntry);
            this.closeEditor();
        },
        getTodayTasks() {
            return new Promise((resolve) => {
                if (this.$store.state.date !== this.date) {
                    this.$store.dispatch('getTasks', { date: this.date }).then(() => resolve());
                }
            });
        },
        deleteTask() {
            this.dialogVisible = false;
            const activeTimeEntry = this.getActiveTimeEntry();
            if (activeTimeEntry && activeTimeEntry.task_id === this.task.id) {
                this.stopTask();
            }
            this.$store.dispatch('deleteTask', { task: this.task, index: this.index });
        },
        currentTime() {
            return moment();
        },
        time(time) {
            return moment(time, 'HH:mm:ss').format('HH:mm');
        },
    },
    components: {
        TimeEntryEditor, TaskEditor, TimeEntry,
    },
};
</script>

<style lang="scss" rel="stylesheet/css" scoped>
    .el-icon-more {
        margin: 5px;
    }
	.el-col {
		padding: 15px;
	}

    .el-icon-caret-right {
        font-size: 20px;
        cursor: pointer;
    }

	.start-button {
		padding: 5px;
	}

	.stop-button {
		padding: 5px;
	}

	.active-tag {
		color: #fff;
	}

    .description {
        cursor: pointer;
    }

    .red {
        color: #f56c6c;
    }

	.editor-enter-active{
        transition: opacity .5s;
    }

    .editor-enter, .editor-leave-to {
        opacity: 0;
    }

    .total {
        float: right;
        margin-right: 50px;
    }
</style>

<style>
    .el-icon-arrow-down, .el-icon-arrow-up, .el-icon-more {
        cursor: pointer;
    }

    .gray-text {
        color: #b4bccc;
    }

    .el-popover {
        min-width: 85px;
    }

</style>