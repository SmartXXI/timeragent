@extends('layouts.app')

@section('content')
{{--<div class="container">--}}
    {{--<div class="row">--}}
        {{--<div class="col-md-8 col-md-offset-2">--}}
            {{--<div class="panel panel-default">--}}
                {{--<div class="panel-heading">Reset Password</div>--}}

                {{--<div class="panel-body">--}}
                    {{--<form class="form-horizontal" method="POST" action="{{ route('password.request') }}">--}}
                        {{--{{ csrf_field() }}--}}

                        {{--<input type="hidden" name="token" value="{{ $token }}">--}}

                        {{--<div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">--}}
                            {{--<label for="email" class="col-md-4 control-label">E-Mail Address</label>--}}

                            {{--<div class="col-md-6">--}}
                                {{--<input id="email" type="email" class="form-control" name="email" value="{{ $email or old('email') }}" required autofocus>--}}

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

                        {{--<div class="form-group{{ $errors->has('password_confirmation') ? ' has-error' : '' }}">--}}
                            {{--<label for="password-confirm" class="col-md-4 control-label">Confirm Password</label>--}}
                            {{--<div class="col-md-6">--}}
                                {{--<input id="password-confirm" type="password" class="form-control" name="password_confirmation" required>--}}

                                {{--@if ($errors->has('password_confirmation'))--}}
                                    {{--<span class="help-block">--}}
                                        {{--<strong>{{ $errors->first('password_confirmation') }}</strong>--}}
                                    {{--</span>--}}
                                {{--@endif--}}
                            {{--</div>--}}
                        {{--</div>--}}

                        {{--<div class="form-group">--}}
                            {{--<div class="col-md-6 col-md-offset-4">--}}
                                {{--<button type="submit" class="btn btn-primary">--}}
                                    {{--Reset Password--}}
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
        <div class="panel-title">Reset Password</div>

        <form class="cd-form" method="POST" action="{{ route('password.request') }}">
            {{ csrf_field() }}
            <input type="hidden" name="token" value="{{ $token }}">
            <p class="fieldset">
                <label class="image-replace cd-email" for="signin-email">E-Mail Address</label>
                <input class="full-width has-padding has-border {{ $errors->has('email') ? 'has-error' : '' }}" id="signin-email"
                       type="email" name="email" value="{{ $email or old('email') }}" placeholder="Email" required autofocus>
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
                @if ($errors->has('password_confirmation'))
                    <span class="cd-error-message is-visible">{{ $errors->first('password_confirmation') }}</span>
                @endif
            </p>

            <p class="fieldset">
                <input class="full-width" type="submit" value="Reset Password">
            </p>
        </form>
    </div> <!--cd-user-modal-container -->
</div> <!-- cd-user-modal -->
@endsection
