<template>
    <div>
        <el-transfer v-model="teamsInTransfer"
                     :data="teamsData"
                     :titles="['My Teams', 'Project Teams']"
                     :render-content="renderTeams"
                     @change="moveTeams"
        >
        </el-transfer>

        <!-- Show team members modal form -->
        <el-dialog title="Members"
                   :visible.sync="showModal"
                   width="40%">
            <el-table :data="membersDataTable">
                <el-table-column label="Name" prop="name"></el-table-column>
            </el-table>
            <span slot="footer">
                <el-button @click="showModal = false">Close</el-button>
            </span>
        </el-dialog>

        <el-dialog title="Users rate in project"
                   :visible.sync="showTeamUsersRates"
                   :show-close="false"
                   width="60%"
                   :close-on-press-escape="false"
                   :close-on-click-modal="false"
        >
            <el-collapse v-model="openedTeams">
                <el-collapse-item v-for="(team, index) in teamsForChangeRates.newValue" :key="team.id" :title="team.name" :name="team.name">
                    <el-table :data="team.users">
                        <el-table-column label="Name" prop="name" :width="300"></el-table-column>
                        <el-table-column label="Rate" :width="200">
                            <template slot-scope="scope">
                                <el-input-number v-model="scope.row.cost_rate" :step="1" :min="0"></el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column label="Currency">
                            <template slot-scope="scope">
                                <el-radio-group v-model="scope.row.cost_currency">
                                    <el-radio-button label="$" title="Dollar USA"></el-radio-button>
                                    <el-radio-button label="€" title="Euro"></el-radio-button>
                                    <el-radio-button label="₴" title="Hryvna"></el-radio-button>
                                    <el-radio-button label="£" title="Funt sterling"></el-radio-button>
                                </el-radio-group>
                            </template>
                        </el-table-column>
                        <el-table-column :width="100">
                            <template slot-scope="scope">
                                <el-button type="plain"
                                           title="Reset"
                                           size="mini"
                                           @click="resetTeamUserRate(index, scope.$index)">
                                    <span class="el-icon-refresh"></span>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
            <span slot="footer">
                <el-button type="plain" @click="resetAllTeamsRates">Reset All</el-button>
                <el-button type="success" @click="setTeamsRates">Apply</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import notification from '../../../mixins/notification';

    export default {
        props : ['isEditing', 'isCreating', 'project', 'ownTeams', 'projectUsers'],
        mixins: [notification],
        data() {
            return {
                teamsGenerated : false,
                teamsInTransfer: [],
                projectTeams   : [],
                openedTeams    : [],
                showModal      : false,

                membersDataTable   : [],
                showTeamUsersRates : false,
                teamsForChangeRates: {
                    oldValue: [],
                    newValue: [],
                },
            };
        },
        computed: {
            teamsData() {
                const data = [];
                const teams = this.ownTeams;
                teams.forEach((team) => {
                    data.push({
                        key  : team.id,
                        label: team.name,
                        users: team.users,
                    });
                });
                if (this.isEditing) {
                    if (!this.teamsGenerated && this.project.teams) {
                        this.project.teams.map((team) => {
                            this.teamsInTransfer.push(team.id);
                            this.projectTeams.push({
                                id   : team.id,
                                users: team.users,
                            });
                            return team;
                        });
                        this.syncProjectTeams();
                        this.teamsGenerated = true;
                    }
                }
                return data;
            },
        },
        methods: {
            moveTeams(value, direction, movedKeys) {
                if (direction === 'right') {
                    movedKeys.forEach((key) => {
                        let team = {};
                        let oldTeam = {};
                        const teamInArray = this.getTeam(key);

                        const usersInProject = teamInArray.users
                            .filter(user => this.userIsInProject(user.id));


                        if (usersInProject.length) {
                            const names = usersInProject.map(user => user.name);

                            setTimeout(() => {
                                this.showWarning(`${names.join(', ')} ${(names.length === 1) ? 'is' : 'are'} already added to project`);
                            });

                            this.teamsInTransfer = this.teamsInTransfer
                                .filter(teamId => teamId !== key);
                            return key;
                        }

                        this.showTeamUsersRates = true;

                        teamInArray.users.forEach((user) => {
                            if (this.userIsInProject(user.id)) {
                                this.showWarning(`${user.name} is already added to project`);
                            }
                        });

                        if (teamInArray) {
                            team = this.cloneDeep(teamInArray);
                            oldTeam = this.cloneDeep(teamInArray);
                        }
                        this.teamsForChangeRates.oldValue.push(oldTeam);
                        this.teamsForChangeRates.newValue.push(team);
                        return key;
                    });
                    if (this.teamsForChangeRates.newValue.length === 1) {
                        this.openedTeams.push(this.teamsForChangeRates.newValue[0].name);
                    }
                } else {
                    this.projectTeams = this.projectTeams.filter(teamData => (
                        !movedKeys.find(teamId => teamId === teamData.id)
                    ));
                }
                this.syncProjectTeams();
            },
            renderTeams(h, option) {
                return h('span', [h('el-button', {
                    class: {
                        'member-item': true,
                    },
                    attrs: {
                        type: 'text',
                    },
                    on: {
                        click: () => {
                            this.membersDataTable = option.users;
                            this.showModal = true;
                        },
                    },
                }, option.label)]);
            },
            setTeamsRates() {
                this.showTeamUsersRates = false;
                this.teamsForChangeRates.newValue.forEach((team) => {
                    this.projectTeams.push(team);
                });
                this.syncProjectTeams();
                this.teamsForChangeRates.oldValue = [];
                this.teamsForChangeRates.newValue = [];
                this.openedTeams = [];
            },
            resetTeamUserRate(teamIndex, userIndex) {
                this.teamsForChangeRates
                    .newValue[teamIndex]
                    .users[userIndex]
                    .cost_rate = this.teamsForChangeRates
                        .oldValue[teamIndex]
                        .users[userIndex]
                        .cost_rate;
                this.teamsForChangeRates
                    .newValue[teamIndex]
                    .users[userIndex]
                    .cost_currency = this.teamsForChangeRates
                        .oldValue[teamIndex]
                        .users[userIndex]
                        .cost_currency;
            },
            resetAllTeamsRates() {
                this.teamsForChangeRates
                    .newValue = this.cloneDeep(this.teamsForChangeRates.oldValue);
            },
            getTeam(teamId) {
                return this.ownTeams.find(team => team.id === teamId);
            },
            // Check if the user is already attached to project
            userIsInProject(userId) {
                const inTeams = !!this.projectTeams
                    .filter(team => (
                        !!team.users
                            .find(user => user.id === userId)
                    ))
                    .length;
                const inProject = !!this.projectUsers
                    .find(user => user.id === userId);
                return inTeams || inProject;
            },
            cloneDeep(object) {
                return JSON.parse(JSON.stringify(object));
            },
            syncProjectTeams() {
                this.$emit('set-project-teams', this.projectTeams);
            },
            resetBeforeClose(done) {
                this.$confirm('Are you sure to close this dialog?')
                    .then(() => {
                        this.resetAllTeamsRates();
                        done();
                    })
                    .catch(() => {});
            },
        },
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
