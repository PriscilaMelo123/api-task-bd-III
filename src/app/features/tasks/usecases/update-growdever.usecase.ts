import { GrowdeverRepository } from "../repositories/growdever.repository";
import { Growdever } from "../../../models/growdever.model";
import { CacheRepository } from "../../../shared/repositories/cache.repository";

interface UpdateGrowdeverDTO {
    id: string;
    nome?: string;
    idade?: number;
}

export class UpdateGrowdeverUseCase {
    constructor(private repository: GrowdeverRepository, private cacheRepository: CacheRepository) {}

    public async execute(data: UpdateGrowdeverDTO) {
        const growdever = await this.repository.get(data.id);

        if (!growdever) {
            return null;
        }

        growdever.nome = data.nome ?? growdever.nome;
        growdever.idade = data.idade ?? growdever.idade;

        console.log(growdever.toJson());

        const result = await this.repository.update(growdever);
        await this.cacheRepository.delete(`growdever-${growdever.id}`);
        await this.cacheRepository.delete("growdevers");

        return result;
    }
}
