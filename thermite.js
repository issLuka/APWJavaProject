let timer_start, timer_game, timer_finish, timer_time, good_positions, wrong, right, speed, timerStart, positions;
let game_started = false;
let streak = 0; // Initialize streak outside functions to persist its value

let max_streak = 0;
let best_time = 99.999;

let mode = 7;
let mode_data = {};
mode_data[5] = [10, '92px'];
mode_data[6] = [14, '74px'];
mode_data[7] = [18, '61px'];
mode_data[8] = [20, '51px'];
mode_data[9] = [24, '44px'];
mode_data[10] = [28, '38px'];
mode_data[11] = [32, '34px']; // Add new speeds up to 15 seconds
mode_data[12] = [36, '30px'];
mode_data[13] = [40, '27px'];
mode_data[14] = [44, '24px'];
mode_data[15] = [48, '21px'];

// Get max streak from cookie
const regex = /max-streak_thermite=([\d]+)/g;
let cookie = document.cookie;
if((cookie = regex.exec(cookie)) !== null){
    max_streak = cookie[1];
}
// Get max streak from cookie
const regex_time = /best-time_thermite=([\d.]+)/g;
cookie = document.cookie;
if((cookie = regex_time.exec(cookie)) !== null){
    best_time = parseFloat(cookie[1]);
}

const sleep = (ms, fn) => {return setTimeout(fn, ms)};

const range = (start, end, length = end - start + 1) => {
    return Array.from({length}, (_, i) => start + i)
}

const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}

// Options
document.querySelector('#speed').addEventListener('input', function(ev){
    document.querySelector('.speed_value').innerHTML = ev.target.value + 's';
    reset(); // Reset the game when speed is changed
});

document.querySelector('.btn_start').addEventListener('click', function(){
    start();
});

document.querySelector('.btn_again').addEventListener('click', function(){
    reset();
});

function listener(ev){
    if(!game_started) return;

    if( good_positions.indexOf( parseInt(ev.target.dataset.position) ) === -1 ){
        wrong++;
        ev.target.classList.add('bad');
    }else{
        right++;
        console.log(right); // Log the value of right
        ev.target.classList.add('good');
    }

    ev.target.removeEventListener('mousedown', listener);

    check();
}

function check(){
    if(wrong >= 3){
        stopTimer();
        resetTimer();
        game_started = false;

        let blocks = document.querySelectorAll('.group');
        good_positions.forEach( pos => {
            blocks[pos].classList.add('proper');
        });

        // Reset the streak only when the player loses
        streak = 0;

        // Show the container for entering name and saving score
        document.querySelector('.lost_container').classList.remove('hidden');

        // Hide the other elements
        document.querySelector('.splash').classList.add('hidden');
        document.querySelector('.groups').classList.add('hidden');

        document.querySelector('.btn_again').classList.remove('hidden');

        return;
    }
    if(right === mode_data[mode][0]){
        stopTimer();
        streak++;
        if(streak > max_streak){
            max_streak = streak;
            document.cookie = "max-streak_thermite="+max_streak;
            document.querySelector('.max_streak').innerHTML = max_streak; // Update max streak on UI
        }

        let time = parseFloat(document.querySelector('.streaks .time').innerHTML);

        if(time < best_time){
            best_time = time;
            document.cookie = "best-time_thermite="+best_time;
            document.querySelector('.best_time').innerHTML = best_time.toFixed(3) + 's';
        }

        axios.post('/saveData', {
            streak: streak,
            bestTime: time,
            maxStreak: max_streak // Include max streak when sending data to server
        })
        .then(function (response) {
            console.log(response.data);
            reset();
        })
        .catch(function (error) {
            console.error(error);
        });
    }
}

function addListeners(){
    document.querySelectorAll('.group').forEach(el => {
        el.addEventListener('mousedown', listener);
    });
}

function reset(){
    game_started = false;
    wrong = 0;
    right = 0;

    resetTimer();
    clearTimeout(timer_start);
    clearTimeout(timer_game);
    clearTimeout(timer_finish);

    document.querySelector('.splash').classList.remove('hidden');
    document.querySelector('.groups').classList.add('hidden');
    document.querySelector('.lost_container').classList.add('hidden'); // Hide the lost container

    document.querySelectorAll('.group').forEach(el => { el.remove(); });
}

function start(){
    reset(); // Reset the game when starting a new game

    positions = range(0, Math.pow(mode, 2) - 1 );
    shuffle(positions);
    good_positions = positions.slice(0, mode_data[mode][0]);

    let div = document.createElement('div');
    div.classList.add('group');
    div.style.width = mode_data[mode][1];
    div.style.height = mode_data[mode][1];
    const groups = document.querySelector('.groups');
    for(let i=0; i < positions.length; i++){
        let group = div.cloneNode();
        group.dataset.position = i.toString();
        groups.appendChild(group);
    }

    addListeners();

    document.querySelector('.streak').innerHTML = streak;
    document.querySelector('.max_streak').innerHTML = max_streak;
    document.querySelector('.best_time').innerHTML = best_time;

    timer_start = sleep(2000, function(){
        document.querySelector('.splash').classList.add('hidden');
        document.querySelector('.groups').classList.remove('hidden');

        let blocks = document.querySelectorAll('.group');
        good_positions.forEach( pos => {
            blocks[pos].classList.add('good');
        });

        timer_game = sleep(4000, function(){
            document.querySelectorAll('.group.good').forEach(el => { el.classList.remove('good')});
            game_started = true;

            startTimer();
            speed = document.querySelector('#speed').value;
            timer_finish = sleep((speed * 1000), function(){
                game_started = false;
                wrong = 3;
                check();
            });
        });
    });
}

function startTimer(){
    timerStart = new Date();
    timer_time = setInterval(timer,1);
}
function timer(){
    let timerNow = new Date();
    let timerDiff = new Date();
    timerDiff.setTime(timerNow - timerStart);
    let ms = timerDiff.getMilliseconds();
    let sec = timerDiff.getSeconds();
    if (ms < 10) {ms = "00"+ms;}else if (ms < 100) {ms = "0"+ms;}
    document.querySelector('.streaks .time').innerHTML = sec+"."+ms;

    if (sec >= speed) { // Stop the timer when the specified time is reached
        stopTimer();
        game_started = false;
        wrong = 3;
        check();
    }
}
function stopTimer(){
    clearInterval(timer_time);
}
function resetTimer(){
    clearInterval(timer_time);
    document.querySelector('.streaks .time').innerHTML = '0.000';
}
