@extends('layouts.master_min')
@section ('title', 'Inicio de Sesión')
@section('head')
    <link rel="stylesheet" href="{{ url('css/login.css') }}">
@endsection

@section('script', 'home')

@section('raw-content')
<main>
    <div class="login-container">
        <div class="login">
            <h1>Iniciar Sesión</h1>
            <form action="/login" method="POST">
                {{ csrf_field() }}
                <div class="my-input-group">
                    <label for="username" class="sr-only">Nombre de usuario: </label>
                    <input type="text" name="username" placeholder="Nombre de usuario">
                    @if ($errors->has('username'))
                        <span class="help-block">
                            <strong>{{ $errors->first('username') }}</strong>
                        </span>
                    @endif
                </div>
                <div class="my-input-group">
                    <label for="password" class="sr-only">Contraseña: </label>
                    <input type="password" name="password" placeholder="Contraseña">
                    @if ($errors->has('password'))
                        <span class="help-block">
                            <strong>{{ $errors->first('password') }}</strong>
                        </span>
                    @endif
                </div>
                <div class="remember-me">
                    <label for="remember">
                        <input type="checkbox" name="remember">
                        Recordarme en este computador
                    </label>
                </div>
                <div class="submit">
                    <input type="submit" name="submit" value="Iniciar sesión">
                </div>
            </form>
        </div>
        <div class="login-help">
            ¿Olvidó la contraseña?, <a href="/password/reset">click aquí para restaurarla</a>.
        </div>
    </div>
</main>
@endsection