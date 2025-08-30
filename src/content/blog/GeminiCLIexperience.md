---
title: GeminiCLI和使用体验
date: 2025-08-28
updated: 2025-08-30
keywords: ["Google","LLM"]
featured: true
summary: "GeminiCLI上手体验和工作流分享"
---

# 什么是GeminiCLI
> GeminiCLI是一个集成在终端环境中的AI开发助手。其核心（大脑）是 Google 的 Gemini 模型，通过一个工具集与用户的本地文件系统和 Shell环境直接交互。这使它能够理解上下文、运行代码和命令、使用工具以及辅助完成软件工程任务，从而实现一个具备行动能力的智能体（Agent）工作流。

# 系统提示词
> GeminiCLI背后的System Prompt可以参考 [Prompts.ts](
     https://github.com/google-gemini/gemini-cli/blob/main/packages/core/src/core/prompts.ts)


这个文件揭示了以下关键设计：
- 高度可定制化：系统优先检查环境变量，允许用户通过提供自己的Markdown文件（system.md）来完全覆盖内置提示词。这为高级用户和企业团队提供了前所未有的灵活性，可以根据自身项目规范和团队文化定制AI的行为。
- 情景感知能力：提示词内部嵌入了逻辑判断。例如，它会检测当前是否在沙盒环境中运行，并据此插入关于文件和系统访问权限的特定说明。更智能的是，它能识别当前目录是否为Git仓库，并指导AI在执行版本控制操作时遵循标准流程。
- 记忆整合机制：系统可以将用户的“记忆片段”（userMemory）追加到提示词末尾，确保AI在连续对话中能够记住关键上下文和用户偏好，实现更具个性化和连贯性的交互。
这种动态分层架构使得GeminiCLI的行为准则稳固又灵活，值得借鉴学习。

# 可用的工具
> Prompt：Can you list out all the tools you have,give me the description of tool,inputs/outputs(if available) of the tool;give me clear bullet points 

> [官方文档](https://google-gemini.github.io/gemini-cli/docs/tools/)

```
ℹAvailable Gemini CLI tools:
    - Edit
    - FindFiles
    - GoogleSearch
    - ReadFile
    - ReadFolder
    - ReadManyFiles
    - Save Memory
    - SearchText
    - Shell
    - WebFetch
    - WriteFile
```
# 常用的快捷指令

## 无头模式
适用于非交互式的、一次性的任务，非常适合集成到脚本中。
```  
gemini --prompt "tell me a joke"
Loaded cached credentials.
Why don't scientists trust atoms?

Because they make up everything. 
```

`Git 集成: git diff | gemini --prompt "为这段 diff 生成一个符合Conventional Commits 规范的提交信息"`

## @
将文件/文件夹加入上下文
`"在 @src/hooks/useAuth.ts 中添加 JSDoc 注释"`

## shift+tab once auto-accept edits on
略

## -y / --yolo
![Gemini YOLO Mode](https://res.cloudinary.com/dbrbdlmsx/image/upload/v1756546869/blog_images/geminiYoloMode.png)
打开yolo模式
例子：`"根据这个接口文档，在 src/api/ 下添加一个新的 endpoint"`




## memory
```
memory show
ℹMemory is currently empty.
```

```
╭───────────────────────────────────────────────────────────╮
│  > /memory add "translate all your answers into chinese"  │
╰───────────────────────────────────────────────────────────╯


ℹAttempting to save to memory: ""translate all your answers into chinese""
 
 ╭───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
 │ ✔ Save Memory in ~\.gemini\GEMINI.md                                                                                     │
 │                                                                                                                           │
 │    Okay, I've remembered that: ""translate all your answers into chinese""                                                │
 ╰───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯

ℹRefreshing hierarchical memory (GEMINI.md or other context files)...
 

ℹMemory refreshed successfully. Loaded 167 characters from 1 file(s).
 

```

## 后台任务 (&)

  当您需要启动一个服务（比如开发服务器）但又不想阻塞当前终端时，这个功能非常有用。

* 它是什么: 在命令末尾使用 & 符号，让该命令在后台运行。
* 
    ` "用 npm run dev & 启动开发服务器，然后帮我读取一下 packag.json 里的依赖列表。"`

## 精确文件搜索 (glob 和 search_file_content)
* 它是什么: 使用 glob 按文件名模式查找文件，或使用 search_file_content 按内容（支持正则表达式）查找代码。
* 开发者用例:
    * `"用 glob 帮我找到所有在 'src/components' 目录下，但不在'__tests__' 子目录里的 '.tsx' 文件。"`
    * `"用 search_file_content 在所有 '.css' 文件里搜索使用了十六进颜色码（例如 #FF5733）的地方。"`

> [查看官方文档了解更完整的指令列表和用法](https://google-gemini.github.io/gemini-cli/docs/cli/commands.html)


# 配置层
> 参考[官方文档](https://google-gemini.github.io/gemini-cli/docs/cli/configuration.html)
设置分为三个scope
- User setting
  - Location: ~/.gemini/settings.json (where ~ is your home directory).仅当前用户有效
- Project settings
  - Location: .gemini/settings.json within your project’s root directory.__对于这个项目生效，层级高过用户设置__
- System settings
  - Location: /etc/gemini-cli/settings.json (Linux), C:\ProgramData\gemini-cli\settings.json (Windows) or /Library/Application Support/GeminiCli/settings.json (macOS). The path can be overridden using the GEMINI_CLI_SYSTEM_SETTINGS_PATH environment variable.__最高等级__

## .gemini
除了Project settings之外，.gemini文件夹起到了包含其他项目层级上与GeminiCLI相关的操作，如
- 沙箱文件（沙箱即sandbox，目的是创建一个不外露的密闭环境，即使沙箱内有危险操作也不会影响到沙盒以外的世界，开启方法：--sandbox / -s 标识符）


# 我的工作流
以软件项目开发为例
`/init 创建GEMINI.md`

在 GEMINI.md文件中，在完成需求叙述后，完善以下三部分内容

### 1. Commands: all necessary commands for dev, building and linting

### 2. 系统架构设计总览 / Architecture：
详细列出系统采用的技术栈，例如：

- Python: Uses Black (line length 88), strict typing with pyright  
- TypeScript: Strict mode enabled, PascalCase for components, camelCase for variables  
- React: Functional components with hooks, avoid class components  
- Import order: React, libraries, internal modules, types  
- Error handling: Always catch and properly handle exceptions  

### 3. 有效的 Prompt
这是我喜欢用的一份 prompt：

- always in plan mode to make a plan  
- after getting the plan done，make sure you write it into [a folder]  
- the plan should be detailed and reasonable, along with breaking down tasks  
- always think mvp, don't over plan it  
- if the task requires external knowledge, make sure use the googlesearch tool and ask me for advice  
- once you write the plan, firstly ask me to review  
- while implementing code, update the plan as you work, append detailed descriptions of the changes you made.
