const employmentInput = document.getElementById("employment");
const yesButton = document.getElementById("yes");
const noButton = document.getElementById("no");

const handleYesClick = () => {
  employmentInput.hidden = false;
};

const handleNoClick = () => {
  employmentInput.hidden = true;
};

employmentInput.hidden = true;

yesButton.addEventListener("click", handleYesClick);
noButton.addEventListener("click", handleNoClick);
