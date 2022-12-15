import {
  // listaTasks,
  Tasks,
} from "../../models/tasks";
import { User } from "../../models/user";

export const tasksList = [
  new Tasks("teste 01", "teste 01"),
  new Tasks("teste 02", "teste 02"),
];

export const userList = [
  new User("ricardo@teste.com", "0987!", "0987!"),
  new User("teste@teste.com", "1234@", "1234@"),
];
