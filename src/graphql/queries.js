import gql from 'graphql-tag';

const fetchMe = gql`
    query fetchMe{
         fetchMe {
            uuid,
            name,
            firstName,
            lastName,
            middleName,
            email,
            organizations {
                uuid,
                name,
                options {
                    status
                }
            }
        }
    }
`;

const searchAllUsers = gql`
    query searchAllUsers($queryString: String!) {
        searchAllUsers(queryString: $queryString) {
            uuid,
            name,
            email,
            costRate,
        }
    }
`;

const searchOrganizationMembers = gql`
    query searchOrganizationMembers($queryString: String!, $organizationUuid: String!) {
        searchOrganizationMembers(queryString: $queryString, organizationUuid: $organizationUuid) {
            uuid,
            name,
            email,
            costRate
        }
    }
`;

const fetchOrganization = gql`
        query fetchOrganization($uuid: String!) {
            fetchOrganization(uuid: $uuid) {
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

const fetchOrganizationMembers = gql`
    query fetchOrganizationMembers($organizationUuid: String!) {
        fetchOrganizationMembers(organizationUuid: $organizationUuid) {
            uuid,
            name,
            email,
            statusInOrganization(organizationUuid: $organizationUuid),
            costRate
        }
    }
`;

const fetchTeams = gql`
    query fetchTeams($ownerType: String!, $ownerUuid: String!, $userUuid: String) {
        fetchTeams(ownerType: $ownerType, ownerUuid: $ownerUuid, userUuid: $userUuid) {
            uuid,
            name,
            ownerType,
            ownerUuid,
            ownerName,
            users {
                name,
                email
            }
        }
    }
`;

const fetchTeam = gql`
    query fetchTeam($uuid: String!) {
        fetchTeam(uuid: $uuid) {
            uuid,
            name,
            ownerType,
            ownerUuid,
            users {
                uuid,
                name
            }
        }
    }
`;

const searchPersonalTeams = gql`
    query searchPersonalTeams($queryString: String!, $userUuid: String!) {
      searchPersonalTeams(queryString: $queryString, userUuid: $userUuid) {
            uuid,
            name,
            ownerType,
            ownerUuid,
            users {
                uuid,
                name,
                costRate
            }
        }
    }
`;

const searchOrganizationTeams = gql`
    query searchOrganizationTeams($queryString: String!, $organizationUuid: String!) {
      searchOrganizationTeams(queryString: $queryString, organizationUuid: $organizationUuid) {
            uuid,
            name,
            ownerType,
            ownerUuid,
            users {
                uuid,
                name,
                costRate
            }
        }
    }
`;

const fetchClients = gql`
    query fetchClients($organizationUuid: String!) {
        fetchClients(organizationUuid: $organizationUuid) {
            uuid,
            name,
            organizationUuid,
            contactUuid,
            address,
            invoicePrefix,
            rate,
            contact {
                name
            }
        }
    }
`;

const fetchClient = gql`
    query fetchClient($uuid: String) {
        fetchClient(uuid: $uuid) {
            uuid,
            name,
            organizationUuid,
            contactUuid,
            address,
            invoicePrefix,
            rate,
            contact {
                uuid,
                firstName,
                lastName,
                email,
                telephone
            }
        }
    }
`;

const fetchProjects = gql`
    query fetchProjects($ownerType: String!, $ownerUuid: String!, $userUuid: String, $key: String) {
        fetchProjects(ownerType: $ownerType, ownerUuid: $ownerUuid, userUuid: $userUuid, key: $key) {
            uuid,
            name,
            clientName,
            ownerType,
            ownerName,
            ownerUuid,
            teams {
                uuid,
                name,
                ownerType,
                ownerName,
                users {
                    uuid,
                    name
                }
            },
            users {
                uuid,
                name,
                options {
                    costRate
                }
            },
        }
    }
`;

const fetchProject = gql`
    query fetchProject($uuid: String!) {
        fetchProject(uuid: $uuid) {
            uuid,
            name,
            clientUuid,
            teams {
                uuid,
                name,
                ownerUuid,
                ownerType,
                users(projectUuid: $uuid) {
                    uuid,
                    name,
                    options {
                        costRate
                    }
                }
            },
            users {
                uuid,
                name,
                options {
                    costRate
                }
            }
        }
    }
`;

const fetchTasks = gql`
    query fetchTasks($date: String!, $userUuid: String!, $organizationUuid: String) {
        fetchTasks(date: $date, userUuid: $userUuid, organizationUuid: $organizationUuid) {
            uuid,
            description,
            eta,
            projectUuid,
            userUuid,
            total(date: $date),
            createdAt,
            project {
                uuid,
                name,
                ownerUuid,
                ownerType
            }
            timeEntries(date: $date) {
                uuid,
                active,
                taskUuid,
                startTime,
                endTime
            }
        }
    }
`;

export default {
  fetchMe,
  searchAllUsers,
  searchOrganizationMembers,
  fetchOrganization,
  fetchOrganizationMembers,
  fetchTeams,
  fetchTeam,
  searchPersonalTeams,
  searchOrganizationTeams,
  fetchClients,
  fetchClient,
  fetchProjects,
  fetchProject,
  fetchTasks,
};
