"use client";

import NavigationBar from "@/app/navigation";
import { useState } from "react";
import { useDelayedNavigation } from "@/app/hooks/useDelayedNavigation";
import { FaPencil } from "react-icons/fa6";
import { CldUploadButton } from "next-cloudinary";

type EditPageClientProps = {
    username: string;
    initialData: {
        fullName: string;
        age: string;
        height: string;
        weight: string;
        sex: string;
        profileImg:string;
    };
};

export default function EditPageClient({ username, initialData }: EditPageClientProps) {
    const [formData, setFormData] = useState(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { navigateWithDelay } = useDelayedNavigation();

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
                    navigateWithDelay("/profile", 500, "right");
                }, 1000);
            } else {
                const data = await response.json();
                setError(data.error || "Failed to update profile");
            }
        } catch (error) {
            setError("An error occurred while updating profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigateWithDelay("/profile", 500, "left");
    };

    return (
        <div className="modern-profile-bg">
            <NavigationBar />
            <div className="modern-profile-container">
                <div className="modern-profile-card">
                    <div className="modern-profile-header">
                        <div className="modern-profile-avatar">
                            <img
                                src="/pictures/blank-profile.webp"
                                alt="Profile"
                                width={140}
                                height={120}
                                className="modern-avatar-img"
                            />
                            <button className="imageEdit"><FaPencil style={{color:""}}/></button>
                        </div>
                        <h1 className="modern-profile-name">{username}</h1>
                    </div>

                    <form className="modern-profile-form" onSubmit={handleSubmit}>
                        <div className="modern-form-section">
                            <h3 className="modern-section-title">Personal Information</h3>
                            <div className="modern-form-grid">
                                <div className="modern-form-group">
                                    <label htmlFor="full-name" className="modern-form-label">Full Name</label>
                                    <input
                                        id="full-name"
                                        type="text"
                                        className="modern-form-input"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder={formData.fullName}
                                    />
                                </div>
                                <div className="modern-form-group">
                                    <label htmlFor="age" className="modern-form-label">Age</label>
                                    <input
                                        id="age"
                                        type="number"
                                        className="modern-form-input"
                                        min="0"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder={formData.age || 'Enter your age'}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modern-form-section">
                            <h3 className="modern-section-title">Health Information</h3>
                            <div className="modern-form-grid">
                                <div className="modern-form-group">
                                    <label htmlFor="gender" className="modern-form-label">Gender</label>
                                    <select
                                        id="gender"
                                        className="modern-form-select"
                                        value={formData.sex}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select Gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                    </select>
                                </div>
                                <div className="modern-form-group">
                                    <label htmlFor="height" className="modern-form-label">Height (cm)</label>
                                    <input
                                        id="height"
                                        type="number"
                                        className="modern-form-input"
                                        min="0"
                                        value={formData.height}
                                        onChange={handleChange}
                                        placeholder={formData.height || 'Enter your height'}
                                    />
                                </div>
                                <div className="modern-form-group">
                                    <label htmlFor="weight" className="modern-form-label">Weight (kg)</label>
                                    <input
                                        id="weight"
                                        type="number"
                                        className="modern-form-input"
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

                        <div className="modern-form-actions">
                            <button
                                type="button"
                                className="modern-btn-secondary"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="modern-btn-primary"
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
