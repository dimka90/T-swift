# Dashboard Comparison - Contractor vs Agency

## Overview
Created distinct dashboards for contractors and agencies with role-specific features and data.

---

## Contractor Dashboard (`/contractor-dashboard`)

### Purpose
Allows contractors to track their assigned projects, submissions, and milestone status.

### Key Features

#### Stats Cards
- **Active Projects** - Projects currently in progress
- **Completed** - Successfully delivered projects
- **Pending Submission** - Projects awaiting deliverables
- **Rejected Milestones** - Milestones needing revision

#### Main Sections

1. **Your Projects**
   - Lists all assigned projects
   - Shows project description and budget
   - Displays start and end dates
   - Status indicator (Completed/In Progress)
   - Submit Deliverables button for pending projects
   - Submission confirmation for completed projects

2. **Your Information**
   - Wallet address
   - Network connection status
   - Connected status indicator

3. **Attention Required** (if applicable)
   - Shows rejected milestones count
   - Quick link to review rejections
   - Alert styling for visibility

4. **Quick Tips**
   - Best practices for submissions
   - Deadline reminders
   - Documentation guidelines
   - Connection tips

### Data Sources
- `getContractorsProject()` - Fetch assigned projects
- `getRejectedProject()` - Fetch rejected milestones
- Real-time project status calculation

---

## Agency Dashboard (`/agency-dashboard`)

### Purpose
Allows agencies to create projects, manage contractors, and oversee procurement.

### Key Features

#### Stats Cards
- **Active Projects** - Currently running projects
- **Completed** - Successfully delivered projects
- **Pending Review** - Submissions awaiting approval
- **Contractors** - Total registered contractors

#### Main Sections

1. **Create New Project**
   - Full project creation form
   - Budget allocation
   - Contractor assignment
   - Date range selection
   - Token approval integration

2. **Agency Information**
   - Wallet address
   - Network connection status
   - Connected status indicator

3. **Contractors Overview**
   - Total registered contractors count
   - View all contractors button
   - Quick contractor management

4. **Quick Actions**
   - Review Submissions
   - Approve Milestones
   - View Budget Status
   - Easy access to common tasks

### Data Sources
- `getAllContractors()` - Fetch all registered contractors
- Real-time contractor count
- Project statistics

---

## Key Differences

| Feature | Contractor | Agency |
|---------|-----------|--------|
| **Primary Action** | Submit deliverables | Create projects |
| **Project View** | Assigned to them | Created by them |
| **Contractor List** | N/A | View all contractors |
| **Budget Management** | View budget | Allocate budget |
| **Milestone Tracking** | Track submissions | Review submissions |
| **Rejection Handling** | View rejections | Reject milestones |
| **Stats Focus** | Personal metrics | Portfolio metrics |
| **Quick Actions** | Submit, Review | Create, Approve, Review |

---

## Component Structure

### Contractor Dashboard
```
ContractorDashboard
├── Stats Cards (4)
├── Main Content Grid
│   ├── Left Column (2/3)
│   │   └── Your Projects
│   │       ├── Project List
│   │       └── Submit Button
│   └── Right Column (1/3)
│       ├── Your Information
│       ├── Attention Required (conditional)
│       └── Quick Tips
```

### Agency Dashboard
```
AgencyDashboard
├── Stats Cards (4)
├── Main Content Grid
│   ├── Left Column (2/3)
│   │   └── Create New Project
│   │       └── AssignContract Form
│   └── Right Column (1/3)
│       ├── Agency Information
│       ├── Contractors Overview
│       └── Quick Actions
```

---

## Styling Consistency

Both dashboards maintain:
- Same color scheme (slate-900 background)
- Consistent card styling
- Matching typography
- Responsive grid layouts
- Hover effects and transitions
- Icon usage for visual hierarchy

---

## Data Flow

### Contractor Dashboard
1. User connects wallet
2. Fetch contractor's projects
3. Fetch rejected milestones
4. Calculate stats
5. Display projects with submission status
6. Show alerts for rejections

### Agency Dashboard
1. User connects wallet
2. Fetch all contractors
3. Calculate project statistics
4. Display contractor count
5. Show project creation form
6. Provide quick action buttons

---

## Routing

### New Routes Added
- `/contractor-dashboard` - Contractor-specific dashboard
- `/agency-dashboard` - Agency-specific dashboard (already existed)

### Navigation
Update your navigation/menu to route users to appropriate dashboard based on role:
```javascript
// Example role detection
if (userRole === 'contractor') {
  navigate('/contractor-dashboard');
} else if (userRole === 'agency') {
  navigate('/agency-dashboard');
}
```

---

## Future Enhancements

### Contractor Dashboard
- [ ] Milestone submission form
- [ ] Document upload for deliverables
- [ ] Payment history
- [ ] Performance metrics
- [ ] Notification system

### Agency Dashboard
- [ ] Contractor approval workflow
- [ ] Budget analytics
- [ ] Project timeline view
- [ ] Bulk project creation
- [ ] Reporting dashboard

---

## Testing Checklist

- [ ] Contractor dashboard loads with correct data
- [ ] Agency dashboard loads with correct data
- [ ] Stats update in real-time
- [ ] Project list displays correctly
- [ ] Contractor count shows accurately
- [ ] Responsive design on mobile
- [ ] Error handling for failed data fetches
- [ ] Loading states display properly
- [ ] Navigation between dashboards works
