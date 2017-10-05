<template >
	<div>
		<one-task v-for="(task, index) in sortedTasks" :task="task" :index="index" :tasks="sortedTasks"></one-task>
	</div>
</template>

<script>
import OneTask from './OneTask.vue';
import moment from 'moment';//eslint-disable-line

export default {
    computed: {
        sortedTasks() {
            return this.$store.getters.tasks.sort(this.compare);
        },
    },
    methods: {
        compare(a, b) {
            let result;
            if (moment(a.startTime, 'HH:mm:ss').isAfter(moment(b.startTime, 'HH:mm:ss'))) {
                result = 1;
            } else if (moment(b.startTime, 'HH:mm:ss').isAfter(moment(a.startTime, 'HH:mm:ss'))) {
                result = -1;
            }
            return result;
        },
    },
    components: {
        OneTask,
    },
};
</script>

<style lang="scss" rel="stylesheet/css" scoped>
	

</style>