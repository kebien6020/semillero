# MGCP

MGCP (Manual general de completamiento de pozos) es una pagina web diseñada para suplir diferentes necesidades en la división de completamiento en Ecopetrol mediante una colección de proyectos de semillero.

El backend de MGCP está desarrollado en php usando el framework [Laravel](https://laravel.com/).

Para el frontend se han usado diversas tecnologías (incluyendo simple javascript, [AngularJS 1](https://angularjs.org/) y [React](https://facebook.github.io/react/)), sin embargo el preprocesado de assets se hace mediante [gulp](http://gulpjs.com/) (ver el [gulpfile de este proyecto](./gulpfile.js)) y para comodidad de uso de gulp se hace uso de [Laravel Elixir](https://laravel.com/docs/5.1/elixir), esto permite usar [nuevas características de javascript](http://es6-features.org) y que el código sea convertido para mayor compatibilidad con navegadores antiguos.

## Desarrollo

Para configurar su entorno para desarrollar sobre este proyecto, ver las [guías para contribución](./CONTRIBUTING.md).

## Estructura del Código

El código está estructurado según la herramienta de generación de proyectos de Laravel. Por esto es recomendable ver la [documentación oficial de Laravel](https://laravel.com/docs/5.1/routing) así como tutoriales de Laravel en caso de no ser familiar con este framework.

Una buena forma de explicar la estructura del código es por la estructura de las carpetas.

### app

La carpeta app contiene la mayoría del código del backend. El primer lugar en el que abría que fijarse es en el `router` que se encuentra en [`./app/Http/routes.php`](./app/Http/routes.php). En el `router` se define cada url de la aplicación, el método por el que se puede acceder (GET, POST, PUT o DELETE) y cual controlador se encarga de generar una respuesta.

También en el `router` se especifica el middleware `auth`, para las rutas que lo requieren, las rutas que tengan especificado el middleware `auth` requerirán que se haya iniciado la sesión y re-direccionarán a cualquier usuario que no haya iniciado sesión a la url `/login`.

Los controladores en cuestión se encuentran dentro de [`./app/Http/Controllers`](./app/Http/Controllers), todos heredan de Controller (por lo que comportamiento común se puede definir en esta clase). Las funciones de los controladores son llamadas desde el router y se encargan de obtener y almacenar la información de la base de datos mediante los modelos y proveer esta información a las vistas (que se encuentran en [`./resources/views`](./resources/views)).

En la carpeta app también encontramos los modelos que se encargan de acceder a la base de datos y proporcionan una forma fácil de acceder a la información mitigando los riesgos de seguridad (en particular inyección SQL). También es en cada uno de los modelos en que se definen las relaciones (por ejemplo, `Well` pertenece a `Field` y `Field` tiene varios `Well`).

### resources

La carpeta resources contiene los assets (imágenes, javascript y hojas de estilos), y tambien las vistas.

Los assets son procesados según el [gulpfile](./gulpfile.js) y el resultado de dicho procesamiento es almacenado en la carpeta public. Por esto mismo los assets se pueden escribir en lenguajes diferentes a los que seran servidos al cliente.

El javascript es preprocesado mediante [babel](https://babeljs.io/), el cual toma el código de javascript escrito según el estándar EcmaScript2015 (tambien conocido como ES6) y lo transforma en código con mayor compatibilidad.

Los estilos se escriben en [scss](http://sass-lang.com/guide), un superset de css con muchas adiciones como estilos anidados y variables que hacen que las hojas de estilos sean mas limpias y entendibles. Por ser un superset de css, cualquier css válido es scss válido, es decir, no es necesario aprender un lenguaje nuevo sino que se puede realizar una transición gradual.

Las vistas son plantillas de html escritas en [blade](https://laravel.com/docs/5.4/blade), un lenguaje de template creado por Laravel. En las vistas se define como se va a generar el html final a partir de la información provista por el controlador.

### public

La carpeta public es servida directamente al cliente. Es por esto que aquí se encuentra el punto de entrada a la aplicación que es el archivo `index.php`, este archivo *no es necesario modificarlo*.

También en esta carpeta se encuentran los assets ya procesados ya que estos van a ser servidos directamente al usuario.

Por último cuando se configure un servidor (como nginx o apache) para servir la aplicación, esta es la carpeta a la que se debe apuntar desde la configuración.

### database

En la carpeta database encontramos las migraciones, en estas se define cada cambio que se le deba hacer a la estructura de la base de datos asi como la forma de revertir este cambio. Cada vez que se genere un nuevo modelo, se debe hacer una migracion para realizar los cambios correspondientes en la base de datos.

Tambien encontramos las seeds, estas son muy útiles cuando se esta probando la aplicación en desarrollo ya que generan datos de prueba, de esta forma si se debe reconstruir la base de datos, se pueden ingresar datos de prueba rápidamente.

### Otras carpetas y archivos

En la carpeta config hay archivos que retornan simples arrays y permiten configurar varios aspectos de la aplicación. No es necesario hacer cambios aqui muy seguido.

En la carpeta bootstrap hay secuencias de inicializacion de la aplicación (autocarga de Clases, inicializacion de ServiceProviders, etc).

En storage/logs hay registros de errores. En storage/framework se guardan archivos autogenerados por laravel (tokens de sesión, vistas precompiladas, entre otros). En storage/app se guardan archivos generados por la aplicacion (por ejemplo, archivos cargados por el ususario).

En vendor se guardan dependencias de [composer](https://getcomposer.org/). En node_modules se guardan dependencias de [npm](https://www.npmjs.com/).

En tests se guardan los test automáticos de la aplicación. No son requeridos para el funcionamiento de la misma pero aumentan la confiabilidad y la estabilidad.

Fuera de carpetas esta el archivo composer.json que define las dependencias de composer y el archivo package.json que define las dependencias de node.
