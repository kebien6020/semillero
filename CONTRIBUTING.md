## Instalación local para desarrollo sobre la página

Para desarrollar sobre este proyecto se hace uso de [Laravel Homestead](https://laravel.com/docs/5.1/homestead), el cual proporciona una máquina virtual con todos los requerimientos necesarios para ejecutar el código (PHP, MySQL, node, entre otros).

Para empezar instale [git](https://git-scm.com/downloads), [VirtualBox](https://www.virtualbox.org/wiki/Downloads) y [Vagrant](http://www.vagrantup.com/downloads.html).

Cree una carpeta para los archivos del proyecto. Para el propósito de este tutorial se va a llamar `Base`:

```sh
mkdir Base
cd Base
```

Dentro de `Base` clone el repositorio de Homestead:

```sh
git clone https://github.com/laravel/homestead.git Homestead
```

Esto creará la carpeta `Base/Homestead`. Entre a esta carpeta e inicialice Homestead.

```sh
cd Homestead
bash init.sh # o ./init en windows
```

Ahora deberá modificar el archivo de configuración de Homestead. En linux está en `~/.homestead/Homestead.yaml`, en windows está en `%USERPROFILE%\.homestead\Homestead.yaml`. Configurarlo de la siguiente forma:

```yaml
ip: "192.168.10.10"
memory: 2048
cpus: 1
provider: virtualbox

# Llave rsa para acceder a la máquina virtual por ssh
authorize: ~/.ssh/id_rsa.pub

keys:
    - ~/.ssh/id_rsa

# Reemplazar aquí la ubicación de la carpeta Base
folders:
    - map: <Ubicación de Base>
      to: /home/vagrant/Code

sites:
    - map: mgcp.app
      to: /home/vagrant/Code/MGCP/public

databases:
    - homestead
```

Recuerde reemplazar en la configuración la ubicación de la carpeta `Base`.

Con esta configuración se va a poder acceder a la aplicación en la dirección http://192.168.10.10, pero podemos modificar el archivo hosts para acceder mediante http://mgcp.app. Para esto necesitamos editar el archivo host. En linux está en `/etc/hosts`, en windows en `%WINDIR%\System32\drivers\etc\hosts`. Es posible que en windows deba copiar el archivo a otra ubicación para editarlo y luego copiar de vuelta para reemplazar el original.

Agregue esto al final del archivo hosts:

```
192.168.10.10  mgcp.app
```

Ya estamos listos para iniciar la máquina virtual. Sin embargo la aplicación en si aun no ha sido descargada.

Ubiquese en la carpeta `Base` y clone el repositorio:

```sh
git clone https://github.com/kebien6020/semillero MGCP
```

Ingrese a `Base/MGCP` y renombre el archivo `.env.example` a `.env`:

```sh
cd MGCP
mv .env.example .env # En windows usar ren en lugar de mv
```
La configuración de entorno provista en `.env.example` suele ser suficiente, pero en caso de ser necesario modificar el usuario y contraseña de la base de datos, es en este archivo que se almacena dicha configuración.

Ahora si podemos ejecutar la máquina virtual. Dirijase a la carpeta `Base/Homestead` y ejecute:

```sh
vagrant up
```

La primera vez que lo ejecute se descargará la máquina virtual, en ejecuciones subsiguientes el proceso será mucho mas rápido.

Por ultimo es necesario generar la `application key` y también instalar las dependencias externas. Para esto acceda a la máquina virtual mediante ssh y use la utilidad de laravel para este tipo de tareas:

```sh
# Esto va a acceder a la consola dentro de la máquina virtual.
vagrant ssh
# Ya dentro de la consola movernos a la carpeta del código
cd Code/MGCP
# Ejecutar la utilidad
php artisan key:generate
# Instalar dependencias de composer
composer install
```

Una vez la máquina esté arrancada puede acceder a la aplicación en http://mgcp.app y cualquier cambio que haga en el código, el cual se encuentra ubicado en `Base/MGCP` se vera reflejado al actualizar la página.

Cuando termine las ediciones, estando ubicado en `Base/Homestead` apague la máquina virtual:

```sh
vagrant halt
```
## Accesos subsiguientes

Después de la configuración inicial para seguir haciendo cambios en el código, deberá arrancar la máquina virtual:

```sh
cd `Base/Homestead`
vagrant up
```

Acceda a la aplicación en http://mgcp.app para visualizar los cambios mientras edita el código.

En caso de necesitar ejecutar comandos de artisan (con `php artisan`), de gulp o de MySQL. Acceda a la máquina virtual con:

```sh
vagrant ssh
```

Es importante para acceder mediante ssh que la maquina virtual esté arrancada y que este ubicado en la carpeta `Base/Homestead`.

Al finalizar cada cambio recuerde hacer commit:

```sh
# Ubicado en `Base/MGCP`
git add -A
git commit -m "<Descripción breve de los cambios realizados>"
```

Cuando ya no vaya a seguir trabajando apague la maquina virtual con:

```sh
# Ubicado en `Base/Homestead`
vagrant halt
```
