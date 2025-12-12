// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/ITOKEN.sol";
import "../types/Enum.sol";
import "../types/Struct.sol";

/**
 * @title Procurement V2
 * @notice Enhanced procurement contract with payment mechanism and access control
 * @dev Implements milestone-based payments and dispute resolution
 */
contract ProcurementV2 {
    // ============ State Variables ============
    
    address public owner;
    address public tokenAddress;
    
    // Project and contractor mappings
    mapping(uint256 => Project) public projects;
    mapping(address => uint256[]) public contractorProjects;
    mapping(uint256 => Contractor) public contractor;
    mapping(address => RejectedMileStone[]) public rejectedMilestones;
    mapping(address => address) public agency_Contractor;
    mapping(address => uint[]) public projectsubmited;
    
    // Payment tracking
    mapping(uint256 => Payment) public projectPayments;
    mapping(uint256 => MilestoneData[]) public projectMilestones;
    mapping(uint256 => MilestoneStatus) public milestoneStatus;
    
    // Counters
    Contractor[] public contractors;
    uint256 public projectId = 1;
    uint256 public milestoneId = 1;
    
    // ============ Enums ============
    
    enum MilestoneStatus {
        PENDING,
        SUBMITTED,
        APPROVED,
        REJECTED,
        PAID
    }
    
    // ============ Structs ============
    
    struct Payment {
        uint256 projectId;
        uint256 totalAmount;
        uint256 paidAmount;
        uint256 remainingAmount;
        bool isReleased;
        uint256 releaseTime;
    }
    
    struct MilestoneData {
        uint256 milestoneId;
        uint256 projectId;
        string description;
        uint256 amount;
        uint256 dueDate;
        string deliverablesCid;
        MilestoneStatus status;
        uint256 submittedAt;
        uint256 approvedAt;
    }
    
    // ============ Events ============
    
    event ProjectCreated(
        uint256 indexed projectId,
        address indexed agency,
        address indexed contractor,
        uint256 budget
    );
    
    event MilestoneCreated(
        uint256 indexed milestoneId,
        uint256 indexed projectId,
        uint256 amount,
        uint256 dueDate
    );
    
    event MilestoneSubmitted(
        uint256 indexed milestoneId,
        uint256 indexed projectId,
        address indexed contractor,
        string deliverablesCid
    );
    
    event MilestoneApproved(
        uint256 indexed milestoneId,
        uint256 indexed projectId,
        address indexed agency
    );
    
    event MilestoneRejected(
        uint256 indexed milestoneId,
        uint256 indexed projectId,
        address indexed agency,
        string reason
    );
    
    event PaymentReleased(
        uint256 indexed projectId,
        uint256 indexed milestoneId,
        address indexed contractor,
        uint256 amount
    );
    
    event ProjectCompleted(
        uint256 indexed projectId,
        address indexed contractor,
        uint256 totalPaid
    );
    
    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier projectExists(uint256 _projectId) {
        require(_projectId > 0 && _projectId < projectId, "Project does not exist");
        _;
    }
    
    modifier onlyAgency(uint256 _projectId) {
        require(projects[_projectId].agency == msg.sender, "Only project agency can call this");
        _;
    }
    
    modifier onlyContractor(uint256 _projectId) {
        require(projects[_projectId].contractorAddress == msg.sender, "Only project contractor can call this");
        _;
    }
    
    // ============ Constructor ============
    
    constructor(address _tokenAddress) {
        require(_tokenAddress != address(0), "Invalid token address");
        owner = msg.sender;
        tokenAddress = _tokenAddress;
    }
    
    // ============ Project Management ============
    
    /**
     * @notice Create a new project with budget
     * @param _description Project description
     * @param _budget Total project budget
     * @param _contractorAddress Contractor address
     * @param _startDate Project start date
     * @param _endDate Project end date
     */
    function createProject(
        string memory _description,
        uint256 _budget,
        address _contractorAddress,
        uint256 _startDate,
        uint256 _endDate
    ) external returns (uint256) {
        require(_budget > 0, "Budget must be greater than 0");
        require(_contractorAddress != address(0), "Invalid contractor address");
        require(_endDate > _startDate, "End date must be after start date");
        
        // Check allowance
        uint256 allowance = ITOKEN(tokenAddress).allowance(msg.sender, address(this));
        require(_budget <= allowance, "Insufficient allowance");
        
        // Transfer tokens to contract
        require(
            ITOKEN(tokenAddress).transferFrom(msg.sender, address(this), _budget),
            "Token transfer failed"
        );
        
        // Create project
        uint256 currentProjectId = projectId;
        projects[currentProjectId] = Project({
            projectId: currentProjectId,
            description: _description,
            budget: _budget,
            contractorAddress: _contractorAddress,
            agency: msg.sender,
            completed: false,
            startDate: _startDate,
            endDate: _endDate,
            imageCid: "",
            status: 0 // ACTIVE
        });
        
        // Initialize payment tracking
        projectPayments[currentProjectId] = Payment({
            projectId: currentProjectId,
            totalAmount: _budget,
            paidAmount: 0,
            remainingAmount: _budget,
            isReleased: false,
            releaseTime: 0
        });
        
        // Map contractor to project
        contractorProjects[_contractorAddress].push(currentProjectId);
        agency_Contractor[msg.sender] = _contractorAddress;
        
        emit ProjectCreated(currentProjectId, msg.sender, _contractorAddress, _budget);
        
        projectId++;
        return currentProjectId;
    }
    
    /**
     * @notice Create a milestone for a project
     * @param _projectId Project ID
     * @param _description Milestone description
     * @param _amount Payment amount for this milestone
     * @param _dueDate Milestone due date
     */
    function createMilestone(
        uint256 _projectId,
        string memory _description,
        uint256 _amount,
        uint256 _dueDate
    ) external projectExists(_projectId) onlyAgency(_projectId) returns (uint256) {
        require(_amount > 0, "Amount must be greater than 0");
        require(_dueDate > block.timestamp, "Due date must be in the future");
        require(_amount <= projectPayments[_projectId].remainingAmount, "Amount exceeds remaining budget");
        
        uint256 currentMilestoneId = milestoneId;
        
        MilestoneData memory newMilestone = MilestoneData({
            milestoneId: currentMilestoneId,
            projectId: _projectId,
            description: _description,
            amount: _amount,
            dueDate: _dueDate,
            deliverablesCid: "",
            status: MilestoneStatus.PENDING,
            submittedAt: 0,
            approvedAt: 0
        });
        
        projectMilestones[_projectId].push(newMilestone);
        milestoneStatus[currentMilestoneId] = MilestoneStatus.PENDING;
        
        emit MilestoneCreated(currentMilestoneId, _projectId, _amount, _dueDate);
        
        milestoneId++;
        return currentMilestoneId;
    }
    
    // ============ Milestone Management ============
    
    /**
     * @notice Submit milestone deliverables
     * @param _milestoneId Milestone ID
     * @param _deliverablesCid IPFS hash of deliverables
     */
    function submitMilestone(
        uint256 _milestoneId,
        string memory _deliverablesCid
    ) external {
        require(bytes(_deliverablesCid).length > 0, "Deliverables CID cannot be empty");
        
        // Find milestone
        MilestoneData storage milestone = _findMilestone(_milestoneId);
        require(milestone.milestoneId == _milestoneId, "Milestone not found");
        require(milestone.status == MilestoneStatus.PENDING, "Milestone already submitted");
        
        uint256 projectId_ = milestone.projectId;
        require(projects[projectId_].contractorAddress == msg.sender, "Only contractor can submit");
        
        milestone.deliverablesCid = _deliverablesCid;
        milestone.status = MilestoneStatus.SUBMITTED;
        milestone.submittedAt = block.timestamp;
        milestoneStatus[_milestoneId] = MilestoneStatus.SUBMITTED;
        
        emit MilestoneSubmitted(_milestoneId, projectId_, msg.sender, _deliverablesCid);
    }
    
    /**
     * @notice Approve a submitted milestone
     * @param _milestoneId Milestone ID
     */
    function approveMilestone(uint256 _milestoneId) external {
        MilestoneData storage milestone = _findMilestone(_milestoneId);
        require(milestone.milestoneId == _milestoneId, "Milestone not found");
        require(milestone.status == MilestoneStatus.SUBMITTED, "Milestone not submitted");
        
        uint256 projectId_ = milestone.projectId;
        require(projects[projectId_].agency == msg.sender, "Only agency can approve");
        
        milestone.status = MilestoneStatus.APPROVED;
        milestone.approvedAt = block.timestamp;
        milestoneStatus[_milestoneId] = MilestoneStatus.APPROVED;
        
        emit MilestoneApproved(_milestoneId, projectId_, msg.sender);
    }
    
    /**
     * @notice Reject a submitted milestone
     * @param _milestoneId Milestone ID
     * @param _reason Rejection reason
     */
    function rejectMilestone(
        uint256 _milestoneId,
        string memory _reason
    ) external {
        MilestoneData storage milestone = _findMilestone(_milestoneId);
        require(milestone.milestoneId == _milestoneId, "Milestone not found");
        require(milestone.status == MilestoneStatus.SUBMITTED, "Milestone not submitted");
        
        uint256 projectId_ = milestone.projectId;
        require(projects[projectId_].agency == msg.sender, "Only agency can reject");
        
        milestone.status = MilestoneStatus.REJECTED;
        milestoneStatus[_milestoneId] = MilestoneStatus.REJECTED;
        
        // Track rejection
        rejectedMilestones[projects[projectId_].contractorAddress].push(
            RejectedMileStone({
                projectId: projectId_,
                milestoneId: _milestoneId,
                contractor: projects[projectId_].contractorAddress
            })
        );
        
        emit MilestoneRejected(_milestoneId, projectId_, msg.sender, _reason);
    }
    
    // ============ Payment Management ============
    
    /**
     * @notice Release payment for approved milestone
     * @param _milestoneId Milestone ID
     */
    function releaseMilestonePayment(uint256 _milestoneId) external {
        MilestoneData storage milestone = _findMilestone(_milestoneId);
        require(milestone.milestoneId == _milestoneId, "Milestone not found");
        require(milestone.status == MilestoneStatus.APPROVED, "Milestone not approved");
        
        uint256 projectId_ = milestone.projectId;
        require(projects[projectId_].agency == msg.sender, "Only agency can release payment");
        
        Payment storage payment = projectPayments[projectId_];
        require(payment.remainingAmount >= milestone.amount, "Insufficient funds");
        
        // Update payment tracking
        payment.paidAmount += milestone.amount;
        payment.remainingAmount -= milestone.amount;
        milestone.status = MilestoneStatus.PAID;
        milestoneStatus[_milestoneId] = MilestoneStatus.PAID;
        
        // Transfer tokens to contractor
        require(
            ITOKEN(tokenAddress).transfer(projects[projectId_].contractorAddress, milestone.amount),
            "Payment transfer failed"
        );
        
        emit PaymentReleased(projectId_, _milestoneId, projects[projectId_].contractorAddress, milestone.amount);
        
        // Check if project is complete
        if (payment.remainingAmount == 0) {
            projects[projectId_].completed = true;
            projects[projectId_].status = 1; // COMPLETED
            emit ProjectCompleted(projectId_, projects[projectId_].contractorAddress, payment.paidAmount);
        }
    }
    
    /**
     * @notice Get project payment status
     * @param _projectId Project ID
     */
    function getPaymentStatus(uint256 _projectId) 
        external 
        view 
        projectExists(_projectId) 
        returns (Payment memory) 
    {
        return projectPayments[_projectId];
    }
    
    /**
     * @notice Get project milestones
     * @param _projectId Project ID
     */
    function getProjectMilestones(uint256 _projectId) 
        external 
        view 
        projectExists(_projectId) 
        returns (MilestoneData[] memory) 
    {
        return projectMilestones[_projectId];
    }
    
    // ============ Helper Functions ============
    
    /**
     * @notice Find milestone by ID
     * @param _milestoneId Milestone ID
     */
    function _findMilestone(uint256 _milestoneId) internal view returns (MilestoneData storage) {
        for (uint256 i = 0; i < projectMilestones[projects[projectId - 1].projectId].length; i++) {
            if (projectMilestones[projects[projectId - 1].projectId][i].milestoneId == _milestoneId) {
                return projectMilestones[projects[projectId - 1].projectId][i];
            }
        }
        revert("Milestone not found");
    }
    
    /**
     * @notice Get contractor details
     * @param _contractorAddress Contractor address
     */
    function getContractor(address _contractorAddress) 
        external 
        view 
        returns (Contractor memory) 
    {
        require(_contractorAddress != address(0), "Invalid address");
        
        for (uint256 i = 0; i < contractors.length; i++) {
            if (contractors[i].owner == _contractorAddress) {
                return contractors[i];
            }
        }
        
        revert("Contractor not found");
    }
    
    /**
     * @notice Get all contractors
     */
    function getAllContractors() external view returns (Contractor[] memory) {
        return contractors;
    }
    
    /**
     * @notice Get contractor projects
     * @param _contractorAddress Contractor address
     */
    function getContractorProjects(address _contractorAddress) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return contractorProjects[_contractorAddress];
    }
}
