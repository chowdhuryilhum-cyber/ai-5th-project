# AutoFinder AI - Used Car Search

A premium, full-stack web application that allows users to search for used car deals using an AI chat interface powered by Gemini AI.

## Project Structure

- `frontend/` - Contains the HTML, CSS, and vanilla JS for the UI.
- `backend/` - Contains the Node.js/Express server and the mock car database.
- `backend/api/` - Contains the backend endpoint that integrates with Gemini AI.
- `vercel.json` - Configuration for seamless deployment on Vercel.

## Local Development Setup

To run this application locally, you'll need [Node.js](https://nodejs.org/) installed on your machine.

1. **Install Dependencies**
   Navigate to the root directory and install the necessary packages:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=5000
   ```
   *(Note: Without the API key, the backend will fall back to a basic keyword-matching algorithm for demonstration purposes).*

3. **Run the Server**
   Start the Express server:
   ```bash
   npm start
   ```

4. **Access the App**
   Open your browser and navigate to `http://localhost:5000`. You can now chat with the AI!

## How to Push to GitHub

1. Initialize a Git repository in the root folder:
   ```bash
   git init
   ```
2. Create a `.gitignore` file to avoid committing node modules:
   ```bash
   echo "node_modules/" > .gitignore
   echo ".env" >> .gitignore
   ```
3. Add all files and commit:
   ```bash
   git add .
   git commit -m "Initial commit: AI Car Search App"
   ```
4. Create a new repository on [GitHub](https://github.com/).
5. Link your local repo to GitHub and push:
   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

## How to Deploy on Vercel

This repository is pre-configured to be deployed as a full-stack application on Vercel. Vercel will host the `frontend` folder as a static site and convert the Express backend into Serverless Functions using the `vercel.json` file.

1. Create an account on [Vercel](https://vercel.com/) and link it to your GitHub account.
2. Click **Add New Project**.
3. Import your newly created GitHub repository.
4. **Important Configuration**:
   - In the **Environment Variables** section, add your `GEMINI_API_KEY`.
5. Click **Deploy**. Vercel will automatically detect the configuration and build your site.
6. Once completed, Vercel will provide you with a live URL to access your web app.
