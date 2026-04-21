import { GoogleGenAI, Type } from "@google/genai";
import { ReportOutline } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateOutline(topic: string): Promise<ReportOutline> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `请根据以下主题生成一份政务舆情分析报告的大纲：\n主题：${topic}\n\n要求大纲包含以下四个部分：\n1. 总体情况 (Overall Situation)\n2. 主要问题 (Main Problems)\n3. 典型案例 (Typical Cases)\n4. 工作建议 (Work Suggestions)\n\n请以 JSON 格式返回，结构如下：\n{
      "overallSituation": { "title": "总体情况", "points": ["点1", "点2"] },
      "mainProblems": { "title": "主要问题", "points": ["点1", "点2"] },
      "typicalCases": { "title": "典型案例", "points": ["点1", "点2"] },
      "workSuggestions": { "title": "工作建议", "points": ["点1", "点2"] }
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallSituation: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              points: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "points"]
          },
          mainProblems: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              points: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "points"]
          },
          typicalCases: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              points: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "points"]
          },
          workSuggestions: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              points: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "points"]
          }
        },
        required: ["overallSituation", "mainProblems", "typicalCases", "workSuggestions"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateReport(topic: string, outline: ReportOutline): Promise<string> {
  const outlineStr = JSON.stringify(outline, null, 2);
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `请根据以下主题和确认后的大纲生成一份详细的政务舆情分析报告内容：\n主题：${topic}\n大纲：${outlineStr}\n\n要求：\n1. 内容详实，符合公文规范。\n2. 必须包含报告页眉信息：\n   - 标题：红网网上群众工作平台涉${topic}舆情专报\n   - 报送：省委主要领导\n   - 报送单位：红网网上群众工作部\n   - 报送日期：${new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}\n3. 结构要求（严格遵守）：\n   - 一级标题使用：一、二、三、...（Markdown ##）\n   - 二级标题使用：（一）（二）（三）...（Markdown ###）\n   - 三级标题使用：1. 2. 3. ...（Markdown #### 或加粗）\n4. 包含具体的数据（可模拟，但要合理）。\n5. 典型案例要具体，包含时间、地点、核心问题和链接（模拟）。\n6. 整体风格严肃、专业。\n7. 请使用 Markdown 格式返回。`,
  });

  return response.text;
}
