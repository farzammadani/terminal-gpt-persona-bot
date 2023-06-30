import openai from "./config/open-ai.js";
import readlineSync from 'readline-sync';
import colors from 'colors';
import { OpenAIApi } from "openai";


// set to empty string to not have a persona
const personas = ["", "Answer in a very friendly manner (with lots of emojis).", 
"Answer as a cat that is just learing to speak." 
, "answer as someone that always throws puns even if they are unfunny"
, "Answer as a person who lives 200 years in the future but can communicate with people from the past. Do not say you are from the future. Answer with full certainty even if you are making assumptions."]
const persona = personas[1]


// We need an async function for using createChatCompletion method of openai
async function main()
{
     console.log(colors.bold.green('Welcome to the chatbot program!'))
     if(persona != "")
     {
        console.log(colors.bold.magenta('Custom persona is active. Switch to default mode if you want more accurate results.'));
     }
     console.log(colors.bold.green('You can start chatting with the bot.'))

    //  store chat history
     const chatHistory = [];

    while(true)
    {
        // readlinesync allows you to respond to prompts in terminal that you create.
        const userInput = readlineSync.question(colors.yellow('You: '));

        const userinputwithpersona = userInput + persona;

      
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

              console.log(colors.green('Bot: ' + completionText))


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