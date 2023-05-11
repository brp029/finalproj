
import { useState } from "react";
import {Routes, Route, Link} from 'react-router-dom';
import "./pages.css"

var countries = [];
var capitals = [];
var currentCapital;
var currentCountry;
var currentSelections = [];
var missTally = 0;

getLists();


function getLists() {
    
    var req = new XMLHttpRequest();
    req.withCredentials = true;
    
    req.open('GET', 'https://api.countrylayer.com/v2/all?access_key=a399b98133a1cb241056a67a7ee3e189');
    req.header('Access-Control-Allow-Origin', 'https://final-proj.herokuapp.com/');
    req.send();
    req.onload = () => {
        let data = JSON.parse(req.response);
        countries = data.map(countryList);
        capitals = data.map(capitalList);
        console.log(countries);
        console.log(capitals);
    }
    
    function countryList(data) {
        return data.name;
    }

    function capitalList(data) {
        return data.capital;
    }
}

function newQuestion() {
    currentSelections = [];
    let countryID = Math.round(Math.random()*249);
    console.log(countryID);
    currentCapital = capitals[countryID];
	currentCountry = countries[countryID];
    currentSelections.push(countries[countryID]);
    let countryOption1 = Math.round(Math.random()*249);
    currentSelections.push(countries[countryOption1]);
    let countryOption2 = Math.round(Math.random()*249);
    currentSelections.push(countries[countryOption2]);
    let countryOption3 = Math.round(Math.random()*249);
    currentSelections.push(countries[countryOption3]);
    
    function shuffle(array) {
          let currentIndex = currentSelections.length,  randomIndex;

          // While there remain elements to shuffle.
          while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
          }

          return array;
    }

// Shuffle my country array
shuffle(currentSelections);
    
console.log(currentCapital + ", " + currentSelections);
}

function generateQuestion() {
    newQuestion();
}

function GameForm() {
	
	newQuestion();
	
	const [currGuess, setCurrGuess] = useState('');
	var g = [];
	const [guesses, setGuesses] = useState(g); //add guess to Guess list
	
	function Nav()
		{
		return (
		<ul id='main-nav'>
		<li><Link to="/">Game</Link></li>
		<li><Link to="/settings">Instructions</Link></li>
		</ul>
		);
		}
		function Header()
		{
		return (
		<div className='header'>
		<Nav />
		</div>
		)
		}
		function Game()
		{

		return (
		<div className='page'>
		<Header />
		<h1>Play Game</h1>
		For instructions, click the instructions link in the navigation bar.<br /><br />
			</div>
		)
		}

		function NotFound()
		{
		return (
		<div className='page'>
		<Header />
		<h1>Oh No!</h1>
		You have stumbled on a secret page! Please choose again.
		</div>
		)
		}

		function Instructions()
		{
		return (
		<div class='page'>
		<Header />
		<h1>Instructions</h1>
		Select the country that matches the capital city shown. <br />
		</div>
		)
		}
	
	function handleNewGuess(e)
	{
		e.preventDefault();
		//alert(currGuess);
		var match = currentCapital + ", " + e.target.value;
		var answer = currentCapital + ", " + currentCountry;
		console.log(match);
		console.log(answer);
		if (match == answer) {
			setGuesses((st)=>[...st,match])
			setCurrGuess('');
			newQuestion();
		} 
		else {
			alert("Wrong Answer!")
			missTally++;
		}
		
	}
	
	
	return (
		<>
		<div>
		<Routes>
			<Route path="/" element={<Game />} />
			<Route path="/instructions" element={<Instructions />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
		
		</div>
		
		
		<div class="myForm">
		<h3>Which country is {currentCapital} the capital of?</h3>
		
		<form>
			<button class="countryBtn" value={currentSelections[0]} onClick={(e)=>handleNewGuess(e)}>{currentSelections[0]}</button>
			<button class="countryBtn" value={currentSelections[1]} onClick={(e)=>handleNewGuess(e)}>{currentSelections[1]}</button>
			<button class="countryBtn" value={currentSelections[2]} onClick={(e)=>handleNewGuess(e)}>{currentSelections[2]}</button>
			<button class="countryBtn" value={currentSelections[3]} onClick={(e)=>handleNewGuess(e)}>{currentSelections[3]}</button>
		</form>
		
		<hr />
		
		<h4>Correct Matches</h4>
		<ul className='guess-list'>
			{guesses.map((st, i)=><li key={i}>{st}</li>)}
		</ul>
		</div>
		</>
	);
}


/*
var lowEnd = 1;
var highEnd = 100;
var maxGuesses = 10;
var solution = Math.floor(Math.random() * highEnd) + lowEnd;
var counter = 0;
var totalGuesses = 0;
var numGuesses = [];
var rounds = 1;
var avgGuesses = 0; 

function GuessForm()
{
	
	const [currGuess, setCurrGuess] = useState('')
	var g = []
	const [guesses, setGuesses] = useState(g) //add guess to Guess list
	
	function handleNewGuess(e)
	{
		e.preventDefault();
		//alert(currGuess);
		setGuesses((st)=>[...st,currGuess])
		setCurrGuess('');
		counter++;
		totalGuesses++;
		document.getElementById("newGamebtn").className = "notVisible";
		
		if (currGuess == solution) {
			alert("You're right!");
			document.getElementById("newGamebtn").className = "nowVisible";
		}
		else if (currGuess < solution) {
			alert("Your guess is too low.");
		}
		else if (currGuess > solution) {
			alert("Your guess is too high.")
		}
	}
	
	function newGame()
	{
		solution = Math.round((Math.random() * 100));
		rounds++;
		counter = 0;
	}

	return (
		<>
		<div>
		<Routes>
			<Route path="/" element={<Game />} />
			<Route path="/settings" element={<Settings />} />
			<Route path="/stats" element={<Stats />} />
			<Route path="*" element={<NotFound />} />
		</Routes>
		</div>
		<div class="myForm">
		<form>
			Guess a number:
			<input type='text' name="newGuess" value={currGuess} onChange={(e) =>
			setCurrGuess(e.target.value)}/><br /><br />
			<button onClick={(e)=>handleNewGuess(e)}>Submit Guess</button>
			<button id="newGamebtn" class="notVisible" onClick={(e)=>newGame(e)}>New Game</button>
		</form>
		<hr />
		<h4>Previous Guesses</h4>
		<ul className='guess-list'>
			{guesses.map((st, i)=><li key={i}>{st}</li>)}
		</ul>
		</div>
		</>
	);
}

function Nav()
{
return (
<ul id='main-nav'>
<li><Link to="/">Game</Link></li>
<li><Link to="/settings">Settings</Link></li>
<li><Link to="/stats">Stats</Link></li>
</ul>
);
}
function Header()
{
return (
<div className='header'>
<Nav />
</div>
)
}
function Game()
{
	
return (
<div className='page'>
<Header />
<h1>Game Instructions</h1>
To play, enter a guess. The game will tell you if your guess is correct, too high, or too low.<br /><br />
	</div>
)
}

function NotFound()
{
return (
<div className='page'>
<Header />
<h1>Oh No!</h1>
You have stumbled on a secret page! Please choose again.
</div>
)
}

function Settings()
{
return (
<div class='page'>
<Header />
<h1>Settings</h1>
Guess any number between {lowEnd} and {highEnd}. <br />
The maximum number of guesses is {maxGuesses}.

</div>
)
}
function Stats()
{
	avgGuesses = totalGuesses/rounds;
return (
<div class='page'>
<Header/>
<h1>Player Stats</h1>
<p> Rounds played: {rounds}</p>
<p> Average guesses per round: {avgGuesses}</p>
</div>
)
} */

export function MyApp()
{
	return <GameForm />;
}
// JavaScript Document
