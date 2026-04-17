# Cargo2View

Cargo2View is a desktop application for automated analysis of Git repositories with visualization of key project structure metrics, development activity, and codebase quality indicators.

The application is built using a hybrid architecture:

- Rust backend
- TypeScript frontend
- Tauri for cross-platform desktop delivery

## Features

Cargo2View allows users to:

- clone remote Git repositories
- analyze project structure
- compute statistical code metrics
- visualize programming language distribution
- analyze contributor activity
- save analysis snapshots
- reload saved snapshots
- delete snapshots

## Tech Stack

Backend:

- Rust
- Tauri
- Git CLI

Frontend:

- React
- TypeScript
- Zustand
- shadcn/ui
- Recharts
- Lucide Icons

## Architecture Overview

The application follows a layered responsibility separation between frontend and backend.

Rust backend modules:

- `git` — repository cloning
- `analysis` — metrics computation
- `services` — business logic and snapshot processing
- `commands` — Tauri command interface for frontend communication

Frontend responsibilities:

- metrics visualization
- global state management with Zustand
- communication with backend via Tauri API

## Collected Metrics

Cargo2View analyzes:

- number of files
- lines of code
- repository size
- number of commits
- number of branches
- number of contributors
- language distribution
- average file size
- average commit size
- commit frequency

## Getting Started

Install dependencies:

```bash
npm install
curl https://sh.rustup.rs -sSf | sh
rustc --version
```

## Tauri system dependencies (Linux only)

Arch
```bash
sudo pacman -S base-devel webkit2gtk gtk3
```
Ubuntu / Debian
```bash
sudo apt install build-essential \
libwebkit2gtk-4.1-dev \
libgtk-3-dev \
libayatana-appindicator3-dev \
librsvg2-dev
```
