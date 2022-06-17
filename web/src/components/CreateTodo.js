import React, { useState, useEffect } from "react";
import { createTodo } from "../api/todo";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { HiOutlineCalendar } from "react-icons/hi";

function CreateTodo(props) {
  const [text, setText] = useState("");
  const [completionDate, setCompletionDate] = useState(null);
  const [error, setError] = useState(false);

  const createTask = () => {
    if (!text.trim()) {
      setError(true);
      return;
    }
    createTodo(text, props.parentTodo, completionDate)
      .then((res) => {
        setText("");
        setCompletionDate(null);
        props.addTodo(res);
      })
      .catch((err) => {
        setText("");
        setCompletionDate(null);
        console.log(err);
      });
  };

  const handleChange = (txt) => {
    if (txt.trim()) setError(false);
    setText(txt);
  };

  return (
    <div className="border rounded-md px-4 py-4 w-[24%] shadow-sm cursor-pointer hover:shadow-md transition-shadow">
      <textarea
        className={`rounded-sm border p-1 line-clamp h-28 text-ellipsis break-words overflow-hidden w-full resize-none ${
          error ? "border-red-400" : ""
        }`}
        onInput={(e) => {
          handleChange(e.target.value);
        }}
        type="text"
        value={text}
        placeholder="Enter todo text"
      ></textarea>
      <div className="border my-2 relative">
        <HiOutlineCalendar className="absolute top-1 right-2 z-10"/>
        <DatePicker
          className="w-full px-2"
          dateFormat="dd/MM/yyyy"
          selected={completionDate}
          onChange={(date) => setCompletionDate(date)}
          placeholderText="dd/mm/yyyy"
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          className="bg-slate-500 hover:bg-slate-700 transition-all text-white font-bold py-1 px-3 text-sm rounded"
          onClick={() => {
            setText("");
            setCompletionDate(null);
            setError(false);
          }}
        >
          Clear
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 transition-all text-white font-bold py-1 px-3 rounded"
          onClick={createTask}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default CreateTodo;
