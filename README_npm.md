<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


## Description

[Loggrar 1.0.1](https://loggrar.com) ERP empresarial

## Installation

1. instalación de nest-cli
```
npm i -g @nestjs/cli
```
2. Clonar el repositorio.
```
git clone xxx
```

3. instalar dependencias
```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# create production dist
$ npm run build
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
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
```

2. creación de propyecto
```
nest new project-name
```

## Módulos
| Instalación | Detalle |
|-|--|
|```npm i --save @nestjs/typeorm typeorm mysql2```|__typeorm__ » Modulo para manejo de BD (MySql-MariaDB)|
|```npm i --save @nestjs/throttler```|__throttler__ » Modulo para el control de peticiones|
|```npm i --save helmet```|__helmet__ » Protección vulnerabilidades encabezados HTTP|
|```npm i --save @nestjs/jwt passport-jwt```|__passport__ y __JWT__ » Modulos para implementar la seguridad|
|```npm i --save-dev @types/passport-jwt```|Tipado de **_JWT_**|
|```npm i --save @nestjs/passport passport```|__passport__ » Modulos para implementar la seguridad |
|```npm i --save class-validator class-transformer```|__class-transformer__ y __class-validator__ » Transformaciones de datos|
|```npm i --save @nestjs-modules/mailer nodemailer``` |__mailer__ » Módulo para enviar emails |
|```npm i --save-dev @types/nodemailer```|Tipado **_mailer_**|
|```npm i --save handlebars```|Procesador de plantillas (HTML) para el **_mailer_**|
|```npm i --save @nestjs/config```|__config__ » Modulo para leer las variables de entorno  (.env)|
|```npm i --save @nestjs/swagger```|__swagger__ » Modulo para implementar documentación|
|&nbsp;||
|```npm i --save bcryptjs```| __bcryptjs__ » Modulo para cifrado de datos|
|```npm i --save uuid```|__uuid_ » Modulo para generar y validar UUID|
|```npm i --save moment```|__moment__ » Modulo para el manejo de fechas|
|&nbsp;||
|__ojo revisar__| |
|```npm i --save numeral```|__numeral__ » Modulo para el manejo de valores de monedas $ (en reportes WEP)|
|```npm i --save-dev cross-env```|__cross-env__ » Modulo para el manejo de variables de entorno en los script de seeders|
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
***** **OJO CAMBIAR a endpoints**
```
en **package.json**, para seeders, adicionar el los "scripts": :
```
  "seeders:seed": "cross-env NODE_ENV=developer ts-node src/database/commands/tables.seeder.ts",
  "seeders:reverse": "cross-env NODE_ENV=developer ts-node src/database/commands/reverse.seeder.ts",
  "start:security": "cross-env NODE_ENV=developer ts-node src/database/commands/start-security.ts",
  "start:token": "cross-env NODE_ENV=developer ts-node src/common/tools/generateToken.ts"
```
&nbsp;
en **.eslintrc.js**, cambiar:
```
 extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  
```
por:
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