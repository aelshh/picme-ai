# 🎨 PicMe AI

PicMe AI is an AI-powered image generation platform where users can create images from prompts and train their own custom models using their personal datasets. Built with Next.js, Supabase, and Replicate, it enables personalized LoRA-based model training and inference with full support for credits, subscription, and webhook-driven workflows.

---

## 📑 Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Image Generation Parameters](#image-generation-parameters)
- [Model Training](#model-training)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Deployment](#deployment)
- [License](#license)
- [Contributing](#contributing)

---

## 🔗 Demo

**Live Site:** [https://picme-ai.vercel.app](https://picme-ai.vercel.app)  


---

## ✨ Features

- 🎨 Generate images via prompts using LoRA fine-tuned models
- 🧠 Train custom image generation models using your own images
- ⚙️ Configure output with parameters like:
  - Model name
  - Image type
  - Aspect ratio
  - Number of outputs
  - Output quality and format
- 🔐 User authentication via Supabase
- 💳 Subscription and credit-based access system powered by Stripe
- 🔁 Real-time webhooks for training and payment events
- 🌘 Modern UI with dark mode, built using shadcn/ui

---

## 🛠 Tech Stack

| Layer         | Technology                              |
|---------------|------------------------------------------|
| **Frontend**  | React, Next.js, Tailwind CSS, shadcn/ui |
| **Backend**   | Node.js, Supabase (PostgreSQL)          |
| **AI/ML**     | Replicate API (LoRA model support)      |
| **Auth**      | Supabase Auth                           |
| **Payments**  | Stripe (Subscriptions, Webhooks)        |
| **Hosting**   | Vercel                                   |

---

## 🧾 Image Generation Parameters

Users can customize image generation with the following options:

- `prompt` – main input for generation
- `model` – selected LoRA model
- `imageType` – artistic, photo-realistic, etc.
- `aspectRatio` – e.g., 1:1, 16:9
- `numOutputs` – number of images to generate
- `quality` – low, medium, high
- `format` – PNG, JPG, etc.

---

## 🧠 Model Training

Users can upload their own images to train personalized LoRA models on Replicate.

- Training is triggered via `/api/webhooks/train`
- LoRA models are automatically tracked and linked to the user
- Status and results are updated via webhook events

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/picme-ai.git
cd picme-ai

# Install dependencies
npm install

# Create and configure your .env file (see below)

# Run development server
npm run dev
