import axios, { AxiosResponse } from 'axios';

import type { ITodo } from '../api/type';

const baseUrl: string = 'https://localhost:5001/api';

export const getTodos = async (): Promise<ITodo[]> => {
  try {
    const resp: AxiosResponse<ITodo[]> = await axios.get(
      `${baseUrl}/TodoItems`,
    );

    const { data: todos } = resp;

    return todos;
  } catch (error) {
    throw new Error(error);
  }
};

export const addTodo = async (
  todo: Omit<ITodo, 'id'>,
): Promise<AxiosResponse<ITodo>> => {
  try {
    const newTodo: Omit<ITodo, 'id'> = todo;

    const saveTodo: AxiosResponse<ITodo> = await axios.post<ITodo>(
      `${baseUrl}/TodoItems`,
      newTodo,
    );

    return saveTodo;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateTodo = async (
  todo: ITodo,
): Promise<AxiosResponse<ITodo>> => {
  try {
    const updateTodo: AxiosResponse<ITodo> = await axios.put(
      `${baseUrl}/TodoItems/${todo.id}`,
      todo,
    );

    return updateTodo;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteTodo = async (id: number): Promise<AxiosResponse> => {
  try {
    const deleteTodo: AxiosResponse = await axios.delete(
      `${baseUrl}/TodoItems/${id}`,
    );

    return deleteTodo;
  } catch (error) {
    throw new Error(error);
  }
};
