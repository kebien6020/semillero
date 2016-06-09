var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.sass('app.scss')
       .sass('home.scss')
       .sass('map.scss')
       .sass('flot.scss')
       .scripts(['flot/jquery.flot.js','flot/jquery.flot.pie.js'],
            'public/js/flot.js')
       .scripts([
            '../../../bower_components/jQuery/dist/jquery.js'
        ], 'public/js/jquery.js')
       .scripts([
            '../../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'
        ], 'public/js/bootstrap.js');
    mix.copy('resources/assets/images','public/images');
});
