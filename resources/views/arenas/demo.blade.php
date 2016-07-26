@extends('layouts.container')

@section('title', 'Video Explicativo')

@section('view-class', 'arenas-demo')

@section('content')

{{-- Embed from youtube --}}
<iframe
    id="main-video"
    src="https://www.youtube.com/embed/LpoN5_wD0HY"
    frameborder="0"
    allowfullscreen>
</iframe>

@endsection