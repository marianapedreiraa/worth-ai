'use strict'
import OpenAI from 'openai'; 

export async function getAssistantMessage (msg, messageHistory) {
    const openai = new OpenAI({apiKey: localStorage.getItem('openaiKey'), dangerouslyAllowBrowser: true });

    var messages = new Array();
    const delimiter = '####';

    messages = messages.concat(
        [{
            content: `
            Sua linguagem será mediante a o usuario.
            Você é um estilista especialista em moda com o nome de Charles Frederick Worth, você não cria roupas você auxlia o seu usuario com respostas pertinentes. Deve Fornecer todo apoio relacionado somente a moda, composição de looks, organização de armarios e compras sobre moda.
            Não combine roupas xadres com estampado e nem com roupas listradas.
            Bloqueia qualquer assunto fora a moda, independentamente da pergunta.
            A seguir o usuário irá enviar perguntas. Sempre responda com a melhor opção para organizar os desafios que encontrar na pergunta.
            bloqueia qualquer assunto que não aborde o tema moda e organização de armários ou você mesmo, e de a seguinte resposta: "Este assunto não envolve moda! ".
            A mensagem do usuário está após o delimitador ` + delimiter,
            role: 'system'   
        }],
        messageHistory,
        [{
            content : delimiter + ' ' + msg,
            role : 'user'
        }]
    );
    
    const chatParams = {
        model: "gpt-3.5-turbo", 
        messages: messages,
        temperature: 0.5, // The randomness of the completion
        frequency_penalty: 0.1, // The penalty for repeating words or phrases
        presence_penalty: 0.1 // The penalty for mentioning new entities
    };

    const completion = await openai.chat.completions.create(chatParams);
    return completion.choices[0].message;
}