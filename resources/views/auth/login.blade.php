@extends('layouts.app')

@section('content')

<div class="cd-user-modal is-visible"> <!-- this is the entire modal form, including the background -->
    <div class="cd-user-modal-container"> <!-- this is the container wrapper -->
        <div class="panel-title">Login</div>
        <div id="cd-login" class="is-selected"> <!-- log in form -->
            <form class="cd-form" method="POST" action="{{ route('login') }}">
                {{ csrf_field() }}
                <p class="fieldset">
                    <label class="image-replace cd-email" for="signin-email">E-mail</label>
                    <input class="full-width has-padding has-border {{ $errors->has('email') ? 'has-error' : '' }}" id="signin-email" type="email"
                           placeholder="E-mail" name="email" value="{{ old('email') }}" required autofocus>
                    @if ($errors->has('email'))
                        <span class="cd-error-message is-visible">{{ $errors->first('email') }}</span>
                    @endif
                </p>

                <p class="fieldset">
                    <label class="image-replace cd-password" for="signin-password">Password</label>
                    <input class="full-width has-padding has-border {{ $errors->has('password') ? 'has-error' : '' }}"
                           id="signin-password" type="password" name="password" required  placeholder="Password">
                    @if ($errors->has('password'))
                        <span class="help-block">
                            <span class="cd-error-message is-visible">{{ $errors->first('password') }}</span>
                        </span>
                    @endif
                </p>

                <p class="fieldset">
                    <input type="checkbox" id="remember-me" name="remember" {{ old('remember') ? 'checked' : '' }}>
                    <label for="remember-me">Remember me</label>
                </p>

                <p class="fieldset">
                    <input class="full-width" type="submit" value="Login">
                </p>
                @if (session('message'))
                    <div class="alert alert-success">
                        {{ session('message') }}
                    </div>
                @endif
            </form>

            <p class="cd-form-bottom-message">
                <a href="{{ route('password.request') }}">Forgot your password?</a>
                @if ($errors->has('email'))
                    <a href="{{ route('send.verify.email', old('email')) }}"
                       onclick="event.preventDefault(); document.getElementById('send-email').submit();">
                        Send activation email again
                    </a>
                    <form id="send-email" class="cd-form" method="POST" action="{{ route('send.verify.email', old('email')) }}">
                        {{ csrf_field() }}
                    </form>
                @endif
            </p>
        </div> <!-- cd-login -->

        <a href="#0" class="cd-close-form">Close</a>
    </div> <!-- cd-user-modal-container -->
</div> <!-- cd-user-modal -->
@endsection
