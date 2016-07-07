@if (session()->has('success'))
    <div class="success-panel">
        <button class="dismiss" data-dismiss="alert">×</button>
        {!! session('success') !!}
    </div>
@endif

@if (session()->has('error'))
    <div class="error-panel">
        <button class="dismiss" data-dismiss="alert">×</button>
        {!! session('error') !!}
    </div>
@endif