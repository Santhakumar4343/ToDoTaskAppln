package com.todo.entity;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Modules {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String moduleName;
    private Date startDate;
    private Date endDate;
    private String status;
    private String remarks;
    private String priority;
    @ElementCollection
    private List<String> assignedTo;
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "module")
    private List<Task> tasks;


	public Modules() {
		super();
		// TODO Auto-generated constructor stub
	}


	public Modules(Long id, String moduleName, Date startDate, Date endDate, String status, String remarks,
			String priority, List<String> assignedTo, Project project, List<Task> tasks) {
		super();
		this.id = id;
		this.moduleName = moduleName;
		this.startDate = startDate;
		this.endDate = endDate;
		this.status = status;
		this.remarks = remarks;
		this.priority = priority;
		this.assignedTo = assignedTo;
		this.project = project;
		this.tasks = tasks;
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getModuleName() {
		return moduleName;
	}


	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}


	public Date getStartDate() {
		return startDate;
	}


	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}


	public Date getEndDate() {
		return endDate;
	}


	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}


	public String getStatus() {
		return status;
	}


	public void setStatus(String status) {
		this.status = status;
	}


	public String getRemarks() {
		return remarks;
	}


	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}


	public String getPriority() {
		return priority;
	}


	public void setPriority(String priority) {
		this.priority = priority;
	}


	public List<String> getAssignedTo() {
		return assignedTo;
	}


	public void setAssignedTo(List<String> assignedTo) {
		this.assignedTo = assignedTo;
	}


	public Project getProject() {
		return project;
	}


	public void setProject(Project project) {
		this.project = project;
	}


	public List<Task> getTasks() {
		return tasks;
	}


	public void setTasks(List<Task> tasks) {
		this.tasks = tasks;
	}



	

	
}
