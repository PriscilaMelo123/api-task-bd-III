import { Request, Response } from "express";
import { Tasks } from "../../../models/tasks";
import { User } from "../../../models/user";
import { CacheRepository } from "../../../shared/repositories/cache.repository";
import { serverError, success } from "../../../shared/util/response.helper";
import { UserRepository } from "../../users/repositories/user.repository";
import { TasksRepository } from "../repositories/tasks.repository";
import { ListTasksUseCase } from "../usecases/list-tasks.usecase";

export class TasksController {
  public async list(req: Request, res: Response) {
    try {
      const usecase = new ListTasksUseCase(
        new TasksRepository(),
        new CacheRepository()
      );
      const result = await usecase.execute();
      return success(res, result, "Tasks successfull listed");
      // const repository = new TasksRepository();
      // const result = await repository.list();

      // return res.status(200).send({
      //   ok: true,
      //   data: result,
      // });
    } catch (error: any) {
      return serverError(res, error);
      // return res.status(500).send({
      //   ok: false,
      //   message: error.toString(),
      // });
    }
  }

  public async get(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const repository = new TasksRepository();
      const result = await repository.get(id);

      if (!result) {
        return res.status(404).send({
          ok: false,
          message: "Task not found",
        });
      }

      return res.status(200).send({
        ok: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const { description, detail, idUser } = req.body;

      if (!description) {
        return res.status(400).send({
          ok: false,
          message: "Description não foi informado",
        });
      }

      if (!detail) {
        return res.status(400).send({
          ok: false,
          message: "Detail não foi informada",
        });
      }

      if (!idUser) {
        return res.status(400).send({
          ok: false,
          message: "User (idUser) não foi informado",
        });
      }

      // 1- verificar se o user existe
      const userRepository = new UserRepository();
      const userResult = await userRepository.getId(idUser);

      if (!userResult) {
        return res.status(404).send({
          ok: false,
          message: "User não existe",
        });
      }

      const user = User.create(userResult.id, userResult.name, userResult.pass);

      const tasks = new Tasks(description, detail, user);

      const tasksRepository = new TasksRepository();
      const result = await tasksRepository.create(tasks);

      return res.status(201).send({
        ok: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { description, detail, arquivada } = req.body;

      const repository = new TasksRepository();
      const result = await repository.get(id);

      if (!result) {
        return res.status(404).send({
          ok: false,
          message: "Task não encontrada!",
        });
      }

      const resultUpdate = repository.update(result, {
        description,
        detail,
        arquivada,
      });

      return res.status(200).send({
        ok: true,
        message: "Task atualizado com sucesso",
        data: resultUpdate,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public async arquivar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { arquivada } = req.body;

      const repository = new TasksRepository();
      const result = await repository.get(id);

      if (!result) {
        return res.status(404).send({
          ok: false,
          message: "User não encontrado!",
        });
      }

      const resultUpdate = repository.arquivar(result, {
        arquivada,
      });

      return res.status(200).send({
        ok: true,
        message: "Task atualizado com sucesso",
        data: resultUpdate,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const repository = new TasksRepository();
      const result = await repository.get(id);

      if (!result) {
        return res.status(404).send({
          ok: false,
          message: "Tasks não encontrada!",
        });
      }

      await repository.delete(id);

      return res.status(200).send({
        ok: true,
        message: "Task successfully deleted",
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }
}
