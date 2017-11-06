<template>
    <div>
        <nav-menu-auth></nav-menu-auth>
        <div class="container">
                <div class="pull-right">
                    <button class="btn btn-wide btn-default btn-lg" @click.prevent="$router.go(-1)"> Cancel </button>
                    <button class="btn btn-wide btn-primary btn-lg" title="Press Ctrl+Enter to save changes" @click.prevent="updateProject" :disabled="formInvalid"> Save </button>
                </div>
                <span class="page-title"> Edit Project </span> 
            <div class="row">
            	<div class="col-md-12"> 
            		<div class="panel panel-default"> 
                        <div class="col-md-8">
                            <div class="form-group row">
                                <div class="col-xs-8"> <label class="control-label" for="project-name">Name</label> 
                                    <input id="project-name" class="form-control" :class="{ 'has-error': $v.project.name.$error }"
                                    placeholder="Enter project name" v-model="project.name" @input="$v.project.name.$touch()">
                                    <i class="fa fa-exclamation-circle error-icon" v-if="$v.project.name.$error">
                                        <div class="errors">
                                            <span class="error-message" v-if="!$v.project.name.required">Field is required</span>
                                        </div> 
                                    </i>
                                </div>
                                <div class="col-xs-4">
                                    <label class="control-label" for="project-status" disabled="disabled">Status</label> 
                                    <div class="dropdown"> 
                                        <button id="project-status" type="button" class="btn-block-justify form-control dropdown-toggle ng-binding" data-toggle="dropdown" disabled="disabled">  
                                        <i class="fa fa-angle-down pull-right"></i> </button> 
                                        <ul class="dropdown-menu full-width"> 
                                            <li role="presentation"> <a href=""> Active </a></li>
                                            <li role="presentation"> <a href=""> Done </a></li>
                                            <li role="presentation"> <a href=""> Archived </a></li>
                                        </ul> 
                                    </div>
                                </div>  
                            </div>

                            <ul class="nav nav-tabs"> 
                                <li class="active"> <a >Team</a> </li> 
                            </ul>
                            <!-- <add-team></add-team> -->
                            <div class="tab-content"> 
                                <div> 
                                    <button type="button" class="btn btn-default" @click.prevent="showModal = true"> Add teams to project </button>
                                </div>
                            </div>
                            <div> 
                                <ul class="list-group margin-top-small"> 
                                    <li v-for="(team, index) in project.teams" class="list-group-item hoverable-element clearfix"> 
                                        <span class="fa fa-users"></span> {{ team.name }} <span class="pull-right"> 
                                        <span class="fa fa-times hoverable-cross" @click="deleteTeam(index, team.id)"></span> 
                                        </span>

                                        <ul class="list-group margin-top-small"> 
                                            <li v-for="member in team.users" class="list-group-item hoverable-element clearfix"> 
                                                <span class="fa fa-user"></span> {{ member.name }} <span class="pull-right"> 
                                                </span> 
                                            </li>
                                        </ul> 
                                    </li>
                                </ul>
                            </div>
                            <div><a @click="showConfirmModal = true">Delete Project</a></div>

                            <!-- Confirm delete project modal form -->
                            <div class="modal" v-if="showConfirmModal">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <form> 
                                            <div class="modal-header"> 
                                                <button type="button" class="close" @click.prevent="showConfirmModal = false">
                                                    <span>×</span>
                                                </button> <h4 class="modal-title ng-binding">Delete project</h4> 
                                            </div>
                                            <div class="modal-body">
                                                <div class="row">
                                                    <div class="col-sm-12">
                                                       <span>It will not be undone, continue?</span>
                                                    </div>
                                                </div>
                                            </div> 
                                            <div class="modal-footer">
                                                <button class="btn btn-primary" @click.prevent="deleteProject">Delete</button>
                                                <button class="btn btn-default" @click.prevent="showConfirmModal = false ">Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div class="modal-backdrop" ></div>
                            </div>

                            <!-- Adding teams modal form -->

                            <div class="modal" v-if="showModal">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <form> 
                                            <div class="modal-header"> 
                                                <button type="button" class="close" @click.prevent="showModal = false">
                                                    <span>×</span>
                                                </button> <h4 class="modal-title ng-binding">Add Project Teams</h4> 
                                            </div>
                                            <div class="modal-body">
                                                <div class="row">
                                                    <div class="col-sm-12">
                                                        <!-- <ul> -->
                                                            <div v-for="team in teams"> <input type="checkbox" :name="team.id" :value="team.id" v-model="addedTeams"> {{ team.name }} </div>
                                                        <!-- </ul> -->
                                                    </div>
                                                </div>
                                            </div> 
                                            <div class="modal-footer">
                                                <button type="submit" class="btn btn-primary" @click.prevent="addTeams">Add</button>
                                                <button type="submit" class="btn btn-default" @click.prevent="showModal = false ">Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div class="modal-backdrop" ></div>
                            </div>
                        </div>
            		</div>
            	</div>
            </div>
        </div>
    </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
import NavMenuAuth from '../blocks/NavMenuAuth';
import notification from '../../mixins/notification';

export default {
    props : ['projectId'],
    mixins: [notification],
    data() {
        return {
            showModal       : false,
            showConfirmModal: false,
            addedTeams      : [],
            deletedTeams    : [],
        };
    },
    created() {
        this.$store.dispatch('getOwnTeams');
        this.$store.dispatch('getOneProject', { projectId: this.projectId });
    },
    computed: {
        formInvalid() {
            return this.$v.$invalid;
        },
        ...mapGetters([
            'project',
            'teams',
        ]),
    },
    methods: {
        updateProject() {
            if (this.$v.$invalid) return;
            this.$store.dispatch('updateProject', { projectId: this.project.id, project: this.project, addedTeams: this.addedTeams, deletedTeams: this.deletedTeams })
            .then(() => {
                this.showSuccess('Project saved successful');
                this.$router.push('/projects');
            })
            .catch((error) => {
                this.showError(error);
            });
        },
        deleteProject() {
            this.showConfirmModal = false;
            this.$store.dispatch('deleteProject', { projectId: this.project.id })
            .then(() => {
                this.showSuccess('Project deleted successful');
                this.$router.push('/projects');
            })
            .catch(() => {
                this.showError();
            });
        },
        deleteTeam(index, teamId) {
            this.deletedTeams.push(teamId);
            this.project.teams.splice(index);
        },
        addTeams() {
            this.addedTeams.map((teamId) => {
                const teamIndex = this.teams.findIndex(obj => obj.id === teamId);
                const index = this.project.teams.findIndex(obj => obj.id === teamId);
                if (index === -1) {
                    const team = this.teams[teamIndex];
                    this.project.teams.push(team);
                }
                return teamId;
            });
            this.showModal = false;
        },
    },
    components: {
        NavMenuAuth,
    },
    validations: {
        project: {
            name: {
                required,
            },
        },
    },
};
</script>
<style lang="scss" rel="stylesheet/css" scoped>
	.page-title {
	    padding: 0;
	    font-size: 28px;
	    line-height: 33px;
	    display: block;
	    margin: 0 0 25px;
	    height: 40px;
	    word-break: break-all;
	}

	    body {
        background-color: #efefef;
    }

    .container {
        margin-top: 70px;
    }

    .panel {
        display: flex;
        justify-content: center;
        padding: 20px;
    }
    .container-center {
        width: 50%;
    }

    .btn-primary {
    	color: #fff;
    	background-color: #545454;
    	border-color: #545454;
    }

	.btn-primary:hover {
		color: #fff;
    	background-color: #3b3b3b;
    	border-color: #3b3b3b;
	}

    .form-control {
        width: 100%;
        height: 34px;
        padding: 6px 0;
        background-color: transparent;
        background-image: none;
        border: none;
        border-bottom: 1px solid #e0e0e0;
        border-radius: 0;
        -webkit-box-shadow: none;
        transition: border-color ease-in-out .2s;
    }

    .form-control:focus {
        border-bottom: 2px solid #178fe5;
        outline: 0;
        padding: 6px 0 5px;
    }

    .actions {
        display: flex;
        align-items: center;
        text-align: left;
    }

    .margin-top-20 {
        margin-top: 20px !important;
    }

    .btn-primary {
        color: #fff;
        background-color: #545454;
        border-color: #545454;
    }

    .btn-primary:hover {
        color: #fff;
        background-color: #474747;
        border-color: #474747;
    }

    .btn-default {
        color: #525252;
        background-color: rgba(0, 0, 0, .05);
        border-color: rgba(0, 0, 0, .07);
    }

    .btn-icon-default {
        display: inline-block;
        width: 34px;
        height: 34px;
        line-height: 34px;
        border-radius: 17px !important;
        padding: 0 !important;
        color: #525252;
        background-color: transparent;
        border-color: transparent;
        font-size: 20px !important;
    }

    .nav-tabs {
        border: none;
        margin: 0;
        display: flex;
        justify-content: center;

        li.active {
            border-bottom: 2px solid #178fe5;
            a {
                color: #178fe5;
            }
        }

        a {
            margin: 0;
            border: 0!important;
            padding-left: 15px;
            padding-right: 15px;
            padding-bottom: 20px;
            background: 0 0!important;
            color: #525252;
            font-size: 18px;
            line-height: 1.1;
        }
    }

    .modal {
        display: block;
    }
    .modal-backdrop {
        opacity: .5;
    }
    .modal-dialog {
        z-index: 1050;
    }
    .modal-content {
        margin-top: 120px;
    }
    .modal-header {
        padding: 25px;
    }
    .modal-body {
        padding: 25px;
    }

    .form-control {
        width: 100%;
        height: 34px;
        padding: 6px 0;
        background-color: transparent;
        background-image: none;
        border: none;
        border-bottom: 1px solid #e0e0e0;
        border-radius: 0;
        -webkit-box-shadow: none;
        transition: border-color ease-in-out .2s;
    }
    .modal-footer {
        padding: 25px;
        text-align: left;
        border-top: 1px solid #e0e0e0;
    }
    .list-group {
        margin-top: 10px;
    }
    .list-group-item {
        margin-top: 5px;
        margin-bottom: 5px;
    }
    .fa-times {
        cursor: pointer;
    }
</style>