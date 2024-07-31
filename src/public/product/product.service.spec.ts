import { Test, TestingModule } from "@nestjs/testing"
import { ProductService } from "./product.service"
import { PrismaService } from "../../private/prisma/prisma.service"
import { PrismaModule } from "../../private/prisma/prisma.module"
import { mockPrismaService } from "./prisma-mock/prisma.mock"
import { INestApplication, ValidationPipe } from "@nestjs/common"

describe("ProductService", () => {
    let app: INestApplication
    let productService: ProductService
    let prismaService: PrismaService

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            providers: [ProductService]
        })
            .overrideProvider(PrismaService)
            .useValue(mockPrismaService)
            .compile()

        app = moduleFixture.createNestApplication()
        app.useGlobalPipes(new ValidationPipe())
        await app.init()

        productService = app.get<ProductService>(ProductService)
        prismaService = app.get<PrismaService>(PrismaService)
    })

    describe("product", () => {
        it("should store a product in warehouse", () => {
            const prismaCreateSpy = jest.spyOn(prismaService.product, "create")
            const response = productService.create({
                name: "Product A",
                price: 500
            })

            expect(response).toBeDefined()
            expect(prismaCreateSpy).toHaveBeenCalledTimes(1)
        })
    })
})
