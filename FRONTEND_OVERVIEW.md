# Faculty Management System - Frontend Overview

## Technology Stack
- **Framework**: React 19.2.0
- **Router**: React Router DOM 7.9.5
- **State Management**: Zustand 5.0.8
- **HTTP Client**: Axios 1.12.2
- **Styling**: Tailwind CSS 4.1.17 + PostCSS
- **Charts**: Recharts 3.4.1
- **Icons**: Lucide React 0.545.0
- **Build Tool**: Vite 7.1.7

---

## Application Architecture

### Core Structure
```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page-level components (organized by feature)
│   ├── services/         # API services
│   ├── store/            # Zustand state management
│   ├── utils/            # Helper utilities
│   ├── App.jsx           # Main app routing
│   └── main.jsx          # Entry point
```

---

## Key Components

### 1. **Navbar Component**
- Top navigation bar with Faculty Portal branding
- Conditional links based on authentication status
- Dashboard, Profile, and Logout buttons for authenticated users
- Home and Sign Up buttons for unauthenticated users

### 2. **Authentication Components**
- **AuthGate**: Protected route wrapper with role-based access control
- **FormContainer**: Reusable form wrapper with styling
- **FormInput**: Reusable form input component with validation
- **PrimaryButton**: Standardized action button
- **LoadingSpinner**: Loading indicator component
- **BackButton**: Navigation back button

### 3. **Toast Component** (NEW)
- Provider-based toast notification system
- Shows error/success messages to users

---

## Pages & Routes

### Public Pages
| Route | Page | Purpose |
|-------|------|---------|
| `/` | HomePage | Landing page with feature overview |
| `/login` | LoginPage | Faculty/Admin login |
| `/signup` | SignupPage | Faculty registration (awaiting approval) |
| `/forgot-password` | ForgotPasswordPage | Password reset request |
| `/reset-password/:token` | ResetPasswordPage | Reset password with token |
| `/retrieve` | RetrievePage | Browse faculty directory & export |

### Protected Faculty Pages
| Route | Page | Purpose |
|-------|------|---------|
| `/dashboard` | DashboardPage | Faculty dashboard with stats |
| `/profile` | ProfilePage | Edit own profile |
| `/faculty-profile` | FacultyProfile | View complete faculty profile |

### Research & Publications
| Route | Page | Purpose |
|-------|------|---------|
| `/research` | ResearchProjectsPage | List research projects |
| `/research/new` | AddResearchProjectPage | Add new research project |
| `/research/edit/:id` | AddResearchProjectPage | Edit research project |
| `/publications` | PublicationsPage | List publications |
| `/publications/new` | AddPublicationPage | Add new publication |
| `/publications/edit/:id` | AddPublicationPage | Edit publication |
| `/patents` | PatentsPage | List patents |
| `/patents/new` | AddPatentPage | Add new patent |
| `/patents/edit/:id` | AddPatentPage | Edit patent |

### Teaching & Qualifications
| Route | Page | Purpose |
|-------|------|---------|
| `/teaching` | TeachingExperiencePage | List teaching experience |
| `/teaching/experience/new` | AddTeachingExperiencePage | Add teaching experience |
| `/teaching/experience/edit/:id` | AddTeachingExperiencePage | Edit teaching experience |
| `/subjects` | SubjectsPage | List subjects taught |
| `/subjects/new` | AddSubjectPage | Add new subject |
| `/subjects/edit/:id` | AddSubjectPage | Edit subject |
| `/qualifications` | QualificationsPage | List qualifications |
| `/qualifications/new` | AddQualificationPage | Add qualification |
| `/qualifications/edit/:id` | AddQualificationPage | Edit qualification |

### Awards & Recognition
| Route | Page | Purpose |
|-------|------|---------|
| `/awards` | AwardsPage | List awards |
| `/awards/new` | AddAwardPage | Add new award |
| `/awards/edit/:id` | AddAwardPage | Edit award |
| `/citations` | CitationMetricsPage | List citation metrics |
| `/citations/new` | AddCitationMetricsPage | Add citation metrics |
| `/citations/edit/:id` | AddCitationMetricsPage | Edit citation metrics |

### Outreach & Events
| Route | Page | Purpose |
|-------|------|---------|
| `/outreach` | OutreachActivitiesPage | List outreach activities |
| `/outreach/new` | AddOutreachActivityPage | Add outreach activity |
| `/outreach/edit/:id` | AddOutreachActivityPage | Edit outreach activity |
| `/events` | EventsPage | List events organized |
| `/events/new` | AddEventPage | Add new event |
| `/events/edit/:id` | AddEventPage | Edit event |

### Admin Pages
| Route | Page | Purpose |
|-------|------|---------|
| `/admin` | AdminDashboard | Admin control panel |

---

## State Management (Zustand Store)

### useAuth Store
**Location**: `src/store/auth.store.jsx`

**State**:
- `user`: Current logged-in user object (FacultyID, FirstName, LastName, Email, Role, token)
- `isLoading`: Loading state during auth checks
- `error`: Error message from auth operations

**Actions**:
- `login(email, password)`: Authenticate user
- `signup(userData)`: Register new faculty
- `logout()`: Logout and clear session
- `updateUser(userData)`: Update user info in store
- `checkAuth()`: Check if user is already logged in (runs on app load)
- `clearError()`: Clear error message

**Persistence**: Uses localStorage for token and user data

---

## API Services

### Service Layer (`src/services/api.js`)

**Endpoints Consumed**:

#### Auth Endpoints
- `POST /auth/login` - Login
- `POST /auth/signup` - Register
- `POST /auth/logout` - Logout

#### Faculty Endpoints
- `GET /faculty/getfaculty` - Get current user profile
- `PUT /faculty/updatefaculty` - Update profile
- `GET /faculty/:id` - Get faculty by ID
- `GET /faculty/all` - Get all faculty members

#### Research Endpoints
- `GET /faculty/research/:facultyId` - List projects
- `POST /faculty/research/:facultyId` - Add project
- `PUT /faculty/research/:projectId` - Update project
- `DELETE /faculty/research/:projectId` - Delete project

#### Publication Endpoints
- `GET /faculty/publication/:facultyId` - List publications
- `POST /faculty/publication/:facultyId` - Add publication
- `PUT /faculty/publication/:publicationId` - Update publication
- `DELETE /faculty/publication/:publicationId` - Delete publication

#### Teaching Endpoints
- `GET /faculty/teaching[/:facultyId]` - List teaching experience
- `POST /faculty/teaching` - Add teaching experience
- `PUT /faculty/teaching/:experienceId` - Update experience
- `DELETE /faculty/teaching/:experienceId` - Delete experience

#### Events Endpoints
- `GET /faculty/events/:facultyId` - List events
- `POST /faculty/events` - Add event
- `PUT /faculty/events/:eventId` - Update event
- `DELETE /faculty/events/:eventId` - Delete event

#### Outreach Endpoints
- `GET /faculty/outreach/:facultyId` - List activities
- `POST /faculty/outreach` - Add activity
- `PUT /faculty/outreach/:activityId` - Update activity
- `DELETE /faculty/outreach/:activityId` - Delete activity

#### Awards & Recognition
- `GET/POST /faculty/awards` - List/Add awards
- `PUT/DELETE /faculty/awards/:awardId` - Update/Delete award
- `GET/POST /faculty/qualifications` - List/Add qualifications
- `PUT/DELETE /faculty/qualifications/:qualificationId` - Update/Delete qualification

#### Subjects Endpoints
- `GET /faculty/subjects/:facultyId` - List subjects
- `POST /faculty/subjects` - Add subject
- `PUT /faculty/subjects/:subjectId` - Update subject
- `DELETE /faculty/subjects/:subjectId` - Delete subject

#### Admin Endpoints
- `GET /admin/pending` - Get pending faculty approvals
- `GET /admin/all-faculties` - Get all faculty
- `GET /admin/departments` - Get all departments
- `PUT /admin/approve/:facultyId` - Approve faculty
- `DELETE /admin/reject/:facultyId` - Reject faculty
- `POST /admin/departments` - Add department
- `DELETE /admin/departments/:departmentId` - Delete department

---

## Form Pages & Features

### Add/Edit Form Pages
Each form page follows a consistent pattern:

1. **Data Fetching** (on mount or for edit mode)
2. **Form State Management** (useState for form fields)
3. **Validation** (client-side validation before submission)
4. **Error Handling** (display errors to user)
5. **API Integration** (POST for new, PUT for edit)
6. **Success Handling** (redirect after successful save)

### Date Validation Features (RECENT ADDITIONS)

All form pages with dates include:
- **Realistic date constraints** (1900 - current year for historical data)
- **Start date < End date validation** (where applicable)
- **Future date prevention** (past activities cannot have future dates)
- **Age validation** (SignupPage requires age >= 18)
- **HTML5 constraints** (min/max attributes on date inputs)
- **JavaScript validation** (double-layer validation before submission)

**Validation Utility**: `src/utils/dateValidation.js`
- `isRealisticDate()` - Check date is within realistic bounds
- `isStartBeforeEnd()` - Ensure start date before end date
- `isNotFutureDate()` - Check date is not in future
- `isRealisticYear()` - Check year is realistic
- `isStartBeforeEndOrOngoing()` - Allow optional end dates

---

## Key Features

### 1. **Authentication System**
- Email/password login
- Faculty registration with approval workflow
- Password reset via email
- Token-based session management

### 2. **Faculty Dashboard**
- Quick stats (research, publications, awards, etc.)
- Quick links to add new records
- View all functionality

### 3. **Faculty Profile Management**
- Edit personal information
- View complete profile with all achievements
- Tabbed interface for different sections

### 4. **Research & Publications**
- Add/edit/delete research projects
- Add/edit/delete publications with type-specific details
- Add/edit/delete patents

### 5. **Teaching & Qualifications**
- Track teaching experience
- Manage subjects taught
- Record academic qualifications

### 6. **Awards & Recognition**
- Record awards received
- Track citation metrics
- Manage qualifications

### 7. **Outreach & Events**
- Track outreach activities
- Record events organized
- Manage community engagement

### 8. **Faculty Directory**
- Search faculty by name or other criteria
- Filter by department
- View faculty profiles
- Export functionality (CSV/PDF)

### 9. **Admin Dashboard**
- Approve/reject pending faculty registrations
- View all faculty members
- Manage departments
- View statistics

### 10. **Data Export**
- Export faculty directory to CSV
- Export to PDF format

---

## Styling & UI

- **Framework**: Tailwind CSS with utility-first approach
- **Color Scheme**: 
  - Primary: Indigo (#4f46e5)
  - Accent: Green (for add actions)
  - Secondary: Gray (text, backgrounds)
- **Responsive Design**: Mobile-first with breakpoints (md:, lg:)
- **Hover Effects**: Smooth transitions and scale transforms
- **Forms**: Consistent styling with FormInput component
- **Cards**: Shadow, border, and rounded corner styling

---

## Data Flow

```
User Interaction
    ↓
Component State Update
    ↓
Form Validation (client-side)
    ↓
API Call (axios)
    ↓
Backend Processing
    ↓
Response Handling
    ↓
State Update / Navigation
    ↓
UI Rerender
```

---

## Security Features

1. **Authentication**: Token-based auth stored in localStorage
2. **Protected Routes**: AuthGate component wraps protected pages
3. **Role-Based Access**: Admin pages require admin role
4. **CORS**: Configured with credentials
5. **Token Validation**: Checked on app initialization

---

## Error Handling

1. **Form Validation**: Client-side validation with error messages
2. **API Errors**: Catch and display backend error messages
3. **Network Errors**: Fallback messages for connection issues
4. **LoadingSpinner**: Show loading states during data fetching
5. **Error States**: Display error messages to users

---

## Performance Optimizations

1. **Code Splitting**: React Router lazy loading support
2. **Tailwind CSS**: Optimized CSS with PurgeCSS
3. **Image Optimization**: Avatar generation with initials
4. **Memoization**: Components optimized with React.memo where needed
5. **API Caching**: Some data cached in component state

---

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- HTML5 Date input support required
- ES6+ JavaScript features used

---

## Development Workflow

### Setup
```bash
npm install
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
```

### File Organization
- **Pages**: Organized by feature (Teaching/, Research/, etc.)
- **Components**: Shared, reusable components in components/
- **Services**: API interaction in services/
- **Store**: Global state in store/
- **Utils**: Helpers and utilities in utils/

---

## Recent Updates

### Date Validation System (Complete)
- Added comprehensive date validation across all forms
- `dateValidation.js` utility with 5 reusable functions
- HTML5 date constraints (min/max)
- JavaScript validation before submission
- Age >= 18 validation for SignupPage
- Error messages for all date constraint violations

### Toast Component (NEW)
- Provider-based toast notification system
- Display success/error messages to users

### Navigation Fixes
- `useNavigate()` hook properly integrated
- Back button and navigation working correctly

---

## Known Limitations

1. **Form Submission**: Some complex nested data (relationships) may need backend fixes
2. **Export**: Limited to CSV/PDF basic formats
3. **Search**: Basic search, no advanced filtering UI
4. **Validation**: Client-side only (server-side also needed for production)

---

## Future Enhancements

1. Add server-side validation for all forms
2. Implement advanced search/filter UI
3. Add real-time notifications
4. Implement data caching strategy
5. Add pagination for large datasets
6. Mobile app optimization
7. Accessibility (a11y) improvements

