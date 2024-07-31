import { PrismaService } from "src/private/prisma/prisma.service"
import { Injectable } from "@nestjs/common"
import { IPrismaSeedManager } from "./interface/interface"

@Injectable()
export class PrismaSeedManager implements IPrismaSeedManager {
    constructor(private prismaService: PrismaService) {}

    async clearDatabase(): Promise<void> {
        await this.prismaService
            .$executeRaw`TRUNCATE "public"."Product" RESTART IDENTITY CASCADE;`
    }
}
