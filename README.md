# Serverless Nodejs Rest API con TypeScript y MongoDB Atlas - TokenizadorApp


Se expone el proyecto tokenizador de tarjeta de crédito.

## Tecnologías

* REST API con typescript
* MongoDB Atlas data storage
* Multi-environment administrado bajo Serverless
* Serverless offline
* NodeJs 14.18

## Primero configurar con las credenciales de acceso a AWS con el comando
 ```
$ aws configure
```

## Despliegue

### Probar la aplicación localmente

* Ejecutar ```npm install``` para instalar las dependencias necesarias.
* Ejecutar ```npm run dev``` para desplegar en serverless offline localmente. 

### Envío pk en el request a los endpoints
* Envío de pk a través del header Authorization ```Bearer pk_tknzr_``` para el registro de cliente y generación de token.
* Envío de pk a través del header Authorization ```Bearer pk_tknzr_<TOKEN>``` para la obtención de datos de la tarjeta.

### Despliegue en AWS, simplemente ejecutar:

```
$ npm run deploy

# or

$ serverless deploy
```

### Para realizar el testeo de los endpoint ejecutar:
```
$ npm run test

```