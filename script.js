// collecting all the html elements as variables
selectTag = document.querySelectorAll("select");  // return a NodeList(array) of all the options present inside the selct drop down list
translateButton = document.querySelector('button');
fromText = document.querySelector('.from-text');
toText = document.querySelector('.to-text');
exchangeButton = document.querySelector('.exchange');
icons = document.querySelectorAll(".row i"); //returns a NodeList(array) of all the elements- i present inside the row class

// copy function
const copyContent=(text)=>{++
    navigator.clipboard.writeText(text);
}

//function for reading out the text
 const utterText=(text , language)=>{
    // retrieving the API
    const synth=window.speechSynthesis
    console.log(text, language); //for purpose of debugging
    // making request for utterance with given text
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language; // setting the language
    synth.speak(utterance); // reading the text out
 }

  //loop for populating the select drop down list with the data present in the object of languages

 selectTag.forEach((tag, id) => {
    //tag refers to the elements present inside the select tag and id refers to the id of those elements starting from 0
    console.log(tag, id);
    for(let language in languages) {
        //setting the default selected language
        let selected = id == 0 ? (language == "en-GB" ? "selected" : "") 
                               : (language == "hi-IN" ? "selected" : "");
        let option = `<option ${selected} value="${language}">${languages[language]}</option>`;
        // This inserts the new <option> inside the <select> tag ... beforeend ensures new options are added at the end.
        tag.insertAdjacentHTML("beforeend", option);
    }
});


exchangeButton.addEventListener("click", () => {
    // Swapping the texts in the "texts areas"
    let tempValue = fromText.value;
    fromText.value = toText.value;
    toText.value = tempValue;
    
    //  Swapping the Selected Languages in the drop down lists
    let tempLang = selectTag[0].value;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

translateButton.addEventListener("click", () => {
    fromLanguage = selectTag[0].value
    toLanguage = selectTag[1].value
    console.log(fromLanguage, toLanguage);
    let text = fromText.value;
    if(!text) { //if there is nothing in the from text
        toText.value = "";
        toText.setAttribute("placeholder", ""); //set the placeholder as empty
        return;
    }
    // Set placeholder text while translating:
    toText.setAttribute("placeholder", "Translating your text...");
    let url = `https://api.mymemory.translated.net/get?q=${text}&langpair=${fromLanguage}|${toLanguage}`;
    fetch(url) //fetch() function calls the translation API.
    .then(res => res.json()) //storing the translated text in json format
    .then(data => { 
        console.log(data.responseData);
        toText.value = data.responseData.translatedText;  //assigning the translated text
    });
});

//looping over all the icons present in the icon class
icons.forEach(icon => {  // we will lopp over copy and speaker icons
    icon.addEventListener("click", ({target}) => {
        if(!fromText.value || !toText.value) return; //If either input box is empty, the function stops here.
        if(target.classList.contains("fa-copy")) {  // if the button clickes is the copy button
            if(target.id == "from") {
                copyContent(fromText.value); //calling the copy function
            } else {
                copyContent(toText.value);
            }
        } else { //if Not a Copy Icon, It Must Be a Speech Icon (fa-volume-high)
            if(target.id == "from") {
                utterText(fromText.value, selectTag[0].value); //calling the utter text function
            } else {
                utterText(toText.value, selectTag[1].value);
            }
        }
    });
});



