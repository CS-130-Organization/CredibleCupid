import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { BACKEND_PORT, FRONTEND_PORT } from "./env";
import * as fs from "fs";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.enableCors({ origin: "http://localhost:" + FRONTEND_PORT });

	const config = new DocumentBuilder()
		.setTitle("CredibleCupid API")
		.setDescription("CredibleCupid REST API documentation")
		.setVersion("1.0")
		.addBearerAuth({
			type: "http",
			scheme: "bearer",
			bearerFormat: "JWT",
			name: "JWT",
			description: "Enter JWT token",
			in: "header",
		})
		.build();

	const doc = SwaggerModule.createDocument(app, config, { operationIdFactory: (_: string, method_key: string) => method_key });
	SwaggerModule.setup("api", app, doc);
	fs.writeFileSync(process.env["OPENAPI_OUT"]!, JSON.stringify(doc));

	await app.listen(BACKEND_PORT);
}
bootstrap();
