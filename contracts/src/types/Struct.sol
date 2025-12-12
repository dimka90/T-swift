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

struct ContractorReputation {
    address contractorAddress;
    uint256 totalProjects;
    uint256 completedProjects;
    uint256 totalRating; // Sum of all ratings
    uint256 ratingCount; // Number of ratings
    uint256 averageRating; // Calculated as (totalRating * 100) / ratingCount
    uint256 rejectedMilestones;
    uint256 lateDeliveries;
    bool isVerified;
    uint256 penaltyPoints;
    uint256 lastUpdated;
}

struct AgencyReputation {
    address agencyAddress;
    uint256 totalProjects;
    uint256 completedProjects;
    uint256 totalRating;
    uint256 ratingCount;
    uint256 averageRating;
    bool isVerified;
    uint256 verificationLevel; // 0: UNVERIFIED, 1: BASIC, 2: ADVANCED, 3: PREMIUM
    uint256 lastUpdated;
}

struct Rating {
    address rater;
    address ratee;
    uint256 projectId;
    uint8 score; // 1-5 stars
    string comment;
    uint256 timestamp;
}
