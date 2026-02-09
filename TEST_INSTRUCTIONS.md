# Toy Robot Application - Test Instructions

## Prerequisites
- Node.js 18+ installed
- NestJS backend running on `http://localhost:3333`
- Angular frontend running on `http://localhost:4200`

## Setup Instructions

### 1. Start the Backend
```bash
cd /Users/edombiratu/Documents/learning/toyrobot
npm install @nestjs/typeorm typeorm sqlite3  # Install dependencies if not already done
npx nx serve backend
```
Backend will start on `http://localhost:3333`

### 2. Start the Frontend
In a new terminal:
```bash
npx nx serve frontend
```
Frontend will start on `http://localhost:4200`

---

## Test Cases

### Test 1: Basic Robot Placement
**Objective**: Place a robot on the table by clicking

**Steps**:
1. Open browser to `http://localhost:4200`
2. Click on a cell in the 5×5 grid table (e.g., bottom-left corner)
3. Verify robot icon appears at that location
4. Verify report message shows: "Robot placed at (X, Y) facing NORTH"

**Expected Result**:
- Robot icon is visible in the clicked cell
- Message displays current position and facing direction (↑ for NORTH)

---

### Test 2: Invalid Placement (Out of Bounds)
**Objective**: Ensure robot cannot be placed outside the table

**Steps**:
1. Try clicking outside the table area (above, below, left, or right)
2. Observe the behavior

**Expected Result**:
- Robot does not move
- Error message may appear in browser console
- No changes to robot position

---

### Test 3: Move Forward (Arrow Up Key)
**Objective**: Move robot forward in its facing direction

**Setup**: Place robot at position (2, 2) by clicking center of table

**Steps**:
1. Press **Up Arrow** key 3 times
2. Verify robot moves north (upward on grid)
3. Report message updates with each move

**Expected Result**:
- After 1st move: Robot at (2, 3)
- After 2nd move: Robot at (2, 4)
- After 3rd move: Robot tries to move to (2, 5) but stays at (2, 4) - boundary protection

---

### Test 4: Move Forward (Button Click)
**Objective**: Move robot using the Move button

**Setup**: Place robot at position (0, 0) facing NORTH

**Steps**:
1. Click the **↑ Move** button multiple times
2. Observe robot moving upward

**Expected Result**:
- Robot moves one step up with each button click
- Stops at boundary (Y = 4)

---

### Test 5: Turn Left
**Objective**: Rotate robot 90° counter-clockwise

**Setup**: Place robot facing NORTH

**Steps**:
1. Press **Left Arrow** key once
2. Verify report message shows "facing WEST"
3. Press **Left Arrow** again
4. Verify report message shows "facing SOUTH"

**Expected Result**:
- 1st left turn: NORTH → WEST
- 2nd left turn: WEST → SOUTH
- 3rd left turn: SOUTH → EAST
- 4th left turn: EAST → NORTH (full rotation)

---

### Test 6: Turn Right
**Objective**: Rotate robot 90° clockwise

**Setup**: Place robot facing NORTH

**Steps**:
1. Press **Right Arrow** key once
2. Verify report message shows "facing EAST"
3. Press **Right Arrow** again
4. Verify report message shows "facing SOUTH"

**Expected Result**:
- 1st right turn: NORTH → EAST
- 2nd right turn: EAST → SOUTH
- 3rd right turn: SOUTH → WEST
- 4th right turn: WEST → NORTH (full rotation)

---

### Test 7: Report (Space Bar)
**Objective**: Display current robot position and facing direction

**Setup**: Place robot at (1, 3) and turn to EAST

**Steps**:
1. Press **Space** key
2. Observe report message

**Expected Result**:
- Message shows: "X: 1, Y: 3, F: EAST →"
- Symbol matches facing direction (↑=N, →=E, ↓=S, ←=W)

---

### Test 8: Report (Button Click)
**Objective**: Display current state using Report button

**Setup**: Robot placed at any position

**Steps**:
1. Click **Report** button
2. Verify position and direction displayed

**Expected Result**:
- Report message updates immediately
- Format: "X: [x], Y: [y], F: [direction] [symbol]"

---

### Test 9: Complex Movement Sequence
**Objective**: Execute multiple commands in sequence

**Setup**: Fresh page load

**Steps**:
1. Click center cell (2, 2) to place robot
2. Press **Up Arrow** once → Robot at (2, 3)
3. Press **Right Arrow** once → Robot facing EAST
4. Press **Up Arrow** once → Robot at (3, 3)
5. Press **Left Arrow** twice → Robot facing WEST
6. Press **Up Arrow** twice → Robot at (1, 3)
7. Press **Space** to report

**Expected Result**:
- Final position: X: 1, Y: 3
- Final facing: WEST ←

---

### Test 10: Boundary Protection (All Edges)
**Objective**: Verify robot doesn't fall off table edges

**Setup**: Place robot at (0, 0) facing SOUTH

**Steps**:
1. Press **Down Arrow** (or turn and move toward south edge multiple times)
2. Robot should not move further south

**Verify North Edge**: Place at (2, 4) facing NORTH, press up
**Verify East Edge**: Place at (4, 2) facing EAST, press right
**Verify West Edge**: Place at (0, 2) facing WEST, press left

**Expected Result**:
- Robot ignores movement commands that would take it off the table
- Position doesn't change when boundary is reached

---

### Test 11: Replace Existing Robot
**Objective**: Placing robot again replaces old robot

**Setup**: Robot placed at (0, 0)

**Steps**:
1. Note robot position at (0, 0)
2. Click on cell (3, 3) to place robot again
3. Verify old robot disappears
4. Verify new robot appears at (3, 3)
5. Verify facing direction is reset to NORTH

**Expected Result**:
- Old robot is removed from (0, 0)
- New robot appears at (3, 3) facing NORTH
- Report shows: "Robot placed at (3, 3) facing NORTH"

---

### Test 12: Database Persistence (Page Refresh)
**Objective**: Robot state is saved and restored on page refresh

**Setup**: Robot placed at (1, 2) facing EAST with some moves executed

**Steps**:
1. Place robot at (1, 2)
2. Turn right twice (facing SOUTH)
3. Press F5 or Cmd+R to refresh the page
4. Wait for page to load
5. Check if robot position and facing direction are restored

**Expected Result**:
- After refresh, robot is still at position (1, 2)
- Facing direction is SOUTH
- Report message shows previous state

---

### Test 13: History Tracking (Developer Console)
**Objective**: Verify movement history is recorded

**Steps**:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Execute: `fetch('http://localhost:3333/robot/history').then(r => r.json()).then(console.log)`
4. Observe the array of movements

**Expected Result**:
- Output shows array of objects with:
  - `action`: PLACE, MOVE, LEFT, RIGHT
  - `x`, `y`: Position coordinates
  - `facing`: Direction
  - `createdAt`: Timestamp

---

### Test 14: Robot Ignores Commands Before Placement
**Objective**: Ensure robot doesn't respond to control commands before being placed

**Setup**: Fresh page load (no robot placed)

**Steps**:
1. Without placing robot, press **Up Arrow**
2. Try pressing **Left Arrow**
3. Try clicking **Report** button
4. Try pressing **Space**

**Expected Result**:
- No errors in console
- Robot doesn't appear
- Report button shows nothing or an error
- Once robot is placed, all commands work

---

### Test 15: Origin Verification (0,0 at Southwest)
**Objective**: Confirm coordinate system has origin at bottom-left

**Setup**: None

**Steps**:
1. Click the **bottom-left** cell of the table
2. Check reported coordinates

**Expected Result**:
- Bottom-left cell should be (0, 0)
- Bottom-right cell should be (4, 0)
- Top-left cell should be (0, 4)
- Top-right cell should be (4, 4)

---

## Keyboard Shortcuts Summary

| Key | Action |
|-----|--------|
| **↑ (Up Arrow)** | Move robot forward |
| **← (Left Arrow)** | Turn left 90° |
| **→ (Right Arrow)** | Turn right 90° |
| **Space** | Report current position/direction |
| **Mouse Click** | Place robot at clicked grid cell |

---

## Troubleshooting

### Backend not responding
- Ensure backend is running: `npx nx serve backend`
- Check if port 3333 is available
- Look for errors in backend terminal

### Frontend not loading
- Ensure frontend is running: `npx nx serve frontend`
- Check if port 4200 is available
- Clear browser cache (Ctrl+Shift+Delete)

### Database not persisting
- Check if `toyrobot.db` file was created in workspace root
- Delete old database and refresh to reinitialize: `rm toyrobot.db`

### CORS errors
- Backend should handle CORS automatically
- If issues persist, check NestJS middleware configuration

---

## Performance Notes

- Small SQLite database for testing (use PostgreSQL for production)
- Auto-synchronize TypeORM (not recommended for production)
- All movements are validated server-side
- History kept for last 50 movements
