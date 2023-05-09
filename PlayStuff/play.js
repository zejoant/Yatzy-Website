let rollCount = 0;
let turnCount = 0;
let timer;
let i = 0;
let p = "a";
var rollSound = new Audio("../Images/DiceRoll.wav"); // buffers automatically when created
let rolling = false

let locked = [false, false, false, false, false] //array of which dice are locked
let numbers = [0, 0, 0, 0, 0] // array of what numbers each dice has
let scorepreview = 0;


window.onload = function() /*animation on page load */
{
    document.getElementById("line").style.width = `70%`;
}

function Roll() /*function that is called when you click the roll button */
{
    if (rollCount < 3 && !rolling)
    {
        let rando
        rolling = true;
        rollSound.play();
        rollCount += 1;
        timer = setInterval(function() //repeat function with delay, function randomizes a number for each dice a couple of times to make an animation
        {
            for (let j = 0; j < 5; j++)
            {
                if(!locked[j]) //if dice isnt locked it switches to a random number
                {
                    let r = Math.floor(Math.random() * 6) +1
                    numbers[j] = r // saves dice number to array
                    document.getElementById(`dice${j+1}`).innerHTML = `<img src="../Images/dice ${r}.svg" />`;
                }
            }
            i++
            if (i == 9) //stops the animation loop
            {
                rolling = false;
                clearInterval(timer);
                i = 0;
            }
        }, 200);
        document.getElementById("rollCount").innerHTML = `${rollCount}/3`; //adds 1 to the roll-count

        let rollButton = document.getElementById("roll-button").style
        if (rollCount == 1) //button styling after one roll
        {
            rollButton.background = "#F2EDD3";
        }
        if (rollCount == 2) //button styling after 2 rolls
        {
            rollButton.background = "#FFD1D1";
        }
        if (rollCount == 3) //button styling after 3 rolls
        {
            rollButton.background = "#D8D8D8";
            rollButton.color = "#929292";
        }
    }
}
function Finish() /*function that is called after SaveScore that resets everything back so the next turn can begin */
{
    if (!rolling && rollCount > 0)
    {
        for(let i = 1; i < 6; i++) /*resets all dice back to 0 */
        {
            locked[i-1] = true
            DiceLock(i)
            document.getElementById(`dice${i}`).innerHTML = `<img src="../Images/dice 0.svg" />`;
        }
        rollCount = 0;
        turnCount++;
        document.getElementById("rollCount").innerHTML = `${rollCount}/3`;
    
        let rollButton = document.getElementById("roll-button").style /*button styling */
        rollButton.background = "#CEEDC7";
        rollButton.color = "black";

        if (turnCount >= 26)
        {
            if (document.getElementById("a14").innerHTML > document.getElementById("b14").innerHTML)
            {
                document.getElementById("popup").innerHTML = "Player 1 Won!"
            }
            else if (document.getElementById("a14").innerHTML < document.getElementById("b14").innerHTML)
            {
                document.getElementById("popup").innerHTML = "Player 2 Won!"
            }
            else
            {
                document.getElementById("popup").innerHTML = "It's a Draw!" 
            }
            document.getElementById("overlay").style.display = "block";
        }
    }
}

function DiceLock(n) /*function that locks dice when you click them, the value n is sent with so it knows which dice you clicked*/
{
    if(document.getElementById("rollCount").innerHTML != `0/3` && i==0) /*Makes sure you cant lock dice if you havnt rolled yet */
    {
        if (!locked[n-1]) /* checks if the dice is unlocked and lockes it if it is */
        {
            document.getElementById(`dice${n}`).style.background = "#F4DFF5";
            document.getElementById(`dice${n}`).style.scale = "1.1";
            locked[n-1] = true
        }
        else{ /* checks if the dice is locked and unlockes it if it is */
            document.getElementById(`dice${n}`).style.background = "white";
            document.getElementById(`dice${n}`).style.scale = "1";
            locked[n-1] = false;
        }
    }
}
function SaveScore(n) /*called when you choose a choose a category to save your score into */
{
    if (!rolling && rollCount > 0 && document.getElementById(p + n).innerHTML == " " + scorepreview + " ") /*makes sure you cant save score if you havnt rolled, the dice are currently rolling or if you already have a score in that category */
    {
        document.getElementById(p + n).style.color = "black"
        document.getElementById(p + n).innerHTML = scorepreview /* saves the score and writes it out */
        document.getElementById(p + 14).innerHTML = parseInt(document.getElementById(p + 14).innerHTML) + scorepreview; /*adds the score to your total score and writes it out */
        if (p == "a") /*switches player from player a to player b */
        {
            document.getElementById(p + n).style.background = "#fbf6e0"
            p = "b";
            document.getElementById("player-1").style.opacity = "0"
            document.getElementById("player-2").style.opacity = "1"
        }
        else if (p == "b") /*switches player from player b to player a */
        {
            document.getElementById(p + n).style.background = "#ffe3cd"
            p = "a";
            document.getElementById("player-1").style.opacity = "1"
            document.getElementById("player-2").style.opacity = "0"
        }
        Finish()
    }
}
function ScorePreview(n, m) /*called when you hover over a category and lets you view the score */
{
    if (!rolling && rollCount > 0 && document.getElementById(p + n).innerHTML == "-" && m) /*makes sure you cant view score if you havnt rolled, the dice are currently rolling or if you already have a score in that category */
    {
        if (n > 0 && n < 7) /*if category is from Aces to Sixes then this function is called */
        {
            scorepreview = Score1to6(n)
        }
        else /*else it calles the apropriate function depending on the chosen category */
        {
            scorepreview = window["Score" + n]()
        }
        document.getElementById(p + n).innerHTML = " " + scorepreview + " "
        document.getElementById(p + n).style.color = "#acadc2"
    }
    else if (!m && document.getElementById(p + n).innerHTML == " " + scorepreview + " ")
    {
        document.getElementById(p + n).innerHTML = "-" 
        document.getElementById(p + n).style.color = "black"
    }
}
function Score1to6(n) /*Aces-Sixes, takes the sum of the choosen number and returns it */
{
    let score = 0;
    for (let i = 0; i < 5; i++)
    {
        if (numbers[i] == n)
        {
            score += numbers[i];
        }
    }
    return score;
}
function Score7() /* FIX FIX FIX FIX FIX Three of a Kind, checks if you have 3 dice with the same value and returns the sum of those if its true */
{
    let score = 0;
    let amount = 1;
    for (let i = 0; i < 5; i++)
    {
        for (let j = 0; j < 5; j++)
        {
            if (numbers[i] == numbers[j] && i != j)
            {
                amount++;
            }
        }
        if (amount > 2)
        {
            score = numbers[i]*3
            break;
        }
        else
        {
            amount = 1
        }
    }
    return score;
}
function Score8() /*Four of a Kind, checks if you have 4 dice with the same value and returns the sum of those if its true */
{
    let score = 0;
    let amount = 1;
    for (let i = 0; i < 5; i++)
    {
        for (let j = 0; j < 5; j++)
        {
            if (numbers[i] == numbers[j] && i != j)
            {
                amount++;
            }
        }
        if (amount > 3)
        {
            score = numbers[i]*4
            break;
        }
        else
        {
            amount = 1
        }
    }
    return score;
}
function Score9() /*Full House, checks if you have 3 dice of the same value and the 2 others also are the same value and returns 25 if its true */
{
    let num1 = numbers[0];
    console.log(num1)
    let amount1 = 0
    let num2 = 69;
    let amount2 = 0
    for(let i = 0; i < 5; i++)
    {
        if(numbers[i] != num1)
        {
            num2 = numbers[i]
            console.log(num2)
            break
        }
        else if (i == 4 && num2 == 69)
        {
            return 25
        }
    }
    for(let k = 0; k < 5; k++)
    {
        if(numbers[k] == num1)
        {
            amount1 +=1
        }
        else if (numbers[k] == num2)
        {
            amount2 += 1
        }
    }
    console.log(amount1)
    console.log(amount2)
    if (amount2 == 3 && amount1 == 2)
    {
        return 25
    }
    else if (amount2 == 2 && amount1 == 3)
    {
        return 25
    }
    else
    {
        return 0
    }
}
function Score10() /*Ladder of 4, checks if you have a ladder of 4 and returns the apropriate value */
{
    let list = [0, 0, 0, 0, 0, 0]
    for(let i = 0; i < list.length; i++) /*puts in all the dice numbers into a listen in order */
    {
        for(let j = 0; j < 5; j++)
        {
            if(numbers[j] == i+1)
            {
                list[i] = numbers[j]
            }
        }
    }
    for(let i = 0; i < list.length; i++) /*checks if a sequence of 4 numbers has a ladder of 4 */
    {
        if (list[i] != 0)
        {
            for(let j = i; j < i+4; j++)
            {
                if(list[j] != j+1)
                {
                    return 0
                }
            }
            return 30
        }
    }
    
}
function Score11() /*Ladder of 5, checks if you have a ladder of 5 and returns the apropriate value */
{
    let list = [0, 0, 0, 0, 0, 0]
    for(let i = 0; i < list.length; i++) /*puts in all the dice numbers into a listen in order */
    {
        for(let j = 0; j < 5; j++)
        {
            if(numbers[j] == i+1)
            {
                list[i] = numbers[j]
            }
        }
    }
    for(let i = 0; i < list.length; i++) /*checks if a sequence of 5 numbers has a ladder of 5 */
    {
        if (list[i] != 0)
        {
            for(let j = i; j < i+5; j++)
            {
                if(list[j] != j+1)
                {
                    return 0
                }
            }
            return 40
        }
    }
}
function Score12() /*Yahtzee, checks if all dices are the same and returns 50 if they are */
{
    for(let i = 1; i < 5; i++)
    {
        if (numbers[i] != numbers[0])
        {
            return 0
        }
    }
    return 50
}
function Score13() /*Chance, adds all numbers together and returns that value */
{
    let score = 0
    for(let i = 0; i < 5; i++)
    {
        score += numbers[i]
    }
    return score
}