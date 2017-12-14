<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use \App\Task;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function getTasks(Request $request) {
        $user_id = Auth::user()->id;
		$tasks = Task::whereDate('created_at', $request->date)->where('user_id', $user_id)->get();
	    return $tasks;
    }

    public function createTask(Request $request) {
        $task = $request->task;
        $task['user_id'] = Auth::user()->id;
        $task = Task::create($task);
        // dd($request->task);
        return response($task);
    }

    public function updateTask(Request $request, Task $task) {
    	// dd($request->task);

    	$task->description = $request->task['description'];
        if (isset($request->task['project_id'])) {
            $task->project_id = $request->task['project_id'];
        }
    	$task->startTime = $request->task['startTime'];
    	$task->spendTime = $request->task['spendTime'];
    	$task->endTime = $request->task['endTime'];

    	$task->save();

    	return response($task); 		
    }

    public function continueTask(Request $request) {
        $task = Task::find($request['task_id']);

        $task->active = true;
        $task->endTime = null;

        $task->save();
        return response($task);
    }

    public function stopTask(Request $request, Task $task) {
        $task->active = false;
        $task->endTime = $request->endTime;
        $task->save();
        return response($task);
    }

    public function deleteTask(Task $task) {
        $task->delete();
    }

    // public function addTimeEntry(Request $request) {
    //     $timeEntry
    // }
}