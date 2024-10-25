// script.js

const anatomySections = {
  "Head and Neck - Arteries": [
    "internal carotid", "external carotid", "common carotid", "vertebral"
  ],
  "Head and Neck - Veins": [
    "external jugular", "internal jugular", "vertebral"
  ],
  "Branches of Aortic Arch": [
    "brachiocephalic trunk", "left common carotid", "left subclavian"
  ],
  "Trunk - Arteries": [
    "aorta", "aortic arch descending thoracic", "descending abdominal", "celiac trunk",
    "superior mesenteric", "inferior mesenteric", "renal", "common iliac"
  ],
  "Upper Limb": [
    "axillary", "subclavian", "radial", "ulnar", "brachial", "palmar"
  ],
  "Lower Limb": [
    "external iliac", "internal iliac", "femoral", "popliteal", "anterior tibial",
    "posterior tibial", "dorsalis pedis"
  ],
  "Trunk - Veins": [
    "brachiocephalic", "subclavian", "superior vena cava", "inferior vena cava", "hepatic",
    "hepatic portal", "gastric", "splenic", "renal", "superior mesenteric", "inferior mesenteric",
    "common iliac"
  ]
};

let score = 0;
let currentSection = '';
let remainingParts = [];
let allowRedemption = false;

function getRandomSection() {
  const sections = Object.keys(anatomySections);
  currentSection = sections[Math.floor(Math.random() * sections.length)];
  remainingParts = [...anatomySections[currentSection]];
  document.getElementById('section-name').textContent = currentSection;
}

function startGame() {
  score = 0;
  getRandomSection();
  document.getElementById('answers-list').innerHTML = '';
  document.getElementById('score').textContent = `Score: ${score}`;
  document.getElementById('feedback').textContent = '';
  document.getElementById('retry-button').style.display = 'none';
}

function submitAnswer() {
  const userAnswer = document.getElementById('spelling-input').value.trim().toLowerCase();
  const correctPart = findClosestMatch(userAnswer);

  if (correctPart) {
    const accuracy = getAccuracy(userAnswer, correctPart);

    if (accuracy === 100) {
      awardPoints(correctPart, 10);
    } else if (accuracy >= 60) {
      allowRedemption = true;
      document.getElementById('feedback').textContent = `Almost! Try redemption?`;
      document.getElementById('retry-button').style.display = 'block';
    } else {
      document.getElementById('feedback').textContent = 'Incorrect. Try another part!';
    }
  } else {
    document.getElementById('feedback').textContent = 'Incorrect guess. No match found.';
  }

  document.getElementById('score').textContent = `Score: ${Math.round(score)}`;
  document.getElementById('spelling-input').value = '';
}

function findClosestMatch(userAnswer) {
  let bestMatch = null;
  let highestAccuracy = 0;

  for (const part of remainingParts) {
    const accuracy = getAccuracy(userAnswer, part.toLowerCase());
    if (accuracy > highestAccuracy) {
      highestAccuracy = accuracy;
      bestMatch = part;
    }
  }

  return highestAccuracy >= 60 ? bestMatch : null;
}

// George image animation trigger
const georgeImage = document.getElementById("george-img");

function triggerFunkyAnimation() {
  georgeImage.style.display = "block";
  georgeImage.classList.add("show-funky");

  setTimeout(() => {
    georgeImage.classList.remove("show-funky");
    georgeImage.style.display = "none";
  }, 2000);
}

function awardPoints(part, points) {
  score += points;
  document.getElementById('feedback').textContent = `Correct! You earned ${points} points for ${part}.`;
  document.getElementById('answers-list').innerHTML += `<li>${part}</li>`;
  remainingParts = remainingParts.filter(item => item !== part);

  if (remainingParts.length === 0) {
    document.getElementById('feedback').textContent += " You've completed this section!";
  }

  if (points === 10) triggerFunkyAnimation();
}

function redeemAttempt() {
  const userAnswer = document.getElementById('spelling-input').value.trim().toLowerCase();
  const correctPart = findClosestMatch(userAnswer);

  if (correctPart && getAccuracy(userAnswer, correctPart) === 100) {
    awardPoints(correctPart, 10);
  } else {
    document.getElementById('feedback').textContent = 'Incorrect. No points awarded for this attempt.';
  }

  document.getElementById('score').textContent = `Score: ${Math.round(score)}`;
  document.getElementById('retry-button').style.display = 'none';
  allowRedemption = false;
}

function getAccuracy(userAnswer, correctAnswer) {
  const length = Math.max(userAnswer.length, correctAnswer.length);
  let correctChars = 0;
  for (let i = 0; i < length; i++) {
    if (userAnswer[i] === correctAnswer[i]) correctChars++;
  }
  return (correctChars / length) * 100;
}

// Initialize game
startGame();
