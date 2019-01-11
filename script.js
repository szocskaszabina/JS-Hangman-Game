//get task

let task = '';
let movieData;

class Solution {
constructor (title, overview, poster) {
this.title = title;
this.overview = overview;
this.poster = poster

}

};
//loading data feom API

async function loadData (page, movieNumber) {

    let data = await fetch (`https://api.themoviedb.org/3/discover/movie?api_key=f0fea38f1fe76d3ba0daa8f0f718a404&language=en-US&sort_by=popularity.desc&year=2018&include_adult=false&include_video=true&page=${page}`)
    let dataToStore = await data.json();


    let movieList = dataToStore.results
    .filter((movie) => movie.release_date > '2017-01-01')
    .map((movie) => {
        return new Solution (movie.title,
                             movie.overview,  
                            `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                                )
    })
    movieData = movieList[movieNumber];
    task = movieData.title
                        .toUpperCase()
                        .split("");
    return task;


};

//Initialize game

const startButton = document.getElementById("startButton");

startButton.addEventListener('click', async function (e) {

    let randomPageNumber = Math.floor(Math.random() * 30) + 1;
    let randomMovieNumber = Math.floor(Math.random() * 10) + 0;

    await loadData(randomPageNumber, randomMovieNumber);

//Set default values

    document.getElementById('solution').innerHTML = '';
    guessButton.disabled = false;
    document.getElementById('hanging').src = 'public/pics/bg.png';
    document.getElementById('details').innerHTML = '';
    document.getElementById('guess').value = '';
    document.getElementById('mistakes').innerHTML = 'Wrong letters:';
    mistakeCounter = 0;
    
    let id = 0;
//Initialize the task

    document.getElementById('container').innerHTML = task
    .filter((letter) => letter != ',')
    .map((letter) => `<span id="${id++}">____</span>`)
    .reduce((accumulator, current) => accumulator + current, []);
 
//Writing some special characters

    for (let element = 0; element <= task.length; element++ ) {

        let specChars = ["'", ' ', ':', '-', '!', '/', '?', ','];

        if (specChars.includes(task[element])) {

            document.getElementById(`${element}`).innerHTML = task[element]
        }
        
    }
    
}
);
//guessing


const guessButton =  document.getElementById("guessButton");

let mistakeCounter = 0;

guessButton.addEventListener('click', (e) => {

    
    let guessLetter = document.getElementById('guess').value.toUpperCase();

    for (let element = 0; element <= task.length; element++ ) {

        if(!task.includes(guessLetter)) {
                mistakeCounter++;
                
                document.getElementById('mistakes').innerHTML += `${guessLetter}, `;

                if (8 > mistakeCounter > 0) {

                document.getElementById('hanging').src = `public/pics/bg${mistakeCounter}.png`;
                document.getElementById('hanging-sound').play();
                }
                if (mistakeCounter == 7) {
                document.getElementById('losing-sound').play();
                document.getElementById('solution').innerHTML = `Unfortunately, you lost! The solution was: ${task.join('')}<br>
               You can start a new game by clicking on the Start New Game button!`;
                guessButton.disabled = true;
                getDetails();
            
                }
                document.getElementById('guess').value = '';
                return mistakeCounter;
        };


        if (task[element] == guessLetter) {

            

                document.getElementById(`${element}`).innerHTML = task[element];
                document.getElementById('correct-sound').play();
                let collection = document.getElementById('container').children;
                let res = [];
                for (let child of collection) {
                    res.push(child.innerHTML)

                }
                
                if (res.join('') == task.join('')) {
                    document.getElementById('solution').innerHTML = `Great job! You discovered that the solution was: ${task.join('')}<br>
               You can start a new game by clicking on the Start New Game button!`;
               document.getElementById('applause').play();
                   
                   getDetails();
                }
                  
                

        }
    }
     document.getElementById('guess').value = '';
});

//Initialize details of the movie

function getDetails () {
document.getElementById('details').innerHTML = `
<h2>${movieData.title}</h2>
<p>${movieData.overview}</p>
<img src="${movieData.poster}" alt="${movieData.title}">
`
}












