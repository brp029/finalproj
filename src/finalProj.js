// JavaScript Document
import { useState } from "react";
import {Routes, Route, Link} from 'react-router-dom';
import "./pages.css"

var countries = [];
var capitals = [];
var currentCapital;
var currentCountry;
var currentSelections = [];
var missTally = 0;
var currentScore = 0;
var highScore = 0;

	getLists();

function getLists() {
    
    var req = new XMLHttpRequest();
    req.withCredentials = true;
    req.open('GET', 'https://api.countrylayer.com/v2/all?access_key=a399b98133a1cb241056a67a7ee3e189');
    req.withCredentials = false;
    req.send();
    req.onload = async () => {
        let data = await JSON.parse(req.response);
		console.log(data);
        countries = data.map(countryList);
        capitals = data.map(capitalList);
       // console.log(countries);
       // console.log(capitals);
    }
    
    function countryList(data) {
       return data.name;
    }

    function capitalList(data) {
       return data.capital;
    }
	
}


function GameForm() {
	
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
		console.log(currentSelections);
    
    function shuffle(array) {
          let currentIndex = currentSelections.length,  randomIndex;

          while (currentIndex != 0) {
          	randomIndex = Math.floor(Math.random() * currentIndex);
          	currentIndex--;

          	[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
          }

          return array;
     }

// Shuffle my country array
shuffle(currentSelections);
    
console.log(currentCapital + ", " + currentSelections);
}
	
	const [currGuess, setCurrGuess] = useState('');
	const [btn0Text, setBtn0Text] = useState('');
	const [btn1Text, setBtn1Text] = useState('');
	const [btn2Text, setBtn2Text] = useState('');
	const [btn3Text, setBtn3Text] = useState('');
	const [btn4Text, setBtn4Text] = useState('');
	var g = [];
	const [guesses, setGuesses] = useState(g); //add guess to Guess list
	

	
	function Nav()
		{
		return (
		<ul id='main-nav'>
		<li><Link to="/">Game</Link></li>
		<li><Link to="/instructions">Instructions</Link></li>
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
			
		For instructions, click the Instructions link in the navigation bar.<br /><br />
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
		To start a new game, click the New Game button. <br /><br />
		Select the country that matches the capital city shown by clicking the button with the country name. <br /><br />
		The game ends after you have accumulated three strikes.<br />
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
			currentScore++;
			document.getElementById("currentScore").innerHTML = currentScore;
			setGuesses((st)=>[...st,match])
			setCurrGuess('');
			triggerNewQuestion(e);
		} 
		else {
			alert("Sorry, " + currentCapital + " is the capital of " + currentCountry + ".");
			missTally++;
			console.log("missTally: " + missTally);
			document.getElementById("strikes").innerHTML += "X";
			if (missTally > 2){
				alert("Sorry, your game is over. Press New Game to start again.")
				if (currentScore > highScore){
					console.log("high score: " + highScore);
					console.log("current score: " + currentScore);
					highScore = currentScore;
					document.getElementById("highScore").innerHTML = highScore;
					console.log("New high score: " + highScore);
				}
			}
			else {
				triggerNewQuestion(e);
			}
			
		}
		
	}
	
	function triggerNewGame(e) {
		missTally = 0;
		currentScore = 0;
		document.getElementById("strikes").innerHTML = "Strike Count: ";
		document.getElementById("currentScore").innerHTML = currentScore;
		triggerNewQuestion(e);
	}

	function triggerNewQuestion(e) {
		e.preventDefault();
		setBtn1Text(currentSelections[1]);
		newQuestion();
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
		
		
		<form>
			<button class="newGameBtn" onClick={(e)=>triggerNewGame(e)}>New Game</button>
			<h3>Which country is {currentCapital} the capital of?</h3>
			<button class="countryBtn" value={currentSelections[0]} onClick={(e)=>handleNewGuess(e)}>{currentSelections[0]}</button>
			<button class="countryBtn" value={currentSelections[1]} onClick={(e)=>handleNewGuess(e)}>{currentSelections[1]}</button>
			<button class="countryBtn" value={currentSelections[2]} onClick={(e)=>handleNewGuess(e)}>{currentSelections[2]}</button>
			<button class="countryBtn" value={currentSelections[3]} onClick={(e)=>handleNewGuess(e)}>{currentSelections[3]}</button>
		</form>
		
		<hr />	
		<h4 id="strikes">Strike Count: </h4>
		<h4>Current Score: <div id="currentScore"></div></h4>
		<h4>High Score: <div id="highScore"></div></h4>
		<h4>Correct Matches</h4>
		<ul className='guess-list'>
			{guesses.map((st, i)=><li key={i}>{st}</li>)}
		</ul>
		</div>
		</>
	);
}

export function MyApp()
{
	return <GameForm />;
}
