//SPDX-License-identifier: MIT

pragma solidity ^0.8.20;
import "../interfaces/ITOKEN.sol";
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
    uint projectId = 1;

    function createProject(
        string memory _description,
        uint256 _budget,
        address _contractorAddress,
        uint _startdate,
        uint _endate
    ) external {
        uint256 allowance = ITOKEN(tokenAddress).allowance(
            msg.sender,
            address(this)
        );
        require(
            _budget <= allowance,
            "No allowance to spend funds at the moment"
        );
        ITOKEN(tokenAddress).transferFrom(msg.sender, address(this), _budget);
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

    function SubmitProject(
        uint _projectId,
        string memory projectDescription,
        string memory imgCid
    ) external {
        // Get the Project and update the value
        Project storage project = projects[_projectId];

        project.description = projectDescription;
        project.imageCid = imgCid;

        // create a project to

        projectsubmited[msg.sender].push(_projectId);
        emit SubmitedProject(projectId, projectDescription, imgCid, msg.sender);
    }

    function getSubmittedProject(
        address contractOwner
    ) external view returns (Project[] memory) {
        uint[] memory number = projectsubmited[
            agency_Contractor[contractOwner]
        ];
        uint projectlen = number.length;
        Project[] memory project = new Project[](projectlen);

        for (uint i; i < projectlen; i++) {
            project[i] = projects[number[i]];
        }
        return project;
    }

    function createContractor(
        string memory _companyName,
        uint _registrationNumber,
        uint _taxIdenticationNumber,
        string memory _physicalAddress,
        string memory _addressImageCid,
        string memory _companyUploadedCid
    ) external {
        // work on this
        require(
            contractor[_registrationNumber].registrationNumber !=
                _registrationNumber,
            "Contractor already exist"
        );
        // validate the user address
        contractors.push(
            Contractor({
                companyName: _companyName,
                registrationNumber: _registrationNumber,
                taxIdenticationNumber: _taxIdenticationNumber,
                physicalAddress: _physicalAddress,
                owner: msg.sender,
                addressImageCid: _addressImageCid,
                companyUploadedCid: _companyUploadedCid
            })
        );
        emit CreateContractor(_companyName, msg.sender, _registrationNumber);
    }

    function RejectMilestones(
        uint _milestoneId,
        uint _projectId,
        address contractorAddress
    ) external returns (bool) {
        RejectedMileStone[] storage milstonesRejected = rejectedMilestones[
            contractorAddress
        ];
        milstonesRejected.push(
            RejectedMileStone({
                projectId: _projectId,
                milestoneId: _milestoneId,
                contractor: contractorAddress
            })
        );

        return true;
    }

    function getAllContractors() external view returns (Contractor[] memory) {
        return contractors;
    }

    function getContractor(
        address _contractorAddress
    ) external view returns (Contractor memory) {
        require(_contractorAddress != address(0), "Address can't be zero");
        require(contractors.length > 0, "No Contractor Onboard");
        for (uint i; i < contractors.length; i++) {
            if (contractors[i].owner == _contractorAddress) {
                return contractors[i];
            }
        }
        // Contractor not found
        return
            Contractor({
                companyName: "",
                registrationNumber: 0,
                taxIdenticationNumber: 0,
                physicalAddress: "",
                owner: address(0),
                addressImageCid: "",
                companyUploadedCid: ""
            });
    }

    function getProject(
        uint _projectId
    ) external view returns (Project memory) {
        return projects[_projectId];
    }

    function getRejectedProject(
        address _contractorAddress
    ) external view returns (RejectedMileStone[] memory) {
        return rejectedMilestones[_contractorAddress];
    }

    // Government agency

    function createAgency() external {}
}
