import { ClassProvider } from "@nestjs/common"
import { PrismaSeedManager } from "./PrismaSeedManager"
import { IPrismaSeedManager } from "./interface/interface" // Adjust the import path accordingly

export const PRISMA_SEED_MANAGER_TOKEN = "PRISMA_SEED_MANAGER_TOKEN"

export const PrismaSeedManagerProvider: ClassProvider<IPrismaSeedManager> = {
    provide: PRISMA_SEED_MANAGER_TOKEN,
    useClass: PrismaSeedManager
}
