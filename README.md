# Tripbox Frontend

## Pasos para empezar a desarrollar:

1. Vamos al terminal y lanzamos:

        $ git clone <urlDelRepositorio>


    Esto nos habrá creado una nueva carpeta con el contenido del repositorio llamada TB_Frontend.

2. Ahora toca descargar las dependencias: jQuery, Bootstrap, Grunt, Bower, etc. Para realizar esto, nos meteremos dentro de la carpeta y llamaremos a un comando que nos lo instalará todo de golpe:

        $ cd TB_Frontend

        $ npm install

    Esto empezará a instalar todas las dependencias y podremos empezar a trabajar.

## Comandos útiles durante el desarrollo

### Grunt tasks

    $ grunt serve

Lanza el proyecto en un servidor local, traduce el SCSS a CSS, pasa los juegos de pruebas y **permanece encendido** vigilando cambios en el sistema de ficheros, refrescando el navegador cada vez que se detecta uno. Realiza mas funciones, para mas info, mira dentro de Gruntfile.js

    $ grunt test

Pasa los juegos de prueba

    $ grunt build

Crea una release, con el CSS y el JS minificado, imagenes comprimídas, etc.


