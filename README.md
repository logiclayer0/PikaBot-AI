# ⚡ PikaBot-AI — Intelligent Full-Stack AI Assistant

![PikaBot Banner](https://img.shields.io/badge/PikaBot--AI-Live%20Application-brightgreen?style=for-the-badge&logo=vercel)
![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React-646CFF?style=for-the-badge&logo=vite)
![Python](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python-3776AB?style=for-the-badge&logo=python)
![Deployment](https://img.shields.io/badge/Hosted%20On-Vercel%20%26%20Render-black?style=for-the-badge&logo=vercel)

> **PikaBot-AI** is a modern, high-performance conversational AI platform featuring real-time speech processing, Markdown rendering, session authentication, and seamless user interaction. Built with cutting-edge web technologies, it provides an ultra-responsive interface paired with powerful backend intelligence.

🌐 **Live Application:** [https://pika-bot-ai.vercel.app/](https://pika-bot-ai.vercel.app/)

---

## ✨ Features at a Glance

* 🧠 **Conversational Intelligence:** Powered by high-speed LLM inference, delivering accurate and context-aware responses instantly.
* 🎙️ **Voice Assistant Integrations (STT & TTS):**
  * **Speech-to-Text (Voice Input):** Live browser-native continuous speech recognition using Web Speech API.
  * **Text-to-Speech (Voice Output):** Dynamic speech synthesis with toggleable controls for immersive accessibility.
* 🔐 **Built-in Authentication:** Instant user login/registration modal with persistent token-based session memory.
* 📝 **Rich Content Rendering:** Full Markdown parsing support (including code blocks, tables, bold text, and bullet lists).
* 📋 **One-Click Clipboard Copying:** Effortlessly copy generated code snippets or bot responses with a single click.
* 🎨 **Sleek & Cyberpunk Theme:** Polished user interface built with modern CSS animations, glowing accents, and high-contrast dark mode support.
* ⚡ **Lightning Fast:** Frontend optimized with Vite for microsecond HMR and instant page loads.

---

## 🏗️ Architecture & Tech Stack

```text
┌─────────────────────────────────────────┐
│              PikaBot-AI                 │
├────────────────────┬────────────────────┤
│      Frontend      │      Backend       │
│  (Hosted on Vercel)│  (Hosted on Render)│
├────────────────────┼────────────────────┤
│ • React / Vite     │ • FastAPI / Python │
│ • Axios / Web API  │ • SQLite DB        │
│ • React-Markdown   │ • RESTful APIs     │
└────────────────────┴────────────────────┘
