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
		$team->name = $request->name;
		$team->save();
		$user->attachTeam($team);

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
    	return $teams;
    }
    public function edit(Request $request, Team $team) {
        $team->users;
        return $team;
    }
    public function update(Request $request, Team $team) {
        $team->update($request->all()); 
    }
}
