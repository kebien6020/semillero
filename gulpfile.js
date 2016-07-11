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

elixir.config.js.browserify.watchify.options.poll = true;

elixir(function(mix) {
  // Sass
  mix.sass('app.scss');

  // Copy assets
  mix.copy('resources/assets/images','public/images')
     .copy('node_modules/bootstrap-sass/assets/fonts/', 'public/fonts');

  // Javascript
  [
    'map.js',
    'app.js',
    'fluidos_map_campos.js',
    'arenas_map.js',
    'arenas_matrix_results.js',
    'arenas_matrix_edit.js',
    'home.js'
  ].forEach(function(val){
    mix.browserify(val);
  });
});
