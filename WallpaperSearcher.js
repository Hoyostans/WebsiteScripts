const searchCharacters = SearchCharacters();
document.getElementById("inputButton").onclick = searchCharacters;

console.log("Started");


async function FetchJsonData(requestURL, type) {

    let request = new Request(requestURL);

    let response = await fetch(request);
    let fileDataText = await response.text();
    let data = JSON.parse(fileDataText);

    if (type == "characterData") {
        characterData = data;
        charKeys = Object.keys(data);
    }
    else if (type == "fileData") {
        fileData = data;
    }
    else if (type == "characterRedirects") {
        characterRedirects = data;
        redirKeys = Object.keys(data);
    }

}






FetchJsonData("https://raw.githubusercontent.com/" + repo + "1/refs/heads/main/characterToFile.json", "characterData");
FetchJsonData("https://raw.githubusercontent.com/" + repo + "1/refs/heads/main/fileData.json", "fileData");
FetchJsonData("https://raw.githubusercontent.com/" + repo + "1/refs/heads/main/characterRedirects.json", "characterRedirects");
var divtemplatebase = SetupFormRedir(document.getElementsByClassName("divholder")[0]);
var divspawner = document.getElementsByClassName("divspawner")[0];
var divtemplate = divtemplatebase.cloneNode(true);
divtemplatebase.remove();

var fixedSearch = false;



function SearchCharacters() {
    console.log("Started Search");
    let item = document.getElementById("nameInput").value;
    if (item != "") {
        var charactersBuffer = item.replaceAll(" ,", ",").replaceAll(", ", ",").split(",");
        var characters = [];
        var output = [];

        var newCharactersBuffer = [];

            <!--noformat on-->
            let a = 0;
        console.log(charactersBuffer);
        if (charactersBuffer.includes("|")) {
            fixedSearch = true;
        }
        else {
            fixedSearch = false;
        }
        for (let i = 0; i < charactersBuffer.length; i++) {
            let characterItem = charactersBuffer[i];
            if (!(redirKeys.includes(characterItem)) && !(charKeys.includes(characterItem))) {
                characterItem = capitalizeFirstLetter(characterItem);

            }
            newCharactersBuffer.push(characterItem);
        }
        charactersBuffer = [];
        charactersBuffer = newCharactersBuffer;
        let len = charactersBuffer.length;
        let redirects = [];

        while (len > 0) {
            let addCharacter = charactersBuffer[0];
            if (redirKeys.includes(addCharacter)) {
                redirects[addCharacter] = (characterRedirects[addCharacter]);
                var runLoopAmount = redirects[addCharacter].length;
                let runLoop = true;
                var runA = -1;
                while (runLoop) {
                    runA += 1;

                    if (!(runA < runLoopAmount)) {
                        runLoop = false;
                    }
                    if (runLoop) {
                        let redirItem = redirects[addCharacter][runA];
                        if (redirKeys.includes(redirItem)) {
                            for (let runB = 0; runB < characterRedirects[redirItem].length; runB++) {
                                redirects[addCharacter].push(characterRedirects[redirItem][runB]);
                                runLoopAmount++;
                            }
                        }

                    }

                }
                let newRedirects = [];
                let newRedirKeys = Object.keys(redirects);
                for (let runA = 0; runA < newRedirKeys.length; runA++) {
                    newRedirects[newRedirKeys[runA]] = [];
                    for (let runB = 0; runB < redirects[newRedirKeys[runA]].length; runB++) {
                        if (charKeys.includes(redirects[newRedirKeys[runA]][runB])) {
                            newRedirects[newRedirKeys[runA]].push(redirects[newRedirKeys[runA]][runB]);
                        }
                    }
                }
                redirects = newRedirects;
            }
            if (charKeys.includes(addCharacter)) {
                characters.push(addCharacter);
            }
            charactersBuffer.shift();
            len -= 1;

        }

        for (let i = 0; i < characters.length; i++) {
            let character = characters[i];
            for (let o = 0; o < characterData[character].length; o++) {
                output.push(characterData[character][o]);
            }
        }<!--noformat off-->
            ProcessOutput(output, characters, redirects);
    }



}

function ProcessOutput(outputOriginal, originalGivenCharacters, redirects) {
  <!--noformat on-->
        let givenCharacters = originalGivenCharacters;
    let spawnerDivLen = divspawner.childElementCount;
    for (let i = 1; i < spawnerDivLen; i++) {
        divspawner.removeChild(divspawner.lastChild);

    }
    output = [];

    var chosenCharacterData = [{}];

    for (let i = 0; i < givenCharacters.length; i++) {
        chosenCharacterData[givenCharacters[i]] = characterData[(givenCharacters[i])];
    }

    if (redirects != [{}]) {
        let chosenRedirectKeys = Object.keys(redirects);

        for (let i = 0; i < chosenRedirectKeys.length; i++) {
            if (!givenCharacters.includes(chosenRedirectKeys[i])) {
                chosenCharacterData[chosenRedirectKeys[i]] = [];
                givenCharacters.push(chosenRedirectKeys[i]);
            }

            for (let o = 0; o < chosenRedirectKeys[i].length; o++) {
                chosenCharacterData[(chosenRedirectKeys[i])] = chosenCharacterData[(chosenRedirectKeys[i])].concat(characterData[redirects[chosenRedirectKeys[i]][o]]);
            }


        }
    }

    if (givenCharacters.length > 1) {
        let shortestList = "";
        let shortestListNo = 5000;
        for (let i = 0; i < givenCharacters.length; i++) {

            if (chosenCharacterData[givenCharacters[i]].length < shortestListNo) {
                shortestList = givenCharacters[i];
            }
        }

        outputOriginal = chosenCharacterData[shortestList];
        for (let o = 0; o < outputOriginal.length; o++) {

            let includeImage = true;
            for (let i = 0; i < givenCharacters.length; i++) {
                if (!(chosenCharacterData[givenCharacters[i]].includes(outputOriginal[o]))) {
                    includeImage = false;
                }
            }
            if (includeImage && !(output.includes(outputOriginal[o]))) {
                output.push(outputOriginal[o]);
            }
        }

    }

    else {
        output = chosenCharacterData[givenCharacters[0]];
    }
    if (fixedSearch) {
        output = FixedSearchProcess(output, originalGivenCharacters)
    }
    output.sort();
    let processed = [];

    for (let i = 0; i < output.length; i++) {
        if (!processed.includes(output[i])) {
            processed.push(output[i]);
            CreateDiv(output[i]);
        }



    }<!--noformat off-->
      }


function FixedSearchProcess(output, characters) {
    let newOutput = [];
    characters.sort();
    console.log(characters);
    for (let i = 0; i < output.length; i++) {
        try {
            let outputCharacters = fileData[output[i]]["Characters"];
            outputCharacters.sort();
            let useImage = true;
            for (let o = 0; o < outputCharacters.length; o++) {
                if (!characters.includes(outputCharacters[o])) {
                    useImage = false;
                    o = 100;
                }
            }
            if (useImage) {
                newOutput.push(output[i]);
            }

        }
        catch (err) { }
        finally { }
    }
    return newOutput
}


async function CreateDiv(output, i) {
      
       <!--noformat on-->
       if (output != undefined) {
        let newDiv = divtemplate.cloneNode(true);
        newDiv.style.color = "white";
        let newDivImage = newDiv.getElementsByClassName("divimage")[0];
        let newDivVideo = newDiv.getElementsByClassName("divvideo")[0];
        if (output.includes(".mp4") || output.includes(".mpeg") || output.includes(".webm") || output.includes(".mov")) {
            newDivImage.remove();
            newDivImage = newDivVideo.getElementsByTagName("video")[0];
        }
        else {
            newDivVideo.remove();
            newDivImage = newDivImage.getElementsByTagName("img")[0];

        }

        newDivImage.src = "https://raw.githubusercontent.com/" + repo + fileData[output]["RepoNo"].toString() + "/refs/heads/main/" + output.replaceAll("#", "%23");
        let charactersList = fileData[output]["Characters"];
        charactersList.sort();
        let characters = "" + charactersList[0]
        for (let o = 1; o < charactersList.length - 1; o++) {
            characters += ", " + charactersList[o];
        }
        if (charactersList.length > 1) {
            characters += " & " + charactersList[charactersList.length - 1];
        }
        newDiv.getElementsByClassName("divcharacters")[0].innerText = characters;
        newDiv.getElementsByClassName("divfiletype")[0].innerText = fileData[output]["FileExtension"];
        let fileDimensions = fileData[output]["FileDimensions"];
        newDiv.getElementsByClassName("divfiledimensions")[0].innerText = fileDimensions[0].toString() + " x " + fileDimensions[1].toString();
        let charForm = newDiv.getElementsByClassName("characterform")[0].firstChild;
        charForm.innerHTML = charForm.innerHTML.replace("tmpValue", output);
        SetupFormRedir(newDiv);

        divspawner.appendChild(newDiv);

    }
}<!--noformat off-->


    function capitalizeFirstLetter(val) {
        let items = val.split(" ");
        let output = [];
      <!--noformat on-->
  for (let i = 0; i < items.length; i++) {
            output.push(String(items[i]).charAt(0).toUpperCase() + String(items[i]).slice(1).toLowerCase());

        }
  <!--noformat off-->


      return output.join("");
    }

function SetupFormRedir(thisdiv) {

    const form = thisdiv.getElementsByTagName("form")[0];
    //const thankYouMessage = document.getElementById("thankYouMessage");
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(form);

        fetch(form.action,
            {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            })
            .then(response => {
                form.reset();
            })
            .catch(error => {
                console.error('Error submitting form:', error, error.message);
            });
    });
    return thisdiv;
}



