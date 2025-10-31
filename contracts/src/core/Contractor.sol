//SPDX-License-identifier: MIT

pragma solidity ^0.8.20;
import "../interfaces/IERC20.sol";
import "../types/Enum.sol";
import "../types/Struct.sol";
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

    function createProject(
        string memory _description,
        uint256 _budget,
        address _contractorAddress,
        uint _startdate,
        uint _endate
    ) external {
        uint256 allowance = IERC20(tokenAddress).allowance(
            msg.sender,
            address(this)
        );
        require(
            _budget <= allowance,
            "No allowance to spend funds at the moment"
        );
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), _budget);
        // Create a new project for a Contractor
        Project storage newProject = projects[projectId];
        newProject.projectId = projectId;
        newProject.description = _description;
        newProject.budget = _budget;
        newProject.contractorAddress = _contractorAddress;
        newProject.completed = false;
        newProject.startDate = _startdate;
        newProject.endDate = _endate;
        newProject.imageCid = " ";

        //mapp contractors address to the project assigned
        contractorProjects[_contractorAddress].push(projectId);

        // mapp contractor to agency

        agency_Contractor[msg.sender] = _contractorAddress;

        emit CreateProject(
            _description,
            projectId,
            _contractorAddress,
            msg.sender
        );
        projectId++;
    }
}
