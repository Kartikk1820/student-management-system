# Student Management System API Documentation

## Admin Endpoints

### 1. Create Course Without Teacher

- **URL**: `POST /api/admin/courses`
- **Description**: Admin creates a course without assigning a teacher initially
- **Authentication**: Required (Admin role)
- **Body**:
  ```json
  {
    "name": "Course Name",
    "duration": 60,
    "description": "Course description",
    "start_date": "2024-01-15",
    "end_date": "2024-06-15"
  }
  ```
- **Response**: Created course without teacher

### 2. Promote Student to Teacher

- **URL**: `POST /api/admin/promote-student`
- **Description**: Admin promotes a student to teacher role and assigns them to a course
- **Authentication**: Required (Admin role)
- **Body**:
  ```json
  {
    "student_id": "uuid-of-student",
    "course_id": "uuid-of-course"
  }
  ```
- **Response**: Updated user and course information

### 3. Assign Course to Teacher

- **URL**: `POST /api/admin/assign-course`
- **Description**: Admin assigns an existing course to a teacher
- **Authentication**: Required (Admin role)
- **Body**:
  ```json
  {
    "course_id": "uuid-of-course",
    "teacher_id": "uuid-of-teacher"
  }
  ```
- **Response**: Updated course with teacher assignment

### 4. Get All Students

- **URL**: `GET /api/admin/students`
- **Description**: Admin gets list of all students for selection
- **Authentication**: Required (Admin role)
- **Response**: List of all students

### 5. Get Unassigned Courses

- **URL**: `GET /api/admin/unassigned-courses`
- **Description**: Admin gets list of courses without teachers
- **Authentication**: Required (Admin role)
- **Response**: List of unassigned courses

### 6. Get All Teachers

- **URL**: `GET /api/admin/teachers`
- **Description**: Admin gets list of all teachers
- **Authentication**: Required (Admin role)
- **Response**: List of all teachers (id, name, email, role, created_at)

## Course Endpoints

### 1. Get All Courses

- **URL**: `GET /api/courses`
- **Description**: Retrieve all available courses
- **Authentication**: Not required
- **Response**: List of all courses with teacher information

### 2. Get Course by ID

- **URL**: `GET /api/courses/:id`
- **Description**: Retrieve a specific course by its ID
- **Authentication**: Not required
- **Response**: Course details with teacher information

### 3. Get Enrolled Courses (Student)

- **URL**: `GET /api/courses/enrolled/my`
- **Description**: Get all courses that the authenticated student is enrolled in
- **Authentication**: Required (Student role)
- **Response**: List of enrolled courses

### 4. Get Teacher Courses (Teacher)

- **URL**: `GET /api/courses/teacher/my`
- **Description**: Get all courses that the authenticated teacher teaches
- **Authentication**: Required (Teacher role)
- **Response**: List of courses taught by the teacher with enrolled student count

## Enrollment Endpoints

### 1. Send Enrollment Request

- **URL**: `POST /api/enrollments/request`
- **Description**: Student sends a request to enroll in a course
- **Authentication**: Required (Student role)
- **Body**:
  ```json
  {
    "course_id": "uuid-of-course"
  }
  ```
- **Response**: Created enrollment request

### 2. Get Student's Enrollment Requests

- **URL**: `GET /api/enrollments/my-requests`
- **Description**: Get all enrollment requests made by the authenticated student
- **Authentication**: Required (Student role)
- **Response**: List of student's enrollment requests

### 3. Get Teacher's Enrollment Requests

- **URL**: `GET /api/enrollments/teacher/requests`
- **Description**: Get all enrollment requests for courses taught by the authenticated teacher
- **Authentication**: Required (Teacher role)
- **Response**: List of enrollment requests for teacher's courses

### 4. Approve/Reject Enrollment Request

- **URL**: `PUT /api/enrollments/approve/:id`
- **Description**: Teacher approves or rejects an enrollment request
- **Authentication**: Required (Teacher role)
- **Body**:
  ```json
  {
    "is_approved": true
  }
  ```
- **Response**: Updated enrollment request

### 5. Get All Enrollment Requests (Admin)

- **URL**: `GET /api/enrollments/all`
- **Description**: Get all enrollment requests in the system
- **Authentication**: Required (Admin role)
- **Response**: List of all enrollment requests

## Attendance Endpoints

### 1. Mark Attendance (Teacher)

- **URL**: `POST /api/attendance/mark`
- **Description**: Teacher marks attendance for a student in a course
- **Authentication**: Required (Teacher role)
- **Body**:
  ```json
  {
    "course_id": "uuid-of-course",
    "student_id": "uuid-of-student",
    "date": "2024-01-15",
    "status": "present"
  }
  ```
- **Response**: Marked attendance record

### 2. Get Student's Own Attendance

- **URL**: `GET /api/attendance/my-attendance`
- **Description**: Student views their own attendance records
- **Authentication**: Required (Student role)
- **Response**: List of student's attendance records

### 3. Get Course Attendance (Teacher)

- **URL**: `GET /api/attendance/course/:courseId`
- **Description**: Teacher views attendance for all students in their course
- **Authentication**: Required (Teacher role)
- **Response**: List of attendance records for the course

### 4. Get Attendance by Date (Teacher)

- **URL**: `GET /api/attendance/course/:courseId/date/:date`
- **Description**: Teacher views attendance for a specific date in their course
- **Authentication**: Required (Teacher role)
- **Response**: List of attendance records for the specific date

### 5. Get Attendance Statistics (Student)

- **URL**: `GET /api/attendance/stats/:courseId`
- **Description**: Student views their attendance statistics for a specific course
- **Authentication**: Required (Student role)
- **Response**: Attendance statistics (total sessions, present count, absent count, percentage)

## Database Schema

### Users Table

- `id` (UUID, Primary Key)
- `name` (TEXT)
- `email` (TEXT, Unique)
- `password` (TEXT)
- `role` (TEXT: 'admin', 'teacher', 'student')
- `courses` (UUID[] - Array of course IDs)
- `created_at` (TIMESTAMP)

### Courses Table

- `id` (UUID, Primary Key)
- `name` (TEXT)
- `students` (UUID[] - Array of student IDs)
- `duration` (INTEGER)
- `description` (TEXT)
- `start_date` (DATE)
- `end_date` (DATE)
- `teacher` (UUID, Foreign Key to users.id, NULLABLE)
- `created_at` (TIMESTAMP)

### Enrollment Requests Table

- `id` (UUID, Primary Key)
- `teacher_id` (UUID, Foreign Key to users.id)
- `course_id` (UUID, Foreign Key to courses.id)
- `student_id` (UUID, Foreign Key to users.id)
- `is_approved` (BOOLEAN, Default: false)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Attendance Table

- `id` (UUID, Primary Key)
- `course_id` (UUID, Foreign Key to courses.id)
- `student_id` (UUID, Foreign Key to users.id)
- `date` (DATE)
- `status` (TEXT: 'present', 'absent')
- `created_at` (TIMESTAMP)
- **Unique Constraint**: (course_id, student_id, date)

## Usage Examples

### Admin creating and assigning courses:

1. Admin creates course without teacher: `POST /api/admin/courses`
2. Admin promotes student to teacher: `POST /api/admin/promote-student`
3. Admin assigns course to teacher: `POST /api/admin/assign-course`

### Student enrolling in a course:

1. Student sends POST request to `/api/enrollments/request` with course_id
2. Teacher receives notification and can approve/reject
3. If approved, student is automatically added to course.students array
4. Student can view enrolled courses at `/api/courses/enrolled/my`

### Teacher managing enrollments:

1. Teacher views pending requests at `/api/enrollments/teacher/requests`
2. Teacher approves/rejects using PUT `/api/enrollments/approve/:id`
3. Course enrollment is automatically updated based on decision

### Teacher marking attendance:

1. Teacher sends POST request to `/api/attendance/mark` with course_id, student_id, date, and status
2. System validates teacher owns the course
3. Attendance is recorded or updated if it already exists
4. Teacher can view attendance records at `/api/attendance/course/:courseId`

### Student viewing attendance:

1. Student can view their attendance at `/api/attendance/my-attendance`
2. Student can get statistics for specific courses at `/api/attendance/stats/:courseId`

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Success Responses

All successful endpoints return:

```json
{
  "success": true,
  "data": "Response data",
  "message": "Success message"
}
```
