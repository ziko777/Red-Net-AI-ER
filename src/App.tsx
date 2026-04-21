import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  FileText, 
  Share2, 
  HelpCircle, 
  Plus, 
  Send, 
  ChevronRight, 
  User, 
  History,
  CheckCircle2,
  Loader2,
  Edit3,
  Trash2,
  Search
} from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from './lib/utils';
import { Step, ReportOutline, ReportHistoryItem } from './types';
import { generateOutline, generateReport } from './services/geminiService';

export default function App() {
  const [step, setStep] = useState<Step>('input');
  const [inputMode, setInputMode] = useState<'report' | 'case'>('report');
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [outline, setOutline] = useState<ReportOutline | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const [history, setHistory] = useState<ReportHistoryItem[]>([
    { 
      id: 1, 
      title: '湖南省2025年教育舆情分析', 
      date: '2026-04-03 20:06:47',
      userInput: '请结合问政湖南数据，为我生成一份湖南省2025年教育领域的舆情分析报告。',
      outline: {
        overallSituation: { title: '总体情况', points: ['教育投入持续增长', '群众关注度高'] },
        mainProblems: { title: '主要问题', points: ['资源分配不均', '课后服务质量待提升'] },
        typicalCases: { title: '典型案例', points: ['某县小学扩建工程滞后'] },
        workSuggestions: { title: '工作建议', points: ['优化资源配置', '加强监管'] }
      },
      report: '# 湖南省2025年教育舆情分析报告\n\n这是历史生成的报告内容示例...'
    }
  ]);

  // Auto-resize textareas when outline is loaded
  useEffect(() => {
    if (step === 'outline') {
      setTimeout(() => {
        const textareas = document.querySelectorAll('textarea.outline-point-textarea');
        textareas.forEach(ta => {
          const target = ta as HTMLTextAreaElement;
          target.style.height = 'auto';
          target.style.height = Math.max(target.scrollHeight, 44) + 'px';
        });
      }, 100);
    }
  }, [step, outline]);

  const handleGenerateOutline = async () => {
    if (!userInput.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateOutline(userInput);
      setOutline(result);
      setStep('outline');
    } catch (error) {
      console.error('Failed to generate outline:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirmOutline = async () => {
    if (!outline) return;
    setIsGenerating(true);
    try {
      const result = await generateReport(userInput, outline);
      setReport(result);
      setStep('report');
      
      // Save to history
      const newItem: ReportHistoryItem = {
        id: Date.now(),
        title: userInput.length > 20 ? userInput.substring(0, 20) + '...' : userInput,
        date: new Date().toLocaleString(),
        userInput,
        outline,
        report: result
      };
      setHistory(prev => [newItem, ...prev]);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const loadHistoryItem = (item: ReportHistoryItem) => {
    setUserInput(item.userInput);
    setOutline(item.outline);
    setReport(item.report);
    setStep('report');
  };

  const startNewChat = () => {
    setStep('input');
    setUserInput('');
    setOutline(null);
    setReport(null);
  };

  const updateSectionPoint = (sectionKey: keyof ReportOutline, index: number, newValue: string) => {
    if (!outline) return;
    const newOutline = { ...outline };
    newOutline[sectionKey].points[index] = newValue;
    setOutline(newOutline);
  };

  const addPointToSection = (sectionKey: keyof ReportOutline) => {
    if (!outline) return;
    const newOutline = { ...outline };
    newOutline[sectionKey].points.push('新大纲要点');
    setOutline(newOutline);
  };

  const removePointFromSection = (sectionKey: keyof ReportOutline, index: number) => {
    if (!outline) return;
    const newOutline = { ...outline };
    newOutline[sectionKey].points.splice(index, 1);
    setOutline(newOutline);
  };

  return (
    <div className="min-h-screen bg-[#e6f3ff] flex items-center justify-center p-4 font-sans overflow-hidden relative">
      {/* Background Tech Patterns */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#3b82f6_0%,transparent_70%)]" />
        <div className="absolute top-10 left-10 w-64 h-64 border border-blue-300 rounded-full animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 border border-blue-300 rounded-full animate-pulse delay-700" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-7xl h-[90vh] glass-panel rounded-[40px] flex flex-col relative overflow-hidden tech-border">
        
        {/* Header */}
        <div className="pt-8 pb-4 text-center relative z-10">
          <h1 className="text-4xl font-bold text-[#2b6cb0] tracking-wider drop-shadow-md">
            您好，我是红网问政AI助手
          </h1>
          <p className="text-[#4a90e2] mt-2 font-medium">是您身边的AI政务服务顾问</p>
        </div>

        <div className="flex-1 flex overflow-hidden p-6 gap-6 relative z-10">
          
          {/* Left Sidebar */}
          <div className="w-40 flex flex-col gap-4">
            {[
              { icon: MessageSquare, label: '智能问答' },
              { icon: FileText, label: '智能工单' },
              { icon: Share2, label: '智能分发' },
              { icon: HelpCircle, label: '办理助手' },
              { icon: FileText, label: '智能报告', active: true },
            ].map((item, i) => (
              <button
                key={i}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                  item.active 
                    ? "bg-[#3b82f6] text-white shadow-lg shadow-blue-200 translate-x-2" 
                    : "bg-white/60 text-[#4a5568] hover:bg-white/80"
                )}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Center Content Area */}
          <div className="flex-1 bg-white/60 backdrop-blur-md rounded-3xl border border-white/80 shadow-inner flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <AnimatePresence mode="wait">
                {/* Step 1: Input (Completed state) */}
                {step !== 'input' && (
                  <div className="mb-6 flex items-center gap-3 opacity-60">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                      <CheckCircle2 size={16} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-700">主题输入</h2>
                    <div className="flex-1 border-t border-dashed border-gray-300 ml-2" />
                  </div>
                )}

                {step === 'input' && (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
                        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=rednet" alt="AI" className="w-8 h-8" />
                      </div>
                      <div className="bg-white/80 p-5 rounded-2xl rounded-tl-none shadow-sm border border-blue-100 max-w-[80%]">
                        <p className="text-[#2d3748] font-medium leading-relaxed">
                          欢迎使用红网问政AI助手！<br />
                          我可以帮你轻松生成报告，请说明具体诉求（如时间、地点、主题等），我将提供清晰指引。
                        </p>
                        <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center gap-3">
                          <HelpCircle size={18} className="text-blue-500" />
                          <p className="text-sm text-blue-600 italic">
                            您也可以这样问：请结合问政湖南数据，为我生成一份湖南省2025年教育领域的舆情分析报告。
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 'outline' && outline && (
                  <motion.div
                    key="outline"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-100">2</div>
                      <h2 className="text-xl font-bold text-gray-800">大纲生成</h2>
                      <div className="flex-1 border-t border-dashed border-blue-200 ml-2" />
                      {isGenerating && <Loader2 className="animate-spin text-blue-500" size={18} />}
                    </div>

                    <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-4 mb-6 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span>已为您推荐每个章节的参考数据</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span>已为您生成报告大纲</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      {(Object.keys(outline) as Array<keyof ReportOutline>).map((key, sectionIdx) => (
                        <div key={key} className="bg-white/90 p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow group">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-blue-800 flex items-center gap-3 text-lg">
                              <span className="text-blue-300 font-mono text-xl">0{sectionIdx + 1}</span>
                              {outline[key].title}
                            </h3>
                            <button 
                              onClick={() => addPointToSection(key)}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors"
                            >
                              <Plus size={14} /> 添加要点
                            </button>
                          </div>
                          <div className="space-y-3 pl-8">
                            {outline[key].points.map((point, idx) => (
                              <div key={idx} className="flex items-start gap-3 group/item bg-gray-50/30 p-2.5 rounded-xl border border-transparent hover:border-blue-100 hover:bg-white transition-all">
                                <span className="text-blue-500 font-bold text-sm mt-0.5 min-w-[20px]">
                                  {idx + 1}.
                                </span>
                                <textarea
                                  value={point}
                                  onChange={(e) => updateSectionPoint(key, idx, e.target.value)}
                                  rows={2}
                                  onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = Math.max(target.scrollHeight, 44) + 'px';
                                  }}
                                  className="flex-1 bg-transparent border-none focus:ring-0 text-gray-700 text-[15px] leading-relaxed outline-none resize-none overflow-hidden min-h-[44px] py-0 focus:bg-white/50 rounded px-1 transition-colors outline-point-textarea"
                                />
                                <button 
                                  onClick={() => removePointFromSection(key, idx)}
                                  className="opacity-0 group-hover/item:opacity-100 p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-all shrink-0"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center pt-8">
                      <button
                        onClick={handleConfirmOutline}
                        disabled={isGenerating}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-12 py-4 rounded-full font-bold shadow-xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3 text-lg"
                      >
                        {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
                        确认大纲并生成报告
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'report' && report && (
                  <motion.div
                    key="report"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 pb-12"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                        <h2 className="text-xl font-bold text-gray-800">报告生成</h2>
                      </div>
                    </div>
                    
                    <div className="bg-white p-12 rounded-3xl border border-gray-100 shadow-sm prose prose-blue max-w-none prose-headings:text-blue-800 prose-strong:text-blue-700 prose-a:text-blue-500 relative overflow-hidden">
                      {/* Paper Texture Overlay */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
                      
                      <div className="relative z-10">
                        <Markdown>{report}</Markdown>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4">
                      <button className="bg-white border border-blue-200 text-blue-600 px-8 py-2.5 rounded-full font-medium hover:bg-blue-50 transition-colors flex items-center gap-2">
                        <Share2 size={18} /> 导出报告
                      </button>
                      <button 
                        onClick={() => setStep('outline')}
                        className="bg-white border border-blue-200 text-blue-600 px-8 py-2.5 rounded-full font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
                      >
                        <Edit3 size={18} /> 返回修改大纲
                      </button>
                      <button 
                        onClick={startNewChat}
                        className="bg-blue-600 text-white px-8 py-2.5 rounded-full font-medium shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Plus size={18} /> 开启新对话
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isGenerating && step === 'outline' && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-blue-500" size={48} />
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-800">正在为您生成报告内容...</p>
                      <p className="text-sm text-gray-500 mt-1">请稍候，这可能需要几秒钟时间</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            {step === 'input' && (
              <div className="p-6 bg-white/40 border-t border-white/60">
                <div className="relative max-w-4xl mx-auto">
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="请输入需要检索的内容"
                    className="w-full bg-white/80 border-2 border-blue-100 rounded-2xl p-4 pr-16 h-32 focus:border-blue-400 focus:ring-0 transition-all resize-none shadow-sm text-gray-700 placeholder:text-gray-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerateOutline();
                      }
                    }}
                  />
                  <div className="absolute bottom-4 left-4 flex gap-3">
                    <button 
                      onClick={() => setInputMode('report')}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                        inputMode === 'report' 
                          ? "bg-blue-500 text-white border-blue-500 shadow-md" 
                          : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                      )}
                    >
                      <FileText size={14} /> 报告生成
                    </button>
                    <button 
                      onClick={() => setInputMode('case')}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                        inputMode === 'case' 
                          ? "bg-blue-500 text-white border-blue-500 shadow-md" 
                          : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                      )}
                    >
                      <Search size={14} /> 案例查看
                    </button>
                  </div>
                  <button
                    onClick={handleGenerateOutline}
                    disabled={isGenerating || !userInput.trim()}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                  </button>
                </div>
                {isGenerating && step === 'input' && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-blue-500">
                    <Loader2 className="animate-spin" size={16} />
                    <span className="text-sm font-medium">正在为您构建报告大纲...</span>
                  </div>
                )}
                <p className="text-center text-xs text-gray-400 mt-4">内容由 AI 生成，仅供参考，请仔细甄别</p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-56 flex flex-col gap-6">
            <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                <User size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700">网友1z583n</p>
                <button 
                  onClick={startNewChat}
                  className="text-xs text-blue-500 font-medium hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Plus size={12} /> 新建对话
                </button>
              </div>
            </div>

            <div className="flex-1 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-sm flex flex-col overflow-hidden">
              <div className="flex items-center gap-2 text-gray-500 mb-4 px-1">
                <History size={16} />
                <span className="text-sm font-bold tracking-widest uppercase">历史对话 (5)</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => loadHistoryItem(item)}
                    className="p-3 bg-white/40 hover:bg-white/80 rounded-xl border border-transparent hover:border-blue-100 transition-all cursor-pointer group"
                  >
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed group-hover:text-blue-600 font-medium">{item.title}</p>
                    <p className="text-[10px] text-gray-400 mt-2">{item.date}</p>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-xs text-gray-500 hover:text-blue-500 flex items-center justify-center gap-1 py-2 border-t border-gray-100">
                查看更多 <ChevronRight size={14} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 opacity-60">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">RED</div>
              <span className="text-[10px] font-bold text-gray-500">RED · AIGC</span>
            </div>
          </div>
        </div>

        {/* Robot Character */}
        <div className="absolute bottom-4 left-12 z-20 pointer-events-none">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <img 
              src="https://api.dicebear.com/7.x/bottts/svg?seed=helper&backgroundColor=b6e3f4" 
              alt="Robot" 
              className="w-32 h-32 drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </div>
  );
}
