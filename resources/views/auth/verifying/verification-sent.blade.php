<?php
if (!isset($email)) {
    $email = 'example@example.com';
}
?>
@extends('layouts.app')

@section('content')

    <div class="cd-user-modal is-visible"> <!-- this is the entire modal form, including the background -->
        <div class="cd-user-modal-container"> <!-- this is the container wrapper -->
            <div class="panel">
                    The activation email has been sent
            </div>
        </div> <!--cd-user-modal-container -->
    </div> <!-- cd-user-modal -->
@endsection
