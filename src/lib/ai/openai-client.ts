import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function callAIEmployee(
  systemPrompt: string,
  userPrompt: string,
  model: string = 'gpt-4o',
  temperature: number = 0.7,
  maxTokens: number = 4000
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature,
      max_tokens: maxTokens,
    })
    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('AI Employee error:', error)
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
  }
}

export async function callAIWithHistory(
  systemPrompt: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  model: string = 'gpt-4o',
  temperature: number = 0.7,
  maxTokens: number = 4000
): Promise<string> {
  try {
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...history,
    ]
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    })
    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('AI call with history error:', error)
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
  }
}

export { openai }
