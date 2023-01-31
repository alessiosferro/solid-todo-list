import './App.scss'
import {createEffect, createMemo, createResource, createSignal, For, JSX, on, Show} from "solid-js";
import {Todo} from "./model/todo.model";
import {createStore, produce} from "solid-js/store";
import formSubmit from "./form-submit";
import {Si1password, SiAircall, SiBuddy, SiBuffer} from "solid-icons/si";
import {FiPlus, FiTrash} from "solid-icons/fi";
const $1 = formSubmit;

const fetchTodos = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=20");
  return response.json();
}

const App = () => {
  const [todosResource] = createResource<Todo[]>(fetchTodos);
  const [todos, setTodos] = createStore<Todo[]>([]);
  const [searchKey, setSearchKey] = createSignal<string>("");

  const areTodosReady = createMemo(() => todosResource?.state === 'ready');

  createEffect(() => {
    if (!areTodosReady()) return;
    setTodos(todosResource());
  });

  const addTodoHandler: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (event) => {
    const title = event.currentTarget.elements.namedItem('title') as HTMLInputElement;

    if (!title.value) return;

    setTodos(produce<Todo[]>(todos => {
      todos.unshift({ id: Math.floor(Math.random() * 10000 + 1000), title: title.value, completed: false })
    }));

    event.currentTarget.reset();
  }

  const toggleTodoHandler = (todoId: number) => {
    setTodos(
      todo => todo.id === todoId,
      produce<Todo>(todo => todo.completed = !todo.completed)
    )
  }

  const removeTodoHandler = (todoId: number) => {
    setTodos(
      todos.filter(todo => todo.id !== todoId)
    );
  }

  const searchKeyHandler: JSX.EventHandler<HTMLInputElement, InputEvent> = (event) => {
    setSearchKey(event.currentTarget.value);
  }

  createEffect(on(searchKey, searchKey => {
    if (!searchKey) {
      setTodos(todosResource());
      return;
    }

    setTodos(todosResource().filter(todo => todo.title.includes(searchKey)));
  }, {defer: true}));

  return (
    <div class="container">
      <h1 class="app-title">Todo List</h1>

      <form class="add-todo-form" use:formSubmit={addTodoHandler}>
        <div class="form-group">
          <label class="form-group__label" for="add-todo">Add todo</label>
          <input name="title" class="form-group__control" id="add-todo" type="text" placeholder="Insert the title of the todo..." />
        </div>
        <button class="btn submit-btn">
          <FiPlus size="24" />
          Add todo
        </button>
      </form>

      <div class="form-group">
        <label for="search-todo" class="form-group__label">Search Todo</label>

        <input name="search"
               class="form-group__control"
               id="search-todo"
               onInput={searchKeyHandler}
               type="text"
               placeholder="Search todo..."
        />
      </div>

      <Show when={areTodosReady()} fallback={<p>Loading Todos...</p>}>
        <ul class="todo-list" >
          <For each={todos}>
            {todo => (<li class="todo-list-item">
              <input id={todo.id.toString()}
                     type="checkbox"
                     onChange={[toggleTodoHandler, todo.id]}
                     checked={todo.completed}
              />
              <label for={todo.id.toString()}>{todo.title}</label>
              <button class="btn btn-icon" onClick={[removeTodoHandler, todo.id]}>
                <FiTrash size="24" />
              </button>
            </li>)}
          </For>
        </ul>
      </Show>
    </div>
  )
}

export default App;
