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
    @yield('head')
</head>
<body>

    @yield('navbar')

    <main>
        @yield('raw-content', $__env->yieldContent('content'))
    </main>

    <script
        src="/js/{{ $__env->yieldContent('script','app') }}.js"
        type="text/javascript"
        charset="utf-8">
    </script>

    @yield('custom-script')
</body>
</html>
