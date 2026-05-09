# Technical Architecture Plan

## 1. Engine Recommendation

For a "premium indie-game" with high-quality stylized 3D graphics, smooth animations, and robust multiplayer networking, **Unity (Universal Render Pipeline - URP)** or **Unreal Engine 5 (Stylized settings)** are the best choices. 

*   **Primary Recommendation: Unity (URP)**
    *   *Why:* Excellent for stylized, cartoon-proportioned voxel aesthetics. The URP allows for deep customization of shaders (essential for magical particles and soft lighting) while remaining highly performant across PC and Consoles.
    *   *Alternative:* **Godot 4.x** (Excellent for clean architecture and rapid UI development, though 3D networking requires slightly more custom boilerplate).

## 2. Multiplayer Architecture

To achieve the frictionless "Join Code" system and handle up to 4-player Co-op without dedicated server costs for a sandbox game:

*   **Topology:** Client-Hosted (Listen Server) model via Relay.
*   **Networking Solution:** 
    *   If Unity: **Unity Relay + Netcode for GameObjects (NGO)** or **Photon Fusion**.
    *   How it works: Player A hosts the game. The networking service generates a Relay Code (the Join Code). Players B, C, and D connect through the relay, bypassing NAT punch-through issues.
*   **Authority:** Host has state authority over the world, enemy AI, and mission progression. Clients have predictive authority over their own movement and pet commands to ensure a snappy, lag-free feel.

## 3. Save System

The save system must be robust, modular, and decoupled from the engine's built-in serializations to prevent data corruption between patches.

*   **Format:** JSON for human-readability during development, compressed to binary for release.
*   **Structure:**
    *   `WorldData.json`: Stores modified voxel chunks, placed buildings, and world state.
    *   `PlayerData_<ID>.json`: Stores inventory, unlocked skills, and equipped items.
    *   `PetData_<ID>.json`: Stores pet XP, loyalty, unlocked abilities, and customization.
*   **Architecture:** Save data is loaded into pure C# classes (Data Transfer Objects) and then injected into the Monobehaviours/GameObjects.

## 4. Asset & Folder Structure

A clean, production-ready project requires strict folder organization. Do not use generic, messy roots.

```text
/Assets
  /Core
    /Scripts        # Architecture, Singletons, Managers
    /Networking     # Relay logic, sync variables
  /Features
    /Pets           # Scripts, Prefabs, Animations specific to pets
    /Building       # Voxel placement logic, grid math
    /Combat         # Damage calculations, hitboxes
  /Art
    /Models         # Voxels, Characters, Pets
    /Materials      # URP Shaders, Textures
    /UI             # Menus, Icons, Fonts (Inter/Outfit)
  /Scenes
    /Boot           # Initialization
    /MainMenu
    /Chapter1_Forest
```

## 5. Modular World Generation

While Chapter 1 contains handcrafted points of interest (Spawn Village, Boss Arena), the spaces between them should utilize a modular system.

*   **Chunk System:** The world is divided into manageable chunks (e.g., 32x32 voxels).
*   **Procedural Spawning:** Foliage, basic enemy spawns, and minor resource nodes are generated using a seeded noise function at runtime to reduce file size and keep the world feeling fresh.
*   **Object Pooling:** Crucial for voxel building and projectiles. Never `Instantiate` or `Destroy` frequently; instead, pull blocks and effects from a pre-warmed memory pool.

## 6. Optimization Strategy

*   **Voxel Meshing:** Instead of rendering thousands of individual blocks, implement a greedy meshing algorithm that combines adjacent voxel faces into a single mesh. This drastically reduces draw calls.
*   **LODs (Level of Detail):** Pets and trees drop in polygon count when far away.
*   **UI Canvas:** Split the AAA UI into multiple canvases. The Minimap updates frequently, so it should be on a separate canvas from the static Main Menu to prevent unnecessary UI rebuilds.
