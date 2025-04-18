import React, { useState, useEffect } from 'react';
import { Project, ProjectFormData } from '../types/Project';
import '../styles/project.css';

interface ProjectFormProps {
  project?: Project;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    panNumber: '',
    companyName: '',
    address: '',
    logo: '',
    financialYearStart: new Date().getFullYear(),
    financialYearEnd: new Date().getFullYear() + 1
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});

  useEffect(() => {
    if (project) {
      setFormData({
        panNumber: project.panNumber,
        companyName: project.companyName,
        address: project.address,
        logo: project.logo,
        financialYearStart: project.financialYearStart,
        financialYearEnd: project.financialYearEnd
      });
    }
  }, [project]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};

    if (!formData.panNumber.trim()) {
      newErrors.panNumber = 'PAN Number is required';
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company Name is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (formData.financialYearEnd <= formData.financialYearStart) {
      newErrors.financialYearEnd = 'End year must be greater than start year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form className="project-form card" onSubmit={handleSubmit}>
      <h2 className="form-title">{project ? 'Edit Project' : 'New Project'}</h2>

      <div className="logo-upload">
        <img
          src={formData.logo || '/placeholder-logo.svg'}
          alt="Company Logo"
          className="logo-preview"
        />
        <label className="logo-upload-btn">
          Upload Logo
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="panNumber">
          PAN Number
        </label>
        <input
          id="panNumber"
          className="form-input"
          type="text"
          value={formData.panNumber}
          onChange={e => setFormData(prev => ({ ...prev, panNumber: e.target.value }))}
        />
        {errors.panNumber && <div className="error-message">{errors.panNumber}</div>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="companyName">
          Company Name
        </label>
        <input
          id="companyName"
          className="form-input"
          type="text"
          value={formData.companyName}
          onChange={e => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
        />
        {errors.companyName && <div className="error-message">{errors.companyName}</div>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="address">
          Address
        </label>
        <textarea
          id="address"
          className="form-input"
          value={formData.address}
          onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
          rows={3}
        />
        {errors.address && <div className="error-message">{errors.address}</div>}
      </div>

      <div className="form-group year-range">
        <div>
          <label className="form-label" htmlFor="financialYearStart">
            Financial Year Start
          </label>
          <input
            id="financialYearStart"
            className="form-input"
            type="number"
            value={formData.financialYearStart}
            onChange={e => setFormData(prev => ({ ...prev, financialYearStart: parseInt(e.target.value) }))}
          />
        </div>

        <div>
          <label className="form-label" htmlFor="financialYearEnd">
            Financial Year End
          </label>
          <input
            id="financialYearEnd"
            className="form-input"
            type="number"
            value={formData.financialYearEnd}
            onChange={e => setFormData(prev => ({ ...prev, financialYearEnd: parseInt(e.target.value) }))}
          />
          {errors.financialYearEnd && <div className="error-message">{errors.financialYearEnd}</div>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {project ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;