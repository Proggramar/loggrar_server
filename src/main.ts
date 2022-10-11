import { Logger, RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AllExceptionFilter } from '@common/filters';
import { TimeOutInterceptor } from '@common/interceptors';
// import * as csurf from 'csurf';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { abortOnError: false });

    app.enableCors();
    app.use(helmet());
    // app.use(csurf());
    app.setGlobalPrefix('api', { exclude: [{ path: '/', method: RequestMethod.GET }] });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    // app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    if (process.env.NODE_ENV != 'dev') app.useGlobalInterceptors(new TimeOutInterceptor());

    if (process.env.NODE_ENV != 'dev') app.useGlobalFilters(new AllExceptionFilter());

    app.enableVersioning({ type: VersioningType.URI });

    const options = new DocumentBuilder()
      .setTitle('Loggrar API 1.0')
      .setDescription('ERP Comercial')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/api/v1/docs', app, document, { swaggerOptions: { filter: true } });

    await app.listen(process.env.BACK_APP_PORT || 3000, () => {
      Logger.log('server on port: ' + process.env.BACK_APP_PORT || 3000);
    });
  } catch (err) {
    console.log(err); // <-- for example, ECONNREFUSED error
  }

  // Logger.log('server on port: ' + AppModule.port); // verdecito
  // Logger.debug('debug'); // violeta
  // Logger.verbose('verbose'); // azulito
  // Logger.warn('server on port: ' + AppModule.port); //amarillo
  // Logger.error('server on port: ' + AppModule.port); // rojo
}
bootstrap();
