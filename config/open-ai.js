import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';

// to use dotenv
dotenv.config();

// create config of openai
const configuration = new Configuration(
    {
        apiKey: process.env.OPENAI_API_KEY
    }
);

// create a new instance of openai and pass in the config
const openai = new OpenAIApi(configuration)


// set to empty string to not have a persona
const persona = "Answer in a very friendly manner (with lots of emojis)."

export default openai;