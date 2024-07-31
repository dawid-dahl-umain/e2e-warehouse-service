import { jest } from "@jest/globals"
import { Prisma, Product } from "@prisma/client"

type ProductCreateArgs = {
    data: Prisma.ProductCreateInput | Prisma.ProductUncheckedCreateInput
}

let products: Product[] = []

export const mockPrismaService = {
    product: {
        create: jest.fn((args: ProductCreateArgs) => {
            const { name, price } = args.data
            const existingProduct = products.find(
                product => product.name === name
            )

            if (existingProduct) {
                throw new Prisma.PrismaClientKnownRequestError(
                    "Unique constraint failed on the fields: (`name`)",
                    { code: "P2002" } as any
                )
            }

            const newProduct = {
                id: "some-id",
                name,
                price
            } as Product

            products.push(newProduct)

            return Promise.resolve(newProduct)
        })
    },
    clearProducts: () => {
        products = []
    }
}
