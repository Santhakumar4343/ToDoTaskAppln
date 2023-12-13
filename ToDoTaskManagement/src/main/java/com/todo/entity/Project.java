package com.todo.entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Project {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String projectName;
	private String assignedTo;
	private String actionItem;
	private String status;
	private Date startDate;
	private Date closedDate;
	private String remarks;

	public Project() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Project(Long id, String projectName, String assignedTo, String actionItem, String status, Date startDate,
			Date closedDate, String remarks) {
		super();
		this.id = id;
		this.projectName = projectName;
		this.assignedTo = assignedTo;
		this.actionItem = actionItem;
		this.status = status;
		this.startDate = startDate;
		this.closedDate = closedDate;
		this.remarks = remarks;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getAssignedTo() {
		return assignedTo;
	}

	public void setAssignedTo(String assignedTo) {
		this.assignedTo = assignedTo;
	}

	public String getActionItem() {
		return actionItem;
	}

	public void setActionItem(String actionItem) {
		this.actionItem = actionItem;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getClosedDate() {
		return closedDate;
	}

	public void setClosedDate(Date closedDate) {
		this.closedDate = closedDate;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	@Override
	public String toString() {
		return "Project [id=" + id + ", projectName=" + projectName + ", assignedTo=" + assignedTo + ", actionItem="
				+ actionItem + ", status=" + status + ", startDate=" + startDate + ", closedDate=" + closedDate
				+ ", remarks=" + remarks + "]";
	}

}
