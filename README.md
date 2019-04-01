# WIKI aplicacionFinal

Esto es una documentación sobre el proyecto final del curso, aquí se especifican las distintas formas de acceder a la API.


## PACIENTE

#### GET PACIENTES

Devuelve todos los pacientes

```
GET: localhost:3000/paciente
```

#### GET PACIENTE

Devuelve un sólo paciente haciendo la búsqueda por su id

```
GET: localhost:3000/paciente/:id
```

#### POST PACIENTE

Crea un nuevo usuario paciente en la base de datos

Suma +1 al número de pacientes que tiene cada médico

Datos necesarios:

* nombre: { type: String, required },
* apellido: { type: String, required },
* password: { type: String, required },
* dni: { type: String, unique: true, required },
* email: { type: String, required }, 
* telefono: { type: String, required }, 
* direccion: { type: String, required }, 
* tarjeta_sanitaria: { type: String, unique: true, required }, 
* baja: { type: Boolean }, 

```
POST: localhost:3000/paciente
```

#### PUT PACIENTE

Actualiza un paciente con un id

```
PUT: localhost:3000/paciente/:id
```

#### BAJA PACIENTE

Cambiar baja del paciente a true

Pone consultas a canceladas

Resta a médico el número de pacientes asignados (todas las especialidades)

```
PUT: localhost:3000/paciente/baja/:id
```

#### DELETE PACIENTE

ESTA FUNCIÓN NO SE USA, AUNQUE EXISTA ESTÁ COMENTADA, PORQUE NO QUEREMOS BORRAR USUARIOS, SOLO DARLOS DE BAJA

Borra un paciente con su id

```
DELETE: localhost:3000/paciente/:id
```


##  MÉDICO

#### GET MEDICOS

Devuelve todos los medicos

```
GET: localhost:3000/medico
```

#### POST MEDICO

Crea un nuevo usuario medico en la base de datos

Datos necesarios:

* nombre: { type: String, required },
* apellido: { type: String, required },
* usuario: { type: String, unique: true, required },
* password: { type: String, required },
* email: { type: String, required }, 
* telefono: { type: String, required }, 
* baja: { type: Boolean }, 
* especialidad: { type: String, required, enum: especialidades }, // Tiene unas especialidades obligatorias para meter
* npacientesasignados: { type: Number, required, default: 0 }, 
* rol: { type: String, required, enum: rolMedico }, // Tiene unos roles obligatorias para meter

```
POST: localhost:3000/medico
```

#### PUT MEDICO

Actualiza un medico con un id

```
PUT: localhost:3000/medico/:id
```

#### DELETE PACIENTE

ESTA FUNCIÓN NO SE USA, AUNQUE EXISTA ESTÁ COMENTADA, PORQUE NO QUEREMOS BORRAR MEDICOS, SOLO DARLOS DE BAJA

Borra un medico con su id

```
DELETE: localhost:3000/medico/:id
```





## OTRAS COSAS

Antes de ejecutar instalar dependencias: npm install (esto instala también nodemon para actualizar cambios sin reiniciar servidor)

Ejecutar en local: npm start (si da error cambiar el puerto)


build app: sudo docker build -t usuario/aplicacion-final .
run app: sudo docker run -p 49160:8080 -d usuario/aplicacion-final