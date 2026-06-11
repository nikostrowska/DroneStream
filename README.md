# 🚁 DroneStream

> Real-time drone fleet monitoring and management platform.

## 📖 Overview

DroneStream is a web application for real-time monitoring and management of drone fleets.
It streams live video feeds, collects telemetry data, and visualizes drone positions on an interactive map,
all simultaneously across multiple devices.

## ✨ Features

- **Live video streaming** from drones via mediamtx
- **Telemetry ingestion** from `.srt` data packets sent by drones
- **Interactive map** showing real-time drone positions (OpenLayers)
- **Parallel monitoring** of multiple drones at once
- **Real-time communication** via SignalR (WebSocket)
- **Message broker** integration via EMQX (MQTT)

## 🖼️ UI Preview

![UI Mockup](img/ui_preview.png)

## 🛠️ Tech Stack

- .NET 10
- SignalR
- React
- TypeScript
- Vite
- OpenLayers
- mediamtx
- EMQX (MQTT broker)
- Docker

## 🔧 Requirements

[Docker](https://www.docker.com/) & Docker Compose

## 🚀 Getting Started

```bash
git clone https://github.com/nikostrowska/DroneStream.git
docker compose up
```

## 📁 Project Structure

```
DroneStream/
├── backend/                    # ASP.NET Core API
│   ├── Controllers/            # HTTP endpoints
│   ├── Data/                   # Database context
│   ├── DTOs/                   # Data transfer objects
│   ├── Hubs/                   # SignalR (WebSocket)
│   ├── Models/                 # Domain models
│   ├── Repositories/           # Data access layer
│   ├── Services/               # Business logic
│   ├── Workers/                # MQTT broker handlers
│   ├── Program.cs              # Application entry point
│   └── Dockerfile
├── frontend/                   # React + Vite + TypeScript
│   ├── src/
│   │   ├── assets/             # Static resources
│   │   ├── components/         # UI components
│   │   ├── pages/              # Views / pages
│   │   └── types/              # TypeScript types
│   ├── index.html
│   └── Dockerfile
├── mediamtx/                   # Video streaming server
│   └── Dockerfile
├── img/                        # Mockups and graphic assets
├── docker-compose.yml          # Container orchestration
└── .gitignore
```

## 👥 Authors

- [Vladys Berezhnyi](https://github.com/WladekBBC)
- [Krystian Czajkowski](https://github.com/krystianczajkowski)
- [Piotr Piotrowski](https://github.com/piotrusio02)
- [Nikola Ostrowska](https://github.com/nikostrowska)
- [Marcin Bendyk](https://github.com/marcinbendyk)
