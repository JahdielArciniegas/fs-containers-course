const Todo = ({ todo, deleteTodo, completeTodo }) => {
  const doneInfo = (
    <>
      <span>This todo is done</span>
      <button onClick={() => deleteTodo(todo)}>Delete</button>
    </>
  );

  const notDoneInfo = (
    <>
      <span>This todo is pending ...</span>
      <span>
        <button onClick={() => completeTodo(todo)}>Complete</button>
        <button onClick={() => deleteTodo(todo)}>Delete</button>
      </span>
    </>
  );
  return (
    <>
      <span>{todo.text}</span>
      <span>{todo.done ? doneInfo : notDoneInfo}</span>
    </>
  );
};

export default Todo;
