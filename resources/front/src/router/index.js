import Vue from 'vue';
import Router from 'vue-router';
import GenericLayout from '../components/blocks/GenericLayout';
import Features from '../components/pages/FeaturesPage';
import Pricing from '../components/pages/PricingPage';
import Tracker from '../components/pages/TrackerPage';
import Projects from '../components/pages/ProjectsPage';
import Members from '../components/pages/MembersPage';
import InviteMembers from '../components/pages/InviteMembersPage';
import Teams from '../components/pages/TeamsPage';
import EditTeam from '../components/pages/EditTeamPage';
import EditProject from '../components/pages/EditProjectPage';
import Profile from '../components/pages/ProfilePage';
import EditOrganization from '../components/pages/EditOrganizationPage';
import Organization from '../components/pages/OrganizationPage';
import Clients from '../components/pages/ClientsPage';
import EditClient from '../components/pages/EditClientPage';

Vue.use(Router);

export default new Router({
    // mode: 'history',
    base  : '/personal/',
    routes: [
        {
            path: '/:segment(personal)',
            // name: 'personal',

            component: GenericLayout,
            children : [
                {
                    path     : 'tasks',
                    name     : 'tasks',
                    component: Tracker,
                },
                {
                    path     : 'projects',
                    name     : 'Projects',
                    component: Projects,
                },
                {
                    path     : 'projects/new',
                    name     : 'newProject',
                    component: EditProject,
                },
                {
                    path     : 'teams',
                    name     : 'Teams',
                    component: Teams,
                },
                {
                    path     : 'teams/new',
                    name     : 'newTeam',
                    component: EditTeam,
                },
                {
                    path     : 'teams/:teamId',
                    name     : 'editTeam',
                    component: EditTeam,
                    props    : true,
                },
                {
                    path     : 'projects/:projectId',
                    name     : 'editProject',
                    component: EditProject,
                    props    : true,
                },
                {
                    path     : 'profile',
                    name     : 'Profile',
                    component: Profile,
                },
                {
                    path     : 'organizations/new',
                    name     : 'newOrganization',
                    component: EditOrganization,
                },
            ],
        },

        {
            path: '/:segment(organization)',

            component: GenericLayout,
            children : [
                {
                    path     : ':organizationId/view',
                    name     : 'organization',
                    component: Organization,
                },
                {
                    path     : ':organizationId/tasks',
                    name     : 'tasksOrg',
                    component: Tracker,
                },
                {
                    path     : ':organizationId/members',
                    name     : 'members',
                    component: Members,
                },
                {
                    path     : ':organizationId/members/invite',
                    name     : 'inviteMembers',
                    component: InviteMembers,
                },
                {
                    path     : ':organizationId/edit',
                    name     : 'editOrganization',
                    component: EditOrganization,
                    props    : true,
                },
                {
                    path     : ':organizationId/projects',
                    name     : 'projectsOrg',
                    component: Projects,
                },
                {
                    path     : ':organizationId/projects/new',
                    name     : 'newProjectOrg',
                    component: EditProject,
                },
                {
                    path     : ':organizationId/teams',
                    name     : 'orgTeams',
                    component: Teams,
                },
                {
                    path     : ':organizationId/teams/new',
                    name     : 'newOrgTeam',
                    component: EditTeam,
                },
                {
                    path     : ':organizationId/teams/:teamId',
                    name     : 'editOrgTeam',
                    component: EditTeam,
                    props    : true,
                },
                {
                    path     : ':organizationId/projects/:projectId',
                    name     : 'editProjectOrg',
                    component: EditProject,
                    props    : true,
                },
                {
                    path     : ':organizationId/clients',
                    name     : 'clients',
                    component: Clients,
                },
                {
                    path     : ':organizationId/clients/new',
                    name     : 'newClient',
                    component: EditClient,
                },
                {
                    path     : ':organizationId/clients/:clientId',
                    name     : 'editClient',
                    component: EditClient,
                    props    : true,
                },
                {
                    path     : ':organizationId/profile',
                    name     : 'profileOrg',
                    component: Profile,
                },
            ],
        },
        {
            path     : '/features',
            name     : 'Features',
            component: Features,
        },
        {
            path     : '/pricing',
            name     : 'Pricing',
            component: Pricing,
        },
        {
            path    : '/',
            redirect: 'personal/tasks',
        },
        // {
        //     path     : '/',
        //     name     : Tracker,
        //     component: Tracker,
        // },
        // {
        //     path     : '/projects',
        //     name     : 'Projects',
        //     component: Projects,
        // },
        // {
        //     path     : '/projects/new',
        //     name     : 'newProject',
        //     component: EditProject,
        // },
        // {
        //     path     : '/members',
        //     name     : 'Members',
        //     component: Members,
        // },
        // {
        //     path     : '/teams',
        //     name     : 'Teams',
        //     component: Teams,
        // },
        // {
        //     path     : '/teams/new',
        //     name     : 'newTeam',
        //     component: EditTeam,
        // },
        // {
        //     path     : '/teams/:teamId',
        //     name     : 'editTeam',
        //     component: EditTeam,
        //     props    : true,
        // },
        // {
        //     path     : '/projects/:projectId',
        //     name     : 'editProject',
        //     component: EditProject,
        //     props    : true,
        // },
        // // {
        // //     path     : '/clients',
        // //     name     : 'Clients',
        // //     component: Clients,
        // // },
        // // {
        // //     path     : '/clients/new',
        // //     name     : 'NewClient',
        // //     component: NewClient,
        // // },
        // {
        //     path     : '/profile',
        //     name     : 'Profile',
        //     component: Profile,
        // },
        // {
        //     path     : '/organization/new',
        //     name     : 'newOrganization',
        //     component: EditOrganization,
        // },
        // {
        //     path     : '/organization/:organizationId',
        //     name     : 'organization',
        //     component: Organization,
        //     props    : true,
        // },
        // {
        //     path     : '/organization/:organizationId/edit',
        //     name     : 'editOrganization',
        //     component: EditOrganization,
        //     props    : true,
        // },
    ],
});
