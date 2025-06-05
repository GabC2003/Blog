---
title: MCP浅析
date: 2025-06-05
updated: 2025-06-05
keywords: ["MCP","LLM"]
featured: true
summary: "浅要分析MCP"
---


# 为什么会有MCP
## 大模型天生具有的短板
+ 基于之前的数据训练，例如GPT3.5发布于2022.11，现在问他明天的天气是不知道的
+ 计算上容易出问题：9.11 > 9.9 因为它本质上是一个概率语言模型
+ 解决思路：把天气，计算器等"外设"接入到模型上

## Function Call的出现
2023.6.13，OpenAI把**function calling **放入了GPT-4 API

**Function calling**是大模型与外部工具/程序交互的一种能力。

![Function Calling工作流程图](/images/blog/function-calling-workflow.png)

工作流程（以天气预测为例）

+ 模型接收到query
+ 模型输出JSON`{"name":"get_weather","city":"Shanghai"}`
+ 后端调用API
+ 结果返回给模型，模型加工后生成进一步回答

编写Function Calling函数工作量很大，为了让大模型去理解，需要用Json Schema格式去编写功能说明，并需要设计提示词模板。同时，不同平台的Function call API实现差异大，限制了交互的可能性

## 为什么有了Function Call还会有MCP
### 解决局限性
MCP 的引入是为了解决 Function Calling 的局限性，具体原因如下：

+ **处理复杂任务**： 
    - Function Calling 适合单一、明确的工具调用，但对于需要多步骤推理或动态调整的任务（如规划行程、调试代码、自动化工作流），显得不足。MCP 允许模型像"程序员"一样，自主设计和执行多步骤流程。
+ **动态决策能力**： 
    - Function Calling 依赖静态的函数定义和提示词模板，缺乏灵活性。MCP 让模型可以根据上下文和中间结果动态选择工具或调整策略，类似于人类解决问题的思维过程。
+ **减少人工干预**： 
    - 在 Function Calling 中，开发者需要详细定义每个函数的签名和提示词，MCP 则将部分决策权交给模型，减少人工设计的负担，提高开发效率。
+ **支持复杂交互**： 
    - MCP 适合需要多次工具调用、条件分支或循环的场景。例如，模型可能需要先查询数据库、根据结果调用 API、再对数据进行处理，MCP 能让模型自主管理这一过程。
+ **更接近通用智能**： 
    - MCP 是向通用人工智能（AGI）迈进的一步，它让模型不仅仅是"回答问题"或"调用函数"，而是能够像人类一样规划和执行复杂任务。

### 统一规范
MCP统一了Function Calling的运行规范：

+ 统一名称：大模型运行环境被称为**MCP Client**，外部的函数运行环境称作**MCP Server**
+ 统一了MCP客户端和服务器的运行规范，并且要求客户端和服务器之间按照某个既定的提示词模板进行通信

![MCP架构图](/images/blog/mcp-architecture.png)

使用MCP的好处在于可以避免外部函数重复编写，也不需要在函数之间写额外的glue code。通用的需求只需要开发一个MCP Server即可，开发者无需关心Host和Client的细节，只需专注开发对应的服务端

![MCP Server开发流程图](/images/blog/mcp-server-development.png)

![MCP工作原理示意图](/images/blog/mcp-workflow-diagram.png)



## MCP工作流程
当用户提出一个问题时：

1. 客户端将问题发送给模型
2. 模型分析可用的工具，并决定选用哪些
3. 客户端通过MCP Server执行所选的工具
4. 工具的执行结果返回给模型
5. 模型结合执行结果构造最终的prompt并生成自然语言的回应
6. 回应显示给用户

> 模型如何确定具体选择哪些工具呢？是否会出现幻觉呢
>

