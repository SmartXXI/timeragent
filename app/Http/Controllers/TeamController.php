<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Mpociot\Teamwork\Facades\Teamwork;
use App\Team;
use App\User;
use Illuminate\Support\Facades\Mail;

use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function getTeams(Request $request) {
        $user = Auth::user();
    	$teams = $user->teams;
        $teams->map(function(Team $team) {
            $team->owner_name = User::find($team->owner_id)->name;
            $team->users = $team->users;
            return $team;
        });
    	return $teams;
    }

    public function create(Request $request) {
		$user = Auth::user();

    	$team = new Team();
		$team->owner_id = $user->getKey();
		$team->name = $request->team['name'];
		$team->save();
		$user->attachTeam($team);

        foreach($request->members as $member) {
            $member = User::find($member);
            $member->attachTeam($team);
        }

		return $team;
    }

    public function invite(Request $request) {
    	$team_id = $request['team_id'];

    	$invite_team = Team::find($team_id);
    	Teamwork::inviteToTeam( $request['members'], $team_id, function( $invite )
        {
            Mail::send('teamwork.emails.invite', ['team' => $invite->team, 'invite' => $invite], function ($m) use ($invite) {
                $m->to($invite->email)->subject('Invitation to join team '.$invite->team->name);
            });
            // Send email to user
        });
    }
    public function getOwnTeams(Request $request) {
    	$user = Auth::user();
    	$teams = $user->teams->where('owner_id', '=', $user->id);
        $teams->map(function(Team $team) {
            $team->users = $team->users;
        });
    	return $teams;
    }
    public function edit(Request $request, Team $team) {
        $team->users;
        return $team;
    }
    public function update(Request $request, Team $team) {
        $projects = $team->projects;

        foreach ($request->deletedMembers as $member) {
            foreach ($projects as $project) {
                $project->detachUser($member);
            }

            $member = User::find($member);
            $member->detachTeam($team);
        }
        foreach($request->addedMembers as $member) {
            $member = User::find($member);
            $member->attachTeam($team);
        }
        $all['name'] = $request->team['name'];
        $team->update($all); 
    }
    public function getExistsMembers(Request $request) {
        $user = Auth::user();
        $teams = $user->teams;
        $existsMembers = [];

        foreach($teams as $team) {
            foreach ($team->users as $user) {
                $noUser = false;
                if ($user->id != Auth::user()->id) {
                    if(count($existsMembers) == 0) $existsMembers[] = $user; 
                    foreach($existsMembers as $member) {
                        if ($member->id == $user->id) {
                            $noUser = false;
                            break;
                        }
                        else $noUser = true;
                    }
                    if($noUser) {
                        $existsMembers[] = $user;
                    }
                }
            }
        } 
        return $existsMembers;
    }

    public function delete(Team $team) {
        $team->delete();
    }
}
