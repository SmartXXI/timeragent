import router from '.';
import store from '../store';
import Login from '../components/pages/LoginPage';
import Register from '../components/pages/RegisterPage';
import VerifyUserPage from '../components/pages/VerifyUserPage';
import GenericLayout from '../components/blocks/GenericLayout';
import Tasks from '../components/pages/TasksPage';
import Projects from '../components/pages/ProjectsPage';
import EditProject from '../components/pages/EditProjectPage';
import Members from '../components/pages/MembersPage';
import InviteMembers from '../components/pages/InviteMembersPage';
import Teams from '../components/pages/TeamsPage';
import EditTeam from '../components/pages/EditTeamPage';
import Profile from '../components/pages/ProfilePage';
import EditOrganization from '../components/pages/EditOrganizationPage';
import Organization from '../components/pages/OrganizationPage';
import Clients from '../components/pages/ClientsPage';
import EditClient from '../components/pages/EditClientPage';

import notification from '../notification';


const routes = [
  {
    path: '/',
    name: 'home',

    beforeEnter() {
      router.push({
        name: 'tasks',
        params: {
          segment: 'personal',
        },
      });
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      name: 'Tasks',
    },

    beforeEnter(to, from, next) {
      // If the user is authorized redirect to
      if (localStorage.getItem('accessToken')) {
        router.push({
          name: 'tasks',
          params: {
            segment: 'personal',
          },
        });
      } else {
        next();
      }
    },
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      name: 'Register',
    },
  },
  {
    path: '/verify/:verificationCode',
    name: 'verify',
    component: VerifyUserPage,
    props: true,
    meta: {
      name: 'Verify',
    },

    beforeEnter(to) {
      if (localStorage.getItem('accessToken')) {
        router.push({
          name: 'tasks',
          params: {
            segment: 'personal',
          },
        });
      }
      store.dispatch('verifyEmail', {
        verificationCode: to.params.verificationCode,
      })
        .then(({ verifyEmail }) => {
          if (verifyEmail.statusCode === 200) {
            notification.showSuccess(verifyEmail.message);
          } else {
            notification.showError(verifyEmail.message);
          }
          router.push({ name: 'login' });
        });
    },
  },
  {
    path: '/:segment(personal)',
    // name: 'personal',

    component: GenericLayout,
    children: [
      {
        path: 'tasks',
        name: 'tasks',
        component: Tasks,
        meta: {
          name: 'Tasks',
        },

        beforeEnter(to, from, next) {
          localStorage.getItem('accessToken');
          store.dispatch('getTasks', {
            userUuid: store.getters.user.uuid,
            date: store.getters.date,
          })
            .then(() => next());
          // }
        },
      },
      {
        path: 'teams',
        name: 'Teams',
        component: Teams,
        meta: {
          name: 'Teams',
        },

        beforeEnter(to, from, next) {
          store.dispatch('getTeams', {
            ownerType: 'user',
            ownerUuid: store.getters.user.uuid,
          })
            .then(() => {
              next();
            });
        },
      },
      {
        path: 'teams/new',
        name: 'newTeam',
        component: EditTeam,
      },
      {
        path: 'teams/:teamUuid',
        name: 'editTeam',
        component: EditTeam,
        props: true,
        meta: {
          name: 'New Team',
        },

        beforeEnter(to, from, next) {
          store.dispatch('getOneTeam', {
            uuid: to.params.teamUuid,
          })
            .then(() => next());
        },
      },
      {
        path: 'projects',
        name: 'Projects',
        component: Projects,
        meta: {
          name: 'Projects',
        },

        beforeEnter(to, from, next) {
          store.dispatch('getProjects', {
            ownerType: 'user',
            ownerUuid: store.getters.user.uuid,
          })
            .then(() => next());
        },
      },
      {
        path: 'projects/new',
        name: 'newProject',
        component: EditProject,
        meta: {
          name: 'New Project',
        },
      },
      {
        path: 'projects/:projectUuid',
        name: 'editProject',
        component: EditProject,
        props: true,
        meta: {
          name: 'Edit Project',
        },

        beforeEnter(to, from, next) {
          store.dispatch('getOneProject', {
            uuid: to.params.projectUuid,
          })
            .then(() => next());
        },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: {
          name: 'Profile',
        },
      },
      {
        path: 'organizations/new',
        name: 'newOrganization',
        component: EditOrganization,
        meta: {
          name: 'New Organization',
        },
      },
    ],
  },

  {
    path: '/:segment(organization)',

    component: GenericLayout,
    children: [
      {
        path: ':organizationUuid/view',
        name: 'organization',
        component: Organization,
        meta: {
          name: 'Organization',
        },
      },
      {
        path: ':organizationUuid/tasks',
        name: 'tasksOrg',
        component: Tasks,
        meta: {
          name: 'Tasks',
        },

        beforeEnter(to, from, next) {
          store.dispatch('getTasks', {
            userUuid: store.getters.user.uuid,
            orgUuid: to.params.organizationUuid,
            date: store.getters.date,
          })
            .then(() => next());
        },
      },
      {
        path: ':organizationUuid/members',
        name: 'members',
        component: Members,
        meta: {
          name: 'Members',
        },

        beforeEnter(to, from, next) {
          store.dispatch('getOrganizationMembers', {
            orgUuid: to.params.organizationUuid,
          })
            .then(() => {
              next();
            });
        },
      },
      {
        path: ':organizationUuid/members/invite',
        name: 'inviteMembers',
        component: InviteMembers,
        meta: {
          name: 'Manage Members',
        },

        beforeEnter(to, from, next) {
          store.dispatch('getOrganizationMembers', {
            orgUuid: to.params.organizationUuid,
          })
            .then(() => {
              next();
            });
        },
      },
      {
        path: ':organizationUuid/edit',
        name: 'editOrganization',
        component: EditOrganization,
        props: true,
        meta: {
          name: 'Edit Organization',
        },
      },
      {
        path: ':organizationUuid/teams',
        name: 'orgTeams',
        component: Teams,
        meta: {
          name: 'Teams',
        },

        beforeEnter(to, from, next) {
          store.dispatch('getTeams', {
            ownerType: 'organization',
            ownerUuid: to.params.organizationUuid,
            userUuid: store.getters.user.uuid,
          })
            .then(() => next());
        },
      },
      {
        path: ':organizationUuid/teams/new',
        name: 'newOrgTeam',
        component: EditTeam,
        meta: {
          name: 'New Team',
        },
      },
      {
        path: ':organizationUuid/teams/:teamUuid',
        name: 'editOrgTeam',
        component: EditTeam,
        props: true,
        meta: {
          name: 'Edit Team',
        },

        beforeEnter(to, from, next) {
          store.dispatch('getOneTeam', {
            uuid: to.params.teamUuid,
          })
            .then(() => next());
        },
      },
      {
        path: ':organizationUuid/projects',
        name: 'projectsOrg',
        component: Projects,
        meta: {
          name: 'Projects',
        },

        beforeEnter(to, from, next) {
          store.dispatch('getProjects', {
            ownerType: 'organization',
            ownerUuid: to.params.organizationUuid,
            userUuid: store.getters.user.uuid,
          })
            .then(() => next());
        },
      },
      {
        path: ':organizationUuid/projects/new',
        name: 'newOrgProject',
        component: EditProject,
        meta: {
          name: 'New Project',
        },
      },
      {
        path: ':organizationUuid/projects/:projectUuid',
        name: 'editOrgProject',
        component: EditProject,
        props: true,
        meta: {
          name: 'Edit Project',
        },

        beforeEnter(to, from, next) {
          store.dispatch('getOneProject', {
            uuid: to.params.projectUuid,
          })
            .then(() => next());
        },
      },
      {
        path: ':organizationUuid/clients',
        name: 'clients',
        component: Clients,
        meta: {
          name: 'Clients',
        },

        beforeEnter(to, from, next) {
          store.dispatch('getClients', {
            orgUuid: store.getters.organization.uuid,
          })
            .then(() => next());
        },
      },
      {
        path: ':organizationUuid/clients/new',
        name: 'newClient',
        component: EditClient,
        meta: {
          name: 'New Client',
        },
      },
      {
        path: ':organizationUuid/clients/:clientUuid',
        name: 'editClient',
        component: EditClient,
        props: true,

        beforeEnter(to, from, next) {
          store.dispatch('getOneClient', {
            uuid: to.params.clientUuid,
          })
            .then(() => next());
        },
      },
    ],
  },
];

export default routes;
