# 🔐 Prisoner of the Labyrinth

## 🎮 About the Game
**Prisoner of the Labyrinth 2** is a simple browser game based adventure where you, the player awaken trapped in a dark dungeon.
Somewhere in the maze lies a key that unlocks the exit, but beware - a ghost hunts you in the dark!

**_Find the key, avoid the ghost_**, and escape or **before your _moves run out_**..
> You might even find a **_freezing crystal_** that gives you one turn of safety by freezing the ghost!

This is UI-based version of the previous one.
No prompts, no console input, no text commands.
>Everything happens directly in the browser through buttons and live map rendering.

## ⚙️ Core Features
- ✅ Visual Map Rendering
> Each tile represents something and the map updates automatically after every move.
- ✅ Button-based Player Controls:
>Movement is done using on-screen direction buttons:
   - N ⬆️ North (up)
   - E ➡️ East (right)
   - W ⬅️ West (left)
   - S ⬇️ South (down)
- ✅ Ghost with simple chase mechanics.
- ✅ Pickups:
    - 🔑 Key - unlocks the exit
    - 🧊 Freezing Crystal - freezes the ghost for on turn.
- ✅ Life/Move Counter
> Reaching 0 moves results in instant defeat.
- ✅ Win and lose conditions
- ✅ Replay System
> Win/Loss statistics persist for the entire session.

## 🎮 Game Flow
1. Player enters a name.
2. Click **Start Game**
3. Player moves through the labyrinth
4. Win By:
   - Finding the 🔑 **key**.
   - Escaping through the **E (exit)** once you have the key.
5. Lose By:
   - Getting caught by the 👻 **ghost**.
   - Running out of moves.
6. Replay button allows restarting without refreshing the page.

## 🧰 Built With
- 🖥️ **HTML5** – For pages and contents structure
- 🎨 **CSS3** - For styling , layout and responsiveness
- 🧠 **JavaScript(Vanilla)** - Main logic and state handling
- 🪄 **jQuery** - Effects

## 🚀 Future Improvements or Plans
- ⏳ Add multiple ghosts, add traps that would make player lose a turn. 
- ⏳ Make freezing crystal to use later option available.
- ⏳ Improve ghost movement logic, as its moves can be blocked by the wall. To improve, it should find an alternative direction that still brings closer to the player once blocked by the wall oe exit.
- ⏳ Randomized map: generate key, walls, exit randomly when game starts.
- ⏳ Sound effects

## 🤝 How To Contribute
We love community contributions! Here is how you can help improve this project:

1. **Fork** the repository
2. **Clone** the repository
3. **Create** a new branch
```bash 
 git checkout -b improve-feature
```
4. **Make** the appropriate changes and add changes to reflect the changes made
5. **Commit** your changes
```bash 
git commit -am "Improve feature"
```
6. **Push** to your branch
```bash 
git push origin improve-feature
```

7. **Submit** a Pull Request. Click Compare & Pull Request and describe your contribution.

💬 _I will review your PR as soon a possible_ 😊

## 🤝 Author
❤️ [Michelle](https://github.com/themichellesarmiento)
  
🕰️ _“Escape… if you can”_
  



