<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


## Description

[Loggrar 1.0.1](https://loggrar.com) ERP empresarial

## Installation

1. instalación de nest-cli
```
npm i -g @nestjs/cli
yarn global add  @nestjs/cli
```
2. Clonar el repositorio.
```
git clone xxx
```

3. instalar dependencias
```bash
npm install
yarn 
```

3. Configurar variables de entorno 
```
.env.prod
```
// todo: tabla de variables

4. Instalar docker

5. levantar los contenederos en docker
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```
notas:
si desea limpiar la cahche de docker:
```
docker builder prune
```

limpiar todo el docker - precaución:
```
docker system prune -af
```

crear contenedor de bd manualmente:
docker run -d --name mongo-loggrar -e MONGO_INITDB_ROOT_USERNAME=loggrar-admin -e MONGO_INITDB_ROOT_PASSWORD=loggr@r -e MONGO_INITDB_DATABASE=loggrarDevDB -p 27017:27017 mongo:6

entrar al contenedor de la base de datos:
docker exec -it mongo-loggrar bash

entrar a mongo:
mongosh --port 27017 --authenticationDatabase admin -u root -p loggr@r

listar los usuarios:
use admin
db.system.users.find()

## Running the app

```bash
# development
npm run start
yarn start

# watch mode
npm run start:dev
yarn start:dev

# production mode
npm run start:prod
yarn start:prod

# create production dist
npm run build
yarn build
```

## Test

```bash
# unit tests
npm run test
yarn test

# e2e tests
npm run test:e2e
yarn test::e2e

# test coverage
npm run test:cov
yarn test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
***
&nbsp;
***
&nbsp;

## Iniciar desde 0
1. instalación de nest-cli
```
npm i -g @nestjs/cli
yarn global add  @nestjs/cli
```

2. creación de propyecto
```
nest new project-name
```

## Módulos
| Instalación | Detalle |
|-|--|
|```yarn add @nestjs/typeorm typeorm mysql2```|__typeorm__ » Modulo para manejo de BD (MySql-MariaDB)|
|```yarn add @nestjs/throttler```|__throttler__ » Modulo para el control de peticiones|
|```yarn add helmet```|__helmet__ » Protección vulnerabilidades encabezados HTTP|
|```yarn add @nestjs/jwt passport-jwt```|__passport__ y __JWT__ » Modulos para implementar la seguridad|
|```yarn add -D @types/passport-jwt```|Tipado de **_JWT_**|
|```yarn add @nestjs/passport passport```|__passport__ » Modulos para implementar la seguridad |
|```yarn add class-validator class-transformer```|__class-transformer__ y __class-validator__ » Transformaciones de datos|
|```yarn add @nestjs-modules/mailer nodemailer``` |__mailer__ » Módulo para enviar emails |
|```yarn add -D @types/nodemailer```|Tipado **_mailer_**|
|```yarn add handlebars```|Procesador de plantillas (HTML) para el **_mailer_**|
|```yarn add @nestjs/config```|__config__ » Modulo para leer las variables de entorno  (.env)|
|```yarn add @nestjs/swagger```|__swagger__ » Modulo para implementar documentación|
|```yarn add bcryptjs```| __bcryptjs__ » Modulo para cifrado de datos|
|```yarn add moment```|__moment__ » Modulo para el manejo de fechas|
|&nbsp;||
|__ojo revisar__| |
|```yarn add numeral```|__numeral__ » Modulo para el manejo de valores de monedas $ (en reportes WEP)|
||swagger-ui-express|


## varios
En **nest-cli.json**, adicionar:
```
 "compilerOptions": {
        "assets": ["mail/templates/**/*"]
    },
    "watchAssets": true
```
&nbsp;
***** //TODO: CAMBIAR a endpoints
en **package.json**, para seeders, adicionar el los "scripts": :
```
  "seeders:seed": "cross-env NODE_ENV=developer ts-node src/database/commands/tables.seeder.ts",
  "seeders:reverse": "cross-env NODE_ENV=developer ts-node src/database/commands/reverse.seeder.ts",
  "start:security": "cross-env NODE_ENV=developer ts-node src/database/commands/start-security.ts",
  "start:token": "cross-env NODE_ENV=developer ts-node src/common/tools/generateToken.ts"
```
&nbsp;
en **.eslintrc.js**, retirar los elmentos del arreglo:
```
 extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  
```
quedaría así:
```
 extends: [],
  
```
&nbsp;
en **tsconfig.json**, cambiar:
```
"target": "es2017",
```
por:
```
"target": "es2021",
```
&nbsp;
en **tsconfig.json**, adicionar:
```
 "baseUrl": "./src",
    "paths": {
        "@modules/*": ["modules/*"],
        "@safety/*": ["modules/safety/*"],
        "@system/*": ["modules/system/*"],
        "@common/*": ["common/*"]
    },
  ```