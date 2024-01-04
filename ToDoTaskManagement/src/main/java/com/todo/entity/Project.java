package com.todo.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;

@Entity
public class Project {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String projectName;
	 @ElementCollection
	    private List<String> assignedTo;


	private String status;
	private Date startDate;
	private Date closedDate;
	private String remarks;
	private String priority;
	@OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	private List<Modules> modules;
//	@ManyToMany
//	@JoinTable(name = "user_project", joinColumns = @JoinColumn(name = "project_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
//	private Set<User> users = new HashSet<>();

	public Project() {
		super();
		// TODO Auto-generated constructor stub
	}
public Project(Long id, String projectName, List<String> assignedTo, String status, Date startDate, Date closedDate,
		String remarks, String priority, List<Modules> modules) {
	super();
	this.id = id;
	this.projectName = projectName;
	this.assignedTo = assignedTo;
	this.status = status;
	this.startDate = startDate;
	this.closedDate = closedDate;
	this.remarks = remarks;
	this.priority = priority;
	this.modules = modules;
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
public List<String> getAssignedTo() {
	return assignedTo;
}
public void setAssignedTo(List<String> assignedTo) {
	this.assignedTo = assignedTo;
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
public String getPriority() {
	return priority;
}
public void setPriority(String priority) {
	this.priority = priority;
}
public List<Modules> getModules() {
	return modules;
}
public void setModules(List<Modules> modules) {
	this.modules = modules;
}

	

	

}
