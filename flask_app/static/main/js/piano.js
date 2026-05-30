const sound = {65:"http://carolinegabriel.com/demo/js-keyboard/sounds/040.wav",
                87:"http://carolinegabriel.com/demo/js-keyboard/sounds/041.wav",
                83:"http://carolinegabriel.com/demo/js-keyboard/sounds/042.wav",
                69:"http://carolinegabriel.com/demo/js-keyboard/sounds/043.wav",
                68:"http://carolinegabriel.com/demo/js-keyboard/sounds/044.wav",
                70:"http://carolinegabriel.com/demo/js-keyboard/sounds/045.wav",
                84:"http://carolinegabriel.com/demo/js-keyboard/sounds/046.wav",
                71:"http://carolinegabriel.com/demo/js-keyboard/sounds/047.wav",
                89:"http://carolinegabriel.com/demo/js-keyboard/sounds/048.wav",
                72:"http://carolinegabriel.com/demo/js-keyboard/sounds/049.wav",
                85:"http://carolinegabriel.com/demo/js-keyboard/sounds/050.wav",
                74:"http://carolinegabriel.com/demo/js-keyboard/sounds/051.wav",
                75:"http://carolinegabriel.com/demo/js-keyboard/sounds/052.wav",
                79:"http://carolinegabriel.com/demo/js-keyboard/sounds/053.wav",
                76:"http://carolinegabriel.com/demo/js-keyboard/sounds/054.wav",
                80:"http://carolinegabriel.com/demo/js-keyboard/sounds/055.wav",
                186:"http://carolinegabriel.com/demo/js-keyboard/sounds/056.wav"};
				
//awaken variables
const awakenList = ['w','e','s','e','e','y','o','u'];
currentList = [];
canPlay = true;

// keygrid objects
const keyVisibility = document.querySelector("#keygrid");
const whiteKeyTexts = document.querySelectorAll(".whitekeytext");
const blackKeyTexts = document.querySelectorAll(".blackkeytext");
//awaken objects
const awakenImage = document.querySelector(".awakenimage");
const awakenText = document.querySelector(".awakentext");

//listens for keyboard input
addEventListener("keydown", (e) =>{
	// only play if not awaken
	if (!canPlay){
		return;
	}
	// play the coresponding sound
	let keyAudio = new Audio(sound[e.keyCode]);
	keyAudio.play();
	
	console.log(e.key.toLowerCase());
	// make the key have a reaction
	if (/^[wetyuopWETYUOP]/.test(e.key)){
		const keyObject = document.querySelector(`#${e.key.toLowerCase()}`);
		console.log(keyObject.style.background);
		keyObject.style.background = 'gray';
		setTimeout(() => { keyObject.style.background = 'black'; }, 100);
	}
	if (/^[asdfghjklASDFGHJKL]/.test(e.key)){
		const keyObject = document.querySelector(`#${e.key.toLowerCase()}`);
		console.log(keyObject.style.background);
		keyObject.style.background = 'gray';
		setTimeout(() => { keyObject.style.background = 'white'; }, 100);
	}
	if (/^[;]/.test(e.key)){
		const keyObject = document.querySelector('#semi');
		console.log(keyObject.style.background);
		keyObject.style.background = 'gray';
		setTimeout(() => { keyObject.style.background = 'white'; }, 100);
	}
	
	//check to see if awaken by comparing lists
	currentList.push(e.key.toLowerCase());
	if (currentList[currentList.length - 1] !== awakenList[currentList.length - 1])
	{
		currentList = [];
	}
	if (currentList.length === awakenList.length)
	{
		AwakenOne();
	}
}
);

//check if mouse is over the piano board
keyVisibility.addEventListener('mouseover', () => {
	for (const key of whiteKeyTexts){
		key.style.color = 'black';	
	}
	for (const key of blackKeyTexts){
		key.style.color = 'white';	
	}
}
);

//check if mouse leave the piano board
keyVisibility.addEventListener('mouseout',  () => {
	for (const key of whiteKeyTexts){
		key.style.color = 'transparent';	
	}
	for (const key of blackKeyTexts){
		key.style.color = 'transparent';	
	}
}	
);

// function to awaken
function AwakenOne(){
	canPlay = false;
	let creepyAudio = new Audio("https://orangefreesounds.com/wp-content/uploads/2020/09/Creepy-piano-sound-effect.mp3?_=1");
	creepyAudio.play();
	awakenImage.style.zIndex = "5";
	//gradually awaken
	for (let i = 1; i < 101; i++){
		setTimeout(() => { awakenImage.style.opacity = i/100; }, i * 20);
		setTimeout(() => { awakenText.style.opacity = i/100; }, i * 20);
	}
}