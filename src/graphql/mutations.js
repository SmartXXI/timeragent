import gql from 'graphql-tag';

const LOGIN_USER = gql`
    mutation loginUser($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
          tokenType,
          accessToken,
          refreshToken,
          expiresIn
        }
    }
`;

const CREATE_USER = gql`
    mutation createUser($user: UserInput!) {
        createUser(user: $user) {
            status
            message
            statusCode
            redirectUrl
        }
    }
`;

const UPDATE_USER = gql`
    mutation updateUser($user: UserInput!) {
        updateUser(user: $user) {
            uuid,
            email,
            firstName,
            lastName,
            middleName,
        }
    }
`;

const CREATE_ORGANIZATION = gql`
    mutation createOrganization($organization: OrganizationInput!, $userUuid: String!) {
        createOrganization(organization: $organization, userUuid: $userUuid) {
            uuid,
            email,
            name,
            address,
            phone,
            website,
        }
    }
`;

const UPDATE_ORGANIZATION = gql`
    mutation updateOrganization($organization: OrganizationInput!) {
        updateOrganization(organization: $organization) {
            uuid,
            email,
            name,
            address,
            phone,
            website,
            owners {
                uuid,
                firstName,
                lastName,
                options {
                    status
                }
            }
        }
    }
`;

const UPDATE_ORGANIZATION_MEMBERS = gql`
    mutation updateOrganization($organizationUuid: String!, $members: [UserInput]) {
        updateOrganizationMembers(organizationUuid: $organizationUuid, members: $members) {
            uuid,
            name,
            email,
            statusInOrganization(organizationUuid: $organizationUuid),
        }
    }
`;

const VERIFY_EMAIL = gql`
    mutation verifyEmail($verificationCode: String!) {
        verifyEmail(verificationCode: $verificationCode) {
            status,
            message,
            statusCode
        }
    }
`;

const CREATE_TEAM = gql`
    mutation createTeam($team: TeamInput!) {
        createTeam(team: $team) {
            uuid,
            name,
            users {
                name
            }
        }
    }
`;

const UPDATE_TEAM = gql`
    mutation updateTeam($team: TeamInput!) {
        updateTeam(team: $team) {
            uuid,
            name,
            users {
                name
            }
        }
    }
`;

const DELETE_TEAM = gql`
    mutation deleteTeam($uuid: String!) {
        deleteTeam(uuid: $uuid) {
            name
        }
    }
`;

const CREATE_CLIENT = gql`
    mutation createClient($client: ClientInput!, $contact: ContactInput!) {
        createClient(client: $client, contact: $contact) {
            uuid,
            name
        }
    }
`;

const UPDATE_CLIENT = gql`
    mutation updateClient($client: ClientInput!, $contact: ContactInput!) {
        updateClient(client: $client, contact: $contact) {
            uuid,
            name
        }
    }
`;

const DELETE_CLIENT = gql`
    mutation deleteClient($clientUuid: String!, $contactUuid: String!) {
        deleteClient(clientUuid: $clientUuid, contactUuid: $contactUuid) {
            name
        }
    }
`;

const CREATE_PROJECT = gql`
    mutation createProject($project: ProjectInput!) {
        createProject(project: $project) {
            name
        }
    }
`;

const UPDATE_PROJECT = gql`
    mutation updateProject($project: ProjectInput!) {
        updateProject(project: $project) {
            name
        }
    }
`;

const DELETE_PROJECT = gql`
    mutation deleteProject($uuid: String!) {
        deleteProject(uuid: $uuid) {
            name
        }
    }
`;

const CREATE_TASK = gql`
    mutation createTask($task: TaskInput!) {
        createTask(task: $task) {
            uuid,
            description,
            eta,
            projectUuid,
            userUuid,
            project {
                uuid,
                name,
                ownerUuid,
                ownerType
            }
            timeEntries {
                uuid,
                taskUuid,
                startTime,
                endTime
            }
        }
    }
`;

const UPDATE_TASK = gql`
    mutation updateTask($task: TaskInput!, $date: String) {
        updateTask(task: $task) {
            uuid,
            description,
            eta,
            projectUuid,
            userUuid,
            total(date: $date),
            project {
                uuid,
                name,
                ownerUuid,
                ownerType
            }
            timeEntries(date: $date) {
                uuid,
                taskUuid,
                startTime,
                endTime
            }
        }
    }
`;

const DELETE_TASK = gql`
    mutation deleteTask($uuid: String, $uuids: [String]) {
        deleteTask(uuid: $uuid, uuids: $uuids) {
            uuid,
            description
        }
    }
`;

const CREATE_TIME_ENTRY = gql`
    mutation createTimeEntry($timeEntry: TimeEntryInput!) {
        createTimeEntry(timeEntry: $timeEntry) {
            uuid,
            active,
            taskUuid,
            startTime,
            endTime
        }
    }
`;

const UPDATE_TIME_ENTRY = gql`
    mutation updateTimeEntry($timeEntry: TimeEntryInput!) {
        updateTimeEntry(timeEntry: $timeEntry) {
            uuid,
            active,
            taskUuid,
            startTime,
            endTime
        }
    }
`;

const DELETE_TIME_ENTRY = gql`
    mutation deleteTimeEntry($uuid: String!) {
        deleteTimeEntry(uuid: $uuid) {
            uuid,
        }
    }
`;

export default {
  LOGIN_USER,
  CREATE_USER,
  UPDATE_USER,
  CREATE_ORGANIZATION,
  UPDATE_ORGANIZATION,
  UPDATE_ORGANIZATION_MEMBERS,
  VERIFY_EMAIL,
  CREATE_TEAM,
  UPDATE_TEAM,
  DELETE_TEAM,
  CREATE_CLIENT,
  UPDATE_CLIENT,
  DELETE_CLIENT,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  CREATE_TIME_ENTRY,
  UPDATE_TIME_ENTRY,
  DELETE_TIME_ENTRY,
};
