// grabing the menu bar image and the menu bar drop down
const menuBarObject = document.querySelector(".menubar");
const menuDropDown = document.querySelector(".menudropdown");
// grabing the feedback div
const feedbackObject = document.querySelector(".feedback-button");
const feedbackForm = document.querySelector(".feedback-form-div");

// waiting for the menu bar image to be clicked
menuBarObject.addEventListener('click', () => {
	// drops down the menu bar or removes it
	if (menuDropDown.style.display === 'none' || menuDropDown.style.display === ''){
		menuDropDown.style.display = 'block';
	}
	else{
		menuDropDown.style.display = 'none';
	}
}
);

feedbackObject.addEventListener('click', () => {
	// shows the feedback form or hides it
	if (feedbackForm.style.display === 'none' || feedbackForm.style.display === ''){
		feedbackForm.style.display = 'flex';
	}
	else{
		feedbackForm.style.display = 'none';
	}
}
);