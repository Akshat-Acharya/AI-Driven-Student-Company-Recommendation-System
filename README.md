# AI-Powered Student–Company Recruitment Recommendation Platform

An AI-assisted full-stack recruitment recommendation platform that intelligently connects students with company job opportunities using structured resume analysis, deterministic matching logic, and locally hosted Large Language Models.

Built with Next.js, TypeScript, Prisma ORM, Supabase PostgreSQL, LangChain, and Ollama-powered local LLMs.

---

## Overview

This project was built to simplify and improve the student recruitment workflow using AI-assisted automation while keeping the recommendation process transparent and explainable.

Instead of relying entirely on black-box AI scoring, the platform combines deterministic rule-based matching with LLM-powered reasoning and conversational assistance.

Students can upload resumes and receive structured analysis, skill extraction, skill-gap insights, and job recommendations.

Companies can post job requirements and receive ranked candidate recommendations based on technical compatibility, academic eligibility, experience alignment, and domain relevance.

The platform is designed as an academic implementation of an AI-assisted recruitment recommendation system without requiring expensive APIs or model training.

---

# Key Features

## Student Portal

* Secure student authentication
* Resume upload in PDF format
* AI-powered resume parsing
* Structured extraction of:

  * Technical skills
  * CGPA
  * Experience level
  * Projects
  * Domain focus
* Skill normalization and categorization
* Personalized skill-gap analysis
* AI chatbot support
* Recommended jobs dashboard

---

## Company Portal

* Secure company authentication
* Create and manage job postings
* Define:

  * Required skills
  * Preferred qualifications
  * Minimum CGPA
  * Job domain
* AI-powered skill normalization
* View ranked candidate recommendations
* Separate ranking for:

  * Applied candidates
  * Recommended non-applicant candidates

---

## AI Features

The AI layer is integrated using LangChain and locally hosted LLMs through Ollama.

### AI is used for:

* Resume parsing into structured JSON
* Skill normalization
* Skill categorization
* Match explanation generation
* Skill-gap analysis
* Conversational chatbot interactions

### AI is NOT used for:

* Final recommendation scoring
* Ranking computation

The recommendation score is deterministic and fully explainable.

---

# Intelligent Matching System

The platform implements a proactive two-sided matching approach.

Once both student profiles and company job postings exist, the backend matching engine computes compatibility scores between students and jobs.

## Matching Parameters

* Skill overlap
* Minimum CGPA eligibility
* Experience alignment
* Domain compatibility

## Final Match Score

* Score range: `0–100`
* Deterministic rule-based computation
* Transparent and explainable recommendations

---

# System Workflow

```text
Student Uploads Resume (PDF)
            ↓
Resume Text Extraction
            ↓
LangChain Processing Pipeline
            ↓
Local LLM via Ollama
            ↓
Structured JSON Extraction
            ↓
Skill Normalization & Categorization
            ↓
Supabase PostgreSQL Storage
            ↓
Deterministic Matching Engine
            ↓
Ranked Recommendations & Match Explanations
```

---

# Tech Stack

## Frontend

* Next.js
* TypeScript
* Tailwind CSS

---

## Backend

* Next.js API Routes
* Prisma ORM

---

## Database

* Supabase PostgreSQL

---

## AI / NLP

* LangChain (JavaScript)
* Ollama
* Mistral
* LLaMA3

---

## Authentication

* NextAuth.js
* Google OAuth

---

# Project Architecture

## Resume Processing Pipeline

1. Student uploads PDF resume
2. Resume text is extracted
3. LangChain sends prompts to local LLM
4. LLM generates structured JSON data
5. Skills are normalized and categorized
6. Processed data is stored in PostgreSQL

---

## Job Recommendation Flow

1. Company posts job requirements
2. Job skills are normalized using AI
3. Matching engine evaluates compatibility
4. Match score is computed
5. LLM generates explanation for recommendations
6. Ranked candidates displayed on dashboard

---

# Why Local LLMs?

This project uses locally hosted LLMs through Ollama instead of paid APIs.

Benefits:

* No API cost
* Full local execution
* Better privacy
* Faster experimentation
* Academic-project friendly
* Easy model switching

Supported Models:

* Mistral
* LLaMA3

---

# Folder Structure

```bash
app/
components/
lib/
prisma/
public/
utils/
types/
```

---

# Environment Variables

Create a `.env` file in the root directory.

```env
# Database
DATABASE_URL=
DIRECT_URL=

# Authentication
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Ollama
OLLAMA_BASE_URL=
MODEL_NAME=
```

---

# Installation & Setup

## Clone the Repository

```bash
git clone https://github.com/Akshat-Acharya/AI-Driven-Student-Company-Recommendation-System.git

cd AI-Driven-Student-Company-Recommendation-System
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

---

## Run Ollama Locally

Install Ollama and pull a model.

### Using Mistral

```bash
ollama pull mistral
```

### Using LLaMA3

```bash
ollama pull llama3
```

Start Ollama before running the application.

---

## Start Development Server

```bash
npm run dev
```

The application will run on:

```text
http://localhost:3000
```

---

# Example Use Cases

## For Students

* Upload resume for AI analysis
* View extracted technical skills
* Check skill-gap insights
* Receive matching job recommendations
* Interact with AI chatbot assistant

---

## For Companies

* Post technical job requirements
* View ranked candidate recommendations
* Discover strong candidates who did not apply
* Understand recommendation reasoning

---

# Core Highlights

* Full-stack AI-powered platform
* Deterministic explainable recommendation engine
* LangChain integration with local LLMs
* Real-world recruitment workflow simulation
* Resume intelligence pipeline
* Skill normalization system
* Two-sided recommendation architecture
* Modular and scalable backend design
* No paid AI APIs required

---

# Future Improvements

* Vector database integration
* Semantic search
* Real-time notifications
* Interview scheduling system
* Advanced analytics dashboard
* Real-time chat support
* Resume feedback scoring
* Multi-company collaboration
* AI interview preparation assistant

---

# Screenshots

Add project screenshots here.

Suggested screenshots:

* Student dashboard
* Company dashboard
* Resume parsing output
* Match recommendation page
* Chatbot interface
* Job posting workflow

---

# Demo

Add deployment/demo link here.

---

# Author

## Akshat Acharya

GitHub:

[https://github.com/Akshat-Acharya](https://github.com/Akshat-Acharya)

Project Repository:

[https://github.com/Akshat-Acharya/AI-Driven-Student-Company-Recommendation-System](https://github.com/Akshat-Acharya/AI-Driven-Student-Company-Recommendation-System)

---

# License

This project is built for educational and academic purposes.
