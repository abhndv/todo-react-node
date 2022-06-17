import React, { useState, useEffect } from "react";
import { HiCheckCircle, HiPlay, HiTrash } from "react-icons/hi";
import { updateTodo } from "../api/todo";
import { statusClass } from "../config/common";

function Todo(props) {
  const handleStatusChange = (e, status) => {
    e.stopPropagation();
    updateTodo(props.id, status)
      .then((res) => {
        props.changeStatus(status);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showTaskOption = () => {
    return props.status == "Pending" ? (
      <HiPlay
        className="h-6 w-6 text-blue-600 hover:text-blue-800"
        title="Start Progess"
        onClick={(e) => handleStatusChange(e, "InProgress")}
      />
    ) : props.status == "InProgress" ? (
      <HiCheckCircle
        className="h-6 w-6 text-green-600 hover:text-green-800"
        title="Mark As Complete"
        onClick={(e) => handleStatusChange(e, "Completed")}
      />
    ) : (
      <></>
    );
  };

  return (
    <div
      className="border rounded-md w-[24%] shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => {
        props.OnClick();
      }}
    >
      <h1 className="my-3 px-4 font-medium line-clamp h-32 text-ellipsis break-words overflow-hidden">
        {props.text || ""}
      </h1>
      <div className="py-4 px-4 flex justify-between">
        <div className="flex gap-2">
          <p
            className={
              "px-3 py-1 rounded-3xl w-auto text-sm " +
              statusClass[props.status]
            }
          >
            {props.status || ""}
          </p>
          {props.subTaskCount ? (
            <p className="px-2 border-slate-500 border py-1 rounded-3xl w-auto text-sm ">
              {props.subTaskCount + " subtodos"}
            </p>
          ) : (
            <></>
          )}
        </div>
        <div className="flex gap-2">
          {showTaskOption()}
          <HiTrash
            className="h-6 w-6 text-red-600 hover:text-red-800"
            title="Delete Todo"
            onClick={props.todoDeleted}
          />
        </div>
      </div>
    </div>
  );
}

export default Todo;
