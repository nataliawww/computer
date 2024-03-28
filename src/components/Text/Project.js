// Project.jsx
import React from 'react';
import { ProjectData } from '../../constants/projectData';
// Assuming projectData is imported or defined in the same file
const Project = ({ projectId }) => {
  const project = ProjectData.find(p => p.id === projectId);

  return (
    <div className="project">
      {project ? (
        <div id={project.id}>
          <p><i>{project.title}</i></p>
          <p>{project.description}</p>
          { project.tech && <p className="no-margin"><i>Tech stack:</i> {project.tech}</p> }
          { project.role && <p><i>My role:</i> {project.role}</p> }
          <ul className="clickable">
            { project.url && <li><a href={project.url} target="_blank" rel="noopener noreferrer">{project.cta ? project.cta : 'Read more'}</a></li> }
            { project.siteUrl && <li><a href={project.siteUrl} target="_blank" rel="noopener noreferrer">Visit site</a></li> }
          </ul>
        </div>
      ) : (
        <div>No project selected</div>
      )}
    </div>
  );
};

export default Project;