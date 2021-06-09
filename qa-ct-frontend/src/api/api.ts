import axios, { AxiosResponse } from 'axios';
import adapter from 'axios/lib/adapters/http';
import type { ITodo } from '../api/type';

axios.defaults.adapter = adapter;

export class API {
  constructor(private baseUrl: string = 'https://localhost:5001/api') {
    try {
      new URL(baseUrl);
    } catch (error) {
      throw new Error(error);
    }

    this.baseUrl = baseUrl;
  }

  public getTodos = async (): Promise<ITodo[]> => {
    try {
      const resp: AxiosResponse<ITodo[]> = await axios.get(
        `${this.baseUrl}/TodoItems`,
      );

      const { data: todos } = resp;

      return todos;
    } catch (error) {
      throw new Error(error);
    }
  };

  public getTodo = async (id: number): Promise<ITodo> => {
    try {
      const resp: AxiosResponse<ITodo> = await axios.get(
        `${this.baseUrl}/TodoItems/${id}`,
      );

      const { data: todo } = resp;

      return todo;
    } catch (error) {
      throw new Error(error);
    }
  };

  public addTodo = async (
    todo: Omit<ITodo, 'id'>,
  ): Promise<AxiosResponse<ITodo>> => {
    try {
      const newTodo: Omit<ITodo, 'id'> = todo;

      const saveTodo: AxiosResponse<ITodo> = await axios.post<ITodo>(
        `${this.baseUrl}/TodoItems`,
        newTodo,
      );

      return saveTodo;
    } catch (error) {
      throw new Error(error);
    }
  };

  public updateTodo = async (todo: ITodo): Promise<AxiosResponse<ITodo>> => {
    try {
      const updateTodo: AxiosResponse<ITodo> = await axios.put(
        `${this.baseUrl}/TodoItems/${todo.id}`,
        todo,
      );

      return updateTodo;
    } catch (error) {
      throw new Error(error);
    }
  };

  public deleteTodo = async (id: number): Promise<AxiosResponse> => {
    try {
      const deleteTodo: AxiosResponse = await axios.delete(
        `${this.baseUrl}/TodoItems/${id}`,
      );

      return deleteTodo;
    } catch (error) {
      throw new Error(error);
    }
  };
}
