// const def_prompt = `The following is a transcript of an interview dialogue. Please extract the last question asked by the interviewer and provide an answer. If it is an algorithm question, please provide the approach and code implementation. If no question is found, there is no need to respond.`


function gpt_system_prompt() {
    return localStorage.getItem("gpt_system_prompt")
}

function azure_language() {
    return localStorage.getItem("azure_language") || "en-US"
}

function azure_region() {
    return localStorage.getItem("azure_region") || "eastasia"
}

function gpt_model() {
    return localStorage.getItem("gpt_model") || "gpt-3.5-turbo"
}

export default {
    gpt_system_prompt,
    azure_language,
    azure_region,
    gpt_model
}