import { DatabaseConnection } from "../../../../main/database/typeorm.connection";
import { User } from "../../../models/user";
import { UserEntity } from "../../../shared/entities/user.entity";

interface UpdateUserDTO {
  name?: string;
  pass?: string;
}

export class UserRepository {
  private _repository = DatabaseConnection.connection.getRepository(UserEntity);

  public async list() {
    return await this._repository.find({
      relations: {
        tasks: true,
      },
    });
  }

  public async get(name: string) {
    return await this._repository.findOne({
      where: {
        name,
      },
      relations: {
        tasks: true,
      },
    });
  }

  public async getId(id: string) {
    return await this._repository.findOne({
      where: {
        id,
      },
      relations: {
        tasks: true,
      },
    });
  }

  public async create(user: User) {
    const userEntity = this._repository.create({
      id: user.id,
      name: user.name,
      pass: user.pass,
    });

    return await this._repository.save(userEntity);
  }

  public async update(userEntity: UserEntity, data: UpdateUserDTO) {
    if (data.name) {
      userEntity.name = data.name;
    }

    if (data.pass) {
      userEntity.pass = data.pass;
    }

    return await this._repository.save(userEntity);
  }
}
