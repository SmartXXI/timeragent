<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group(['middleware' => ['isVerified', 'auth:api']], function () {
    Route::get('/user', 'UserController@index');
    Route::post('/user/validate-email', 'UserController@validateEmail');

    Route::post('/user', 'UserController@update');

    Route::get('/tasks', 'TaskController@getTasks');

    Route::post('/update-task/{task}', 'TaskController@updateTask');

    Route::post('/create-task', 'TaskController@createTask');


    Route::post('/continue-task/{timeEntry}', 'TimeEntryController@continueTask');

    Route::post('/stop-task/{timeEntry}', 'TimeEntryController@stopTask');

    Route::post('/delete-task', 'TaskController@deleteTask');

    Route::post('/create-time-entry', 'TimeEntryController@createTimeEntry');
    Route::post('/update-time-entry/{timeEntry}', 'TimeEntryController@updateTimeEntry');
    Route::post('/delete-time-entry/{timeEntry}', 'TimeEntryController@deleteTimeEntry');

    Route::get('/teams', 'TeamController@getTeams');
    Route::post('/teams/new', 'TeamController@create');
    Route::post('/teams/invite', 'TeamController@invite');
    Route::get('/teams/exists-members', 'TeamController@getExistsMembers');
    Route::post('/teams/{team}/delete', 'TeamController@delete');
    Route::get('/teams/{team}', 'TeamController@edit')->middleware('can:update,team');
    Route::post('/teams/{team}', 'TeamController@update');

    Route::get('/projects', 'ProjectController@getProjects');
    Route::post('/projects/new', 'ProjectController@createProject');
    Route::get('/projects/teams', 'TeamController@getOwnTeams');
    Route::get('/projects/users', 'TeamController@getOwnUsers');
    Route::get('/projects/{project}', 'ProjectController@edit')->middleware('can:update,project');
    Route::post('/projects/{project}', 'ProjectController@update');
    Route::post('/projects/{project}/delete', 'ProjectController@delete');

    Route::post('/organizations/new', 'Organization\OrganizationController@create');
    Route::post('/organizations/{organization}', 'Organization\OrganizationController@update');
    Route::get('/organizations/{organization}', 'Organization\OrganizationController@getOrganization');

    // Organization projects
    Route::get('organization/{organization}/projects', 'Organization\ProjectController@getProjects');
    Route::post('organization/{organization}/projects/new', 'Organization\ProjectController@create');
    Route::get('organization/{organization}/projects/{project}', 'Organization\ProjectController@edit')
        ->middleware('can:update,project');
    Route::post('organization/{organization}/projects/{project}', 'Organization\ProjectController@update');
    // Organization tasks
    Route::get('/organization/{organization}/tasks', 'Organization\TaskController@getTasks');

    Route::post('/clients', 'ClientController@getClients');
    Route::post('/clients/new', 'ClientController@create');
    Route::post('clients/{client}', 'ClientController@update');
    Route::get('/clients/{client}', 'ClientController@getClient');
});