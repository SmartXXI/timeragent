<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = ['description', 'active', 'user_id', 'project_id', 'startTime', 'spendTime', 'endTime'];

    public function project() {
    	return $this->belongsTo('App\Project');
    }

}
