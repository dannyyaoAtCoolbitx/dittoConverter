const fs = require('fs');
const style = require('console-style');
// the file path to the json file to convert
const dittoFilePath = process.argv[2];
const filePrefix = process.argv[3] || './';
// the translation object is to store the copy parsed
const CHINESE = 'chinese';
const translation = {};
translation[CHINESE] = {};
console.log(style.white("----------------------"))
console.log("Parsing file: ");
console.log(style.bold(dittoFilePath));
console.log(style.white("----------------------"))

let projectName;

fs.readFile(dittoFilePath, 'utf-8', (error, content)=>{
    const dittoData = JSON.parse(content);
    const { frames } = dittoData;
    projectName = dittoData.project_name
    console.log(style.cyan(`${Object.keys(frames).length} frames to be parsed...`))
    for(let frame in frames){
        console.log(style.white(`Parsing ${frame}...`))
        for(let textKey in frames[frame].otherText){
            // the original copy is chinese
            translation[CHINESE][textKey] = frames[frame].otherText[textKey]["text"];
            // check all other variants/langs
            for(let other_language in frames[frame].otherText[textKey].variants){
                // initial the language if no previous records
                if(!translation[other_language]){
                    translation[other_language] = {}
                }
                // record the other languages
                translation[other_language][textKey] = frames[frame].otherText[textKey].variants[other_language];
            }
        }
    }
    // store the translations into other JSON files
    console.log(style.white("----------------------"))
    for(let lang in translation){
        const fileName = `${filePrefix}${projectName}_${lang}.json`;
        fs.writeFile(fileName, JSON.stringify(translation[lang]), ()=>{
            console.log(style.green(`File stored: ${fileName}`))
        })
    }
})