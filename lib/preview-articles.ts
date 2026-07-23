export type PreviewBias = {
  left: number;
  center: number;
  right: number;
};

export type PreviewSource = {
  name: string;
  leaning: "偏左" | "中立" | "偏右";
};

export type PreviewArticle = {
  id: string;
  category: string;
  region: string;
  title: string;
  summary: string;
  imageSrc: string;
  imageAlt: string;
  sourceCount: number;
  readTime: string;
  visual: string;
  bias: PreviewBias;
  framing: string;
  body: string[];
  summaryPoints: string[];
  sources: PreviewSource[];
};

export const previewCategories = [
  "全部",
  "国内",
  "国际",
  "商业与市场",
  "科技",
  "社会",
  "健康与医学",
  "体育",
  "气候与环境",
] as const;

export const previewArticles: PreviewArticle[] = [
  {
    id: "preview-urban",
    category: "国内",
    region: "城市观察",
    title: "公共空间更新如何改变日常通勤体验",
    summary: "通行、停留与服务设施的重新组织，正在形成一套更容易被居民感知的城市尺度。",
    imageSrc: "/preview-news/urban-transit.jpg",
    imageAlt: "预览封面图，一座线条简洁的现代公共建筑",
    sourceCount: 12,
    readTime: "6 分钟阅读",
    visual: "urban",
    bias: { left: 28, center: 46, right: 26 },
    framing: "公共服务与日常效率",
    body: [
      "这是一段合成界面预览文案，用来展示长篇文章在阅读页中的段落节奏、行宽与信息层级，不对应具体城市项目或新闻事件。",
      "当空间改造从单一通行目标延伸到等候、换乘与短暂停留，使用体验往往会成为公共讨论的起点。不同视角会关注投入效率、服务公平与生活便利等不同问题。",
      "页面中的分析模块仅演示产品将来如何呈现已经保存的多来源结果。当前不读取新闻内容，也不对任何现实议题作出判断。",
    ],
    summaryPoints: [
      "以通行与停留体验为例展示新闻详情的信息组织。",
      "不同视角条目用于验证分析结果在窄栏中的可读性。",
      "所有文本和来源构成均为本地界面预览数据。",
    ],
    sources: [
      { name: "公共议题样本 A", leaning: "偏左" },
      { name: "城市观察样本", leaning: "中立" },
      { name: "效率讨论样本", leaning: "偏右" },
    ],
  },
  {
    id: "preview-harvest",
    category: "商业与市场",
    region: "市场观察",
    title: "新的消费节奏正在重塑季节性市场预期",
    summary: "从产地到零售端的节奏变化，为市场观察提供了更细致的比较维度。",
    imageSrc: "/preview-news/vineyard.jpg",
    imageAlt: "预览封面图，葡萄园前的一只酒杯",
    sourceCount: 9,
    readTime: "5 分钟阅读",
    visual: "harvest",
    bias: { left: 20, center: 51, right: 29 },
    framing: "供给节奏与消费选择",
    body: [
      "本段为合成预览文本，用来展示商业主题文章的标题、封面、正文和分析卡片如何共同组织，不对应实际市场报告。",
      "同一消费现象可以从价格、供应链、生活方式与行业预期等角度讨论。阅读页将这些角度放在清晰的结构中，而非将它们混在一段摘要里。",
      "未来接入数据后，页面会用已保存的文章分析替换本地预览字段，视觉组件与阅读路径保持不变。",
    ],
    summaryPoints: [
      "用季节性消费主题验证商业文章的阅读密度。",
      "摘要条目展示侧栏在长文旁的扫描方式。",
      "预览来源数量不代表现实媒体覆盖情况。",
    ],
    sources: [
      { name: "市场笔记样本", leaning: "偏左" },
      { name: "行业资料样本", leaning: "中立" },
      { name: "消费趋势样本", leaning: "偏右" },
    ],
  },
  {
    id: "preview-lab",
    category: "科技",
    region: "研究前沿",
    title: "跨学科协作让研究讨论走向更开放的场景",
    summary: "实验室之外的交流方式，正在影响研究议题被理解与分享的路径。",
    imageSrc: "/preview-news/research-lab.jpg",
    imageAlt: "预览封面图，实验室中的透明试管与滴管",
    sourceCount: 8,
    readTime: "7 分钟阅读",
    visual: "lab",
    bias: { left: 18, center: 55, right: 27 },
    framing: "研究开放与知识传播",
    body: [
      "这是用于科技版详情页的合成预览内容。它不描述特定机构、研究人员或实验结果，只呈现一篇分析文章应有的阅读层次。",
      "当专业议题进入更广泛的讨论空间，准确性、可解释性与参与门槛会同时影响信息如何被转述。不同材料之间的关联也更需要清楚呈现。",
      "右侧模块中的百分比和要点仅用于展示组件状态，不是对科研议题或发布渠道的真实评价。",
    ],
    summaryPoints: [
      "科技主题以实验器材封面展示图片与正文的比例。",
      "分析面板保留未来结构化输出所需的位置。",
      "当前页面不进行模型调用或联网检索。",
    ],
    sources: [
      { name: "研究解读样本", leaning: "偏左" },
      { name: "科学资料样本", leaning: "中立" },
      { name: "技术观察样本", leaning: "偏右" },
    ],
  },
  {
    id: "preview-community",
    category: "社会",
    region: "社区议题",
    title: "社区服务协同成为公共讨论的新切口",
    summary: "服务之间的连接方式，往往决定一项公共议题被理解的速度与范围。",
    imageSrc: "/preview-news/community-library.jpg",
    imageAlt: "预览封面图，一处明亮且无人使用的公共室内空间",
    sourceCount: 14,
    readTime: "6 分钟阅读",
    visual: "community",
    bias: { left: 34, center: 39, right: 27 },
    framing: "协作机制与公共参与",
    body: [
      "本页使用合成内容演示社会议题在新闻详情页中的阅读体验，所列场景和结论均不对应真实机构或公共服务项目。",
      "围绕同一服务主题，讨论可能强调资源配置、流程效率，也可能关注用户体验和参与机会。页面通过并列信息而非单一结论保留比较空间。",
      "随着真实数据层接入，已经保存的文章与分析将替代这些本地示例，同时保留相同的阅读和比较布局。",
    ],
    summaryPoints: [
      "公共服务主题用于验证多段正文的连续阅读。",
      "侧栏要点保留在首屏可扫描的位置。",
      "来源构成是本地预览，不是媒体清单。",
    ],
    sources: [
      { name: "社区观察样本", leaning: "偏左" },
      { name: "服务记录样本", leaning: "中立" },
      { name: "治理讨论样本", leaning: "偏右" },
    ],
  },
  {
    id: "preview-world",
    category: "国际",
    region: "全球观察",
    title: "多边协作议题在公共讨论中持续升温",
    summary: "面对跨区域问题，不同叙事通常从合作成本、共同责任与行动路径展开。",
    imageSrc: "/preview-news/global-network.jpg",
    imageAlt: "预览封面图，从太空俯瞰夜间地球的城市灯光",
    sourceCount: 11,
    readTime: "8 分钟阅读",
    visual: "world",
    bias: { left: 24, center: 48, right: 28 },
    framing: "协作责任与行动路径",
    body: [
      "本段文字为国际主题的界面预览，不对应现实谈判、国家、组织或政策。页面以通用图像和抽象表述来验证阅读布局。",
      "跨区域议题常同时包含共同目标与不同优先级。新闻分析界面需要把这些差异呈现为可阅读的结构，而非用一条标签替代全部上下文。",
      "数据接入前，所有视角比例和来源列表都是明确标识的本地样例，不构成媒体立场或事实判断。",
    ],
    summaryPoints: [
      "国际主题展示长标题和深色封面的对比效果。",
      "结构化摘要用于测试复杂主题的快速浏览。",
      "预览数据没有关联任何现实国际事件。",
    ],
    sources: [
      { name: "区域议题样本", leaning: "偏左" },
      { name: "协作资料样本", leaning: "中立" },
      { name: "行动观察样本", leaning: "偏右" },
    ],
  },
  {
    id: "preview-health",
    category: "健康与医学",
    region: "健康观察",
    title: "健康信息的可读性正在成为服务设计重点",
    summary: "从解释方式到信息入口，易理解的表达能让健康服务更接近日常选择。",
    imageSrc: "/preview-news/health-service.jpg",
    imageAlt: "预览封面图，放在浅色织物上的听诊器",
    sourceCount: 7,
    readTime: "5 分钟阅读",
    visual: "health",
    bias: { left: 19, center: 59, right: 22 },
    framing: "健康沟通与服务可及性",
    body: [
      "这是健康主题的合成界面预览内容，不构成医疗建议，也不对应任何个人、机构或真实服务信息。",
      "可读性并不只取决于术语多少，也与信息顺序、解释层级和用户在何处接触到信息有关。页面以较舒缓的正文密度适配这一主题。",
      "将来真实文章接入后，系统会在受控服务端完成数据处理，展示层只读取已经保存的结果。",
    ],
    summaryPoints: [
      "健康主题展示短摘要与中立视角的排版。",
      "页面不提供诊断、治疗或行动建议。",
      "本地来源样本只用于验证视觉层级。",
    ],
    sources: [
      { name: "健康沟通样本", leaning: "偏左" },
      { name: "服务资料样本", leaning: "中立" },
      { name: "日常观察样本", leaning: "偏右" },
    ],
  },
  {
    id: "preview-sport",
    category: "体育",
    region: "赛事观察",
    title: "训练方法的公开讨论带来新的赛事观察角度",
    summary: "从日常训练到观赛语言，体育内容正在形成更多可比较的讨论层面。",
    imageSrc: "/preview-news/sport-field.jpg",
    imageAlt: "预览封面图，一个篮球正穿过篮筐网兜",
    sourceCount: 10,
    readTime: "4 分钟阅读",
    visual: "sport",
    bias: { left: 22, center: 44, right: 34 },
    framing: "训练视角与赛事叙事",
    body: [
      "本页的体育内容为界面预览，不代表任何联赛、队伍、运动员或赛事报道。它用于测试更轻快的图文组合与可点击详情入口。",
      "训练方法的讨论可以连接专业视角、观赛体验和公众沟通。不同切入点并不互相排斥，适合在同一阅读页面中并列呈现。",
      "当前的来源计数、摘要和框架标签均为本地样例，后续将替换为已保存数据。",
    ],
    summaryPoints: [
      "体育主题验证封面主视觉与紧凑卡片的组合。",
      "分析条目用于展示不同讨论路径的并列关系。",
      "没有连接任何真实赛事数据或直播信息。",
    ],
    sources: [
      { name: "训练观察样本", leaning: "偏左" },
      { name: "赛事资料样本", leaning: "中立" },
      { name: "观赛讨论样本", leaning: "偏右" },
    ],
  },
  {
    id: "preview-climate",
    category: "气候与环境",
    region: "环境观察",
    title: "城市气候适应方案进入更细致的评估阶段",
    summary: "公共设施与能源选择的长期影响，正在被放进更具体的生活场景中讨论。",
    imageSrc: "/preview-news/climate-city.jpg",
    imageAlt: "预览封面图，蓝天之下成排的太阳能板",
    sourceCount: 13,
    readTime: "7 分钟阅读",
    visual: "climate",
    bias: { left: 29, center: 43, right: 28 },
    framing: "环境适应与公共投入",
    body: [
      "本篇为气候主题的合成预览文案，不描述真实城市、工程、天气或环境事件。封面图只用于建立稳定的新闻卡片视觉节奏。",
      "环境适应常被放在长期成本、公共投入、技术可行性与日常感受之间比较。详情页会把这些不同叙述的提示留在可快速扫描的侧栏中。",
      "现阶段的百分比和来源样本仅为本地预览，不能用于判断现实政策、项目或媒体立场。",
    ],
    summaryPoints: [
      "环境主题检验高亮封面在三列网格中的平衡。",
      "正文结构保留未来分析结果的展示位置。",
      "预览中不包含真实环境数据或政策信息。",
    ],
    sources: [
      { name: "环境讨论样本", leaning: "偏左" },
      { name: "公共资料样本", leaning: "中立" },
      { name: "技术观察样本", leaning: "偏右" },
    ],
  },
  {
    id: "preview-culture",
    category: "国内",
    region: "文化观察",
    title: "文化空间正在连接不同年龄层的公共生活",
    summary: "展陈、活动与日常停留交织，让文化议题拥有更丰富的观察维度。",
    imageSrc: "/preview-news/culture-gallery.jpg",
    imageAlt: "预览封面图，黄色与深色交织的抽象颜料纹理",
    sourceCount: 6,
    readTime: "6 分钟阅读",
    visual: "culture",
    bias: { left: 26, center: 50, right: 24 },
    framing: "文化参与与公共连接",
    body: [
      "本页为文化主题的合成界面预览。抽象封面不指向实际展览或作品，标题和文本也不对应现实活动。",
      "文化空间的讨论可以围绕参与机会、内容表达、公共服务和城市生活展开。详情页用连续正文与辅助分析保持这类多重视角的可读性。",
      "所有来源构成、摘要和比例均是可替换的本地样例，未来将由经过保存和校验的数据提供。",
    ],
    summaryPoints: [
      "文化主题使用抽象图像验证视觉差异。",
      "相关文章区域展示小尺寸封面的信息密度。",
      "本页没有对应现实文化机构或报道。",
    ],
    sources: [
      { name: "文化讨论样本", leaning: "偏左" },
      { name: "公共生活样本", leaning: "中立" },
      { name: "活动观察样本", leaning: "偏右" },
    ],
  },
];

export function findPreviewArticle(id: string) {
  return previewArticles.find((article) => article.id === id);
}
