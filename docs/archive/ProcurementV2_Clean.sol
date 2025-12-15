// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITOKEN {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

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
    uint8 status;
}

struct ContractorReputation {
    address contractorAddress;
    uint256 totalProjects;
    uint256 completedProjects;
    uint256 totalRating;
    uint256 ratingCount;
    uint256 averageRating;
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
    uint256 verificationLevel;
    uint256 lastUpdated;
}

struct Rating {
    address rater;
    address ratee;
    uint256 projectId;
    uint8 score;
    string comment;
    uint256 timestamp;
}

contract ProcurementV2 {
    address public owner;
    address public tokenAddress;
    
    mapping(uint256 => Project) public projects;
    mapping(address => uint256[]) public contractorProjects;
    mapping(uint256 => Contractor) public contractor;
    mapping(address => RejectedMileStone[]) public rejectedMilestones;
    mapping(address => address) public agency_Contractor;
    mapping(address => uint[]) public projectsubmited;
    
    mapping(uint256 => Payment) public projectPayments;
    mapping(uint256 => MilestoneData[]) public projectMilestones;
    mapping(uint256 => MilestoneStatus) public milestoneStatus;
    
    mapping(address => ContractorReputation) public contractorReputation;
    mapping(address => AgencyReputation) public agencyReputation;
    mapping(uint256 => Rating[]) public projectRatings;
    mapping(address => uint256[]) public contractorRatings;
    mapping(address => uint256[]) public agencyRatings;
    
    Contractor[] public contractors;
    uint256 public projectId = 1;
    uint256 public milestoneId = 1;
    uint256 public ratingId = 1;
    
    enum MilestoneStatus {
        PENDING,
        SUBMITTED,
        APPROVED,
        REJECTED,
        PAID
    }
    
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
    
    event ProjectCreated(uint256 indexed projectId, address indexed agency, address indexed contractor, uint256 budget);
    event MilestoneCreated(uint256 indexed milestoneId, uint256 indexed projectId, uint256 amount, uint256 dueDate);
    event MilestoneSubmitted(uint256 indexed milestoneId, uint256 indexed projectId, address indexed contractor, string deliverablesCid);
    event MilestoneApproved(uint256 indexed milestoneId, uint256 indexed projectId, address indexed agency);
    event MilestoneRejected(uint256 indexed milestoneId, uint256 indexed projectId, address indexed agency, string reason);
    event PaymentReleased(uint256 indexed projectId, uint256 indexed milestoneId, address indexed contractor, uint256 amount);
    event ProjectCompleted(uint256 indexed projectId, address indexed contractor, uint256 totalPaid);
    event ContractorRated(address indexed contractor, address indexed rater, uint256 indexed projectId, uint8 score, uint256 timestamp);
    event AgencyRated(address indexed agency, address indexed rater, uint256 indexed projectId, uint8 score, uint256 timestamp);
    event ContractorVerified(address indexed contractor, uint256 timestamp);
    event AgencyVerified(address indexed agency, uint256 verificationLevel, uint256 timestamp);
    event PenaltyApplied(address indexed contractor, uint256 points, string reason, uint256 timestamp);
    
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
    
    constructor(address _tokenAddress) {
        require(_tokenAddress != address(0), "Invalid token address");
        owner = msg.sender;
        tokenAddress = _tokenAddress;
    }
    
    function createProject(string memory _description, uint256 _budget, address _contractorAddress, uint256 _startDate, uint256 _endDate) external returns (uint256) {
        require(_budget > 0, "Budget must be greater than 0");
        require(_contractorAddress != address(0), "Invalid contractor address");
        require(_endDate > _startDate, "End date must be after start date");
        
        uint256 allowance = ITOKEN(tokenAddress).allowance(msg.sender, address(this));
        require(_budget <= allowance, "Insufficient allowance");
        
        require(ITOKEN(tokenAddress).transferFrom(msg.sender, address(this), _budget), "Token transfer failed");
        
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
            status: 0
        });
        
        projectPayments[currentProjectId] = Payment({
            projectId: currentProjectId,
            totalAmount: _budget,
            paidAmount: 0,
            remainingAmount: _budget,
            isReleased: false,
            releaseTime: 0
        });
        
        contractorProjects[_contractorAddress].push(currentProjectId);
        agency_Contractor[msg.sender] = _contractorAddress;
        
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
    
    function createMilestone(uint256 _projectId, string memory _description, uint256 _amount, uint256 _dueDate) external projectExists(_projectId) onlyAgency(_projectId) returns (uint256) {
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
    
    function submitMilestone(uint256 _milestoneId, string memory _deliverablesCid) external {
        require(bytes(_deliverablesCid).length > 0, "Deliverables CID cannot be empty");
        
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
    
    function rejectMilestone(uint256 _milestoneId, string memory _reason) external {
        MilestoneData storage milestone = _findMilestone(_milestoneId);
        require(milestone.milestoneId == _milestoneId, "Milestone not found");
        require(milestone.status == MilestoneStatus.SUBMITTED, "Milestone not submitted");
        
        uint256 projectId_ = milestone.projectId;
        require(projects[projectId_].agency == msg.sender, "Only agency can reject");
        
        milestone.status = MilestoneStatus.REJECTED;
        milestoneStatus[_milestoneId] = MilestoneStatus.REJECTED;
        
        address contractorAddr = projects[projectId_].contractorAddress;
        rejectedMilestones[contractorAddr].push(RejectedMileStone({projectId: projectId_, milestoneId: _milestoneId, contractor: contractorAddr}));
        contractorReputation[contractorAddr].rejectedMilestones += 1;
        
        emit MilestoneRejected(_milestoneId, projectId_, msg.sender, _reason);
    }
    
    function releaseMilestonePayment(uint256 _milestoneId) external {
        MilestoneData storage milestone = _findMilestone(_milestoneId);
        require(milestone.milestoneId == _milestoneId, "Milestone not found");
        require(milestone.status == MilestoneStatus.APPROVED, "Milestone not approved");
        
        uint256 projectId_ = milestone.projectId;
        require(projects[projectId_].agency == msg.sender, "Only agency can release payment");
        
        Payment storage payment = projectPayments[projectId_];
        require(payment.remainingAmount >= milestone.amount, "Insufficient funds");
        
        payment.paidAmount += milestone.amount;
        payment.remainingAmount -= milestone.amount;
        milestone.status = MilestoneStatus.PAID;
        milestoneStatus[_milestoneId] = MilestoneStatus.PAID;
        
        require(ITOKEN(tokenAddress).transfer(projects[projectId_].contractorAddress, milestone.amount), "Payment transfer failed");
        
        emit PaymentReleased(projectId_, _milestoneId, projects[projectId_].contractorAddress, milestone.amount);
        
        if (payment.remainingAmount == 0) {
            projects[projectId_].completed = true;
            projects[projectId_].status = 1;
            
            address contractorAddr = projects[projectId_].contractorAddress;
            contractorReputation[contractorAddr].completedProjects += 1;
            agencyReputation[projects[projectId_].agency].completedProjects += 1;
            
            emit ProjectCompleted(projectId_, contractorAddr, payment.paidAmount);
        }
    }
    
    function getPaymentStatus(uint256 _projectId) external view projectExists(_projectId) returns (Payment memory) {
        return projectPayments[_projectId];
    }
    
    function getProjectMilestones(uint256 _projectId) external view projectExists(_projectId) returns (MilestoneData[] memory) {
        return projectMilestones[_projectId];
    }
    
    function rateContractor(address _contractorAddress, uint256 _projectId, uint8 _score, string memory _comment) external projectExists(_projectId) {
        require(_score >= 1 && _score <= 5, "Score must be between 1 and 5");
        require(projects[_projectId].agency == msg.sender, "Only project agency can rate");
        require(projects[_projectId].completed, "Project must be completed");
        
        Rating memory newRating = Rating({rater: msg.sender, ratee: _contractorAddress, projectId: _projectId, score: _score, comment: _comment, timestamp: block.timestamp});
        
        projectRatings[_projectId].push(newRating);
        contractorRatings[_contractorAddress].push(ratingId);
        
        _updateContractorReputation(_contractorAddress, _score);
        
        emit ContractorRated(_contractorAddress, msg.sender, _projectId, _score, block.timestamp);
        ratingId++;
    }
    
    function rateAgency(address _agencyAddress, uint256 _projectId, uint8 _score, string memory _comment) external projectExists(_projectId) {
        require(_score >= 1 && _score <= 5, "Score must be between 1 and 5");
        require(projects[_projectId].contractorAddress == msg.sender, "Only project contractor can rate");
        require(projects[_projectId].completed, "Project must be completed");
        
        Rating memory newRating = Rating({rater: msg.sender, ratee: _agencyAddress, projectId: _projectId, score: _score, comment: _comment, timestamp: block.timestamp});
        
        projectRatings[_projectId].push(newRating);
        agencyRatings[_agencyAddress].push(ratingId);
        
        _updateAgencyReputation(_agencyAddress, _score);
        
        emit AgencyRated(_agencyAddress, msg.sender, _projectId, _score, block.timestamp);
        ratingId++;
    }
    
    function getContractorReputation(address _contractorAddress) external view returns (ContractorReputation memory) {
        return contractorReputation[_contractorAddress];
    }
    
    function getAgencyReputation(address _agencyAddress) external view returns (AgencyReputation memory) {
        return agencyReputation[_agencyAddress];
    }
    
    function getProjectRatings(uint256 _projectId) external view projectExists(_projectId) returns (Rating[] memory) {
        return projectRatings[_projectId];
    }
    
    function verifyContractor(address _contractorAddress) external onlyOwner {
        require(_contractorAddress != address(0), "Invalid address");
        contractorReputation[_contractorAddress].isVerified = true;
        emit ContractorVerified(_contractorAddress, block.timestamp);
    }
    
    function verifyAgency(address _agencyAddress, uint256 _verificationLevel) external onlyOwner {
        require(_agencyAddress != address(0), "Invalid address");
        require(_verificationLevel >= 1 && _verificationLevel <= 3, "Invalid verification level");
        agencyReputation[_agencyAddress].isVerified = true;
        agencyReputation[_agencyAddress].verificationLevel = _verificationLevel;
        emit AgencyVerified(_agencyAddress, _verificationLevel, block.timestamp);
    }
    
    function applyPenalty(address _contractorAddress, uint256 _points, string memory _reason) external onlyOwner {
        require(_contractorAddress != address(0), "Invalid address");
        require(_points > 0, "Points must be greater than 0");
        
        contractorReputation[_contractorAddress].penaltyPoints += _points;
        emit PenaltyApplied(_contractorAddress, _points, _reason, block.timestamp);
    }
    
    function _updateContractorReputation(address _contractorAddress, uint8 _score) internal {
        ContractorReputation storage rep = contractorReputation[_contractorAddress];
        
        if (rep.totalRating == 0) {
            rep.contractorAddress = _contractorAddress;
        }
        
        rep.totalRating += _score;
        rep.ratingCount += 1;
        rep.averageRating = (rep.totalRating * 100) / rep.ratingCount;
        rep.lastUpdated = block.timestamp;
    }
    
    function _updateAgencyReputation(address _agencyAddress, uint8 _score) internal {
        AgencyReputation storage rep = agencyReputation[_agencyAddress];
        
        if (rep.totalRating == 0) {
            rep.agencyAddress = _agencyAddress;
        }
        
        rep.totalRating += _score;
        rep.ratingCount += 1;
        rep.averageRating = (rep.totalRating * 100) / rep.ratingCount;
        rep.lastUpdated = block.timestamp;
    }
    
    function _findMilestone(uint256 _milestoneId) internal view returns (MilestoneData storage) {
        for (uint256 i = 0; i < projectMilestones[projects[projectId - 1].projectId].length; i++) {
            if (projectMilestones[projects[projectId - 1].projectId][i].milestoneId == _milestoneId) {
                return projectMilestones[projects[projectId - 1].projectId][i];
            }
        }
        revert("Milestone not found");
    }
    
    function getContractor(address _contractorAddress) external view returns (Contractor memory) {
        require(_contractorAddress != address(0), "Invalid address");
        
        for (uint256 i = 0; i < contractors.length; i++) {
            if (contractors[i].owner == _contractorAddress) {
                return contractors[i];
            }
        }
        
        revert("Contractor not found");
    }
    
    function getAllContractors() external view returns (Contractor[] memory) {
        return contractors;
    }
    
    function getContractorProjects(address _contractorAddress) external view returns (uint256[] memory) {
        return contractorProjects[_contractorAddress];
    }
}
