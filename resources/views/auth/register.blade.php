@extends('layouts.app')

@section('content')
{{--<div class="container">--}}
    {{--<div class="row">--}}
        {{--<div class="col-md-8 col-md-offset-2">--}}
            {{--<div class="panel panel-default">--}}
                {{--<div class="panel-heading">Register</div>--}}

                {{--<div class="panel-body">--}}
                    {{--<form class="form-horizontal" method="POST" action="{{ route('register') }}">--}}
                        {{--{{ csrf_field() }}--}}

                        {{--<div class="form-group{{ $errors->has('name') ? ' has-error' : '' }}">--}}
                            {{--<label for="name" class="col-md-4 control-label">Name</label>--}}

                            {{--<div class="col-md-6">--}}
                                {{--<input id="name" type="text" class="form-control" name="name" value="{{ old('name') }}" required autofocus>--}}

                                {{--@if ($errors->has('name'))--}}
                                    {{--<span class="help-block">--}}
                                        {{--<strong>{{ $errors->first('name') }}</strong>--}}
                                    {{--</span>--}}
                                {{--@endif--}}
                            {{--</div>--}}
                        {{--</div>--}}

                        {{--<div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">--}}
                            {{--<label for="email" class="col-md-4 control-label">E-Mail Address</label>--}}

                            {{--<div class="col-md-6">--}}
                                {{--<input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required>--}}

                                {{--@if ($errors->has('email'))--}}
                                    {{--<span class="help-block">--}}
                                        {{--<strong>{{ $errors->first('email') }}</strong>--}}
                                    {{--</span>--}}
                                {{--@endif--}}
                            {{--</div>--}}
                        {{--</div>--}}

                        {{--<div class="form-group{{ $errors->has('password') ? ' has-error' : '' }}">--}}
                            {{--<label for="password" class="col-md-4 control-label">Password</label>--}}

                            {{--<div class="col-md-6">--}}
                                {{--<input id="password" type="password" class="form-control" name="password" required>--}}

                                {{--@if ($errors->has('password'))--}}
                                    {{--<span class="help-block">--}}
                                        {{--<strong>{{ $errors->first('password') }}</strong>--}}
                                    {{--</span>--}}
                                {{--@endif--}}
                            {{--</div>--}}
                        {{--</div>--}}

                        {{--<div class="form-group">--}}
                            {{--<label for="password-confirm" class="col-md-4 control-label">Confirm Password</label>--}}

                            {{--<div class="col-md-6">--}}
                                {{--<input id="password-confirm" type="password" class="form-control" name="password_confirmation" required>--}}
                            {{--</div>--}}
                        {{--</div>--}}

                        {{--<div class="form-group">--}}
                            {{--<div class="col-md-6 col-md-offset-4">--}}
                                {{--<button type="submit" class="btn btn-primary">--}}
                                    {{--Register--}}
                                {{--</button>--}}
                            {{--</div>--}}
                        {{--</div>--}}
                    {{--</form>--}}
                {{--</div>--}}
            {{--</div>--}}
        {{--</div>--}}
    {{--</div>--}}
{{--</div>--}}
<div class="cd-user-modal is-visible"> <!-- this is the entire modal form, including the background -->
    <div class="cd-user-modal-container"> <!-- this is the container wrapper -->

        <div id="cd-signup" class="is-selected"> <!-- sign up form -->
            <div class="panel-title">Register</div>
            <form class="cd-form" method="POST" action="{{ route('register') }}">
                {{ csrf_field() }}
                <p class="fieldset">
                    <label class="image-replace cd-username" for="signup-username">Full name</label>
                    <input class="full-width has-padding has-border "
                           id="signup-username" type="text"{{ $errors->has('name') ? 'has-error' : '' }}
                           name="name" value="{{ old('name') }}" required autofocus placeholder="Username">
                    @if ($errors->has('name'))
                        <span class="cd-error-message is-visible">{{ $errors->first('name') }}</span>
                    @endif
                </p>

                <p class="fieldset">
                    <label class="image-replace cd-email" for="signup-email">E-mail</label>
                    <input class="full-width has-padding has-border {{ $errors->has('email') ? 'has-error' : '' }}"
                           id="signup-email" type="email"
                           name="email" value="{{ old('email') }}" required placeholder="E-mail">
                    @if ($errors->has('email'))
                        <span class="cd-error-message is-visible">{{ $errors->first('email') }}</span>
                    @endif
                </p>

                <p class="fieldset">
                    <label class="image-replace cd-password" for="signup-password">Password</label>
                    <input class="full-width has-padding has-border {{ $errors->has('password') ? 'has-error' : '' }}"
                           id="signup-password" type="password"
                           name="password" required placeholder="Password">
                    @if ($errors->has('password'))
                        <span class="cd-error-message is-visible">{{ $errors->first('password') }}</span>
                    @endif
                </p>

                <p class="fieldset">
                    <label class="image-replace cd-password" for="signup-password">Confirm Password</label>
                    <input class="full-width has-padding has-border"
                           id="signup-password-confirm"
                           type="password" name="password_confirmation" required placeholder="Confirm Password">
                </p>

                {{--<p class="fieldset">--}}
                    {{--<input type="checkbox" id="accept-terms">--}}
                    {{--<label for="accept-terms">I agree to the <a href="#0">Terms</a></label>--}}
                {{--</p>--}}

                <p class="fieldset">
                    <input class="full-width has-padding" type="submit" value="Create account">
                </p>
            </form>

            <!-- <a href="#0" class="cd-close-form">Close</a> -->
        </div> <!-- cd-signup -->

        <a href="#0" class="cd-close-form">Close</a>
    </div> <!-- cd-user-modal-container -->
</div> <!-- cd-user-modal -->
@endsection
