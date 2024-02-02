package com.todo.entity;

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

		public Department() {
			super();
			
		}

		public Department(long id, String departmentName) {
			super();
			this.id = id;
			this.departmentName = departmentName;
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
        
	
}
