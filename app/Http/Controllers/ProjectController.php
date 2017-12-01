<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Project;
use App\Team;
use App\User;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
	public function getProjects() {
		$user_id = Auth::user()->id;
        $projects = Auth::user()->projects;
		$own_projects = Project::where('owner_id', '=', $user_id)->get();
        $projects = $projects->merge($own_projects);
        $projects->map(function (Project $project) {
            $project->owner_name = User::find($project->owner_id)->name;
            $project->teams->map(function (Team $team) {
                $team->owner_name = User::find($team->owner_id)->name;
            });
            return $project;
        });
		return $projects;
	}

    public function createProject(Request $request) {
    	$data = $request->project;

    	$data['owner_id'] = Auth::user()->id;
    	$project = Project::create($data);

    	if ($request->projectTeams) {
            foreach($request->projectTeams as $team_id) {
                $project->attachTeam($team_id);

                $team = Team::find($team_id);

                foreach ($team->users as $user) {
                    $project->attachUser($user->id, [
                            'billable_rate' => $user->billable_rate,
                            'cost_rate' => $user->cost_rate,
                            'team_id' => $team_id,
                        ]
                    );
                }
            }
        }

        if ($request->projectUsers) {
            foreach ($request->projectUsers as $userData) {
                $user = User::find($userData['id']);
                $project->attachUser($userData['id'], [
                    'billable_rate' => $userData['billable_rate'],
                    'cost_rate' => $userData['cost_rate'],
                ]);
            }
        }

    	return $project;
    }

    public function edit(Project $project) {

        $project->load(['teams' => function($sql) {
                $sql->with('users');
            }])
            ->load(['users' => function($sql) {
                $sql->whereNull('team_id');
            }])
            ->get();
        return $project;
    }

    public function update(Request $request, Project $project) {

//        if ($request->deletedTeams) {
//            foreach($request->deletedTeams as $team_id) {
//                $team = Team::find($team_id);
//                $users = $team->users;
//                foreach ($users as $user) {
//                    $project->detachUser($user->id, $team_id);
//                }
//                $project->detachTeam($team_id);
//            }
//        }

//        if ($request->addedTeams) {
//            $team_exists = false;
//            foreach($request->addedTeams as $team_id) {
//
//                foreach($project->teams as $team) {
//                    if ($team->id == $team_id) {
//
//                        $team_exists = true;
//                        break;
//                    }
//                }
//
//                if ($team_exists == true) continue;
//
//                $project->attachTeam($team_id);
//
//                $team = Team::find($team_id);
//
//                foreach ($team->users as $user) {
//                    $project->attachUser($user->id, [
//                            'billable_rate' => $user->billable_rate,
//                            'cost_rate' => $user->cost_rate,
//                            'team_id' => $team_id,
//                        ]
//                    );
//                }
//            }
//        }
        $project->teams()
            ->whereNotIn('team_id', $request->projectTeams)
            ->get()
            ->each(function(Team $team) use ($project) {
                $project->usersWithTeam($team->id)->detach();
            });
//        dd($request->projectTeams);
        if ($request->projectTeams) {
            $project->teams()->sync($request->projectTeams);
        }
        else {
            $project->teams()->detach();
        }

        foreach ($request->projectTeams as $team_id) {
            $team = Team::find($team_id);

            foreach ($team->users as $user) {
                $team_users[$user->id] = [
                    'team_id' => $team_id,
                    'billable_rate' => $user->billable_rate,
                    'cost_rate' => $user->cost_rate,
                ];
            }

//            dd($project->usersWithTeam($team_id));
            $project->usersWithTeam($team_id)->sync($team_users);
            $team_users = [];
        }

//        if ($request->addedMembers) {
//            foreach ($request->addedMembers as $member) {
//                $user = User::find($member);
//                $project->attachUser($user->id, [
//                    'billable_rate' => $user->billable_rate,
//                    'cost_rate' => $user->cost_rate,
//                ]);
//            }
//        }

        $project_users = [];

//        foreach ($request->projectUsers as $user_id) {
        foreach ($request->projectUsers as $userData) {
            $user = User::find($userData['id']);

            $project_users[$user->id] = [
                'billable_rate' => $userData['billable_rate'],
                'cost_rate' => $userData['cost_rate'],
            ];
        }

           $project->usersWithoutTeam()->sync($project_users);
        // $data['name'] = $request->project->name;
        // dd($request['project']['name']);
        $project->update([
            'name' => $request['project']['name'],
        ]);
    }

    public function delete(Project $project) {
        $project->delete();
    }
}
