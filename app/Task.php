<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'description',
        'active',
        'user_id',
        'project_id',
    ];

    public function project() {
    	return $this->belongsTo('App\Project');
    }

    public function duration() {
        return $this->hasMany('App\TasksDuration');
    }

}
