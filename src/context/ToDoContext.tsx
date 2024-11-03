import {
    createContext,
    FC,
    ReactNode,
    useContext,
  } from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_URL}/Todos`;
export interface Todo {
    id: string;
    title: string;
    completed: boolean;
  }
  
  interface UserProviderProps {
    children: ReactNode;
  }
  
  interface ContextProps {
    todos: Todo[];
    isLoading: boolean;
    getTodo: () => void;
    addTodo: (title: string) => void;
    deleteTodo: (id: string) => void;
    toggleCompletion: (id: string) => void;
  }

  
  const UserContext = createContext<ContextProps>({
    todos: [],
    isLoading: true,
    getTodo: () => {},
    addTodo: () => {},
    deleteTodo: () => {},
    toggleCompletion: () => {},
  });
  
  const UserProvider: FC<UserProviderProps> = ({ children }) => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [todos, setTodos] = useState<Todo[]>([]);
    
  const getTodo = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<Todo[]>(BASE_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("error featching data", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getTodo();
  }, []);

  const addTodo = async (title: string): Promise<void> => {
    try {
      await axios.post<Todo>(BASE_URL, {
        title,
        completed: false,
      });
      getTodo();
    } catch (error) {
      console.error("cant add todo", error);
    }
  };

  const deleteTodo = async (id: string): Promise<void> => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      getTodo();
    } catch (error) {
      console.error("cant delete todo", error);
    }
  };
  const toggleCompletion = async (id: string): Promise<void> => {
    try {
      const singleTodo: Todo | undefined = todos.find((todo) => todo.id === id);
      if (!singleTodo) {
        throw new Error("cant find todo with this id");
      }
      await axios.put<Todo>(`${BASE_URL}/${id}`, {
        ...singleTodo,
        completed: !singleTodo.completed,
      });
      getTodo();
    } catch (error) {
      console.error("cant toogle todo", error);
    }
  };
  
    return (
      <UserContext.Provider
        value={{
          todos,
          isLoading,
          getTodo,
          addTodo,
          deleteTodo,
          toggleCompletion,
        }}
      >
        {children}
      </UserContext.Provider>
    );
  };
  
  export const useGlobalUser = () => {
    return useContext(UserContext);
  };
  
  export { UserContext, UserProvider };
  



















