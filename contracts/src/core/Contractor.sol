//SPDX-License-identifier: MIT

pragma solidity ^0.8.20;

contract Procurement {
    address owner;
    address tokenAddress;
    // Data structures for data storage
    mapping(uint256 => Project) public projects;
    mapping(uint256 => Project) public projectsupdate;
    mapping(address => uint256[]) public contractorProjects;
    // mapping(uint256 projectId=> Milestone[]) public projectMilestones;
    mapping(uint256 => Contractor) public contractor;
    mapping(address => RejectedMileStone[]) public rejectedMilestones;
    mapping(address => MileStoneSubMitted[]) public milestoneSubmitted;
    mapping(address => address) public agencyContractor;
    mapping(address contractor => uint[]) public projectsubmited;
    mapping(address agency => address contractor) public agency_Contractor;

    Contractor[] public contractors;
    uint milestoneId;
}
