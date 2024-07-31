import { Injectable } from "@nestjs/common"
import { Product } from "@prisma/client"
import { PrismaService } from "src/private/prisma/prisma.service"
import { IProduct } from "src/public/product/interface/IProduct"
import { CreateProductDto } from "./dto/product-dto"

@Injectable()
export class ProductService implements IProduct {
    constructor(private readonly prisma: PrismaService) {}

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const product = await this.prisma.product.create({
            data: createProductDto
        })

        return product
    }
}
