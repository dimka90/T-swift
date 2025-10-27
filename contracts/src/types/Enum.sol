// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
enum UserRole { None, Contractor, Whistleblower, Agency }
enum ProjectStatus { NotStarted, InProgress, Completed, Canceled }

event CreateContractor(string,address,uint);
event CreateProject(string projectDescription,uint projectId,address contractorName,address agencyAddress);
event SubmitedProject(uint projectId, string milestoneDescription, string Imgcid, address contractoraAddress);