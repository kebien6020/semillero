@extends('layouts.container')

@section('title', 'Error 404')

@section('content')

@include('partial.messages')

<h1>Error 404: La página no existe</h1>
<p>No se pudo encontrar el recurso al que intenta acceder.</p>

@endsection