// collecting all the html elements as variables
selectTag = document.querySelectorAll("select");
translateButton = document.querySelector('button');
fromText = document.querySelector('.from-text');
toText = document.querySelector('.to-text');
exchangeButton = document.querySelector('.exchange');
icons = document.querySelectorAll(".row i");

// copy function
const copyContent=(text)=>{
    navigator.clipboard.writeText(text);
}

//reading out the text function
 const utterText=(text , language)=>{
    // retrieving the API
    const synth=window.speechSynthesis
    console.log(text, language);
    // making request for utterance with given text
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language; // setting the language
    synth.speak(utterance); // resding the text out
 }

 selectTag.forEach((tag, id) => {
    console.log(tag, id);
    for(let language in languages) {
        let selected = id == 0 ? (language == "en-GB" ? "selected" : "") 
                               : (language == "hi-IN" ? "selected" : "");
        let option = `<option ${selected} value="${language}">${languages[language]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
})
exchangeButton.addEventListener("click", () => {
    // Swapping the Input Texts
    let tempValue = fromText.value;
    fromText.value = toText.value;
    toText.value = tempValue;
    
    //  Swapping the Selected Languages
    let tempLang = selectTag[0].value;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

translateButton.addEventListener("click", () => {
    fromLanguage = selectTag[0].value
    toLanguage = selectTag[1].value
    console.log(fromLanguage, toLanguage);
    let text = fromText.value;
    if(!text) {
        toText.value = "";
        toText.setAttribute("placeholder", "");
        return;
    }
    toText.setAttribute("placeholder", "Translating...");
    let url = `https://api.mymemory.translated.net/get?q=${text}&langpair=${fromLanguage}|${toLanguage}`;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.responseData);
        toText.value = data.responseData.translatedText;
    });
})
icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(!fromText.value || !toText.value) return;
        if(target.classList.contains("fa-copy")) {
            if(target.id == "from") {
                copyContent(fromText.value);
            } else {
                copyContent(toText.value);
            }
        } else {
            if(target.id == "from") {
                utterText(fromText.value, selectTag[0].value);
            } else {
                utterText(toText.value, selectTag[1].value);
            }
        }
    })
})



