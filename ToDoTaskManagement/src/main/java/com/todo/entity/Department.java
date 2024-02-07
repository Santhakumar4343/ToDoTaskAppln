package com.todo.entity;

import java.util.List;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Department {
        @Id 
        @GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
        private String departmentName;
        @ElementCollection
	    private List<String> assignedTo;
		public Department() {
			super();
			
		}
		public Department(long id, String departmentName, List<String> assignedTo) {
			super();
			this.id = id;
			this.departmentName = departmentName;
			this.assignedTo = assignedTo;
		}
		public long getId() {
			return id;
		}
		public void setId(long id) {
			this.id = id;
		}
		public String getDepartmentName() {
			return departmentName;
		}
		public void setDepartmentName(String departmentName) {
			this.departmentName = departmentName;
		}
		public List<String> getAssignedTo() {
			return assignedTo;
		}
		public void setAssignedTo(List<String> assignedTo) {
			this.assignedTo = assignedTo;
		}

	
}
