import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { ProductModule } from "./public/product/product.module"
import { PrismaModule } from "./private/prisma/prisma.module"
import { ConfigModule } from "@nestjs/config"
import { resolve } from "path"

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath:
                process.env.NODE_ENV === "test"
                    ? resolve(__dirname, "../.env.test.local")
                    : process.env.NODE_ENV === "development"
                      ? resolve(__dirname, "../.env.development.local")
                      : resolve(__dirname, "../.env")
        }),
        PrismaModule,
        ProductModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
