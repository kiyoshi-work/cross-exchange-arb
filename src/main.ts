import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
const PORT = process.env.PORT || "3000";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(morgan('tiny'));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  if (process.env.APP_ENV !== "production") {
    const options = new DocumentBuilder()
      .setTitle("API docs")
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("docs", app, document);
  }
  await app.listen(PORT);
  console.log(`🚀 Application is running in port ${PORT}`);
}
bootstrap();
