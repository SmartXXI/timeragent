<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'description',
        'active',
        'user_id',
        'eta',
        'project_id',
        'created_at',
    ];

    public function project() {
    	return $this->belongsTo('App\Project');
    }

    public function timeEntries() {
        return $this->hasMany('App\TimeEntry');
    }

    public function totalDuration($date)
    {
        return $this->timeEntries()
            ->whereNotNull('endTime')
            ->whereDate('startTime', '!=', $date)
            ->select(\DB::raw('SUM(TIME_TO_SEC(TIMEDIFF(`endTime`, `startTime`))) as total'))
            ->first()
            ->total;
    }

}
