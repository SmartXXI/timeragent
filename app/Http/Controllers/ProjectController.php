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
		$projects = Project::where('owner_id', '=', $user_id)->get();
        $projects->map(function (Project $project) {
            $project->owner_name = User::find($project->owner_id)->name;
            $project->teams = $project->teams;
            return $project;
        });
		return $projects;
	}

    public function createProject(Request $request) {
    	$data = $request->project;

    	$data['owner_id'] = Auth::user()->id;
    	$project = Project::create($data);

    	foreach($request->teams as $team_id) {   
    		$project->attachTeam($team_id);

            $team = Team::find($team_id);

            foreach ($team->users as $user) {
                $project->attachUser($user->id, [
                    'billable_rate' => $user->billable_rate,
                    'cost_rate' => $user->cost_rate]
                );
            } 
    	}
    	return $project;
    }

    public function edit(Project $project) {
        $project->teams->map(function(Team $team) {
            $team->users;
        });
        return $project;
    }

    public function update(Request $request, Project $project) {
        if ($request->teams) {
            $team_exists = false;
            foreach($request->teams as $team_id) {

                foreach($project->teams as $team) {
                    if ($team->id == $team_id) {

                        $team_exists = true;
                        break;
                    }
                }

            if ($team_exists == true) continue;

            $project->attachTeam($team_id);

            $team = Team::find($team_id);

            foreach ($team->users as $user) {
                $project->attachUser($user->id, [
                    'billable_rate' => $user->billable_rate,
                    'cost_rate' => $user->cost_rate]
                );
            } 
        }
        }
        // $data['name'] = $request->project->name;
        // dd($request['project']['name']);
        $project->update([
            'name' => $request['project']['name'],
        ]);
    }
}
