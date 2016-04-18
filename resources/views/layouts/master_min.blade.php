<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Semillero - @yield('title')</title>

    <link href='https://fonts.googleapis.com/css?family=Squada+One' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'>
    
    <link rel="stylesheet" href="/css/app.css">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
    @yield('head')
</head>
<body>
    @yield('header')
    <div class="main">
        <div class="content">
            @yield('content')
        </div>

        @yield('menu')
    </div>
</body>
</html>