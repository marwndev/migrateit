import { Task } from "./task.js";
import OpenAI from "openai";
import { PromptContext } from "./context.js";
import { MigrateItConfig } from "../interfaces/auto-migrate-config.js";

export abstract class BaseAgent<TResult> {
    private prompt: string[] = ['You are a DB Admin.'];
    private tasks: Task[] = [];
    private context: PromptContext[] = [];
    private footerInstructions: string[] = [];

    constructor(private config: MigrateItConfig, prompt: string) {
        this.prompt.push(prompt);
    }

    addTask(task: Task) {
        this.tasks.push(task);
    }

    addContext(context: PromptContext) {
        this.context.push(context);
    }

    addFooterInstructions(instructions: string) {
        this.footerInstructions.push(instructions);
    }

    getSystemPrompt() {
        return `
        ${this.prompt.join('\n')}
        You need to do the following tasks:
        ${this.tasks.map(task => `- ${task.description}`).join('\n')}
        Your answer should be formatted as follows:
        ${this.tasks.map(task => `<${task.tag}>{answer}</${task.tag}>`).join('\n')}
        ${this.footerInstructions.join('\n')}`;
    }

    getUserPrompt() {
        return `${this.context.map(context => `<${context.tag}>${context.context}</${context.tag}>`).join('\n')}`
    }

    protected async getAnswer() {
        if (this.config.llm?.provider === 'openai') {
            return this.getOpenAIAnswer();
        }

        throw new Error(`Provider ${this.config.llm?.provider} is not supported`);
    }

    private async getOpenAIAnswer() {
        const client = new OpenAI({
            apiKey: this.config.llm?.apiKey || process.env.OPENAI_API_KEY,
            baseURL: this.config.llm?.baseURL,
        });

        const systemPrompt = this.getSystemPrompt();
        const userPrompt = this.getUserPrompt();

        // console.log('system:::::', systemPrompt);
        // console.log('user:::::', userPrompt);

        const result = await client.chat.completions.create({
            model: this.config.llm?.model,
            temperature: 0.4,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ],
        });

        return result.choices[0].message.content;
    }

    abstract run(): Promise<TResult>;
}


