import React from "react";
import { HiArrowCircleLeft, HiCalendar } from "react-icons/hi";
import { statusClass } from "../config/common";

function TodoView(props) {
  return (
    <div className="w-full border rounded-md px-4 py-3 shadow-sm">
      <div className="flex justify-between mb-3">
        <HiArrowCircleLeft
          className="w-8 h-8 cursor-pointer hover:text-blue-800"
          onClick={props.goBack}
        />
        {props.completionDate ? (
          <div className="flex items-center gap-2">
            <HiCalendar />
            {new Date(props.completionDate).toLocaleDateString()}
          </div>
        ) : (
          <></>
        )}
        <p
          className={
            "px-3 py-1 rounded-3xl w-auto text-sm " + statusClass[props.status]
          }
        >
          {props.status || ""}
        </p>
      </div>
      <h1 className="mt-2 font-medium">{props.text || ""}</h1>
    </div>
  );
}

export default TodoView;
