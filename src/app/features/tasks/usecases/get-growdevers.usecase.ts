import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { GrowdeverRepository } from "../repositories/growdever.repository";

export class GetGrowdeverUseCase {
    constructor(private repository: GrowdeverRepository, private cacheRepository: CacheRepository) {}

    public async execute(id: string) {
        // 1 - Verificar se o growdever está em cache
        const growdeverCache = await this.cacheRepository.get(`growdever-${id}`);

        // 2 - Se estiver em cache, retornar o cache
        if (growdeverCache) {
            return growdeverCache;
        }

        // 3 - se não, buscar o growdever do repositório primário
        const growdever = await this.repository.get(id);

        if (!growdever) {
            return null;
        }

        const growdeverJson = growdever.toJson();

        // 4 - setar o growdever no cache
        await this.cacheRepository.set(`growdever-${id}`, growdeverJson);

        // 5 - retornar o growdever
        return growdeverJson;
    }
}
