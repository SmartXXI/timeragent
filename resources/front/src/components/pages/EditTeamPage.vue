<template>
    <div>
        <nav-menu-auth></nav-menu-auth>
        <div class="container">
                <div class="pull-right">
                    <button type="button" @click="$router.go(-1)" class="btn btn-wide btn-default btn-lg"> Cancel </button> 
                    <button type="submit" class="btn btn-wide btn-primary btn-lg" title="Press Ctrl+Enter to save changes" 
                    @click="updateTeam"> Save </button> 
                </div>
                <span class="page-title"> Edit Team </span> 
            <div class="row">
            	<div class="col-md-12"> 
            		<div class="panel panel-default"> 
                        <div class="col-md-8">
                            <div class="form-group row">
                                <div class="col-xs-12"> <label class="control-label" for="project-name">Name</label> 
                                    <input id="project-name" class="form-control" placeholder="Enter team name" v-model="team.name"> 
                                </div>
                            </div>

                            <ul class="nav nav-tabs"> 
                                <li class="active"> <a >Members</a> </li> 
                            </ul>
                            <!-- <add-members></add-members> -->
                            <div class="tab-content"> 
                                <div> 
                                    <button type="button" class="btn btn-default" @click="showModal = true"> Add members to team </button> 
                                </div>
                            </div>
                            <div> 
                                <ul class="list-group margin-top-small"> 
                                    <li v-for="user in team.users" class="list-group-item hoverable-element clearfix"> 
                                        <span class="fa fa-user"></span> {{ user.name }} <span class="pull-right"> 
                                        <span class="fa fa-times hoverable-cross"></span> 
                                        </span> 
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
                                                </button> <h4 class="modal-title ng-binding">Add Members</h4> 
                                            </div>
                                            <div class="modal-body">
                                                <div class="row">
                                                    <div class="col-sm-12">
                                                        <input type="text" class="form-control" placeholder="Find user..." v-model="members">
                                                    </div>
                                                </div>
                                            </div> 
                                            <div class="modal-footer">
                                                <button type="submit" class="btn btn-primary" @click="showModal = false ">Add</button>
                                                <button type="submit" class="btn btn-default" @click="showModal = false ">Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div class="modal-backdrop" ></div>
                            </div>
                            <!-- add members -->
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
        props: ['teamId'],
        data() {
            return {
                team: {
                    name: null,
                },
                showModal: false,
                members: "",
            }
        },
        created() {
            HTTP.get('api/teams/' + this.teamId).then(response => this.team = response.data);
        },
        methods: {
            updateTeam() {
                HTTP.post('api/teams/' + this.team.id, this.team).then((response) => {
                    if (this.members !== "") {
                        this.inviteMembers(response.data.id);
                    }
                    this.$router.push('/teams');
                });
            },
            inviteMembers(team_id) {
                HTTP.post('api/teams/invite', { members: this.members, team_id: team_id } );
            }
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

    .form-control:focus {
        box-shadow: none;
        border-bottom: 2px solid #178fe5;
        outline: 0;
        padding: 6px 0 5px;
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