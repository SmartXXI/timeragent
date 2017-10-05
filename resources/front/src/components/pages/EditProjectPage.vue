<template>
    <div>
        <nav-menu-auth></nav-menu-auth>
        <div class="container">
                <div class="pull-right">
                    <button type="button" class="btn btn-wide btn-default btn-lg" @click="$router.go(-1)"> Cancel </button> 
                    <button type="submit" class="btn btn-wide btn-primary btn-lg" title="Press Ctrl+Enter to save changes" @click="updateProject"> Save </button> 
                </div>
                <span class="page-title"> Edit Project </span> 
            <div class="row">
            	<div class="col-md-12"> 
            		<div class="panel panel-default"> 
                        <div class="col-md-8">
                            <div class="form-group row">
                                <div class="col-xs-8"> <label class="control-label" for="project-name">Name</label> 
                                    <input id="project-name" class="form-control" placeholder="Enter project name" v-model="project.name"> 
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
                                    <button type="button" class="btn btn-default" @click="showModal = true"> Add teams to project </button> 
                                </div>
                            </div>
                            <div> 
                                <ul class="list-group margin-top-small"> 
                                    <li v-for="team in project.teams" class="list-group-item hoverable-element clearfix"> 
                                        <span class="fa fa-users"></span> {{ team.name }} <span class="pull-right"> 
                                        <span class="fa fa-times hoverable-cross"></span> 
                                        </span>

                                        <ul class="list-group margin-top-small"> 
                                            <li v-for="member in team.users" class="list-group-item hoverable-element clearfix"> 
                                                <span class="fa fa-users"></span> {{ member.name }} <span class="pull-right"> 
                                                </span> 
                                            </li>
                                        </ul> 
                                    </li>
                                </ul>
                            </div>

                            <div class="modal" v-if="showModal">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <form> 
                                            <div class="modal-header"> 
                                                <button type="button" class="close" @click="showModal = false"> 
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
                                                <button type="submit" class="btn btn-primary" @click="showModal = false">Add</button>
                                                <button type="submit" class="btn btn-default" @click="showModal = false ">Cancel</button>
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
	import NavMenuAuth from '../blocks/NavMenuAuth.vue';
    import {HTTP} from '../../main.js';

	export default {
        props: ['projectId'],
        data() {
            return {
                project: {
                    name: null,
                },
                teams: {},
                showModal: false,
                addedTeams: [],
            }
        },
        created() {
            HTTP.get('api/projects/teams').then(response => this.teams = response.data);
            HTTP.get('api/projects/' + this.projectId).then(response => this.project = response.data);
        },
        methods: {
            updateProject() {
                HTTP.post('api/projects/' + this.project.id, {project: this.project, teams: this.addedTeams}).then((response) => {
                    this.$router.push('/projects');
                });
            },
        },
		components: {
			NavMenuAuth
		}
	}
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
</style>