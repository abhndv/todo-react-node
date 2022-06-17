import Header from "./components/Header";
import Todo from "./components/Todo";
import React, { useState, useEffect } from "react";
import { getTodos, getTodoById, deleteTodo } from "./api/todo";
import CreateTodo from "./components/CreateTodo";
import TodoView from "./components/TodoView";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const [parent, setParent] = useState(null);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (parent && parent["_id"]) {
      fetchTodoOfId(parent["_id"]);
    } else {
      fetchTodos();
    }
  }, []);

  const fetchTodos = () => {
    setParent(null);
    getTodos()
      .then((res) => {
        setLoading(false);
        setTodos(res);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
        console.log(err?.message);
      });
  };

  const fetchTodoOfId = (id) => {
    getTodoById(id)
      .then((res) => {
        setLoading(false);
        setParent(res[0]);
        setTodos(res[0].subTasks);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.message);
        console.log(err?.message);
      });
  };

  const openTask = (todo) => {
    setParent(todo);
    fetchTodoOfId(todo["_id"]);
    setLoading(true);
  };

  const modifyTodos = (status, index) => {
    const uTodo = [...todos];
    if (uTodo[index]) uTodo[index].status = status;
    toast.success("Todo status changed to " + status);
    setTodos(uTodo);
  };

  const addTodoToArray = (obj) => {
    toast.success("Added new todo");
    const nTodo = [...todos];
    nTodo.push(obj);
    setTodos(nTodo);
  };

  const openPreviousTodo = () => {
    if (parent.parentTodo) fetchTodoOfId(parent.parentTodo);
    else fetchTodos();
  };

  const removeTodo = (e, index) => {
    e.stopPropagation();
    const id = todos[index]["_id"];
    deleteTodo(id)
      .then((res) => {
        const uTodo = [...todos];
        if (uTodo[index]) uTodo.splice(index, 1);
        setTodos(uTodo);
        toast.success("Deleted " + res.deletedCount + " todos.");
        console.log(res);
      })
      .catch((err) => {
        toast.error(err.message);
        console.log(err);
      });
  };

  return (
    <div className="App">
      <Header />
      <main className="p-8 flex flex-wrap gap-4">
        {parent ? (
          <TodoView
            text={parent.text}
            status={parent.status}
            completionDate={parent.completionDate}
            goBack={() => {
              openPreviousTodo();
            }}
          />
        ) : (
          <></>
        )}
        {loading ? (
          "Loading Todos"
        ) : (
          <>
            {todos && todos.length ? (
              todos.map((obj, index) => {
                return (
                  <Todo
                    key={obj["_id"]}
                    id={obj["_id"]}
                    text={obj.text}
                    status={obj.status}
                    subTaskCount={obj.subTaskCount}
                    OnClick={() => {
                      openTask(obj);
                    }}
                    changeStatus={(status) => modifyTodos(status, index)}
                    todoDeleted={(e) => removeTodo(e, index)}
                  />
                );
              })
            ) : (
              <></>
            )}
            <CreateTodo
              parentTodo={parent ? parent["_id"] : null}
              addTodo={(todo) => addTodoToArray(todo)}
            />
          </>
        )}
      </main>

      <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
