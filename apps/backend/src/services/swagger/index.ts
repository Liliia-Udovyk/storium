import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const options = new DocumentBuilder()
  .setTitle('Storium API')
  .setDescription('API for file and folder management with user permissions')
  .setVersion('1.0')
  .addBearerAuth()
  .addApiKey(
    {
      type: 'apiKey',
      name: 'x-api-key',
      in: 'header',
    },
    'master-key',
  )
  .build();

export const createSwagger = (app: NestExpressApplication) => {
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document);
};
