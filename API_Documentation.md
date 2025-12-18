1️⃣ Boards
Create Board

Method: POST

Endpoint: /boards

Request Body:

{
  "name": "Project A"
}


Response:

{
  "id": "board-uuid",
  "name": "Project A",
  "owner_id": "profile-uuid",
  "created_at": "2025-12-18T20:00:00Z"
}

Get My Boards

Method: GET

Endpoint: /boards

Response:

[
  {
    "id": "board-uuid",
    "name": "Project A",
    "owner_id": "profile-uuid",
    "created_at": "2025-12-18T20:00:00Z"
  },
  {
    "id": "board-uuid-2",
    "name": "Project B",
    "owner_id": "profile-uuid",
    "created_at": "2025-12-17T15:30:00Z"
  }
]

Invite Member

Method: POST

Endpoint: /boards/:boardId/members

Request Body:

{
  "email": "member@example.com"
}


Response:

{
  "id": "board-member-uuid",
  "board_id": "board-uuid",
  "user_id": "profile-uuid", 
  "role": "member",
  "joined_at": "2025-12-18T20:05:00Z"
}

Get Board Members

Method: GET

Endpoint: /boards/:boardId/members

Response:

[
  {
    "id": "profile-uuid",
    "email": "member@example.com",
    "name": "Jane Doe",
    "role": "member"
  }
]

Update Board

Method: PATCH

Endpoint: /boards/:boardId

Request Body:

{
  "name": "New Project Name"
}


Response:

{
  "id": "board-uuid",
  "name": "New Project Name",
  "updated_at": "2025-12-18T20:15:00Z"
}

Delete Board

Method: DELETE

Endpoint: /boards/:boardId

Response:

{
  "success": true
}

2️⃣ Columns
Create Column

Method: POST

Endpoint: /boards/:boardId/columns

Request Body:

{
  "name": "Todo"
}


Response:

{
  "id": "column-uuid",
  "board_id": "board-uuid",
  "name": "Todo",
  "created_at": "2025-12-18T20:10:00Z"
}

Get Columns

Method: GET

Endpoint: /boards/:boardId/columns

Response:

[
  {
    "id": "column-uuid",
    "board_id": "board-uuid",
    "name": "Todo"
  }
]

Update Column

Method: PATCH

Endpoint: /columns/:columnId

Request Body:

{
  "name": "In Progress"
}


Response:

{
  "id": "column-uuid",
  "board_id": "board-uuid",
  "name": "In Progress",
  "updated_at": "2025-12-18T20:15:00Z"
}

Delete Column

Method: DELETE

Endpoint: /columns/:columnId

Response:

{
  "success": true
}

3️⃣ Tasks
Create Task

Method: POST

Endpoint: /columns/:columnId/tasks

Request Body:

{
  "title": "Fix login bug",
  "description": "Fix issue with login flow"
}


Response:

{
  "id": "task-uuid",
  "column_id": "column-uuid",
  "title": "Fix login bug",
  "description": "Fix issue with login flow",
  "created_at": "2025-12-18T20:20:00Z"
}

Get Tasks by Column

Method: GET

Endpoint: /columns/:columnId/tasks

Response:

[
  {
    "id": "task-uuid",
    "column_id": "column-uuid",
    "title": "Fix login bug",
    "description": "Fix issue with login flow"
  }
]

Update Task

Method: PATCH

Endpoint: /tasks/:taskId

Request Body:

{
  "title": "Fix auth bug"
}


Response:

{
  "id": "task-uuid",
  "column_id": "column-uuid",
  "title": "Fix auth bug",
  "description": "Fix issue with login flow"
  "updated_at": "2025-12-18T20:25:00Z"
}

Delete Task

Method: DELETE

Endpoint: /tasks/:taskId

Response:

{
  "success": true
}

Assign Task

Method: POST

Endpoint: /tasks/:taskId/assignees

Request Body:

{
  "user_id": "profile-uuid"
}


Response:

{
  "id": "task-assignee-uuid",
  "task_id": "task-uuid",
  "user_id": "profile-uuid",
  "assigned_at": "2025-12-18T20:35:00Z"
}

4️⃣ Health Check

Method: GET

Endpoint: /health

Response:

{
  "status": "ok"
}
