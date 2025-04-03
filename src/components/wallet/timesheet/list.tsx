"use client";
// import { useTask } from "@/components/platform/task/context";
// import { task } from "@/components/platform/task/type";
import React, { useEffect, useState } from "react";
// import Delete from "./crud/delete";
// import SmIcon from "@/component/atom/icon/sm";
import Modal from "@/components/atom/modal/modal";
// import Edit from "./crud/edit";
import Create from "./crud/create";
import { useModal } from "@/components/atom/modal/context";
import { Icon } from "@iconify/react";
// import { Task } from '@/type/task/task';  // Import the Task type
// import Circle from "./circle";
// import Image from "next/image";
// import { Delete } from "./crud/delete";
// import SmIcon from "../atom/icon/sm";
import { useProject } from "@/provider/project";
import { domain } from "@/constant/domain";


const TimeList: React.FC = () => {
  // const { modal, openModal } = useModal();
  // const { refreshTasks, tasks, deleteTask } = useTask();
  // const { projects } = useProject();

  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, rowId: string | null }>({ x: 0, y: 0, rowId: null });
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const handleRightClick = (e: React.MouseEvent, rowId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, rowId });
    setSelectedRow(rowId);
  };

  // useEffect(() => {
  //   refreshTasks();
  // }, [projects.length]);

  const handleCloseContextMenu = () => {
    setContextMenu({ x: 0, y: 0, rowId: null });
    setSelectedRow(null);
  };

  // const handleDelete = async (taskID: string | null) => {
  //   if (taskID) {
  //     const confirmed = window.confirm("Are you sure?");
  //     if (confirmed) {
  //       await deleteTask(taskID);
  //       handleCloseContextMenu();
  //     }
  //   }
  // };

 

  // const handleEdit = (id: string) => {
  //   openModal(id);
  // };

  // const taskToEdit = tasks.find((task: Task) => task._id === modal.id);

  return (
    <>
      {/* {modal.open && modal.id === null && <Modal content={<Create />} />} */}
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b">Work Carried Out</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border-b">Hours</th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider border-b">O.T</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b">Remark</th>
            </tr>
          </thead>
          {/* <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(tasks) ? tasks.map((task) => {
              return (
                <tr 
                  key={task._id || ''} 
                  className={`hover:bg-gray-50 cursor-pointer ${task._id === selectedRow ? 'bg-black text-[#fcfcfc]' : ''}`} 
                  onContextMenu={(e) => handleRightClick(e, task._id || '')}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{task.task}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{task.hours || 8}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{task.overtime || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{task.remark}</td>
                </tr>
              );
            }) : <tr><td colSpan={5} className="text-center py-4">No tasks available</td></tr>}
          </tbody> */}
        </table>
      </div>

      {contextMenu.rowId && (
        <div 
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }} 
          className="absolute flex flex-col space-y-2 p-4 bg-white border shadow-lg rounded-md"
          onMouseLeave={handleCloseContextMenu}
        >
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <Icon icon="iconoir:edit" width={20}/>
            <span>Edit</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
          >
            <Icon icon="ant-design:delete-outlined" width={20}/>
            <span>Delete</span>
          </button>
        </div>
      )}
    </>
  );
};

export default TimeList;