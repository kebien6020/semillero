@if (session()->has('success'))
    <div class="success-panel">{!! session('success') !!}</div>
@endif

@if (session()->has('error'))
    <div class="error-panel">{!! session('error') !!}</div>
@endif