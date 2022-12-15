import { Endereco } from "../../../models/endereco.model";
import { Growdever } from "../../../models/growdever.model";
import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { GrowdeverRepository } from "../repositories/growdever.repository";

interface CreateGrowdeverDTO {
    nome: string;
    cpf: number;
    idade: number;
    skills?: string[];
    endereco?: CreateEnderecoDTO;
}

interface CreateEnderecoDTO {
    rua: string;
    cidade: string;
    uf: string;
    complemento?: string;
}

export class CreateGrowdeverUseCase {
    constructor(private repository: GrowdeverRepository, private cacheRepository: CacheRepository) {}

    public async execute(data: CreateGrowdeverDTO) {
        let endereco = undefined;

        if (data.endereco) {
            endereco = new Endereco(
                data.endereco.rua,
                data.endereco.cidade,
                data.endereco.uf,
                data.endereco.complemento
            );
        }

        const growdever = new Growdever(data.nome, data.cpf, data.idade, data.skills, endereco);

        const result = await this.repository.create(growdever);

        await this.cacheRepository.delete("growdevers");

        return result.toJson();
    }
}
