import axios, { AxiosResponse } from 'axios';

import type { ITodo, ApiDataType } from '../api/type';

const baseUrl: string = 'https://localhost:5001/api';

export const getTodos = async (): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const todos: AxiosResponse<ApiDataType> = await axios.get(
      `${baseUrl}/TodoItems`,
    );

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
): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const updateTodo: AxiosResponse<ApiDataType> = await axios.put(
      `${baseUrl}/TodoItems/${todo.id}`,
      todo,
    );

    return updateTodo;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteTodo = async (
  id: number,
): Promise<AxiosResponse<ApiDataType>> => {
  try {
    const deleteTodo: AxiosResponse<ApiDataType> = await axios.delete(
      `${baseUrl}/TodoItems/${id}`,
    );

    return deleteTodo;
  } catch (error) {
    throw new Error(error);
  }
};
