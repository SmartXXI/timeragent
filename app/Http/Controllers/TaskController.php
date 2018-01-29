<?php

namespace App\Http\Controllers;

use App\TimeEntry;
use Illuminate\Http\Request;
use \App\Task;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function getTasks(Request $request) {
//		$tasks = Task::whereDate('created_at', $request->date)->where('user_id', $user_id)->get();
//		$tasks->load('duration');
////		dd($tasks);
//	    return $tasks;

        $user_id = Auth::user()->id;


        return  Task::where('user_id', Auth::id())
            ->whereDate('created_at', $request->date)
            ->orWhereHas('timeEntries', function($sql) use($request) {
                $sql->whereDate('startTime', $request->date);
            })
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

    public function createTask(Request $request) {
        $task = $request->task;
        $task_data = [
            'description' => $task['description'],
            'user_id' => Auth::user()->id,
            'eta'     => $task['eta'],
            'project_id' => $task['project_id'],
            'created_at' => $task['created_at'],
        ];
        $created_task = Task::create($task_data);

//        $time_entry = [
//            'active' => $task['active'],
//            'task_id' => $created_task->id,
//            'startTime' => $task['startTime'],
//            'spendTime' => $task['spendTime'],
//            'endTime' => $task['endTime'],
//        ];
//
//        $time_entry = TimeEntry::create($time_entry);


//        return response(array_merge(
//            $task_duration->toArray(),
//            [
//                'description' => $task['description'],
//                'project_id'  => $task['project_id'],
//            ]
//        ));
        return response($created_task->load('timeEntries'));
    }

    public function updateTask(Request $request, Task $task) {

        $task_data = [];
    	$task_data['description'] = $request->task['description'];
    	$task_data['eta'] = $request->task['eta'];
        if (isset($request->task['project_id'])) {
            $task_data['project_id'] = $request->task['project_id'];
        }
        $task->update($task_data);


    	return response($task);
    }

    public function deleteTask(Task $task) {
        if ($task->timeEntries->count() > 0) {
            foreach ($task->timeEntries as $timeEntry) {
                TimeEntry::find($timeEntry->id)->delete();
            }
        }
        $task->delete();
    }
}