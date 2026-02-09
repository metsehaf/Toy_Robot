# Toy Robot Application - Quick Start Guide

## What is This?
A toy robot simulator that moves on a 5×5 grid. The robot responds to commands (PLACE, MOVE, LEFT, RIGHT, REPORT) via click, buttons, or keyboard arrows.

## Key Features
✅ Click any grid cell to PLACE robot (facing north)  
✅ Arrow keys or buttons to MOVE, TURN LEFT/RIGHT  
✅ REPORT shows current position (X, Y) and facing direction  
✅ Boundary protection - robot won't fall off the table  
✅ Database persistence - robot state saved and restored on refresh  
✅ Movement history tracked in database  

## Coordinate System
```
(0,4)---(1,4)---(2,4)---(3,4)---(4,4)  [NORTH ↑]
  |       |       |       |       |
(0,3)---(1,3)---(2,3)---(3,3)---(4,3)
  |       |       |       |       |
(0,2)---(1,2)---(2,2)---(3,2)---(4,2)
  |       |       |       |       |
(0,1)---(1,1)---(2,1)---(3,1)---(4,1)
  |       |       |       |       |
(0,0)---(1,0)---(2,0)---(3,0)---(4,0)  [SOUTH ↓]
[WEST ←]                          [EAST →]
```
**Origin (0,0) is at the SOUTHWEST corner (bottom-left)**

## Commands

### PLACE (Click on Grid)
- Click any cell to place robot there
- Robot always faces NORTH initially
- Replaces previous robot if one exists
- Position is saved to database

### MOVE (Up Arrow ↑ or Move Button)
- Move one cell forward in the direction robot is facing
- Won't move if it would go off the table
- Updates position in database and history

### LEFT (Left Arrow ← or Left Button)
- Turn robot 90° counter-clockwise
- NORTH → WEST → SOUTH → EAST → NORTH
- Position unchanged, only facing direction changes

### RIGHT (Right Arrow → or Right Button)
- Turn robot 90° clockwise
- NORTH → EAST → SOUTH → WEST → NORTH
- Position unchanged, only facing direction changes

### REPORT (Space or Report Button)
- Display current position and facing direction
- Shows in green message box
- Format: "X: [x], Y: [y], F: [direction] [arrow]"

## How to Run

### Setup Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure as needed in `.env`:
   ```
   PORT=3000
   NODE_ENV=development
   DATABASE_TYPE=sqlite
   DATABASE_NAME=toyrobot.db
   DATABASE_SYNCHRONIZE=true
   FRONTEND_URL=http://localhost:4200
   API_URL=http://localhost:3000/api
   ```

### Terminal 1 - Backend
```bash
cd /Users/edombiratu/Documents/learning/toyrobot
npm install  # if not done
npx nx serve backend
```
Wait for: `[Nest] 12345 - 02/08/2026...`

### Terminal 2 - Frontend
```bash
cd /Users/edombiratu/Documents/learning/toyrobot
npx nx serve frontend
```
Wait for: `Application bundle generation complete`

### Browser
Open `http://localhost:4200`

## Example Session

1. **Click cell (2, 2)** 
   - Message: "Robot placed at (2, 2) facing NORTH"

2. **Press Up Arrow 2 times**
   - Robot moves north to (2, 4)

3. **Press Right Arrow 1 time**
   - Robot now faces EAST

4. **Press Up Arrow 1 time** 
   - Robot moves east to (3, 4)

5. **Press Space**
   - Message: "X: 3, Y: 4, F: EAST →"

6. **Refresh page (F5)**
   - Robot still at (3, 4) facing EAST (restored from database)

## Architecture

### Frontend (Angular)
- `playground.component.ts` - Main game controller
- `robot-icon.component.ts` - Visual robot representation
- `robot-api.service.ts` - HTTP client for backend calls

### Backend (NestJS)
- `robot.controller.ts` - REST API endpoints
- `robot.service.ts` - Game logic (movement, boundaries, directions)
- `robot.entity.ts` - Database schema (Robot, RobotHistory)
- SQLite database - Persistent state storage

## API Endpoints

```
POST   /robot/place         { x: number, y: number }
POST   /robot/move          
POST   /robot/turn-left     
POST   /robot/turn-right    
GET    /robot/report        
GET    /robot/history       
```

## Useful Commands

```bash
# View database
sqlite3 toyrobot.db "SELECT * FROM robot;"

# View history
sqlite3 toyrobot.db "SELECT * FROM robot_history ORDER BY created_at DESC LIMIT 10;"

# Reset database
rm toyrobot.db
```

## Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot GET /robot/report" | Backend not running. Run `npx nx serve backend` |
| CORS error in console | Restart backend |
| Robot position not saving | Check if `toyrobot.db` exists, delete and refresh |
| Grid coordinates seem wrong | Remember origin (0,0) is bottom-left, not top-left |

## Next Steps / Future Improvements

- [ ] Add multiple robots with tracking
- [ ] Implement obstacles/obstructions
- [ ] Add undo/redo functionality
- [ ] Create a replay feature using history
- [ ] Add difficulty levels with time limits
- [ ] Switch to PostgreSQL for production
- [ ] Add authentication for multi-user sessions
- [ ] Create REST API documentation (Swagger)
