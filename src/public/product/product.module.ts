import { Module } from "@nestjs/common"
import { ProductController } from "./product.controller"
import { IProductProvider } from "./interface/IProduct"
import { PrismaModule } from "src/private/prisma/prisma.module"

@Module({
    imports: [PrismaModule],
    controllers: [ProductController],
    providers: [IProductProvider]
})
export class ProductModule {}
