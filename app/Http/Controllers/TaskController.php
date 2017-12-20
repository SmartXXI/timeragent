<?php

namespace App\Http\Controllers;

use App\TasksDuration;
use Illuminate\Http\Request;
use \App\Task;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function getTasks(Request $request) {
//		$tasks = Task::whereDate('created_at', $request->date)->where('user_id', $user_id)->get();
//		$tasks->load('duration');
////		dd($tasks);
//	    return $tasks;

        $user_id = Auth::user()->id;

        return TasksDuration::whereDate('created_at', $request->date)
            ->whereHas('task', function($sql) {
                $sql->where('user_id', Auth::id());
            })
            ->get()
            ->map(function (TasksDuration $duration) {
                return array_merge(
                    $duration->toArray(),
                    [
                        'description' => $duration->task->description,
                        'project_id'  => $duration->task->project_id,
                    ]
                );
            });

    }

    public function createTask(Request $request) {
        $task = $request->task;
        $task_data = [
            'description' => $task['description'],
            'user_id' => Auth::user()->id,
            'project_id' => $task['project_id'],
        ];
        $created_task = Task::create($task_data);

        $task_duration = [
            'active' => $task['active'],
            'task_id' => $created_task->id,
            'startTime' => $task['startTime'],
            'spendTime' => $task['spendTime'],
            'endTime' => $task['endTime'],
        ];

        $task_duration = TasksDuration::create($task_duration);


        return response(array_merge(
            $task_duration->toArray(),
            [
                'description' => $task['description'],
                'project_id'  => $task['project_id'],
            ]
        ));
    }

    public function createDuration(Request $request) {
        $task = $request->task;
        $task_duration = [
            'active' => $task['active'],
            'task_id' => $task['task_id'],
            'startTime' => $task['startTime'],
            'spendTime' => $task['spendTime'],
            'endTime' => $task['endTime'],
        ];

        $task_duration = TasksDuration::create($task_duration);

        return response(array_merge(
            $task_duration->toArray(),
            [
                'description' => $task['description'],
                'project_id'  => $task['project_id'],
            ]
        ));
    }

    public function updateTask(Request $request, TasksDuration $duration) {

        $task_data = [];
        $task = Task::find($duration->task_id);
    	$task_data['description'] = $request->task['description'];
        if (isset($request->task['project_id'])) {
            $task_data['project_id'] = $request->task['project_id'];
        }
        $task->update($task_data);



    	$duration->startTime = $request->task['startTime'];
    	$duration->spendTime = $request->task['spendTime'];
    	$duration->endTime = $request->task['endTime'];

    	$duration->save();

    	return response(array_merge(
    	    $duration->toArray(),
            [
                'description' => $task->description,
                'project_id'  => $task->project_id,
            ]
        ));
    }

    public function continueTask(Request $request, TasksDuration $duration) {
//        $task = Task::find($request['task_id']);
        $duration->active = true;
        $duration->endTime = null;

        $duration->save();
        return response(array_merge(
            $duration->toArray(),
            [
                'description' => $duration->task->description,
                'project_id'  => $duration->task->project_id,
            ]
        ));
    }

    public function stopTask(Request $request, TasksDuration $duration) {
        $duration->active = false;
        $duration->endTime = $request->endTime;
        $duration->save();
        return response(array_merge(
            $duration->toArray(),
            [
                'description' => $duration->task->description,
                'project_id'  => $duration->task->project_id,
            ]
        ));
    }

    public function deleteTask(TasksDuration $duration) {
        if ($duration->task->duration->count() <= 1) {
            $task = Task::find($duration->task_id);
            $task->delete();
        }
        $duration->delete();
    }

    // public function addTimeEntry(Request $request) {
    //     $timeEntry
    // }
}