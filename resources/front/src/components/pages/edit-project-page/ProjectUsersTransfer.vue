<template>
    <div>
        <el-transfer v-model="usersInTransfer"
                     :data="usersData"
                     :titles="['All Users', 'Project Users']"
                     :render-content="renderUsers"
                     @change="moveUsers"
        >

        </el-transfer>
        <!-- Set rates dialog-->
        <el-dialog title="Change rates"
                   :visible.sync="showUsersRates"
                   :show-close="false"
                   :close-on-press-escape="false"
                   :close-on-click-modal="false"
        >
            <el-table :data="usersForChangeRates.newValue">
                <el-table-column label="Name" prop="name"></el-table-column>
                <el-table-column label="Rate">
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
                                   @click="resetUserRate(scope.$index)">
                            <span class="el-icon-refresh"></span>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer">
                <el-button type="plain" @click="resetAllUsersRates">Reset All</el-button>
                <el-button type="success" @click="setUsersRates">Apply</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import notification from '../../../mixins/notification';

    export default {
        props : ['isEditing', 'isCreating', 'project', 'ownUsers', 'projectTeams'],
        mixins: [notification],
        data() {
            return {
                showModal      : false,
                usersInTransfer: [],
                usersGenerated : false,
                projectUsers   : [],
                showUsersRates : false,

                usersForChangeRates: {
                    oldValue: [],
                    newValue: [],
                },
            };
        },
        computed: {
            // Generating users data for transfer
            usersData() {
                const data = [];
                const users = this.ownUsers;
                users.forEach((user) => {
                    let userIsInProject = null;
                    if (this.isEditing && this.project.teams) {
                        userIsInProject = this.project.users.find(userInProject => (
                            user.id === userInProject.id ? userInProject : null
                        ));
                        if (!this.usersGenerated) {
                            this.project.users.map((localUser) => {
                                this.usersInTransfer.push(localUser.id);
                                this.projectUsers.push({
                                    id               : localUser.id,
                                    cost_rate        : localUser.pivot.cost_rate,
                                    cost_currency    : localUser.pivot.cost_currency,
                                    billable_rate    : localUser.pivot.billable_rate,
                                    billable_currency: localUser.pivot.billable_currency,
                                });
                                return localUser;
                            });
                            this.syncProjectUsers();
                            this.usersGenerated = true;
                        }
                    }
                    data.push({
                        key  : user.id,
                        label: user.name,

                        cost_rate: userIsInProject
                            ? userIsInProject.pivot.cost_rate
                            : null,

                        cost_currency: userIsInProject
                            ? userIsInProject.pivot.cost_currency
                            : null,

                        billable_rate: userIsInProject
                            ? userIsInProject.pivot.billable_rate
                            : null,
                    });
                });
                return data;
            },
        },
        methods: {
            // Handle function for transfer users adding
            moveUsers(value, direction, movedKeys) {
                if (direction === 'right') {
                    movedKeys.forEach((key) => {
                        const user = {};
                        const oldUser = {};
                        const userInArray = this.getUser(key);

                        if (this.userIsInProject(userInArray.id)) {
                            setTimeout(() => {
                                this.showWarning(`${userInArray.name} is already added to project`);
                            });
                            this.usersInTransfer = this.usersInTransfer
                                .filter(userId => userId !== key);
                            return key;
                        }

                        this.showUsersRates = true;

                        if (userInArray) {
                            Object.assign(user, userInArray);
                            Object.assign(oldUser, userInArray);
                        }
                        this.usersForChangeRates.oldValue.push(oldUser);
                        this.usersForChangeRates.newValue.push(user);
                        return key;
                    });
                } else {
                    this.projectUsers = this.projectUsers.filter(userData => (
                        !movedKeys.find(userId => (
                            userId === userData.id
                        ))
                    ));
                }
                this.syncProjectUsers();
            },
            // Handle function for transfer teams adding
            cloneDeep(object) {
                return JSON.parse(JSON.stringify(object));
            },
            // Render one user row in transfer
            renderUsers(h, option) {
                return h('span', [
                    option.label,
                    h('span', //eslint-disable-line
                        {
                            class: {
                                rate: true,
                            },
                            attrs: {
                                title: 'Project rate',
                            },
                        },
                        [
                            (option.cost_currency) ? option.cost_currency : '',
                            option.cost_rate,
                        ]
                    ),
                ]);
            },
            // Set users rates
            setUsersRates() {
                this.showUsersRates = false;
                this.usersForChangeRates.newValue.forEach((user) => {
                    this.projectUsers.push(user);
                });
                this.syncProjectUsers();
                this.usersForChangeRates.oldValue = [];
                this.usersForChangeRates.newValue = [];
            },
            resetUserRate(userIndex) {
                this.usersForChangeRates
                    .newValue[userIndex]
                    .cost_rate = this.usersForChangeRates
                        .oldValue[userIndex]
                        .cost_rate;
                this.usersForChangeRates
                    .newValue[userIndex]
                    .cost_currency = this.usersForChangeRates
                        .oldValue[userIndex]
                        .cost_currency;
            },
            resetAllUsersRates() {
                this.usersForChangeRates.newValue = this.cloneDeep(this.usersForChangeRates.oldValue);
            },
            getUser(userId) {
                return this.ownUsers.find(user => user.id === userId);
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
            syncProjectUsers() {
                this.$emit('set-project-users', this.projectUsers);
            },
        },
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
