<template>
    <div>
        <nav-menu-auth></nav-menu-auth>
        <div class="container">
                <span class="page-title"> Projects </span> 
            <div class="row">
            	<div class="col-md-12"> 
            		<div class="panel panel-default"> 
            			<div class="panel-heading flex-container-space-between">  
            				<div class="actions pull-left">  
                                <router-link to="projects/new" class="btn btn-primary"><span class="fa fa-plus"></span> New Project</router-link>  
            				</div>  
            				<div class="table-container"> 
            					<div class="text-muted table-cell ng-binding"></div>
            				</div> 
            			</div>
                        <div class="panel-body form clear-padding">
                        <table class="table projects" v-if="projects.length">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Owner</th>
                                    <th>Teams</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="project in projects">
                                    <td>{{ project.name }}</td> 
                                    <td>{{ project.owner_name }}</td> 
                                    <td>{{ project.teams.length }}</td>
                                    <div v-if="user.id == project.owner_id" class="edit-button" @click="goToProject(project.id)"><a><i class="fa fa-pencil" aria-hidden="true"></i></a></div> 
                                </tr>
                            </tbody>
                        </table>
                        </div>  
            			<div class="panel-body form clear-padding" v-if="!projects.length">
            				<div class="well text-center" > No projects have been added yet. </div>
            			</div> 
            		</div>
            	</div>
            </div>
        </div>
    </div>
</template>

<script>
    import NavMenuAuth from '../blocks/NavMenuAuth';
    import { mapGetters } from 'vuex';

    export default {
        created() {
            this.$store.dispatch('getProjects');
        },
        computed: {
            ...mapGetters([
                'user',
                'projects',
            ]),
        },
        methods: {
            goToProject(projectId) {
                this.$router.push({ name: 'editProject', params: { projectId } });
            },
        },
        components: {
            NavMenuAuth,
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

        .panel-default {
        border-color: #e0e0e0;

        .panel-heading {
            color: #525252;
            background-color: #fff;
            border-color: #e0e0e0;
        }
    }

    .panel-heading {
        padding: 20px;
    }

    .panel {
        margin-bottom: 20px;
        background-color: #fff;
        border: 1px solid transparent;
        border-radius: 3px;
        -webkit-box-shadow: 0 2px 6px 0 rgba(47, 47, 47, .15);
        box-shadow: 0 2px 6px 0 rgba(47, 47, 47, .15);
    }

    .panel-title {
        font-weight: 300;
        font-size: 22px;
    }

    .panel-body {
        padding: 20px;
    }

    .flex-container-space-between {
        display: flex;
        justify-content: space-between;
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
    .projects {
        td {
            height: 61px;
            padding: 20px;
            line-height: 1.42857;
            vertical-align: top;
            border-top: 1px solid #e0e0e0;
        }
    }
    .edit-button {
        margin: 20px 0;
        text-align: center;
        a {
            color: inherit;
        }
    }
</style>