# AGENT_LOG.md

## AI Tools Used

- Cursor
- ChatGPT

## Development Process

1. Used Cursor to scaffold the initial project structure, frontend, backend, and basic functionality (I specified the frontend and backend technologies, and additionally requested the backend architecture to follow the MVC pattern).

2. Cursor generated the first version of two core features:
   - Task Decomposition
   - Status Update Generator

3. The initial Task Decomposition implementation had UX and logic issues, so I asked Cursor to regenerate parts of it and then manually improved the functionality and behavior.

4. Added an extra feature idea: voice-to-task generation, where users can dictate a task and AI generates a structured task from speech input.

5. Used ChatGPT to brainstorm and improve the UI/UX direction and overall application styling.

6. Continued refining layouts, interactions, and frontend behavior with Cursor after the initial AI-generated scaffolding.

7. Refactored frontend and backend code to improve structure, readability, and maintainability.

8. Refactored frontend data fetching to use TanStack Query with Cursor assistance, because the initial AI-generated implementation used plain backend requests without structured state management, improving scalability and maintainability for future project growth.

9. Replaced custom AI-generated icons with Lucide React icons to improve UI consistency and overall visual quality.

10. Used ChatGPT during development to quickly refresh Prisma and OpenAI API setup/configuration knowledge.

11. Manually tested and polished the final functionality and user flows after refactoring.
