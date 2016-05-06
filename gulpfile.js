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
       .scripts(['flot/jquery.flot.js','flot/jquery.flot.pie.js'],'public/js/flot.js');
    mix.copy('resources/assets/images','public/images');
});
