import React from 'react'

interface IntroProps {
  project?: any;
}

const Intro: React.FC<IntroProps> = ({ project }) => {
  return (
    <div className="space-y-4 px-8">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold mb-2">Method of Statement (MOS)</h1>
        {project && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p><strong>Customer:</strong> {project.customer}</p>
              <p><strong>Location:</strong> {project.location}</p>
              <p><strong>Project ID:</strong> {project.project_id || project._id}</p>
            </div>
            <div>
              <p><strong>Client:</strong> {project.client}</p>
              <p><strong>Consultant:</strong> {project.consultant}</p>
              <p><strong>Team Lead:</strong> {project.teamLead}</p>
            </div>
          </div>
        )}
      </div>

      <div className="prose prose-sm max-w-none">
        <h2>GENERAL REQUIREMENTS</h2>
        <p>
          This document compiles the Method of Statement (MOS) for all activities related to 
          this project. Each activity includes detailed procedures, safety requirements, and 
          quality considerations for proper execution.
        </p>
        <p>
          <strong>Important Safety Notes:</strong>
        </p>
        <ul>
          <li>All personnel must follow proper safety procedures at all times.</li>
          <li>Appropriate PPE must be worn for all activities.</li>
          <li>Lockout/tagout procedures must be strictly followed.</li>
          <li>All work must comply with relevant regulations and standards.</li>
        </ul>
      </div>
    </div>
  )
}

export default Intro