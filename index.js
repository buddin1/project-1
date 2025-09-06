const createElements= (arr) => {
    const htmlElement = arr.map((el) => `<span class="btn">${el}</span>`)
    return htmlElement.join(" ");
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const loadLessons = ()=> {
    fetch( "https://openapi.programming-hero.com/api/levels/all")
    .then(res => res.json())
    .then(json => displayLessons(json.data))
};
const removeActive = (id) => {
    const lessonButtons = document.querySelectorAll('.lesson-btn');
    lessonButtons.forEach(btn => btn.classList.remove('active'));
}
const loadLevelWord = (id) => {
    manageSpinner(true)
    fetch(`https://openapi.programming-hero.com/api/level/${id}`)
    .then((res) => res.json())
    .then((data) => { 
        removeActive();
        const clickBtn = document.getElementById(`lesson-btn-${id}`)
        // console.log(clickBtn)
        clickBtn.classList.add("active");
        displayLevelWords(data.data)
    }

)
}
const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayLoadWordDetail(details.data);
}
const displayLoadWordDetail=(word)=>{
       const detailsBox= document.getElementById("details-container")
       detailsBox.innerHTML=`<div>
          <h2 class="text-2xl font-bold">${word.word}( <i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2>
        </div>
        <div>
          <h2 class="font-bold">meaning</h2>
          <p>${word.meaning}</p>
        </div>
        <div>
          <h2 class="font-bold">example</h2>
          <p>${word.sentence}</p>
        </div>
        <div>
          <h2 class="font-bold">synonyms</h2>
          <div>${createElements(word.synonyms)}</div>
        </div>`
       document.getElementById("word_modal").showModal();

}
const displayLevelWords = (words) => {
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = '';
    if(words.length==0){
         wordContainer.innerHTML = `<div class="text-center col-span-full rounded-xl py-10 space-y-6">
         <img class="mx-auto" src="assets/alert-error.png" alt="">
        <p class="text-xl font-medium text-gray-400 font-bangla">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h2 class="font-semibold text-4xl font-bangla">নেক্সট Lesson এ যান</h2>
      </div>`;
manageSpinner(false)
        return;
    }
    words.forEach(word => {
        const card= document.createElement('div');
        card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-15 px-5 space-y-4">
        <h2 class="font-bold text-2xl ">${word.word ? word.word:"word not found"}</h2>
        <p class="font-semibold ">meaning / pronunciation</p>
        <div class="font-medium text-2xl font-bangla">${word.meaning? word.meaning:"meaning not found"} / ${word.pronunciation? word.pronunciation:"pronunciation not found"}</div>
        <div class="flex justify-between items-center">
          <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1a91ff11] hover:bg-[#1a91ff80]"><i class="fa-solid fa-circle-info"></i></button>
          <button onclick="pronounceWord('${word.word}')"" class="btn bg-[#1a91ff11] hover:bg-[#1a91ff80]" ><i class="fa-solid fa-volume-high"></i></button>
        </div>

      </div>
         `
         wordContainer.appendChild(card);
})
manageSpinner(false);
}
const manageSpinner = (status)=> {
  if(status == true){
    document.getElementById("spinner").classList.remove("hidden")
    document.getElementById("word-container").classList.add("hidden")
  }else{
    document.getElementById("word-container").classList.remove("hidden")
    document.getElementById("spinner").classList.add("hidden")
  }
}









const displayLessons = lessons => {
const levelContainer = document.getElementById('level-container');
levelContainer.innerHTML = '';
lessons.forEach((lesson) => {
    const btnDiv = document.createElement("div");
    const button = document.createElement("button");
    button.id = `lesson-btn-${lesson.level_no}`;
    button.className = "btn btn-outline btn-primary lesson-btn";
    button.innerHTML = `<i class="fa-solid fa-book-open-reader"></i>Lesson-${lesson.level_no}`;
    button.addEventListener("click", () => loadLevelWord(lesson.level_no));
    btnDiv.appendChild(button);
    levelContainer.appendChild(btnDiv);
});

}
loadLessons();

document.getElementById("btn-search").addEventListener("click", () => {
    removeActive()
    const input= document.getElementById("input-search")
    const searchValue = input.value.trim().toLowerCase();
    fetch("https://openapi.programming-hero.com/api/words/all")
    .then(res=>res.json())
    .then(data=>{
        const allWords = data.data;
        const filterWords = allWords.filter(word=>word.word.toLowerCase().includes(searchValue))
        displayLevelWords(filterWords)
    })

})
