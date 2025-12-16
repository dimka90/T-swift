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
    // ============ Role Definitions ============
    
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant AGENCY_ROLE = keccak256("AGENCY_ROLE");
    bytes32 public constant CONTRACTOR_ROLE = keccak256("CONTRACTOR_ROLE");
    bytes32 public constant ARBITRATOR_ROLE = keccak256("ARBITRATOR_ROLE");
    
    // ============ State Variables ============
    
    address public owner;
    address public tokenAddress;
    
    // Security
    uint256 private locked; // Reentrancy guard
    bool public paused; // Emergency pause
    
    // Role management
    mapping(address => mapping(bytes32 => bool)) private roles;
    mapping(bytes32 => address[]) private roleMembers;
    
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
    
    // Reputation tracking
    mapping(address => ContractorReputation) public contractorReputation;
    mapping(address => AgencyReputation) public agencyReputation;
    mapping(uint256 => Rating[]) public projectRatings;
    mapping(address => uint256[]) public contractorRatings;
    mapping(address => uint256[]) public agencyRatings;
    
    // Counters
    Contractor[] public contractors;
    uint256 public projectId = 1;
    uint256 public milestoneId = 1;
    uint256 public ratingId = 1;
    
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
    
    event RoleGranted(
        bytes32 indexed role,
        address indexed account,
        address indexed sender
    );
    
    event RoleRevoked(
        bytes32 indexed role,
        address indexed account,
        address indexed sender
    );
    
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
    
    event EscrowRefunded(
        uint256 indexed projectId,
        address indexed agency,
        uint256 amount
    );
    
    event PartialPaymentReleased(
        uint256 indexed projectId,
        uint256 indexed milestoneId,
        address indexed contractor,
        uint256 amount
    );
    
    event ContractorRated(
        address indexed contractor,
        address indexed rater,
        uint256 indexed projectId,
        uint8 score,
        uint256 timestamp
    );
    
    event AgencyRated(
        address indexed agency,
        address indexed rater,
        uint256 indexed projectId,
        uint8 score,
        uint256 timestamp
    );
    
    event ContractorVerified(
        address indexed contractor,
        uint256 timestamp
    );
    
    event AgencyVerified(
        address indexed agency,
        uint256 verificationLevel,
        uint256 timestamp
    );
    
    event PenaltyApplied(
        address indexed contractor,
        uint256 points,
        string reason,
        uint256 timestamp
    );
    
    event ContractPaused(
        address indexed by,
        uint256 timestamp,
        string reason
    );
    
    event ContractUnpaused(
        address indexed by,
        uint256 timestamp
    );
    
    event SecurityAlert(
        string indexed alertType,
        address indexed account,
        uint256 timestamp,
        string details
    );
    
    // ============ Modifiers ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier nonReentrant() {
        require(locked == 0, "No reentrancy");
        locked = 1;
        _;
        locked = 0;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    modifier whenPaused() {
        require(paused, "Contract is not paused");
        _;
    }
    
    modifier onlyRole(bytes32 _role) {
        require(hasRole(_role, msg.sender), "Access denied: insufficient role");
        _;
    }
    
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Only admin can call this");
        _;
    }
    
    modifier onlyAgencyRole() {
        require(hasRole(AGENCY_ROLE, msg.sender), "Only agency can call this");
        _;
    }
    
    modifier onlyContractorRole() {
        require(hasRole(CONTRACTOR_ROLE, msg.sender), "Only contractor can call this");
        _;
    }
    
    modifier onlyArbitrator() {
        require(hasRole(ARBITRATOR_ROLE, msg.sender), "Only arbitrator can call this");
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
        
        // Grant admin role to owner
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    // ============ Role Management ============
    
    /**
     * @notice Grant a role to an address
     * @param _role Role identifier
     * @param _account Address to grant role to
     */
    function grantRole(bytes32 _role, address _account) external onlyAdmin {
        require(_account != address(0), "Invalid address");
        _grantRole(_role, _account);
    }
    
    /**
     * @notice Revoke a role from an address
     * @param _role Role identifier
     * @param _account Address to revoke role from
     */
    function revokeRole(bytes32 _role, address _account) external onlyAdmin {
        require(_account != address(0), "Invalid address");
        _revokeRole(_role, _account);
    }
    
    /**
     * @notice Check if an address has a specific role
     * @param _role Role identifier
     * @param _account Address to check
     */
    function hasRole(bytes32 _role, address _account) public view returns (bool) {
        return roles[_account][_role];
    }
    
    /**
     * @notice Get all members of a role
     * @param _role Role identifier
     */
    function getRoleMembers(bytes32 _role) external view returns (address[] memory) {
        return roleMembers[_role];
    }
    
    /**
     * @notice Internal function to grant role
     * @param _role Role identifier
     * @param _account Address to grant role to
     */
    function _grantRole(bytes32 _role, address _account) internal {
        if (!roles[_account][_role]) {
            roles[_account][_role] = true;
            roleMembers[_role].push(_account);
            emit RoleGranted(_role, _account, msg.sender);
        }
    }
    
    /**
     * @notice Internal function to revoke role
     * @param _role Role identifier
     * @param _account Address to revoke role from
     */
    function _revokeRole(bytes32 _role, address _account) internal {
        if (roles[_account][_role]) {
            roles[_account][_role] = false;
            
            // Remove from roleMembers array
            for (uint256 i = 0; i < roleMembers[_role].length; i++) {
                if (roleMembers[_role][i] == _account) {
                    roleMembers[_role][i] = roleMembers[_role][roleMembers[_role].length - 1];
                    roleMembers[_role].pop();
                    break;
                }
            }
            
            emit RoleRevoked(_role, _account, msg.sender);
        }
    }
    
    // ============ Emergency & Security Functions ============
    
    /**
     * @notice Pause contract in case of emergency
     * @param _reason Reason for pausing
     */
    function pauseContract(string memory _reason) external onlyAdmin {
        require(!paused, "Contract already paused");
        paused = true;
        emit ContractPaused(msg.sender, block.timestamp, _reason);
        emit SecurityAlert("CONTRACT_PAUSED", msg.sender, block.timestamp, _reason);
    }
    
    /**
     * @notice Unpause contract after emergency
     */
    function unpauseContract() external onlyAdmin {
        require(paused, "Contract is not paused");
        paused = false;
        emit ContractUnpaused(msg.sender, block.timestamp);
    }
    
    /**
     * @notice Check if contract is paused
     */
    function isPaused() external view returns (bool) {
        return paused;
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
    ) external onlyAgencyRole whenNotPaused nonReentrant returns (uint256) {
        // Input validation
        require(_budget > 0, "Budget must be greater than 0");
        require(_budget <= 10000000e18, "Budget exceeds maximum limit"); // 10M cUSD max
        require(_contractorAddress != address(0), "Invalid contractor address");
        require(msg.sender != _contractorAddress, "Agency cannot be contractor");
        require(_endDate > _startDate, "End date must be after start date");
        require(_endDate <= block.timestamp + 365 days, "End date too far in future");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(bytes(_description).length <= 1000, "Description too long");
        
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
        
        // Initialize reputation if not exists
        if (contractorReputation[_contractorAddress].contractorAddress == address(0)) {
            contractorReputation[_contractorAddress] = ContractorReputation({
                contractorAddress: _contractorAddress,
                totalProjects: 1,
                completedProjects: 0,
                totalRating: 0,
                ratingCount: 0,
                averageRating: 0,
                rejectedMilestones: 0,
                lateDeliveries: 0,
                isVerified: false,
                penaltyPoints: 0,
                lastUpdated: block.timestamp
            });
        } else {
            contractorReputation[_contractorAddress].totalProjects += 1;
        }
        
        if (agencyReputation[msg.sender].agencyAddress == address(0)) {
            agencyReputation[msg.sender] = AgencyReputation({
                agencyAddress: msg.sender,
                totalProjects: 1,
                completedProjects: 0,
                totalRating: 0,
                ratingCount: 0,
                averageRating: 0,
                isVerified: false,
                verificationLevel: 0,
                lastUpdated: block.timestamp
            });
        } else {
            agencyReputation[msg.sender].totalProjects += 1;
        }
        
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
        
        address contractorAddr = projects[projectId_].contractorAddress;
        
        // Track rejection
        rejectedMilestones[contractorAddr].push(
            RejectedMileStone({
                projectId: projectId_,
                milestoneId: _milestoneId,
                contractor: contractorAddr
            })
        );
        
        // Update contractor reputation
        contractorReputation[contractorAddr].rejectedMilestones += 1;
        
        emit MilestoneRejected(_milestoneId, projectId_, msg.sender, _reason);
    }
    
    // ============ Payment Management ============
    
    /**
     * @notice Release payment for approved milestone
     * @dev Transfers funds from escrow to contractor
     * @param _milestoneId Milestone ID
     */
    function releaseMilestonePayment(uint256 _milestoneId) external onlyAgencyRole whenNotPaused nonReentrant {
        MilestoneData storage milestone = _findMilestone(_milestoneId);
        require(milestone.milestoneId == _milestoneId, "Milestone not found");
        require(milestone.status == MilestoneStatus.APPROVED, "Milestone not approved");
        
        uint256 projectId_ = milestone.projectId;
        require(projects[projectId_].agency == msg.sender, "Only project agency can release payment");
        
        Payment storage payment = projectPayments[projectId_];
        require(payment.remainingAmount >= milestone.amount, "Insufficient funds in escrow");
        
        // Update payment tracking
        payment.paidAmount += milestone.amount;
        payment.remainingAmount -= milestone.amount;
        payment.releaseTime = block.timestamp;
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
            _completeProject(projectId_);
        }
    }
    
    /**
     * @notice Release partial payment for milestone (for partial approvals)
     * @param _milestoneId Milestone ID
     * @param _amount Amount to release
     */
    function releasePartialPayment(uint256 _milestoneId, uint256 _amount) external onlyAgencyRole whenNotPaused nonReentrant {
        MilestoneData storage milestone = _findMilestone(_milestoneId);
        require(milestone.milestoneId == _milestoneId, "Milestone not found");
        require(milestone.status == MilestoneStatus.APPROVED, "Milestone not approved");
        require(_amount > 0 && _amount <= milestone.amount, "Invalid amount");
        
        uint256 projectId_ = milestone.projectId;
        require(projects[projectId_].agency == msg.sender, "Only project agency can release payment");
        
        Payment storage payment = projectPayments[projectId_];
        require(payment.remainingAmount >= _amount, "Insufficient funds in escrow");
        
        // Update payment tracking
        payment.paidAmount += _amount;
        payment.remainingAmount -= _amount;
        payment.releaseTime = block.timestamp;
        
        // Transfer tokens to contractor
        require(
            ITOKEN(tokenAddress).transfer(projects[projectId_].contractorAddress, _amount),
            "Payment transfer failed"
        );
        
        emit PaymentReleased(projectId_, _milestoneId, projects[projectId_].contractorAddress, _amount);
        
        // Check if project is complete
        if (payment.remainingAmount == 0) {
            _completeProject(projectId_);
        }
    }
    
    /**
     * @notice Refund remaining escrow balance to agency (for cancelled projects)
     * @param _projectId Project ID
     */
    function refundEscrow(uint256 _projectId) external projectExists(_projectId) onlyAgencyRole whenNotPaused nonReentrant {
        require(projects[_projectId].agency == msg.sender, "Only project agency can refund");
        require(!projects[_projectId].completed, "Cannot refund completed project");
        
        Payment storage payment = projectPayments[_projectId];
        require(payment.remainingAmount > 0, "No funds to refund");
        
        uint256 refundAmount = payment.remainingAmount;
        payment.remainingAmount = 0;
        
        // Transfer remaining tokens back to agency
        require(
            ITOKEN(tokenAddress).transfer(msg.sender, refundAmount),
            "Refund transfer failed"
        );
        
        emit EscrowRefunded(_projectId, msg.sender, refundAmount);
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
     * @notice Get payment history for a project
     * @param _projectId Project ID
     */
    function getPaymentHistory(uint256 _projectId)
        external
        view
        projectExists(_projectId)
        returns (
            uint256 totalAmount,
            uint256 paidAmount,
            uint256 remainingAmount,
            uint256 releaseTime
        )
    {
        Payment memory payment = projectPayments[_projectId];
        return (
            payment.totalAmount,
            payment.paidAmount,
            payment.remainingAmount,
            payment.releaseTime
        );
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
    
    /**
     * @notice Get milestone payment details
     * @param _milestoneId Milestone ID
     */
    function getMilestonePaymentDetails(uint256 _milestoneId)
        external
        view
        returns (
            uint256 amount,
            uint256 dueDate,
            uint8 status,
            uint256 submittedAt,
            uint256 approvedAt
        )
    {
        MilestoneData memory milestone = _findMilestone(_milestoneId);
        return (
            milestone.amount,
            milestone.dueDate,
            uint8(milestone.status),
            milestone.submittedAt,
            milestone.approvedAt
        );
    }
    
    /**
     * @notice Internal function to complete project
     * @param _projectId Project ID
     */
    function _completeProject(uint256 _projectId) internal {
        projects[_projectId].completed = true;
        projects[_projectId].status = 1; // COMPLETED
        
        // Update reputation
        address contractorAddr = projects[_projectId].contractorAddress;
        contractorReputation[contractorAddr].completedProjects += 1;
        agencyReputation[projects[_projectId].agency].completedProjects += 1;
        
        Payment memory payment = projectPayments[_projectId];
        emit ProjectCompleted(_projectId, contractorAddr, payment.paidAmount);
    }
    
    // ============ Reputation Management ============
    
    /**
     * @notice Rate a contractor after project completion
     * @param _contractorAddress Contractor address
     * @param _projectId Project ID
     * @param _score Rating score (1-5)
     * @param _comment Rating comment
     */
    function rateContractor(
        address _contractorAddress,
        uint256 _projectId,
        uint8 _score,
        string memory _comment
    ) external projectExists(_projectId) {
        require(_score >= 1 && _score <= 5, "Score must be between 1 and 5");
        require(projects[_projectId].agency == msg.sender, "Only project agency can rate");
        require(projects[_projectId].completed, "Project must be completed");
        
        // Create rating
        Rating memory newRating = Rating({
            rater: msg.sender,
            ratee: _contractorAddress,
            projectId: _projectId,
            score: _score,
            comment: _comment,
            timestamp: block.timestamp
        });
        
        projectRatings[_projectId].push(newRating);
        contractorRatings[_contractorAddress].push(ratingId);
        
        // Update contractor reputation
        _updateContractorReputation(_contractorAddress, _score);
        
        emit ContractorRated(_contractorAddress, msg.sender, _projectId, _score, block.timestamp);
        ratingId++;
    }
    
    /**
     * @notice Rate an agency after project completion
     * @param _agencyAddress Agency address
     * @param _projectId Project ID
     * @param _score Rating score (1-5)
     * @param _comment Rating comment
     */
    function rateAgency(
        address _agencyAddress,
        uint256 _projectId,
        uint8 _score,
        string memory _comment
    ) external projectExists(_projectId) {
        require(_score >= 1 && _score <= 5, "Score must be between 1 and 5");
        require(projects[_projectId].contractorAddress == msg.sender, "Only project contractor can rate");
        require(projects[_projectId].completed, "Project must be completed");
        
        // Create rating
        Rating memory newRating = Rating({
            rater: msg.sender,
            ratee: _agencyAddress,
            projectId: _projectId,
            score: _score,
            comment: _comment,
            timestamp: block.timestamp
        });
        
        projectRatings[_projectId].push(newRating);
        agencyRatings[_agencyAddress].push(ratingId);
        
        // Update agency reputation
        _updateAgencyReputation(_agencyAddress, _score);
        
        emit AgencyRated(_agencyAddress, msg.sender, _projectId, _score, block.timestamp);
        ratingId++;
    }
    
    /**
     * @notice Get contractor reputation
     * @param _contractorAddress Contractor address
     */
    function getContractorReputation(address _contractorAddress) 
        external 
        view 
        returns (ContractorReputation memory) 
    {
        return contractorReputation[_contractorAddress];
    }
    
    /**
     * @notice Get agency reputation
     * @param _agencyAddress Agency address
     */
    function getAgencyReputation(address _agencyAddress) 
        external 
        view 
        returns (AgencyReputation memory) 
    {
        return agencyReputation[_agencyAddress];
    }
    
    /**
     * @notice Get project ratings
     * @param _projectId Project ID
     */
    function getProjectRatings(uint256 _projectId) 
        external 
        view 
        projectExists(_projectId) 
        returns (Rating[] memory) 
    {
        return projectRatings[_projectId];
    }
    
    /**
     * @notice Verify contractor (admin only)
     * @param _contractorAddress Contractor address
     */
    function verifyContractor(address _contractorAddress) external onlyAdmin {
        require(_contractorAddress != address(0), "Invalid address");
        contractorReputation[_contractorAddress].isVerified = true;
        emit ContractorVerified(_contractorAddress, block.timestamp);
    }
    
    /**
     * @notice Verify agency with verification level (admin only)
     * @param _agencyAddress Agency address
     * @param _verificationLevel Verification level (1-3)
     */
    function verifyAgency(address _agencyAddress, uint256 _verificationLevel) external onlyAdmin {
        require(_agencyAddress != address(0), "Invalid address");
        require(_verificationLevel >= 1 && _verificationLevel <= 3, "Invalid verification level");
        agencyReputation[_agencyAddress].isVerified = true;
        agencyReputation[_agencyAddress].verificationLevel = _verificationLevel;
        emit AgencyVerified(_agencyAddress, _verificationLevel, block.timestamp);
    }
    
    /**
     * @notice Apply penalty to contractor (admin only)
     * @param _contractorAddress Contractor address
     * @param _points Penalty points
     * @param _reason Penalty reason
     */
    function applyPenalty(
        address _contractorAddress,
        uint256 _points,
        string memory _reason
    ) external onlyAdmin {
        require(_contractorAddress != address(0), "Invalid address");
        require(_points > 0, "Points must be greater than 0");
        
        contractorReputation[_contractorAddress].penaltyPoints += _points;
        emit PenaltyApplied(_contractorAddress, _points, _reason, block.timestamp);
    }
    
    // ============ Helper Functions ============
    
    /**
     * @notice Update contractor reputation after rating
     * @param _contractorAddress Contractor address
     * @param _score Rating score
     */
    function _updateContractorReputation(address _contractorAddress, uint8 _score) internal {
        ContractorReputation storage rep = contractorReputation[_contractorAddress];
        
        if (rep.totalRating == 0) {
            // First rating
            rep.contractorAddress = _contractorAddress;
        }
        
        rep.totalRating += _score;
        rep.ratingCount += 1;
        rep.averageRating = (rep.totalRating * 100) / rep.ratingCount;
        rep.lastUpdated = block.timestamp;
    }
    
    /**
     * @notice Update agency reputation after rating
     * @param _agencyAddress Agency address
     * @param _score Rating score
     */
    function _updateAgencyReputation(address _agencyAddress, uint8 _score) internal {
        AgencyReputation storage rep = agencyReputation[_agencyAddress];
        
        if (rep.totalRating == 0) {
            // First rating
            rep.agencyAddress = _agencyAddress;
        }
        
        rep.totalRating += _score;
        rep.ratingCount += 1;
        rep.averageRating = (rep.totalRating * 100) / rep.ratingCount;
        rep.lastUpdated = block.timestamp;
    }
    
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
