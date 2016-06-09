<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>MICP - @yield('title')</title>

    <link href='https://fonts.googleapis.com/css?family=Squada+One' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'>
    
    <link rel="stylesheet" href="{{ url('css/app.css') }}">

    <script src="{{ url('js/jquery.js') }}"></script>
    @yield('head')
</head>
<body>
    @yield('navbar')
    @yield('raw-content')
    <script src="{{ url('js/bootstrap.js') }}" type="text/javascript" charset="utf-8" async defer></script>
</body>
</html>