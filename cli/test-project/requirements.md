# Task Manager SRS

## Description
A web-based task management application that helps users organize and track their daily tasks efficiently.

## Problem Statement
Users struggle to keep track of their daily tasks, leading to missed deadlines and reduced productivity. Existing solutions are either too complex or lack essential features.

## Success State
Users can easily create, organize, prioritize, and complete tasks, leading to improved productivity and reduced stress.

## Target Users

### Primary Persona: Busy Professional
- Age: 25-45
- Goals: Stay organized, meet deadlines, manage multiple projects
- Pain Points: Too many tools, task overload, forgetting important items

### Secondary Persona: Student
- Age: 18-25
- Goals: Track assignments, manage study schedule
- Pain Points: Procrastination, missing deadlines

## Functional Requirements

- Users can create new tasks with title and description
- Users can set due dates for tasks
- Users can mark tasks as complete
- Users can categorize tasks with labels/tags
- Users can filter tasks by status (todo, done)
- Users can search tasks by title
- Users can set task priority (high, medium, low)
- Users can delete tasks

## Non-Functional Requirements

- Page load time must be under 2 seconds
- Application must work on mobile devices
- User data must be encrypted at rest
- System must support 1000 concurrent users

## Tech Stack

- Frontend: React
- Backend: Node.js
- Database: PostgreSQL
- Language: TypeScript

## Constraints

- Must complete MVP in 4 sprints
- Budget limited to free tier services
- Single developer team

## Assumptions

- Users have internet access
- Users have modern web browsers
- Users have basic computer literacy

## Out of Scope

- Mobile native apps
- Team collaboration features
- Calendar integration
- Third-party integrations
