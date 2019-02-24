# aplicacionFinal

Instalado nodemon para ejecutar automaticamente los cambios

Antes de ejecutar instalar dependencias: npm install (esto instala también nodemon para actualizar cambios sin reiniciar servidor)

Ejecutar en local: npm start (si da error cambiar el puerto)


build app: sudo docker build -t usuario/aplicacion-final .
run app: sudo docker run -p 49160:8080 -d usuario/aplicacion-final