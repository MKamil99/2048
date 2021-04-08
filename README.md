# 2048
**2048** is a project written for **Mobile Web Applications** course during 
the 5th semester of Computer Science at the Silesian University of Technology.

### Table of contents
* [Project description](#project-description)
* [Used technologies](#used-technologies)
* [How to install it?](#how-to-install-it)
* [How to use it?](#how-to-use-it)

### Project description
**2048** is just another version of very popular puzzle game, originally created by Gabriele Cirulli in 2014, in which 
player needs to **move and merge the tiles** that show up on the board. Tiles can be merged only when they are identical 
and it results in creating a tile with value two times bigger than previous tiles' values. After every move new tile 
is spawned on the board until there is no place for it - that's when player loses. Originally the aim was to reach 2048 
tile, but in this case there is **no maximum value**. There are **3 play modes**. You can play on 4x4, 5x5 or 6x6 board
and - if the game is located on the server - compete with others as there is **ranking system**.

### Used technologies
The application was created without any additional libraries or frameworks - it's just **pure HTML, CSS, JavaScript and PHP**.
To make it responsive, we used **CSS Flex Box Layout** and @media queries (for different arrangament in both orientations).

### How to install it?
2048 is a web application, which means that it's some kind of website and **you don't have to install it**. You can just open
main HTML file (start.html), but it is worth to **launch the PHP server** and play it via localhost as without it you won't 
have access to the rankings. To do it, install PHP, go to project directory, launch CMD and use the command:
```
php -S localhost:[port]       eg. php -S localhost:8000
```
The better idea is to **put the project on a server** for people to access it via the url. The application **works only on touch 
screens** - you can't use your mouse to play.

### How to use it?
Application is quite easy to use. **Main Menu** contains three buttons: PLAY, INSTRUCTION and RANKING.

<p align="center">
<img src="https://user-images.githubusercontent.com/43967269/114005076-81af5a80-985f-11eb-9518-c45b9279352a.png" alt="Main Menu">
</p>

Clicking the first button will result in entering the **Play Mode**. Here you can see the board, current score and two buttons.
You can start playing now, but if you want to change the size of the board or enter your nickname (which will be displayed
in the ranking later), you should click the first button: SETTINGS. Pressing the second button - SURRENDER - ends the game
immediately and the score is saved in ranking list (if is high enough).

<p align="center">
<img src="https://user-images.githubusercontent.com/43967269/114004413-eb7b3480-985e-11eb-89d1-ac31ed32c2bd.png" alt="Play Mode">
</p>

If you lose or surrender, you'll see **"GAME OVER"** caption and - if you're in TOP 10 - information about the place that you've 
reached. There's also RETRY button.

<p align="center">
<img src="https://user-images.githubusercontent.com/43967269/114004507-02218b80-985f-11eb-8dee-ee460a603ada.png" alt="Game Over">
</p>

In **Settings**, you change the size of the board or enter your nickname. Changing the size will restart the game.

<p align="center">
<img src="https://user-images.githubusercontent.com/43967269/114004073-963f2300-985e-11eb-8ae7-786dda6d309b.png" alt="Settings">
</p>

In **Instruction**, you can read about the game rules and get to know who created this application.

<p align="center">
<img src="https://user-images.githubusercontent.com/43967269/114004652-2b421c00-985f-11eb-9f97-34a6b6ad042e.png" alt="Instruction">
</p>

The last view is **Ranking**. There you can find three lists of players with the best scores - one list per board size.

<p align="center">
<img src="https://user-images.githubusercontent.com/43967269/114004916-617f9b80-985f-11eb-990d-afa60ef3a8c0.png" alt="Ranking">
</p>
