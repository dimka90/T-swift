// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct Contractor {
    string companyName;
    uint registrationNumber;
    uint taxIdenticationNumber;
    string physicalAddress;
    address owner;
    string addressImageCid;
    string companyUploadedCid;
}

struct CompletedProjects {
    uint projectId;
    string projectDescription;
    string projectImagecid;
    bool status;
}

struct Milestone {
    uint milestoneId;
    string description;
    bool completed;
    uint paymentAmount;
    uint dueDate;
    uint startDate;
    string milestoneImageCid;
}

struct RejectedMileStone {
    uint projectId;
    uint milestoneId;
    address contractor;
}
struct MileStoneSubMitted {
    uint projectId;
    uint milestoneId;
    address contractor;
}

struct Project {
    uint256 projectId;
    string description;
    uint256 budget;
    address contractorAddress;
    address agency;
    bool completed;
    uint startDate;
    uint endDate;
    string imageCid;
    uint8 status; // 0: ACTIVE, 1: COMPLETED, 2: DISPUTED, 3: CANCELLED
}
