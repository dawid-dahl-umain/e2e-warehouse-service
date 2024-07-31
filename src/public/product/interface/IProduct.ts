import { Product } from "@prisma/client"
import { ProductService } from "../product.service"
import { ClassProvider } from "@nestjs/common"
import { CreateProductDto } from "../dto/product-dto"

export interface IProduct extends ICreateProduct {}

export interface ICreateProduct {
    create(createProductDto: CreateProductDto): Promise<Product>
}

export const PRODUCT_SERVICE_TOKEN = "PRODUCT_SERVICE_TOKEN"

export const IProductProvider: ClassProvider<IProduct> = {
    provide: PRODUCT_SERVICE_TOKEN,
    useClass: ProductService
}
