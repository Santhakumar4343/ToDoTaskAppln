import React, { useState } from 'react';
import RegistrationForm  from '../Registration';

function Admins() {
    const [showRegistrationForm, setShowRegistrationForm] = useState(false);

    const handleOpenRegistrationForm = () => {
        setShowRegistrationForm(true);
    };

    const handleCloseRegistrationForm = () => {
        setShowRegistrationForm(false);
    };

    return (
        <div>
            <h1>Admins</h1>
            
            {/* Create button to open RegistrationForm */}
            <button onClick={handleOpenRegistrationForm}>Create Admin</button>

            {/* Render RegistrationForm based on showRegistrationForm state */}
            {showRegistrationForm && (
                <RegistrationForm onClose={handleCloseRegistrationForm} />
            )}
        </div>
    );
}

export default Admins;
