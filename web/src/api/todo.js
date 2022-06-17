const server = "http://localhost:4000";

const getTodos = async () => {
  const response = await fetch(server + "/todos");

  const json = await response.json();
  if (!response.ok) {
    const message = json.message || `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return json;
};

const getTodoById = async (id) => {
  const response = await fetch(server + "/todos/" + id);

  const json = await response.json();
  if (!response.ok) {
    const message = json.message || `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return json;
};

const createTodo = async (text, parentTodo, completionDate) => {
  const response = await fetch(server + "/todos", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      parentTodo,
      completionDate: completionDate || null,
    }),
  });

  const json = await response.json();
  if (!response.ok) {
    const message = json.message || `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  return json;
};

const updateTodo = async (id, status) => {
  if (!!(id && status)) {
    const response = await fetch(server + "/todos/" + id, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const json = await response.json();
    if (!response.ok) {
      const message =
        json.message || `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    return json;
  } else return [];
};

const deleteTodo = async (id) => {
  if (!!id) {
    const response = await fetch(server + "/todos/" + id, {
      method: "DELETE",
    });

    const json = await response.json();
    if (!response.ok) {
      const message =
        json.message || `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    return json;
  } else return "Id is required";
};

module.exports = { getTodos, getTodoById, createTodo, updateTodo, deleteTodo };
