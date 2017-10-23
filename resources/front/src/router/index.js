import Vue from 'vue';
import Router from 'vue-router';
// import Hello from '@/components/Hello';
import Home from '../components/pages/HomePage.vue';
import Features from '../components/pages/FeaturesPage.vue';
import Pricing from '../components/pages/PricingPage.vue';
import Tracker from '../components/pages/TrackerPage.vue';
import Projects from '../components/pages/ProjectsPage.vue';
import NewProject from '../components/pages/NewProjectPage.vue';
import Members from '../components/pages/MembersPage.vue';
import Teams from '../components/pages/TeamsPage.vue';
import NewTeam from '../components/pages/NewTeamPage.vue';
import EditTeam from '../components/pages/EditTeamPage.vue';
import EditProject from '../components/pages/EditProjectPage.vue';
import Clients from '../components/pages/ClientsPage.vue';
import NewClient from '../components/pages/NewClientPage.vue';
import Profile from '../components/pages/ProfilePage.vue';

Vue.use(Router);

export default new Router({
    // mode: 'history',
    routes: [
        // {
        //   path: '/',
        //   name: 'Hello',
        //   component: Hello,
        // },

        // {
        //     path: '/',
        //     name: 'Home',
        //     component: Home,
        // },
        {
            path: '/features',
            name: 'Features',
            component: Features,
        },
        {
            path: '/pricing',
            name: 'Pricing',
            component: Pricing,
        },
        {
            path: '/',
            name: Tracker,
            component: Tracker,
        },
        {
            path: '/projects',
            name: 'Projects',
            component: Projects,
        },
        {
            path: '/projects/new',
            name: 'NewProject',
            component: NewProject,
        },
        {
            path: '/members',
            name: 'Members',
            component: Members,
        },
        {
            path: '/teams',
            name: 'Teams',
            component: Teams,
        },
        {
            path: '/teams/new',
            name: 'NewTeam',
            component: NewTeam,
        },
        {
            path: '/teams/:teamId',
            name: 'editTeam',
            component: EditTeam,
            props: true,
        },
        {
            path: '/projects/:projectId',
            name: 'editProject',
            component: EditProject,
            props: true,
        },
        {
            path: '/clients',
            name: 'Clients',
            component: Clients,
        },
        {
            path: '/clients/new',
            name: 'NewClient',
            component: NewClient,
        },
        {
            path: '/profile',
            name: 'Profile',
            component: Profile,
        },
    ],
});
