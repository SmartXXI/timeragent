<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- <title>{{ config('app.name', 'Laravel') }}</title> --}}
    <title>Timer Agent</title>

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js" type="text/javascript"></script>

    <link href='https://fonts.googleapis.com/css?family=PT+Sans:400,700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="https://s3-us-west-2.amazonaws.com/s.cdpn.io/148866/reset.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css">
</head>
<body>
<div id="app">
    <header role="banner">
        <div id="cd-logo">
            <a href="{{ url('/') }}">
                <img class="logo" src="{{ asset('images/logo.svg') }}" alt="Logo">
                {{--Timer Agent--}}
            </a>
        </div>

        <nav class="main-nav">
            <ul>
                @if (Auth::guest())
                    <li><a class="cd-signin" href="{{ route('login') }}">Sign in</a></li>
                    <li><a class="cd-signup" href="{{ route('register') }}">Sign up</a></li>
                @else
                    <li class="dropdown">
                        <a href="#"
                           class="cd-signin">
                            {{ Auth::user()->name }} <span class="caret"></span>
                        </a>
                    </li>
                    <li>
                        <a href="{{ route('logout') }}"
                           class="cd-signin"
                           onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                            Logout
                        </a>

                        <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                            {{ csrf_field() }}
                        </form>
                    </li>
                @endif
            </ul>
        </nav>
    </header>

    @yield('content')
</div>

    <!-- Scripts -->

    <script>
        window.Laravel = {!! json_encode([
            'csrfToken' => csrf_token(),
        ]) !!};
    </script>

    <script src="{{ asset('js/main.js') }}"></script>
</body>
</html>