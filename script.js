// Default SortableJS
// import * as Sortable from './js/Sortable.js';

// Core SortableJS (without default plugins)
// import Sortable from 'sortablejs/modular/sortable.core.esm.js';

// Complete SortableJS (with all plugins)
// import Sortable from 'sortablejs/modular/sortable.complete.esm.js';

navigator.serviceWorker.register("./serviceWorker.js")
    .then((reg)=>{
        console.log("serviceWorker",reg);
    })
    .catch(err=>{
        console.log("error",err);
    })


window.onload=function() {

    // buttons and modal windows_
    const modal = document.querySelector('#my-modal');
    const modalHint = document.querySelector('#my-modal-hint');
    const modalAnswer = document.querySelector('#my-modal-answer');
    const modalAuthor = document.querySelector('#my-modal-author');
    const modalWin = document.querySelector('#my-modal-continue');
    const continueBtn = document.querySelector('#btn-next');
    const modalStart = document.querySelector('#my-modal-start');
    const playBtn = document.querySelector('.playButton-start');
    const modalBtn = document.querySelector('#modal-btn');
    const closeBtn = document.querySelector('.playButton');
    const hintBtn = document.querySelector('#modal-btn-hint');
    const answerBtn = document.querySelector('#modal-btn-answer');
    const authorBtn = document.querySelector('#modal-btn-author');
    const closeBtn1 = document.querySelector('.closeButton1');
    const closeBtn2 = document.querySelector('.closeButton2');
    const closeBtn3 = document.querySelector('.closeButton3');
    const submitBtn = document.querySelector('#btn-submit');

    //
    let levels = [];
    let currentLevel;
    let answerJson;
    let file;
    const equation = document.querySelector('#equation');
    const signs = document.querySelector('#signs');

    // for printing, display only modal windows
    function displayForPrint(){
        modal.style.display = "block";
        modalHint.style.display = "block";
        modalAnswer.style.display = "block";
    }
    window.onbeforeprint = displayForPrint;
    // after print, close modal windows
    function closeAfterPrint(){
        modal.style.display = "none";
        modalHint.style.display = "none";
        modalAnswer.style.display = "none";
    }
    window.onafterprint = closeAfterPrint;
    // Events for buttons
    modalBtn.addEventListener('click', openModal);
    hintBtn.addEventListener('click', openModalHint);
    answerBtn.addEventListener('click', openModalAnswer);
    authorBtn.addEventListener('click', openModalAuthor);
    closeBtn.addEventListener('click', closeModal);
    closeBtn1.addEventListener('click', closeModalHint);
    closeBtn2.addEventListener('click', closeModalAnswer);
    closeBtn3.addEventListener('click', closeModalAuthor);
    playBtn.addEventListener('click', closeModalStart);
    submitBtn.addEventListener('click', submitResult);
    continueBtn.addEventListener('click', initLevel);
    // Open
    function openModal() {modal.style.display = 'block';}
    function openModalHint() {modalHint.style.display = 'block';}
    function openModalAnswer() {modalAnswer.style.display = 'block';}
    function openModalAuthor() {modalAuthor.style.display = 'block';}
    // Close
    function closeModal() {modal.style.display = 'none';}
    function closeModalHint() {modalHint.style.display = 'none';}
    function closeModalAnswer() {modalAnswer.style.display = 'none';}
    function closeModalAuthor() {modalAuthor.style.display = 'none';}
    function closeModalStart() {modalStart.style.display = 'none';}
    function submitResult(){
        let result = ""
        equation.childNodes.forEach(c => {
            result+=c.innerHTML
        })
        if(result === answerJson){
            // console.log("You won")
            modalWin.style.display = "block";
            $('#errorMsg').html("");
        }
        else{
            // console.log("You won't");
            $('#errorMsg').html("I don't think that's right.");
        }
    }

    //load JSON
    getData();

    function getData(){
        fetch("./levels.json")
            .then(res => res.json())
            .then(data => {
                file = data;
                initLevel(false)

                Sortable.create(equation, {
                    group: "groupped",
                    sort: true,
                    swap: true,
                    put: true,
                    filter: ".cards:not(.drag)",
                })

                Sortable.create(signs, {
                    group: "groupped",
                    swap: true,
                    clone: true,
                    sort: true,
                    pull: true,
                    onSort: function (){
                        console.log("ideeee")
                        initSigns()
                    }
                })
        })

    }

    function initSigns(){
        signs.innerHTML = ""
        for(let i = 0; i < file[currentLevel].signs.length; i++){
            let signsCard = document.createElement("li");
            signsCard.setAttribute("class", "cards drag insertCard");
            signsCard.innerHTML = file[currentLevel].signs[i].toString();
            signs.appendChild(signsCard);
        }
    }

    function initLevel(next=true){
        // console.log(levels)
        if(next){
            if( levels.length === 0) {
                for (let i = 0; i < file.length; i++) {levels.push(i);}
                levels = levels.sort(() => Math.random() - 0.5);
            }
            // console.log("pop")
            currentLevel = levels.pop();
        }
        else{
            let result = localStorage.getItem("save")
            console.log(result)
            if(result !== null){
                result = JSON.parse(result)
                currentLevel = result.level;
                levels = result.levels;
            }else{
                modalStart.style.display = 'block';
                modalStart.style.backgroundColor = '#b7a984';
                // console.log("nothing")
                initLevel();
            }
        }
        // console.log(currentLevel)
        $("#levelCount").html("Level: "+ (+currentLevel+1))
        saveGame()
        answerJson = file[currentLevel].answer;

        equation.innerHTML = ""
        // signs.innerHTML = ""
        $('#hint').html(file[currentLevel].hints)
        $('#answer').html(file[currentLevel].answer)


        let i = 0;
        let index = 0;
        while(i < file[currentLevel].equation.length) {
            let equationCard
            if(!Number.isInteger(parseInt(file[currentLevel].equation[i])) && file[currentLevel].equation[i] !== "=" && file[currentLevel].equation[i] !== "(" && file[currentLevel].equation[i] !== ")"){
                equationCard = document.createElement("li");
                equationCard.setAttribute("id", "insertCards"+index);
                equationCard.setAttribute("class", "insertCard cards")
                index++;
            }
            else{
                equationCard = document.createElement("div");
                equationCard.setAttribute("class", "cards");
            }
            equationCard.innerHTML = file[currentLevel].equation[i].toString();
            equation.appendChild(equationCard);
            i++;
        }
        initSigns()
        modalWin.style.display = "none";
    }

    function saveGame(){
        let save = {
            level: currentLevel,
            levels: levels,
        }
        localStorage.setItem("save", JSON.stringify(save))
    }





}
