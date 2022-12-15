import { CacheConnection } from "../../../main/database/cache.connection";

export class CacheRepository {
    private repostory = CacheConnection.connection;

    public async get(chave: string){
        const result = await this.repostory.get(chave);

        if(!result){
            return null;
        }

        return JSON.parse(result);
    }

    public async set(chave: string, data: any){
        await this.repostory.set(chave, JSON.stringify(data));
    }
}