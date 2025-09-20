-----

````markdown

# Mindspace App

Mindspace is a modern web application designed to help users track their mental well-being, analyze mood trends, engage with a supportive community, and maintain a personal journal. Built with Next.js, TypeScript, and Supabase, Mindspace offers a seamless experience for self-reflection and growth.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- **Dashboard**: Visualize your mood trends and statistics with interactive charts.
- **Journal**: Write daily entries, reflect, and review your progress.
- **Community**: Share posts, interact with others, and find support.
- **Analysis**: Get AI-powered sentiment analysis of your journal entries.
- **Live Chat**: Communicate in real time with online users.
- **Authentication**: Secure login and registration flows.

## Tech Stack
- **Frontend**: Next.js, React, TypeScript
- **Styling**: CSS Modules, PostCSS
- **Backend**: Supabase (for authentication and database)
- **AI**: Custom sentiment analysis utilities
- **Linting**: ESLint

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- Supabase account (for backend services)

### Installation
1. Clone the repository:
  ```bash
  git clone https://github.com/AdiTailor/DH5_Zephyr_Hackathon.git
  cd DH5_Zephyr_Hackathon/mindspace-app
  ```
2. Install dependencies:
  ```bash
  npm install
  # or
  yarn install
  ```
3. Set up environment variables:
  - Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials and other secrets.

4. Run the development server:
  ```bash
  npm run dev
  # or
  yarn dev
  ```
  The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure
```
mindspace-app/
├── app/                # Next.js app directory (routing, pages)
│   ├── dashboard/      # Dashboard charts and stats
│   ├── journal/        # Journal entry pages
│   ├── community/      # Community posts and actions
│   └── chat/           # Live chat feature
├── components/         # Reusable React components
│   ├── features/       # Feature-specific components
│   └── shared/         # Shared UI elements
├── lib/                # Utility functions and API clients
│   ├── ai/             # Sentiment analysis logic
│   └── supabase/       # Supabase client/server helpers
├── public/             # Static assets
├── styles/             # Global styles
├── package.json        # Project metadata and scripts
└── ...
```

## Environment Variables
Create a `.env.local` file in the `mindspace-app` directory. Example:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
Refer to Supabase docs for details on obtaining these keys.

## Scripts
- `dev`: Start the development server
- `build`: Build the app for production
- `start`: Start the production server
- `lint`: Run ESLint

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Open a pull request

## License
This project is licensed under the MIT License.

---

For questions or feedback, feel free to open an issue or reach out to the maintainers.

### 1. Clone the Repository

First, get the code onto your machine.

```bash
git clone <repository-url>
cd mindspace-app
````

### 2\. Install Dependencies

This will install all the necessary packages.

```bash
npm install
```

### 3\. Set Up Environment Variables (CRITICAL)

The project needs to connect to our Supabase backend.

1.  Ask the team member who set up the Supabase project to share two secret keys: the **Project URL** and the **`anon` public key**.
2.  In the root of the project, create a new file named `.env.local`.
3.  Copy the following into that file and paste the shared keys:

<!-- end list -->

```env
NEXT_PUBLIC_SUPABASE_URL='https://kxlaxuwzrrfzrgwmxcsi.supabase.co'
NEXT_PUBLIC_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bGF4dXd6cnJmenJnd214Y3NpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMDQ0NTgsImV4cCI6MjA3Mzg4MDQ1OH0.tuwyWyNudZzptWh3_CO6YEQUxKsnjbDYUoSKBPwP4H0'
```

**Note:** The app will not start without this file.

### 4\. Run the Development Server

You're all set\! Run this command to start the app.

```bash
npm run dev
```

The application should now be running at `http://localhost:3000`.

-----

```
```
