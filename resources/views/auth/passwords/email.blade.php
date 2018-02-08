@extends('layouts.app')

@section('content')

<div class="cd-user-modal is-visible"> <!-- this is the entire modal form, including the background -->
    <div class="cd-user-modal-container"> <!-- this is the container wrapper -->
        <div class="panel-title">Reset Password</div>

            <form class="cd-form" method="POST" action="{{ route('password.email') }}">
                {{ csrf_field() }}
                <p class="fieldset">
                    <label class="image-replace cd-email" for="signin-email">E-mail</label>
                    <input class="full-width has-padding has-border {{ $errors->has('email') ? 'has-error' : '' }}" id="signin-email"
                           type="email" name="email" value="{{ old('email') }}" placeholder="Email" required autofocus>
                    @if ($errors->has('email'))
                        <span class="cd-error-message is-visible">{{ $errors->first('email') }}</span>
                    @endif
                </p>

                <p class="fieldset">
                    <input class="full-width" type="submit" value="Send Password Reset Link">
                </p>
            </form>
    </div> <!--cd-user-modal-container -->
</div> <!-- cd-user-modal -->
@endsection
