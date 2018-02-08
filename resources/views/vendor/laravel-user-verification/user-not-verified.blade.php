@extends('layouts.app')

<!-- Main Content -->
@section('content')
    <div class="cd-user-modal is-visible"> <!-- this is the entire modal form, including the background -->
        <div class="cd-user-modal-container"> <!-- this is the container wrapper -->

            <div class="panel">
                <strong>Your account is not activated yet. Activation email has been sent on {{ auth()->user()->email  }}.</strong>
            </div>

            {{--<a href="#0" class="cd-close-form">Close</a>--}}
        </div> <!--cd-user-modal-container -->
    </div> <!-- cd-user-modal -->
@endsection
