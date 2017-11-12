<!DOCTYPE html>
<html lang="es" class="@yield('view-class')">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    {{-- <base href="{{ url('/') }}"> --}}
    <title>MGCP - @yield('title')</title>

    <link href='https://fonts.googleapis.com/css?family=Squada+One' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css'>

    <link rel="stylesheet" href="/css/app.css">
</head>
<body>

    @yield('navbar')

    <main>
        @yield('raw-content', $__env->yieldContent('content'))
    </main>

    {{-- CDN Scripts Loaded in all pages --}}
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.2/react.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.3.2/react-dom.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.pie.min.js"></script>
    {{-- Actually custom scripts rather than head --}}
    @yield('head')

    <script
        src="/js/{{ $__env->yieldContent('script','app') }}.js"
        type="text/javascript"
        charset="utf-8">
    </script>

    @yield('custom-script')
</body>
</html>
