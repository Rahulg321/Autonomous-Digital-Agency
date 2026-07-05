# AI Agency Platform — Project Plan

## Vision

Build an autonomous AI-powered agency that discovers businesses with high website improvement potential, researches them, generates high-converting websites automatically, deploys them to preview environments, and creates personalized outreach packages that convert those businesses into paying clients.

The long-term vision is not simply to build an AI website generator.

The goal is to build an **AI Agency Operating System**.

Initially, the system will be used internally to operate a one-person agency. Once the entire pipeline is proven and optimized, the platform can evolve into a SaaS product for agencies and freelancers.

---

# Long-Term Roadmap

## Phase 1 — Build Internal Agency

Become the first customer.

Use the platform manually.

- Discover businesses
- Score businesses
- Generate websites
- Deploy previews
- Send outreach
- Close customers

The objective is validating the entire workflow.

---

## Phase 2 — Scale the Agency

Automate repetitive work while keeping human approval where necessary.

Handle significantly more clients without hiring additional developers.

The AI becomes the production team.

---

## Phase 3 — Productize the Platform

Turn the internal agency software into a commercial platform.

Potential customers:

- Web design agencies
- Marketing agencies
- SEO agencies
- Freelancers
- Consultants

The product becomes an autonomous agency operating system.

---

# Guiding Principles

Every component should:

- Have clearly defined inputs.
- Have clearly defined outputs.
- Be independently testable.
- Be independently improvable.
- Not depend on orchestration.
- Eventually expose a reusable API.

The orchestrator is intentionally postponed until each component reaches production quality.

---

# Overall Pipeline

```
Lead Discovery

↓

Business Qualification

↓

Website Audit

↓

Opportunity Scoring

↓

Website Brief Generation

↓

Website Generation

↓

Deployment

↓

Quality Evaluation

↓

Outreach Packet Generation

↓

Human Approval

↓

Customer Acquisition
```

---

# Component 1 — Lead Discovery

## Goal

Find local businesses with high potential.

## Input

Industry

Location

Search parameters

## Responsibilities

- Search business listings
- Collect business information
- Gather reviews
- Gather ratings
- Detect website existence
- Store businesses

## Output

Business profile.

---

# Component 2 — Business Qualification

## Goal

Determine whether the business is worth pursuing.

## Inputs

Business information
Reviews

Ratings

Metadata

## Output

Opportunity score (0–100)

Reasoning

Recommendations

Example:

- Excellent reviews
- High reputation
- Poor website
- High conversion potential

---

# Component 3 — Website Audit

## Goal

Analyze existing websites.

## Inputs

Website URL

## Responsibilities

Technical analysis

- Performance
- Accessibility
- SEO
- Mobile responsiveness
- Security
- Broken links

AI analysis

- Design quality
- Trust
- Content quality
- CTA effectiveness
- Visual hierarchy
- Conversion optimization

## Output

Audit report

Website score

Improvement recommendations

---

# Component 4 — Website Brief Generator

## Goal

Generate a complete website specification before any code is written.

Inputs:

- Business
- Reviews
- Services
- Website audit
- Opportunity score

Outputs:

- Site architecture
- Page structure
- Navigation
- Component list
- Copy direction
- SEO strategy
- Structured data
- Design language
- Color palette
- Typography
- Calls to action
- Conversion strategy

This becomes the single source of truth for the coding agent.

---

# Component 5 — Website Generation Engine

(Currently Under Development)

## Goal

Generate a production-ready TanStack Start website from a website brief.

## Stack

- Flue Framework
- Cloudflare Sandboxes
- TanStack Start
- Tailwind CSS
- Component Library
- Cloudflare Deployment APIs

## Flow

Receive Website Brief

↓

Clone starter repository

↓

Load relevant skills

↓

Modify project

↓

Run build

↓

Fix compilation errors

↓

Deploy

↓

Return preview URL

---

# Component 6 — Starter Template Repository

The coding agent should never start from an empty project.

Instead, maintain a reusable repository containing:

- TanStack Start
- Tailwind
- Shared components
- Design system
- Layouts
- Utilities
- Deployment configuration
- Project conventions

The coding agent customizes this repository rather than generating everything from scratch.

---

# Component 7 — Skills & Knowledge

The coding agent's knowledge base lives inside the starter repository.

Example structure:

```
.flue/

skills/

    industries/
        plumber.md
        hvac.md
        electrician.md
        dentist.md
        lawyer.md

    frameworks/
        tanstack-start.md
        cloudflare.md
        react.md

    design/
        accessibility.md
        seo.md
        performance.md
        responsive.md

    business/
        conversion.md
        landing-pages.md
        local-business.md
```

Skills contain reusable expertise.

Examples:

- Industry best practices
- UX recommendations
- SEO guidance
- Accessibility rules
- Design patterns
- Copywriting guidance
- Framework conventions

Skills should be:

- Small
- Composable
- Reusable

The coding agent loads only the skills relevant to the current project.

---

# Component 8 — Deployment Engine

Goal:

Automatically deploy generated websites.

Responsibilities:

- Build project
- Deploy
- Generate preview URL
- Store deployment metadata
- Maintain version history

Each deployment becomes a preview.

Future improvements can generate additional deployments, preserving history similar to modern AI coding tools.

---

# Component 9 — Website Evaluation

Every generated website should be evaluated.

Metrics:

- Performance
- Accessibility
- SEO
- Visual quality
- Copywriting
- Conversion readiness
- Mobile experience

The evaluation engine creates feedback that continuously improves the generator.

---

# Component 10 — Outreach Packet Generator

Generate personalized sales material.

Input:

- Business
- Website audit
- Opportunity score
- Generated preview
- Website brief

Outputs:

- Personalized email
- Proposal
- Before/after comparison
- ROI summary
- Screenshots
- Preview link
- Talking points

Goal:

Make outreach personalized rather than generic cold emailing.

---

# Business Knowledge

Not all knowledge belongs inside the coding repository.

Business-level knowledge should live separately.

Examples:

- Lead history
- Conversion rates
- Successful industries
- Website performance
- Outreach statistics
- Prompt versions
- Customer feedback

This information should improve future qualification and generation.

---

# Future Orchestration

The orchestrator will be built only after every component is independently production-ready.

Possible orchestration responsibilities:

- Scheduling
- Workflow execution
- Retries
- Human approval
- Parallel execution
- Monitoring
- Logging

The orchestrator should coordinate components, not contain business logic.

---

# Initial Technology Stack

## AI

- Vercel AI SDK

Used for:

- Reasoning
- Structured outputs
- Business analysis
- Brief generation
- Outreach generation

---

## Coding Agent

- Flue Framework

Used for:

- Autonomous coding
- File editing
- Tool usage
- Build loops
- Error correction
- Sandboxed execution

---

## Infrastructure

Cloudflare

- Sandboxes
- Workflows
- Workers
- Deployment APIs
- R2
- KV
- Durable Objects (future if required)

---

## Frontend

- TanStack Start
- Tailwind CSS
- Shared component library

---

## Database

Relational database for:

- Businesses
- Audits
- Briefs
- Scores
- Deployments
- Outreach
- Analytics

---

# Success Metrics

The platform should continuously improve measurable outcomes.

Examples:

Lead Quality

- Qualification accuracy
- Conversion potential

Website Quality

- Lighthouse score
- Accessibility
- SEO
- Conversion readiness

Business Metrics

- Reply rate
- Meeting rate
- Customer conversion
- Revenue generated

---

# Immediate Milestone

Build the Website Generation Engine.

Objectives:

- Accept a website brief.
- Clone the starter repository.
- Load appropriate skills.
- Modify the project.
- Build successfully.
- Fix compilation issues automatically.
- Deploy to Cloudflare.
- Return a preview URL.

This component becomes the foundation upon which the remaining platform will be built.

---

# End Goal

Build an autonomous AI agency capable of discovering businesses, evaluating opportunities, generating conversion-focused websites, deploying production-ready previews, creating personalized outreach campaigns, and enabling a single operator to scale like an entire digital agency.

Once validated through real customer acquisition, evolve the platform into a commercial AI Agency Operating System for agencies and freelancers.
