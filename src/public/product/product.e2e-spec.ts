import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { PrismaService } from "src/private/prisma/prisma.service"
import { ProductModule } from "./product.module"
import request from "supertest"
import { AppModule } from "src/app.module"
import { CreateProductDto, CreateProductDtoFactory } from "./dto/product-dto"
import { PrismaModule } from "src/private/prisma/prisma.module"

describe("ProductController (E2E)", () => {
    let app: INestApplication
    let prismaService: PrismaService

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, ProductModule, PrismaModule]
        }).compile()

        app = moduleFixture.createNestApplication()
        prismaService = moduleFixture.get<PrismaService>(PrismaService)

        app.useGlobalPipes(new ValidationPipe())

        await app.init()

        await prismaService.$executeRaw`TRUNCATE "public"."Product" RESTART IDENTITY CASCADE;`
    })

    afterEach(async () => {
        await prismaService.$executeRaw`TRUNCATE "public"."Product" RESTART IDENTITY CASCADE;`
    })

    afterAll(async () => {
        await app.close()
        await prismaService.$disconnect()
    })

    describe("CREATE /product", () => {
        const productInputs = [
            CreateProductDtoFactory.create({ name: "Product A", price: 500 }),
            CreateProductDtoFactory.create({ name: "Product B", price: 1500 }),
            CreateProductDtoFactory.create({ name: "Product C", price: 2500 })
        ]

        it.each(productInputs)(
            "should store product in warehouse with name '$name' and price '$price'",
            async input => {
                // Arrange
                const productPayload: CreateProductDto =
                    CreateProductDtoFactory.create(input)

                // Act
                const response = await request(app.getHttpServer())
                    .post("/product")
                    .send(productPayload)
                    .expect(HttpStatus.CREATED)

                // Assert
                const createdProduct = response.body
                const product = await prismaService.product.findUnique({
                    where: { id: createdProduct.id }
                })

                expect(response.body).toBeDefined()
                expect(createdProduct.id).toBe(product.id)
                expect(productPayload.name).toBe(product.name)
                expect(productPayload.price).toBe(product.price)
            }
        )

        const invalidProductInputs = [
            { name: null, price: 500, _description: "null" },
            { name: "", price: 500, _description: "empty" }
        ]

        it.each(invalidProductInputs)(
            "should return bad request when product name is $_description",
            async input => {
                // Arrange
                const productPayload: CreateProductDto =
                    CreateProductDtoFactory.create(input)

                // Act & Assert
                await request(app.getHttpServer())
                    .post("/product")
                    .send(productPayload)
                    .expect(HttpStatus.BAD_REQUEST)
            }
        )

        it("should return 409 Conflict when product with the same name already exists", async () => {
            // Arrange
            const productPayload: CreateProductDto =
                CreateProductDtoFactory.create({
                    name: "Product X",
                    price: 500
                })

            // Act & Assert
            await request(app.getHttpServer())
                .post("/product")
                .send(productPayload)
                .expect(HttpStatus.CREATED)

            // Act & Assert
            await request(app.getHttpServer())
                .post("/product")
                .send(productPayload)
                .expect(HttpStatus.CONFLICT)
        })
    })
})
