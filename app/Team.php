<?php

namespace App;

use Mpociot\Teamwork\TeamworkTeam;

class Team extends TeamworkTeam
{
	public function projects() {
		return $this->belongsToMany('App\Project', 'projects_teams', 'team_id', 'project_id');
	}
}
