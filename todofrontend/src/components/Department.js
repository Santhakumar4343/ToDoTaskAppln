import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "./Department.css"
function Department() {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8082/api/departments/getAllDepartments")
            .then(response => {
                setDepartments(response.data);
            })
            .catch(error => {
                console.error('Error fetching departments:', error);
            });
    }, []);

    return (
        <div className="department-container">
            
            {departments.map((department, index) => (
                <div key={department.id} className="department-card mt-4">
                    <p>{department.departmentName}</p>
                    {index % 3 === 2 && <div className="clear"></div>}
                </div>
            
            ))}
        </div>
    );
}

export default Department;
