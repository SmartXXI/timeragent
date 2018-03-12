<?php

namespace App\Http\Controllers\Organization;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Organization;
use Illuminate\Support\Facades\Auth;
use App\Task;

class TaskController extends Controller
{
    public function getTasks(Request $request, Organization $organization)
    {
        $user = Auth::user();

        return $user
            ->tasks()
            ->where(function ($sql) use ($request) {
                $sql->whereDate('created_at', $request->date)
                    ->orWhereHas('timeEntries', function($sql) use($request) {
                        $sql->whereDate('startTime', $request->date);
                    });
            })
            ->whereIn('project_id', $organization->projects->pluck('id'))
            ->with(['timeEntries' => function($query) use($request) {
                $query->whereDate('startTime', $request->date)->orderBy('startTime');
            }])
            ->get()
            ->sortBy(function (Task $task) {
                if ($task->timeEntries->count() > 0) {
                    return $task
                        ->timeEntries
                        ->sortBy('startTime')
                        ->last()
                        ->startTime;
                }
            })
            ->map(function (Task $task) use($request) {
                return array_merge(
                    $task->toArray(),
                    [
                        'total' => $task->totalDuration($request->date),
                    ]
                );
            })
            ->values()
            ->toArray();
    }
}
