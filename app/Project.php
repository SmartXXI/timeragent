<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
	protected $fillable = ['name', 'owner_id'];

    public function teams() {
    	return $this->belongsToMany('App\Team', 'projects_teams', 'project_id', 'team_id');
    }
    public function attachTeam($team_id)
    {
    	$this->teams()->attach($team_id);
    	return $this;
    }

    public function users() {
    	return $this->belongsToMany('App\User', 'projects_users', 'project_id', 'user_id')
    		->withPivot('billable_rate', 'cost_rate')
    		->withTimestamps();
    }
    public function attachUser($user_id, $pivot = [])
    {
    	$this->users()->attach($user_id, $pivot);
    	return $this;
    }

    public function tasks() {
        return $this->hasMany('App\Task', 'project_id');
    }
}
