import claudeCode from "./repos/claude-code.js";
import codex from "./repos/codex.js";
import hermesAgent from "./repos/hermes-agent.js";
import langmem from "./repos/langmem.js";
import letta from "./repos/letta.js";
import mem0 from "./repos/mem0.js";

export const repos = [codex, claudeCode, hermesAgent, letta, langmem, mem0];

export const site = {
  categories: [
    {
      title: "终端型 / 交互式 Agent Runtime",
      description: "这类项目本身就是完整 agent：会拼 prompt、维护会话、做压缩、保存历史，有时还会带自己的长期记忆链路。",
      examples: ["claude code", "codex", "hermes-agent"],
    },
    {
      title: "Memory / Context 能力层",
      description: "这类项目更像别人可以拿来嵌入的能力模块，重点在摘要、抽取、检索、namespace 和持久化，而不是完整聊天界面。",
      examples: ["langmem", "mem0"],
    },
    {
      title: "平台型 Agent 系统",
      description: "这类项目除了 runtime，还把消息、记忆块、归档和存储后端一起平台化，适合看“统一模型”怎么设计。",
      examples: ["letta"],
    },
  ],
  glossary: [
    {
      term: "context",
      plain: "这一轮模型真正带着去思考的材料包。",
      precise: "某一轮真正送进模型、或即将送进模型的可见上下文，不等于整个数据库或全部历史。",
    },
    {
      term: "history",
      plain: "发生过什么的记录本。",
      precise: "消息历史、turn 历史、命令历史、thread transcript 等历史容器，常常服务于恢复、压缩或检索。",
    },
    {
      term: "summary / compaction",
      plain: "把太长的过去压短，但尽量不丢关键意思。",
      precise: "为了缩短上下文窗口而做的摘要、裁剪、压缩、边界重写，不一定等于长期记忆。",
    },
    {
      term: "short-term memory",
      plain: "只对当前会话还热乎的记忆。",
      precise: "面向当前 session / thread 的近程记忆，例如运行中缓存、当前会话摘要、最近消息窗口。",
    },
    {
      term: "long-term memory",
      plain: "过了一段时间还能再叫回来的记忆。",
      precise: "跨 session / thread 持续存在、可被重新召回的记忆，落点可能是文件、数据库、向量库或平台后端。",
    },
    {
      term: "state",
      plain: "系统为了运转自己记下的内部状态。",
      precise: "除消息正文外的持久化运行时状态，例如 SQLite 元数据、线程表、job 表、memory root 或路径布局。",
    },
    {
      term: "storage",
      plain: "东西最后被放到哪里。",
      precise: "文件系统、SQLite、Postgres、向量库、entity store、provider backend 等持久化后端。",
    },
    {
      term: "retrieval",
      plain: "要用的时候再去把相关记忆找回来。",
      precise: "根据 query、embedding、关键词、实体或规则，从长期存储中筛选可回注到当前上下文的信息。",
    },
    {
      term: "session / thread",
      plain: "一段相对连续的对话或工作轨迹。",
      precise: "系统组织 turn、历史、摘要和记忆边界的基本单位，不同项目对 session 和 thread 的命名不同。",
    },
  ],
  patternTakeaways: [
    "大多数系统都会把“模型看到什么”和“系统存了什么”分开处理。",
    "短期历史和长期记忆几乎总是两套机制，而不是一个盒子。",
    "压缩通常不等于记忆写入，更多是在抢上下文窗口。",
  ],
  commonPatterns: [
    {
      title: "都会把“可见上下文”和“底层存储”分开",
      summary: "模型这一轮看见的材料，通常只是系统存储内容的一小部分、重算后的视图。",
      examples: ["claude code 的 /context 是 API 视图", "codex 用 clone_history().for_prompt()", "letta 用 ContextWindowCalculator 重算窗口"],
    },
    {
      title: "短期历史和长期记忆通常不是一回事",
      summary: "history 更像记录和压缩底稿，long-term memory 才是跨轮次、跨会话还会被召回的东西。",
      examples: ["codex 把 history.jsonl 和 memories/ 分开", "mem0 的 SQLite messages 不是主记忆", "langmem 的 running_summary 不是长期记忆"],
    },
    {
      title: "summary / compaction 经常是单独的一条链",
      summary: "很多项目都需要压缩，但压缩本身未必会生成长期记忆，它更多是控制窗口大小。",
      examples: ["claude code 的 compact boundary", "hermes-agent 的 ContextCompressor", "letta 的 Summarizer"],
    },
    {
      title: "长期记忆落点高度多样",
      summary: "文件、SQLite、Postgres、向量库、Git repo、BaseStore 都可能是记忆落点，所以不能只看名字猜实现。",
      examples: ["claude code 用文件型 memory", "letta 有 Git-backed memory", "mem0 以向量库为主记忆体"],
    },
    {
      title: "多 agent 会放大边界问题",
      summary: "一旦有 subagent、provider、group conversation 或 thread spawn，谁能看谁的记忆、谁负责回写就会变复杂。",
      examples: ["codex 的 thread_spawn_edges", "hermes-agent 的 provider 并行层", "letta 的 conversation / archive / git 并行路径"],
    },
  ],
  commonPatternDiagram: {
    title: "共同模式图",
    description: "先把“看见什么”“压什么”“记住什么”“存到哪”四件事拆开，你看 6 个项目时就不会混。",
    nodes: [
      { title: "固定说明", body: "系统提示、人格、规则、工具约束。" },
      { title: "当前输入", body: "这一轮用户消息、工具结果、任务状态。" },
      { title: "短期压缩", body: "把过长历史压短，保证窗口装得下。" },
      { title: "长期记忆", body: "把值得保留的东西存成可召回结果。" },
      { title: "检索回注", body: "下一轮需要时再找回来。" },
      { title: "持久化后端", body: "文件、数据库、向量库、Git 或 provider backend。" },
    ],
  },
  compareDimensions: [
    {
      title: "维度一",
      question: "谁在组装模型真正可见的 context？",
      why: "这是最容易混淆的地方。不是所有存储内容都会进模型，真正重要的是哪条链在负责“最后一轮可见输入”的拼装。",
      byRepo: {
        "claude-code": "由 getSystemContext / getUserContext 和 loadMemoryPrompt 组合，再经过 compact boundary 重算可见视图。",
        codex: "由 ContextManager、build_initial_context() 和 reference_context_item 共同决定，首次全量、之后增量。",
        "hermes-agent": "由 prompt_builder 拼 system prompt，再叠加 session_search、memory provider 和压缩链。",
        letta: "由 Memory.compile() + PromptGenerator 编出 system prompt，再由 ContextWindowCalculator 评估窗口。",
        langmem: "由 messages、SummarizationNode、MemoryManager 和 namespace 路由共同形成运行时上下文。",
        mem0: "主要是为抽取 prompt 服务的上下文，不是完整对话 runtime 的总上下文。",
      },
    },
    {
      title: "维度二",
      question: "谁在负责压缩 / 摘要？",
      why: "压缩通常是窗口管理，不一定等于长期记忆写入。先分清这两者，读每个项目才不容易误判。",
      byRepo: {
        "claude-code": "由 /compact、microcompact 和 SessionMemory compaction 共同作用。",
        codex: "compact 会重写历史和窗口身份，realtime 还有独立 startup context。",
        "hermes-agent": "ContextCompressor 会替换旧 tool 输出，再做结构化压缩和会话切换。",
        letta: "Summarizer 会在窗口压力过大时插入 summary message。",
        langmem: "短期摘要本身就是核心产品能力，RunningSummary 是第一等公民。",
        mem0: "没有统一的 conversation compaction 主线，重点是抽取式长期记忆。",
      },
    },
    {
      title: "维度三",
      question: "短期历史放在哪？",
      why: "history 经常被误当 memory。它更像压缩、恢复和审计的原料。",
      byRepo: {
        "claude-code": "session transcript、命令 history 和 compact boundary 后的可见消息视图是分开的。",
        codex: "ContextManager 历史、history.jsonl 和 SQLite state 分层存在。",
        "hermes-agent": "state.db transcript 与 gateway JSONL 双写并存，session_search 基于它们检索。",
        letta: "messages + conversation_messages 维护顺序，system message 固定在位置 0。",
        langmem: "messages 和 running_summary 主要活在 graph state 里。",
        mem0: "SQLite messages 只保留最近 10 条消息，服务抽取上下文。",
      },
    },
    {
      title: "维度四",
      question: "长期 memory 真正落到哪里？",
      why: "同样叫 memory，落点可能是文件、SQL、BaseStore、Git 或向量库；实现成本和能力差别很大。",
      byRepo: {
        "claude-code": "以 memdir / claudemd 的文件型 memory 为主，SessionMemory 只是当前会话摘要。",
        codex: "最终同步到 codex_home/memories/，中间状态在 SQLite jobs / stage1_outputs。",
        "hermes-agent": "内建文件 memory + 外部 provider backend 并行存在。",
        letta: "core blocks、Git-backed block、archive/passage 和可选向量层同时存在。",
        langmem: "真实落点是注入式 BaseStore，namespace 决定写到哪个空间。",
        mem0: "主记忆体是 vector store，entity store 做实体索引，SQLite 只是辅助层。",
      },
    },
    {
      title: "维度五",
      question: "检索路径怎么走？",
      why: "长期记忆的价值不只在保存，更在于什么时候、怎样被重新找回来。",
      byRepo: {
        "claude-code": "主要依赖文件注入和 /context 视图统计，不是独立语义检索系统。",
        codex: "memory tool 读 memory_summary.md，startup pipeline 再把长期记忆整理进文件层。",
        "hermes-agent": "session_search 查历史 transcript，provider recall 走各插件自己的检索路径。",
        letta: "archive / passage 通过工具检索返回，通常不直接全塞进 prompt。",
        langmem: "先生成 query，再由 search_memory / BaseStore 检索候选。",
        mem0: "用语义向量、关键词、实体和 rerank 做混合检索。",
      },
    },
    {
      title: "维度六",
      question: "多 agent / 多线程关系复杂吗？",
      why: "一旦出现 subagent 或多会话协作，memory 的共享范围和回写策略就会显著变复杂。",
      byRepo: {
        "claude-code": "有 subagent 和远端 session history，但 memory 仍主要围绕 session / project 组织。",
        codex: "thread、subagent、spawn edges 全都进 state DB，结构化程度很高。",
        "hermes-agent": "session、gateway、provider、subagent 路径并存，但以 session 为主轴。",
        letta: "conversation、group、archive、Git-backed memory 并行，是平台型复杂度最高的一类。",
        langmem: "更多是 graph/store 级 workflow 组合，不是完整多 agent runtime。",
        mem0: "主要按 user_id / agent_id / run_id 组织隔离范围，不直接提供线程 runtime。",
      },
    },
  ],
  frameworkDecisionTree: {
    title: "框架选择决策树",
    description: "先按场景，再按记忆需求，再按复杂度，不要一开始就把所有技术都堆上去。",
    nodes: [
      { title: "只做单 agent、任务短", body: "先从 history + 简单 summary 开始，通常不需要复杂长期记忆。" },
      { title: "要跨会话记住事实和偏好", body: "考虑文件 / SQLite / BaseStore 这一类较轻长期记忆层。" },
      { title: "要做语义召回和经验检索", body: "开始考虑向量库、entity store、混合检索。" },
      { title: "要平台化或多人协作", body: "要提前想清 system prompt、会话、归档和版本存储的边界。" },
      { title: "要多 agent 协作", body: "优先设计共享范围、回写策略和冲突解决，再决定后端。" },
    ],
  },
  frameworkOptions: [
    {
      title: "文件 / JSON 方案",
      summary: "适合个人助手、项目助手、知识量不大但需要可审阅、可手改的长期记忆。",
      points: ["实现轻", "便于人工检查", "不擅长复杂检索", "很适合先做 MVP"],
    },
    {
      title: "SQLite 方案",
      summary: "适合本地工具型 agent，把消息、任务状态、作业表和审计记录放到一起管理。",
      points: ["状态结构清晰", "本地部署方便", "做复杂语义检索通常还要加别的后端"],
    },
    {
      title: "向量库 / 混合检索方案",
      summary: "适合知识量大、需要召回旧经验、需要把记忆当检索资产来用的系统。",
      points: ["召回能力强", "实现复杂度更高", "要额外处理去重、过滤和实体索引"],
    },
    {
      title: "平台型 memory 方案",
      summary: "适合团队协作、多会话、多 agent 或需要版本化、归档和统一治理的系统。",
      points: ["边界最清楚", "能力最全", "维护成本也最高"],
    },
  ],
  blueprintDiagram: {
    title: "实现蓝图总图",
    description: "先把输入、上下文拼装、记忆读写和压缩这几步拆清楚，再决定后端。",
    nodes: [
      { title: "接收输入", body: "先拿到用户消息、工具结果和当前状态。" },
      { title: "整理短期上下文", body: "最近消息、当前任务状态、必要系统规则。" },
      { title: "召回长期记忆", body: "按 query、规则或实体找回相关记忆。" },
      { title: "组装最终 context", body: "把固定说明、当前输入、短期摘要、召回结果拼起来。" },
      { title: "模型执行", body: "得到回答、工具调用或结构化输出。" },
      { title: "写回与压缩", body: "决定要不要更新长期记忆、要不要压缩历史。" },
    ],
  },
  blueprintVariants: [
    {
      title: "最小可用版",
      summary: "只有短期 history + 简单 summary + 文件型长期记忆，优先把边界做清楚。",
      points: ["适合先验证体验", "没有复杂检索", "人工可检查"],
    },
    {
      title: "可扩展版",
      summary: "在最小版上增加 SQLite state、记忆更新流水线和检索接口。",
      points: ["适合工具型生产系统", "压缩、审计和长记忆开始分层", "后续可再接向量库"],
    },
    {
      title: "多 agent 版",
      summary: "把共享记忆、私有记忆、线程状态和回写权限拆开设计，再做协调。",
      points: ["优先做共享范围定义", "要处理冲突与去重", "适合工作流或平台型场景"],
    },
  ],
};
