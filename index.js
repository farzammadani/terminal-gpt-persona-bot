import openai from "./config/open-ai.js";
import readlineSync from 'readline-sync';
import colors from 'colors';
import { OpenAIApi } from "openai";
import { existsSync, mkdirSync, writeFile } from 'fs';

// set to empty string to not have a persona


const personas = ["",  
, "answer as someone that always throws puns even if they are unfunny"
, "Answer as a person who lives 200 years in the future but can communicate with people from the past. Do not say you are from the future. Answer with full certainty even if you are making assumptions."]
const persona = personas[0]
let fullsessionname = ""

const modes = ["" , "Write your entire answer in markdown. Use code syntax of markdown when you want to show code."]
const mode = modes[1]

const writetofile = true;
// We need an async function for using createChatCompletion method of openai
async function main()
{
     console.log(colors.bold.green('Welcome to the chatbot program!'))
     if(persona != "")
     {
        console.log(colors.bold.magenta('Custom persona is active. Switch to default mode if you want more accurate results.'));
     }
     if(mode != "")
     {
        console.log(colors.bold.magenta(`Custom mode is active: ${mode}`));
     }
     if (writetofile == true)
     {
        console.log(colors.bold.magenta(`**The session will to written to a file. You will need to type exit for the text to be written in the file.**`));
     }
     

     console.log(colors.bold.green('You can start chatting with the bot.'))

     if (writetofile === true)
     {
        let sessionname = readlineSync.question(colors.magenta('Set session name or leave empty: '));
        let randomnr = Math.floor(Math.random() * 1000);
        fullsessionname = sessionname.replace(' ','-') + randomnr;
     }
    

    //  store chat history
     const chatHistory = [];

    while(true)
    {
        // readlinesync allows you to respond to prompts in terminal that you create.
        const userInput = readlineSync.question(colors.yellow('You: '));

        const userinputwithpersona = userInput + persona + mode;

      
        try{
            // Construct messages by iterating over the history
            const messages = chatHistory.map( ([role , content]) => ({
                role, content
            }) )

            // add latest user input
            messages.push({role: 'user' , content: userinputwithpersona});

            // Call the API with user input
           const completion = await openai.createChatCompletion(
            {
                model: 'gpt-3.5-turbo',
                messages: messages,
            }
           );

        //    Get completion text/content
        const completionText = completion.data.choices[0].message.content;

                 




              // allow exiting the loop
              if (userInput.toLowerCase() === 'exit')
              {
                console.log(colors.green('Bot: ' + completionText))
                return;
              }

            //   response of bot
              console.log(colors.green('Bot: ' + completionText))

              // Write or append to file

               // write to file
                if(writetofile === true) {
                    // Define the directory and file name
                    const dir = './markdown_files/';
                    const filename = `${dir}${fullsessionname}.md`;

                    // Check if directory exists, if not, create it
                    if (!existsSync(dir)){
                        mkdirSync(dir);
                    }

                    // Write or append to file
                // Write or append to file
                writeFile(filename, completionText, {'flag':'a'}, function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log("File written successfully");
                });

                }
   


            //   update history with user input + assistant response

            chatHistory.push(['user', userInput])
            chatHistory.push(['assistant', completionText])
        }
        catch(error)
        {
            console.error(colors.red(error))

        }

    }

}


main();