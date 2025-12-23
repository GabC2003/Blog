---
title: CS146s学习笔记 week 1-2
date: 2025-12-22
updated: 2025-12-22
keywords: ["LLM-powered Coding","Software Engineering"]
featured: true
summary: "CS146s学习笔记"
---
## Week 1
LLMs (large language models) are autoregressive models for next-token prediction.
In practice, strengths and limitations both exist.
![img](https://res.cloudinary.com/dbrbdlmsx/image/upload/v1766477401/blog_images/llm_current_situation.png)

To make full use of LLMs, we need to design powerful prompts and follow some best practices.
Below is the best practices how Openai uses Codex.
![img](https://res.cloudinary.com/dbrbdlmsx/image/upload/v1766477403/blog_images/how_openaiusesCodex_part1.png)

![img](https://res.cloudinary.com/dbrbdlmsx/image/upload/v1766477404/blog_images/how_openaiusesCodex_part2.png)

To make full use of LLMs, we need to design powerful prompts and follow some best practices.
### Various kinds of Prompts

| Prompt Type | Description | Example |
| :--- | :--- | :--- |
| **Zero-shot** | Asking without examples. | "Tell me a joke." |
| **Few-shot (K-shot)** | Providing examples to guide output. | "Sun->Hot, Ice->Cold, Fire->?" |
| **Chain-of-Thought (CoT)** | "Thinking step-by-step" for complex problems. | "Q: 10+5-2?<br />A: 10+5=15... Ans: 13." |
| **Self-Consistency** | Majority vote from multiple reasoning paths. | Output: [42, 42, 40] -> Final: 42 |
| **Tool Use** | Using external tools (APIs/Calculators). | "Weather?" -> calls `get_weather()` |
| **RAG** | Fetching external data for context. | Question + [Company Handbook] -> Answer |
| **Reflexion** | Self-correction after mistakes. | Code fails -> "I missed var" -> Rewrite |

### Prompt Architecture
![alt text](https://res.cloudinary.com/dbrbdlmsx/image/upload/v1766477405/blog_images/prompt_arch.png)
How these prompts all stack together?
- Sys prompt usually not seen
- User prompt usually where you provide your ask
- Assistant prompt where the LLM responds

### Best Practices for Prompting

- **Prompt Improvement**
  [Anthropic Prompt Improver](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/prompt-improver)

- **Clear Prompting**
  Give the prompt to someone with minimal context. If they are confused, the LLM will be too.

- **Role Prompting**
  Use role prompting aggressively to make system prompts more powerful.

## Week2 
### MCP
def:MCP is essentially a universal adapter between AI applications and external tools or data sources. 
![alt text](https://res.cloudinary.com/dbrbdlmsx/image/upload/v1766477407/blog_images/mcp_basic.png)
Below is the flow of MCP application
![alt text](https://res.cloudinary.com/dbrbdlmsx/image/upload/v1766477408/blog_images/mcp_application.png)
#### apis don't make mcp tools
In software engineering, restful apis are widely used, but they may not be suitable for LLMs.
##### 核心挑战 (Core Challenges)

* **Tool Explosion**: Large APIs have hundreds of endpoints. Mapping each to a tool exceeds model limits (e.g., Claude's 128-tool limit) and wastes the **Context Window**.
* **Token Inefficiency**: JSON responses are verbose. Returning "all fields" via API forces the model to process redundant data (brackets, keys, unused fields), increasing latency and cost.
* **Abstraction Mismatch**: APIs are rigid (e.g., `get_user_by_id`). Models work better with flexible, intent-based tools that handle fuzzy logic.

##### 解决方案 (Proposed Solutions)

* **Aggregated Tools**: Combine multiple endpoints into a single, powerful MCP tool.
* **Data Thinning**: Pre-filter data on the server. Convert JSON to **CSV or Markdown** to save tokens.
* **Agent-Centric Design**: Write tool descriptions like prompts. Guide the model on *how* and *why* to use the tool rather than just describing the technical interface.
### Coding Agent

Core steps of a Minimum Viable Workflow (MVW):

1. **Read in terminal and keep appending to conversation**: Read user input in the terminal and continuously append it to the conversation history to maintain context.
2. **Tell LLM what tools are available**: Declare the available toolset to the LLM (Tool Definition).
3. **LLM asks for tool use at appropriate time**: The LLM requests tool execution at the right moment based on task requirements (Tool Call).
4. **Execute tool offline and return response**: Execute the specific tool logic locally or offline and return the execution results to the LLM.

**Minimum Toolset:**
* `Read_file`: Read specific file content.
* `List_dir`: Explore directory structure to understand project layout.
* `Edit_file`: Core productivity tool for creating new files or editing existing ones.
![alt text](https://res.cloudinary.com/dbrbdlmsx/image/upload/v1766481250/blog_images/codingAgentPattern.png)