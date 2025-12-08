# Sidebar Comparison - Contractor vs Agency

## Overview
Created distinct sidebars for contractors and agencies with role-specific navigation and styling.

---

## Contractor Sidebar

### Location
`frontend/src/components/ContractorSideMenu.jsx`

### Color Scheme
- **Primary Color**: Blue (`blue-500`)
- **Background**: Slate gradient (`from-slate-900 to-slate-950`)
- **Accent**: Blue highlights on active items

### Menu Items
1. **Dashboard** (`/contractor-dashboard`)
   - View your projects
   - Main overview page

2. **My Projects** (`/projects`)
   - Assigned projects
   - Project details

3. **Pending Tasks** (`/milestoneform`)
   - Submit deliverables
   - Milestone submissions

4. **Completed** (`/payment`)
   - Completed projects
   - Payment history

5. **Rejections** (`/review`)
   - Review feedback
   - Revision requests

### Features
- Blue color scheme for contractor identity
- Contractor emoji icon (👷)
- Active state highlighting
- Hover effects with descriptions
- Status indicator showing "Active" and connection status
- Disconnect button for wallet disconnection
- Responsive design with descriptions for each menu item

### Status Card
- Shows "Active" status
- Animated pulse indicator
- Connection status display

---

## Agency Sidebar

### Location
`frontend/src/components/AgencySideMenu.jsx`

### Color Scheme
- **Primary Color**: Green (`green-500`)
- **Background**: Slate gradient (`from-slate-900 to-slate-950`)
- **Accent**: Green highlights on active items

### Menu Items
1. **Dashboard** (`/agency-dashboard`)
   - Overview & stats
   - Portfolio metrics

2. **Create Project** (`/assignContract`)
   - New procurement
   - Project creation form

3. **Contractors** (`/agency-projects`)
   - Manage partners
   - Contractor list

4. **Projects** (`/agency-projects`)
   - View all projects
   - Project management

5. **Payments** (`/agency-payment`)
   - Payment history
   - Transaction tracking

6. **Notifications** (`/review`)
   - Submissions & alerts
   - Milestone reviews

### Features
- Green color scheme for agency identity
- Agency emoji icon (🏛️)
- Active state highlighting
- Hover effects with descriptions
- Status indicator showing "Active" and connection status
- Disconnect button for wallet disconnection
- Responsive design with descriptions for each menu item

### Status Card
- Shows "Active" status
- Animated pulse indicator
- Connection status display

---

## Key Differences

| Feature | Contractor | Agency |
|---------|-----------|--------|
| **Color** | Blue | Green |
| **Icon** | 👷 Contractor | 🏛️ Agency |
| **Primary Action** | Submit Tasks | Create Projects |
| **Menu Focus** | Personal projects | Portfolio management |
| **Item Count** | 5 items | 6 items |
| **Key Routes** | Dashboard, Projects, Tasks | Dashboard, Create, Contractors |
| **Status Color** | Blue accent | Green accent |

---

## Automatic Route Detection

The Layout component automatically detects which sidebar to show based on the current route:

### Agency Routes
- `/agency-*` (all agency routes)
- `/assignContract`

### Contractor Routes
- `/contractor-*` (all contractor routes)
- `/dashboard`
- `/projects`
- `/payment`
- `/milestoneform`
- `/review`

```javascript
// Layout.jsx automatically switches sidebars
const isAgencyRoute = location.pathname.includes("agency") || 
                      location.pathname === "/assignContract";

const isContractorRoute = location.pathname.includes("contractor") || 
                          location.pathname === "/dashboard" || ...;
```

---

## Styling Details

### Both Sidebars Include

1. **Header Section**
   - Role icon (emoji)
   - Role label
   - Portal subtitle

2. **Menu Items**
   - Icon (from react-icons)
   - Label
   - Description
   - Active state styling
   - Hover effects

3. **Footer Section**
   - Status card with connection indicator
   - Animated pulse for active status
   - Disconnect button

### Responsive Design
- Fixed width: 256px
- Scrollable content
- Proper spacing and padding
- Mobile-friendly structure

---

## Component Structure

### ContractorSideMenu
```
ContractorSideMenu
├── Header
│   ├── Icon + Label
│   └── Menu Items (5)
│       ├── Dashboard
│       ├── My Projects
│       ├── Pending Tasks
│       ├── Completed
│       └── Rejections
└── Footer
    ├── Status Card
    └── Disconnect Button
```

### AgencySideMenu
```
AgencySideMenu
├── Header
│   ├── Icon + Label
│   └── Menu Items (6)
│       ├── Dashboard
│       ├── Create Project
│       ├── Contractors
│       ├── Projects
│       ├── Payments
│       └── Notifications
└── Footer
    ├── Status Card
    └── Disconnect Button
```

---

## Integration with Layout

The Layout component (`Layout.jsx`) now:
1. Detects current route
2. Determines user role based on route
3. Renders appropriate sidebar
4. Maintains consistent header and main content area

```javascript
// Automatic sidebar selection
{isAgencyRoute ? <AgencySideMenu /> : <ContractorSideMenu />}
```

---

## Usage

### For Contractors
- Navigate to `/contractor-dashboard` or any contractor route
- Sidebar automatically switches to ContractorSideMenu
- Blue color scheme and contractor-specific menu items

### For Agencies
- Navigate to `/agency-dashboard` or any agency route
- Sidebar automatically switches to AgencySideMenu
- Green color scheme and agency-specific menu items

---

## Future Enhancements

### Contractor Sidebar
- [ ] Add notifications badge
- [ ] Show pending task count
- [ ] Add quick stats
- [ ] Add help/support link

### Agency Sidebar
- [ ] Add budget overview
- [ ] Show active projects count
- [ ] Add contractor approval queue
- [ ] Add analytics link

### Both
- [ ] Add user profile section
- [ ] Add settings link
- [ ] Add help/documentation
- [ ] Add theme toggle

---

## Testing Checklist

- [ ] Contractor sidebar displays on contractor routes
- [ ] Agency sidebar displays on agency routes
- [ ] Active state highlighting works correctly
- [ ] Hover effects display properly
- [ ] Disconnect button functions
- [ ] Status indicator shows correctly
- [ ] Responsive design on mobile
- [ ] Route detection works accurately
- [ ] Colors match design specifications
- [ ] Icons display correctly
