import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNumber()
    price: number
}

export class CreateProductDtoFactory {
    static create(data: CreateProductDto): CreateProductDto {
        return {
            name: data.name,
            price: data.price
        }
    }
}
