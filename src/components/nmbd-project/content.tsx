'use client';
import React, { useEffect, useState } from "react";
import Link from 'next/link';
import { useProject } from "./context";
import { Icon } from '@iconify/react';
import ProjectCard from './card';
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/atom/modal/context";
import Modal from "@/components/atom/modal/modal";
import Create from "@/components/nmbd-project/create";

const ProjectContent: React.FC = () => {
    const { modal, openModal, closeModal } = useModal();
    const { refreshProjects, projects, deleteProject } = useProject();
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, projectID: string | null }>({ x: 0, y: 0, projectID: null });

    useEffect(() => {
        refreshProjects();
    }, []);

    const handleRightClick = (e: React.MouseEvent, projectID: string | undefined) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, projectID: projectID ?? null });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ x: 0, y: 0, projectID: null });
    };

    const handleCloseModal = () => {
        closeModal();
    };

    const handleDeleteProject = (projectID: string | null | undefined, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event propagation to the Link component
        if (projectID) {
            deleteProject(projectID);
            handleCloseContextMenu(); // Close the context menu after deleting
        }
    };

    const handleEditProject = (projectID: string | null | undefined, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event propagation to the Link component
        if (projectID) {
            // Add your edit logic here
            console.log('Edit project:', projectID);
            handleCloseContextMenu(); // Close the context menu after editing
        }
    };

    return (
        <>
            {/* Pass the onClose function as a prop to the Create component */}
            {modal.open && modal.id === null && <Modal content={<Create onClose={handleCloseModal} />} />}
            <div className="items-center justify-center pr-10">
                <Button
                    size='icon'
                    className="fixed bottom-8 right-8 rounded-full bg-black reveal-less shadow-lg w-8 h-8"
                    onClick={() => openModal(null)}
                >
                    <Icon icon="ic:sharp-plus" width={30} />
                </Button>
                <div className='grid md:grid-cols-4 md:gap-x-60 gap-y-6 md:gap-y-12 md:-mx-12'>
                    {projects.map((project) => {
                        // const updatedAt = new Date(project.updatedAt);
                        // const formattedDate = `${updatedAt.getDate()}/${updatedAt.getMonth() + 1}/${updatedAt.getFullYear()}`;
                        return (
                            <div key={project._id}
                                onContextMenu={(e) => {
                                    if (project._id) {
                                        handleRightClick(e, project._id);
                                    }
                                }}
                            >
                                <Link href={`/project/${project._id}`} onClick={(e) => {
                                    // Prevent the link navigation when the context menu is open
                                    if (contextMenu.projectID === project._id) {
                                        e.preventDefault();
                                    }
                                }}>
                                    <div className={`relative flex items-center justify-center w-60 ${contextMenu.projectID === project._id ? 'opacity-80' : ''}`}
                                        onClick={(e) => {
                                            if (contextMenu.projectID === project._id) {
                                                e.stopPropagation(); // Stop propagation if context menu is active
                                            }
                                        }}
                                    >
                                        <ProjectCard project={project} />
                                        {contextMenu.projectID === project._id && (
                                            <div
                                                className="absolute top-0 left-0 w-full h-full flex gap-4 justify-center items-center bg-transparent"
                                                onMouseLeave={handleCloseContextMenu}
                                                onClick={(e) => e.stopPropagation()} // Prevent context menu clicks from propagating
                                            >
                                                <button onClick={(e) => handleDeleteProject(project._id, e)}>
                                                    <Icon icon="ant-design:delete-filled" width={40} />
                                                </button>
                                                <button onClick={(e) => handleEditProject(project._id, e)} className="flex gap-4">
                                                    <Icon icon="icon-park-solid:edit" width={40} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default ProjectContent;
