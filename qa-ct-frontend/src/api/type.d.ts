export interface ITodo {
  id: number;
  text: string;
  completed: boolean;
}

export type TodoProps = {
  todo: ITodo;
};

export type ApiDataType = {
  message: string;
  status: string;
  todos: ITodo[];
  todo?: ITodo;
};
