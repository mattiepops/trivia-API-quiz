const question = document.querySelector('#question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');
const loader = document.querySelector('#loader');
const game = document.querySelector('#game');
const end = document.querySelector('#end');


let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
    .then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
       questions = loadedQuestions.results.map(loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question
            }
            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer)

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            })

            return formattedQuestion;
        })

        startGame();
    })
    .catch(err => {
        console.error(err);
    })


// CONSTANTS 

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

const startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
loader.classList.add('hidden');
}

const getNewQuestion = () => {

    // if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    //     //go to end page
        
    // }
    // end.classList.add('hidden');
    // document.body.style.display = "flex";
    // document.body.style.flexDirection = "column";

    questionCounter++;
    progressText.innerHTML = `Question ${questionCounter}/${MAX_QUESTIONS}`;

    //update progress bar 
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`
    if (progressBarFull.style.width == 110 ||progressBarFull.style.width == "110" + "%"){
        // document.body.style.display = "flex";
        // document.body.style.flexDirection = "column-reverse";
        end.classList.remove('hidden');
        document.querySelector("body > div.container.game-container").style.display = "none";
        document.querySelector("#finalScore").innerHTML = "Your score is: " + score;
    }


    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question

    for (let choice of choices) {
        const number = choice.dataset["number"];
        choice.innerHTML = currentQuestion['choice' + number]
    }

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
}

for (let choice of choices) {
    choice.addEventListener('click', e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        let classToApply = 'incorrect';
        if (selectedAnswer == currentQuestion.answer) {
            classToApply = 'correct';
        }

        if (classToApply == "correct") {
            incrementScore(CORRECT_BONUS)
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    })
}

const incrementScore = (num) => {
    score += num;
    scoreText.innerHTML = score;
}

startGame();

const finalScore = document.querySelector("#finalScore");
finalScore.inner = score;
