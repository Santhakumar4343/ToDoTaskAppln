package com.todo.entity;

import java.util.Date;
import java.util.List;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Task {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String taskName;
    private Date startDate;
    private Date endDate;
    private String status;
    private String priority;
    private String remarks;
    @ElementCollection
    private List<String> assignedTo;

    @ManyToOne
    @JoinColumn(name = "module_id")
    private Modules module;

	public Task() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Task(Long id, String taskName, Date startDate, Date endDate, String status, String priority, String remarks,
			List<String> assignedTo, Modules module) {
		super();
		this.id = id;
		this.taskName = taskName;
		this.startDate = startDate;
		this.endDate = endDate;
		this.status = status;
		this.priority = priority;
		this.remarks = remarks;
		this.assignedTo = assignedTo;
		this.module = module;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
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

	public String getPriority() {
		return priority;
	}

	public void setPriority(String priority) {
		this.priority = priority;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public List<String> getAssignedTo() {
		return assignedTo;
	}

	public void setAssignedTo(List<String> assignedTo) {
		this.assignedTo = assignedTo;
	}

	public Modules getModule() {
		return module;
	}

	public void setModule(Modules module) {
		this.module = module;
	}

	
    
    
    
}
