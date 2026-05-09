# Gameplay & Multiplayer Architecture

## 1. Core Gameplay Loop

The gameplay in **Paws of Adventure** is designed to be highly rewarding, creating a satisfying cycle that balances cozy base building with exciting exploration.

**The Loop:**
1.  **Explore:** Venture out into uncharted biomes (e.g., The Lost Forest).
2.  **Rescue & Befriend:** Find trapped or wild pets, solve light puzzles or defeat guarding enemies to rescue them.
3.  **Gather:** Chop trees, mine crystals, and forage for food.
4.  **Build & Craft:** Return to the home base. Use gathered resources to upgrade player housing, build pet shelters, and craft better gear.
5.  **Train & Bond:** Feed pets, play mini-games at training arenas, and increase their loyalty.
6.  **Complete Missions:** Speak to NPCs in the village to undertake chapter-specific quests.
7.  **Fight Bosses:** Once the player and pet are strong enough, tackle the biome's boss.
8.  **Progress:** Defeating the boss unlocks the pathway to the next Chapter (Biome).

## 2. Multiplayer Architecture

Multiplayer is a seamless, drop-in/drop-out co-op experience. The focus is on shared adventure rather than competitive PVP.

### Join Code System
*   **Frictionless Entry:** Instead of dealing with complex server IPs or port forwarding, players host a session and receive a simple 6-digit alphanumeric "Join Code" (e.g., `PAW-7X2`).
*   **Session Types:** 
    *   *Invite Only:* Requires the Join Code.
    *   *Friends Only:* Friends on the platform can join freely.
*   **Host Dependency:** The world state (buildings, mission progress) is saved to the Host. Guest players retain their personal inventory, pet progression, and unlocked skills when returning to their own worlds.

### Co-op Systems
*   **Shared Missions:** If the host accepts a mission, it is shared with all players in the session. Rewards are instanced (everyone gets loot).
*   **Trading System:** A secure UI window where players can trade resources, crafted items, and even pet eggs.
*   **Player Interaction:** Emotes, high-fives, and the ability to pet another player's companion.
*   **Revive Mechanic:** If a player loses all health, they enter a "downed" state. Friends (or their pets with healing abilities) can revive them within a time limit.

## 3. UI/UX Systems

The UI is designed to be "AAA AAA-quality," utilizing rounded modern elements and glassmorphism, completely avoiding the cheap, cluttered look of generic mobile games.

### Essential Screens
*   **Main Menu:** A beautiful, dynamic background showing the player's current avatar and main pet resting by a fire. Clean, bold typography for "Play," "Co-op," and "Settings."
*   **HUD (Heads Up Display):** Minimalist. A sleek, curved health/energy bar in the top left for the player, and a smaller attached bar for the active pet. A soft, non-intrusive mission tracker on the right.
*   **Pet Management Screen:** The star of the UI. A detailed 3D inspection view of the pet. Tabs for "Stats," "Skill Tree," "Cosmetics," and "Diet." Features smooth transitions and satisfying sound effects.
*   **Inventory & Crafting:** Grid-based but highly readable. Items have high-quality icons. Crafting shows clear recipes and utilizes a hold-to-craft radial progress bar.
*   **Map System:** A beautiful, stylized parchment map that clears as the player explores (Fog of War). Custom pins can be dropped, and multiplayer friends are tracked via real-time icons.
