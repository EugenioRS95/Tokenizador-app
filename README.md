# Serverless Nodejs Rest API con TypeScript y MongoDB Atlas - TokenizadorApp


Se expone el proyecto tokenizador de tarjeta de crédito.

## Tecnologías

* REST API con typescript
* MongoDB Atlas data storage
* Multi-environment administrado bajo Serverless
* Serverless offline
* NodeJs 14.18
* Jest
* Esbuild

## Primero configurar con las credenciales de acceso a AWS con el comando
 ```
$ aws configure
```
* `aws_access_key_id`
* `aws_secret_access_key`

### Instalar las dependencias necesarias

* Ejecutar ```npm install``` para instalar las dependencias necesarias.

### Configurar el archivo `.env` para su conexión con DynamoDB
Pueden ser las mismas que las credenciales configuradas inicialmente, siempre y cuando tenga los permisos necesarios.

* `DB_URL`
* `DB_NAME`
* `DB_CUSTOMERACCOUNTS_COLLECTION`
* `DB_TOKENS_COLLECTION`

## Despliegue Local

* Ejecutar ```npm run dev``` para desplegar localmente.

## Despliegue en AWS
* Ejecutar ```npm run deploy``` para desplegar en AWS.

## Ejecución de test de pruebas
* Ejecutar ```npm run test``` para ejecutar los test de pruebas.


## Body de envío para el servicio ```/dev/generateToken```
 ```
{    
    "email": string,
    "card_number": number,
    "cvv": number,
    "expiration_year": string,
    "expiration_month": string
}
```

## Cabecera(header) Bearer token para el servicio ```/dev/getCustomer```

* pk_tknzr_"token"


