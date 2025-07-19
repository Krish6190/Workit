"use client";

import NavigationBar from "@/app/navigation";
import { useState, useEffect, useRef } from "react";
import { useDelayedNavigation } from "@/app/hooks/useDelayedNavigation";
import { FaPencil } from "react-icons/fa6";
import Image from "next/image";

type EditPageClientProps = {
    username: string;
    initialData: {
        fullName: string;
        age: string;
        height: string;
        weight: string;
        sex: string;
        profileImg: string;
    };
};

export default function EditPageClient({ username, initialData }: EditPageClientProps) {
    const [formData, setFormData] = useState(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [open, setOpen] = useState(false);
    const { navigateWithDelay } = useDelayedNavigation();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (open &&
                dropdownRef.current &&
                buttonRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id === "gender" ? "sex" : id === "full-name" ? "fullName" : id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/profile/update", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess("Profile updated successfully!");
                setTimeout(() => {
                    navigateWithDelay("/profile", "right");
                }, 500); 
            } else {
                const data = await response.json();
                setError(data.error || "Failed to update profile");
            }
        } catch {
            setError("An error occurred while updating profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigateWithDelay("/profile", "left");
    };

    const uploadToCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/cloudinary/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();
            return data.url;
        } catch (error) {
            throw error;
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError('');

        try {
            const oldImageUrl = formData.profileImg;
            if (oldImageUrl && oldImageUrl.includes('res.cloudinary.com')) {
                await deleteFromCloudinary(oldImageUrl);
            }
            
            const imageUrl = await uploadToCloudinary(file);
            setFormData(prev => ({
                ...prev,
                profileImg: imageUrl
            }));
            setOpen(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const deleteFromCloudinary = async (imageUrl: string) => {
        try {
            const response = await fetch('/api/cloudinary/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageUrl }),
            });

            if (!response.ok) {
                console.error('Failed to delete image from Cloudniary');
            }
        } catch (error) {
            console.error('Error deleting image from Cloudniary:',error);
        }
    };

    const handleRemoveImage = async () => {
        const currentImageUrl = formData.profileImg;
        
        if (currentImageUrl && currentImageUrl.includes('res.cloudinary.com')) {
            await deleteFromCloudinary(currentImageUrl);
        }
        
        setFormData(prev => ({ ...prev, profileImg: "" }));
        setOpen(false);
    };

    return (
        <div className="edit-profile-bg">
            <NavigationBar />
            <div className="edit-profile-container">
                <div className="edit-profile-card">
                    <div className="edit-profile-header">
                        <div className="edit-profile-avatar">
                            <Image
                                src={formData.profileImg || "/pictures/blank-profile.webp"}
                                alt="Profile"
                                width={210}
                                height={180}
                                className="edit-avatar-img"
                            />
                            <div className="editImg-container">
                                <button ref={buttonRef} className="editImg-button" onClick={() => setOpen((o) => !o)}>
                                    <FaPencil size={14} />
                                    <span>Edit</span>
                                </button>
                                {open && (
                                    <div ref={dropdownRef} className={`editImg ${open ? 'visible' : ''}`}>
                                        <button 
                                            className="editImg-option" 
                                            onClick={handleUploadClick}
                                            disabled={isUploading}
                                        >
                                            {isUploading ? 'Uploading...' : 'Upload Image...'}
                                        </button>
                                        <button className="editImg-option" onClick={handleRemoveImage}>
                                            Remove Image
                                        </button>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleFileUpload}
                                />
                            </div>
                        </div>
                        <h1 className="edit-profile-name">{username}</h1>
                    </div>

                    <form className="edit-profile-form" onSubmit={handleSubmit}>
                        <div className="edit-form-section">
                            <h3 className="edit-section-title">Personal Information</h3>
                            <div className="edit-form-grid">
                                <div className="edit-form-group">
                                    <label htmlFor="full-name" className="edit-form-label">Full Name</label>
                                    <input
                                        id="full-name"
                                        type="text"
                                        className="edit-form-input"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder={formData.fullName}
                                    />
                                </div>
                                <div className="edit-form-group">
                                    <label htmlFor="age" className="edit-form-label">Age</label>
                                    <input
                                        id="age"
                                        type="number"
                                        className="edit-form-input"
                                        min="0"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder={formData.age || 'Enter your age'}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="edit-form-section">
                            <h3 className="edit-section-title">Health Information</h3>
                            <div className="edit-form-grid">
                                <div className="edit-form-group">
                                    <label htmlFor="gender" className="edit-form-label">Gender</label>
                                    <select
                                        id="gender"
                                        className="edit-form-select"
                                        value={formData.sex}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select Gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                    </select>
                                </div>
                                <div className="edit-form-group">
                                    <label htmlFor="height" className="edit-form-label">Height (cm)</label>
                                    <input
                                        id="height"
                                        type="number"
                                        className="edit-form-input"
                                        min="0"
                                        value={formData.height}
                                        onChange={handleChange}
                                        placeholder={formData.height || 'Enter your height'}
                                    />
                                </div>
                                <div className="edit-form-group">
                                    <label htmlFor="weight" className="edit-form-label">Weight (kg)</label>
                                    <input
                                        id="weight"
                                        type="number"
                                        className="edit-form-input"
                                        min="0"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        placeholder={formData.weight || 'Enter your weight'}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && <p className="error" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                        {success && <p className="success" style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

                        <div className="edit-form-actions">
                            <button
                                type="button"
                                className="edit-btn-secondary"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="edit-btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
