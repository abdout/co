import React from 'react';
import { Icon } from '@iconify/react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

// Define the Project interface
interface Project {
    title: string;
    desc: string;
    club: string;
    status: string;
}

// Define the ProjectCardProps interface
interface ProjectCardProps {
    project: Project;
}

// Define a function to get the color based on status
const getStatusColor = (status: string): string => {
    switch (status) {
        case 'جاري':
            return 'bg-yellow-400'; // Yellow for "جاري"
        case 'متوقف':
            return 'bg-red-600'; // Red for "متوقف"
        case 'تم':
            return 'bg-green-500'; // Green for "تم"
        case 'محايد':
            return 'bg-gray-400'; // Grey for "محايد"
        default:
            return 'bg-gray-300'; // Default Grey if status doesn't match
    }
};

// ProjectCard Component
const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <Card className='border border-gray-400 hover:border-yellow-400 max-w-full md:w-48 h-52 reveal'>
            <CardHeader>
                <strong className="font-semibold">{project.title}</strong>
                <p className="line-clamp-2 overflow-hidden text-ellipsis">
                    {project.desc}
                </p>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2 items-center my-1">
                    <Icon icon="material-symbols-light:bookmark-sharp" width={25} />
                    <p>{project.club}</p>
                </div>
            </CardContent>
            <CardFooter className="flex gap-4 items-center mr-[3.5px] -mt-6">
                {/* Use the getStatusColor function to dynamically set the color */}
                <div className={`rounded-full w-[18px] h-[18px] ${getStatusColor(project.status)}`} />
                <p>{project.status}</p>
            </CardFooter>
        </Card>
    );
};

export default ProjectCard;
