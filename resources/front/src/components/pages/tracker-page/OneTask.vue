<template>
	<div>
		<div v-if="!isEditing" class="row">
			<div class="col col-xs-1">
				<input type="checkbox" 
					v-model="tasks[index].checked"
				>
			</div>
			<div class="col col-xs-3" @click="showEditor">
				<span v-if="task.description != null " class="description">{{ task.description }}</span>
				<span v-else > (no description) </span>
				<transition name="editor">
					<span v-if="task.active" class=" label label-success">Active</span>
				</transition>
			</div>
			<div class="col col-xs-3" @click="showEditor">
				<small v-if="task.startTime !== null" class="text-muted"> {{ time(task.startTime) }} - <span v-if="task.endTime == null">now</span> <span v-else >{{ time(task.endTime) }}</span> </small>
			</div> 
			<div class="col col-xs-3" @click="showEditor">
				<!-- <span v-if="task.startTime !== null"><span v-if="task.spendTime !== null">{{ spendTime }}</span></span> -->
				<span v-if="task.startTime !== null"><span >{{ spendTime }}</span></span>
			</div>	
			<div class="col col-xs-1">
				<span title="Stop timer"> 
					<button v-if="this.task.active" @click="stopTask" class="btn btn-icon-danger">
						<i class="fa fa-stop"></i> 
					</button>
				</span>
				<span title="Continue task"> 
					<button v-if="!this.task.active" @click="continueTask" class="btn btn-icon-success">
						<i class="fa fa-play"></i> 
					</button>
				</span>
			</div>
			<div class="col col-xs-1">
				<span>
					<button @click="deleteTask" class="btn btn-icon-danger"><i class="fa fa-times" ></i></button>
				</span>
			</div>			
		</div>
		<transition name="editor">
			<time-entry-editor v-if="isEditing" @update-task="updateTask" @close-editor="closeEditor" :editTask="true" :task="task"></time-entry-editor>
		</transition>

		
	</div>
</template>

<script>
import TimeEntryEditor from './TimeEntryEditor.vue';
import moment from 'moment';//eslint-disable-line
import { mapActions } from 'vuex';//eslint-disable-line

export default {
    props: ['task', 'index', 'tasks'],
    data() {
        return {
            isEditing: false,
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
            return (hours > 0 ? hours + ' h ' : '') + minutes + ' min ';//eslint-disable-line
        },
    },
    methods: {
        showEditor() {
            this.isEditing = true;
        },
        closeEditor() {
            this.isEditing = false;
        },
        updateTask(task) {
        	task.spendTime = moment(task.spendTime, 'HH [h] mm [min]').format('HH:mm:ss');
            this.$store.dispatch('updateTask', { task, index: this.index });
            // this.task = Object.assign({}, task);
            this.isEditing = false;
        },
        stopTask() {
            this.$store.dispatch('stopTimer');
            this.$store.dispatch('stopTask', { task_id: this.task.id, index: this.index, task: this.task });
        },
        continueTask() {
        	this.$store.dispatch('startTimer');
        	this.$store.dispatch('createTask');
        },
        deleteTask(){
        	if (this.task.active == true && moment().diff(moment(this.task.startTime, 'HH:mm:ss'), 'seconds') < 60 ) {
        		this.stopTask();
        	} else if (this.task.active == true) {
        		this.$store.dispatch('stopTimer');
        		this.$store.dispatch('deleteTask', {task_id: this.task.id, index: this.index});
        	} else {
        		this.$store.dispatch('deleteTask', {task_id: this.task.id, index: this.index});
        	}
        },
        currentTime() {
            return moment();
        },
        time(time) {
            return moment(time, 'HH:mm:ss').format('HH:mm'); //eslint-disable-line
        },
    },
    components: {
        TimeEntryEditor,
    },
};
</script>

<style lang="scss" rel="stylesheet/css">
	.col {
			padding: 20px 35px;
			padding-right: 0; 
		}

		.label-success {
			background-color: #00bc6a; 
		}

		.description {
			margin-right: 10px;
		}

	.label {
	    display: inline-block;
	    padding: 4px 6px;
	    font-size: 11px;
	    font-weight: 400;
	    color: #fff;
	    vertical-align: baseline;
	    border-radius: 3px;
	    text-transform: uppercase;
	    letter-spacing: .5px;
	    font-family: "Open Sans",sans-serif;
	}

	.btn-icon-danger {
		color: #e26a6a;
		background: none;
	}

	.btn-icon-danger:hover:active {
		color: #e26a6a;
    	background-color: rgba(226,106,106,.1);
    	border-color: transparent;
    	border-radius: 17px;
	}

	.btn-icon-success {
		color: rgba(82,82,82,.4);
    	background-color: transparent;
    	border-color: transparent;
	}

	.btn-icon-success:hover {
		color: #00bc6a;
    	background-color: rgba(0,188,106,.1);
    	border-color: transparent;
    	border-radius: 17px;
	}

	.editor-enter-active{
        transition: opacity .5s;
    }

    .editor-enter, .editor-leave-to {
        opacity: 0;
    }
</style>