import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Inject,
    Post
} from "@nestjs/common"
import { Prisma, Product } from "@prisma/client"
import { IProduct, PRODUCT_SERVICE_TOKEN } from "./interface/IProduct"
import { CreateProductDto } from "./dto/product-dto"

@Controller("product")
export class ProductController {
    constructor(
        @Inject(PRODUCT_SERVICE_TOKEN) private readonly productService: IProduct
    ) {}

    @Post()
    async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
        try {
            return await this.productService.create(createProductDto)
        } catch (error) {
            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                throw new HttpException(
                    "Product already exists",
                    HttpStatus.CONFLICT
                )
            }

            throw new HttpException(
                "Internal server error",
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }
}
