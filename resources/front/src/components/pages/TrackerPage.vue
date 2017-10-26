<template>
    <div>
        <nav-menu-auth></nav-menu-auth>
        <div class="container">
            <div class="row">
                <app-page></app-page>
            </div>
            <div class="row">
                <time-entries></time-entries>
            </div>
        </div>
    </div>
</template>

<script>
    import NavMenuAuth from '../blocks/NavMenuAuth';
    import AppPage from './tracker-page/AppPage';
    import TimeEntries from './tracker-page/TimeEntries';

    export default {
        data() {
            return {
                timerStarted: false,
            };
        },
        created() {
            const date = this.$store.state.date;
            this.$store.dispatch('getTasks', { date });
        },
        methods: {
            startTimer() {
                this.timerStarted = true;
            },
            stopTimer() {
                this.timerStarted = false;
            },
        },
        components: {
            NavMenuAuth, AppPage, TimeEntries,
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
