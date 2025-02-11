import { OpenAI } from 'openai';

import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});

const report_gen = async (clean_text) => {
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: "You are a Doctor assistant. Analyze the conversation between Doctor and Patient given as input and generate the diagnosis and prescription and required medical test for the patient as a report and format the report and bold the titles and subtitles"
            },
            {
                role: "user",
                content: clean_text
            }
        ]
    });

    return response.choices[0].message.content;
};


const compareReport = async (report1, report2)=>{
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: `You are a Doctor’s assistant. user will provide you with two medical reports: Report 1 (previous report) and Report 2 (new report). Your task is to:\n
                            1. Analyze both reports and identify any changes in the patient's condition (e.g., symptoms, test results, diagnosis).\n
                            2. Generate a detailed diagnosis based on the findings from the reports.\n
                            3. Provide the following additional details:\n   
                                - A prescription with appropriate medications, dosages, and schedules based on the diagnosis.\n   
                                - Recommendations for any follow-up medical tests or investigations.\n
                            4. Summarize your findings in a formatted report that includes:\n 
                                - Diagnosis\n   
                                - Prescription\n    
                                - Follow-up Medical Tests or Investigations.\n
                            Also include Name,date of report generate and Doctors's name(if mention) in the report . \n

                            Important: Base your response strictly on the data provided in the two reports.Ignore any prior context or external information and bold the titles and subtitles`
            },
            {
                role: "user",
                content: `Report1:(Previous Report) ${report1}\nReport2(New Report): ${report2}`
            }
        ]
    });

    return response.choices[0].message.content;

}

export {report_gen,compareReport};

