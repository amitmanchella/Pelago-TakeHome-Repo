'use client';

import { useState, useEffect, useRef } from 'react';
import { Message, Conversation, EndOfConversationScreen as EndScreenData } from '@/lib/types';
import {
  getConversations,
  saveConversation,
  deleteConversation,
  clearAllConversations,
  getWorkingMemory,
  mergeWorkingMemory,
  getSystemPrompt,
  saveSystemPrompt,
  resetSystemPrompt,
  DEFAULT_SYSTEM_PROMPT
} from '@/lib/storage';
import { getTheme, saveTheme, ThemeSettings, BackgroundType, ColorPalette, GLASS_STYLES } from '@/lib/theme';
import { exportConversation, ExportFormat } from '@/lib/export';
import BackgroundWrapper from '@/components/backgrounds/BackgroundWrapper';
import EndOfConversationScreen from '@/components/EndOfConversationScreen';
import { Download } from 'lucide-react';

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [selectedModel, setSelectedModel] = useState('GPT 5.2');

  const modelOptions = ['GPT 5.2', 'Claude Sonnet'];
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [endScreenData, setEndScreenData] = useState<EndScreenData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisStyle, setAnalysisStyle] = useState('warm and supportive');
    const [showExportMenu, setShowExportMenu] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const exportMenuRef = useRef<HTMLDivElement>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedConversations = getConversations();
    setConversations(savedConversations);
    setSystemPrompt(getSystemPrompt());
    setTheme(getTheme());

    // If there are conversations, load the most recent one
    if (savedConversations.length > 0) {
      setCurrentConversation(savedConversations[0]);
    }
  }, []);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentConversation?.messages]);

    // Close export menu when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
          setShowExportMenu(false);
        }
      };

      if (showExportMenu) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showExportMenu]);

  const createNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "What's on your mind?",
          timestamp: Date.now(),
        }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setCurrentConversation(newConv);
  };

  const selectConversation = (conv: Conversation) => {
    setCurrentConversation(conv);
  };

  const deleteConv = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteConversation(id);
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    if (currentConversation?.id === id) {
      setCurrentConversation(updated.length > 0 ? updated[0] : null);
    }
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to delete all conversations and memory?')) {
      clearAllConversations();
      setConversations([]);
      setCurrentConversation(null);
    }
  };

  const savePrompt = () => {
    saveSystemPrompt(systemPrompt);
    setShowSettings(false);
  };

  const resetPrompt = () => {
    resetSystemPrompt();
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
  };

  const updateTheme = (updates: Partial<ThemeSettings>) => {
    if (!theme) return;
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const handleDone = async () => {
    if (!currentConversation || currentConversation.messages.length === 0) {
      alert('No conversation to analyze');
      return;
    }

    setIsAnalyzing(true);

    try {
      // Analyze conversation for end screen
      const analysisResponse = await fetch('/api/analyze-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentConversation.messages,
          style: analysisStyle,
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error('Failed to analyze conversation');
      }

      const endScreen = await analysisResponse.json();
      setEndScreenData(endScreen);

      // Extract and save working memory
      const existingMemory = getWorkingMemory();
      const memoryResponse = await fetch('/api/extract-memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentConversation.messages,
          existingMemory,
        }),
      });

      if (memoryResponse.ok) {
        const extractedMemory = await memoryResponse.json();
        mergeWorkingMemory(extractedMemory);
      }

      // Save end screen to conversation
      const updatedConv = {
        ...currentConversation,
        endScreen,
      };
      saveConversation(updatedConv);
      setCurrentConversation(updatedConv);

      // Update conversations list
      const allConvs = getConversations();
      setConversations(allConvs);

      setShowEndScreen(true);
    } catch (error) {
      console.error('Error analyzing conversation:', error);
      alert('Failed to analyze conversation. Make sure your OPENAI_API_KEY is set.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCloseEndScreen = () => {
    setShowEndScreen(false);
  };

  const handleStartNewFromEndScreen = () => {
    setShowEndScreen(false);
    createNewConversation();
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Create conversation if it doesn't exist
    let conv = currentConversation;
    if (!conv) {
      conv = {
        id: Date.now().toString(),
        title: input.slice(0, 50),
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    const updatedMessages = [...conv.messages, userMessage];
    const updatedConv = {
      ...conv,
      messages: updatedMessages,
      updatedAt: Date.now(),
      title: conv.messages.length === 0 ? input.slice(0, 50) : conv.title,
    };

    setCurrentConversation(updatedConv);
    setInput('');
    setIsLoading(true);

    try {
      // Get working memory
      const memory = getWorkingMemory();

      // Call API with streaming
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          systemPrompt: getSystemPrompt(),
          workingMemory: memory,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantMessage += chunk;

          // Update UI with streaming response
          const streamingAssistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: assistantMessage,
            timestamp: Date.now(),
          };

          setCurrentConversation({
            ...updatedConv,
            messages: [...updatedMessages, streamingAssistantMessage],
            updatedAt: Date.now(),
          });
        }
      }

      // Final save
      const finalConv = {
        ...updatedConv,
        messages: [
          ...updatedMessages,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant' as const,
            content: assistantMessage,
            timestamp: Date.now(),
          },
        ],
        updatedAt: Date.now(),
      };

      saveConversation(finalConv);
      setCurrentConversation(finalConv);

      // Update conversations list
      const allConvs = getConversations();
      setConversations(allConvs);

    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Make sure your OPENAI_API_KEY is set in .env.local');
    } finally {
      setIsLoading(false);
    }
  };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };

    const handleExport = (format: ExportFormat) => {
      if (!currentConversation) return;
      exportConversation(currentConversation, format);
      setShowExportMenu(false);
    };

  if (!theme) return null;

  const glassClass = GLASS_STYLES[theme.glassIntensity];

  return (
    <>
      <BackgroundWrapper type={theme.background} colorPalette={theme.colorPalette} />

      <div className="flex h-screen text-gray-900">
        {/* Sidebar */}
        <div className="w-64 glass-sidebar flex flex-col">
          <div className="p-4 border-b border-white/20">
            <h1 className="text-xl font-bold text-gray-900">Voiced Sandbox</h1>
          </div>

          <div className="p-4 space-y-2">
            <button
              onClick={createNewConversation}
              className={`w-full py-2 px-4 ${glassClass} rounded-lg hover:bg-white/30 transition text-gray-900 font-medium`}
            >
              + New Chat
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`w-full py-2 px-4 ${glassClass} rounded-lg hover:bg-white/30 transition text-gray-900`}
            >
              ⚙️ Settings
            </button>
            <button
              onClick={clearAll}
              className={`w-full py-2 px-4 ${glassClass} rounded-lg hover:bg-red-500/30 transition text-gray-900`}
            >
              🗑️ Clear All
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv)}
                className={`p-3 rounded-lg cursor-pointer transition group relative ${
                  currentConversation?.id === conv.id
                    ? 'bg-white/40 border border-white/50'
                    : `${glassClass} hover:bg-white/30`
                }`}
              >
                <div className="text-sm font-medium truncate pr-6 text-gray-900">
                  {conv.title}
                </div>
                <div className="text-xs opacity-80 text-gray-900">
                  {conv.messages.length} messages
                </div>
                <button
                  onClick={(e) => deleteConv(conv.id, e)}
                  className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/30 rounded transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {showSettings ? (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className={`max-w-4xl mx-auto ${glassClass} rounded-2xl p-8`}>
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Settings</h2>

                {/* Theme Settings */}
                <div className="space-y-6 mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Theme</h3>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900">Background</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['waves', 'clouds', 'particles', 'aurora', 'none'] as BackgroundType[]).map(bg => (
                        <button
                          key={bg}
                          onClick={() => updateTheme({ background: bg })}
                          className={`py-2 px-4 rounded-lg capitalize transition text-gray-900 ${
                            theme.background === bg
                              ? 'bg-white/50 font-semibold'
                              : 'bg-white/20 hover:bg-white/30'
                          }`}
                        >
                          {bg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900">Color Palette</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['cool-blue', 'warm-sunset', 'forest-green', 'lavender', 'ocean-deep'] as ColorPalette[]).map(palette => (
                        <button
                          key={palette}
                          onClick={() => updateTheme({ colorPalette: palette })}
                          className={`py-2 px-4 rounded-lg capitalize transition text-gray-900 ${
                            theme.colorPalette === palette
                              ? 'bg-white/50 font-semibold'
                              : 'bg-white/20 hover:bg-white/30'
                          }`}
                        >
                          {palette.replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900">Glass Intensity</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['light', 'medium', 'heavy'] as const).map(intensity => (
                        <button
                          key={intensity}
                          onClick={() => updateTheme({ glassIntensity: intensity })}
                          className={`py-2 px-4 rounded-lg capitalize transition text-gray-900 ${
                            theme.glassIntensity === intensity
                              ? 'bg-white/50 font-semibold'
                              : 'bg-white/20 hover:bg-white/30'
                          }`}
                        >
                          {intensity}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* End Screen Analysis Style */}
                <div className="space-y-6 mb-8 pb-8 border-b border-white/20">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">End Screen Analysis</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-900">
                      Analysis Style (how the end screen feels)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'warm and supportive',
                        'gentle and reflective',
                        'energizing and hopeful',
                        'calm and grounding',
                        'celebratory and uplifting',
                        'honest and direct'
                      ].map(style => (
                        <button
                          key={style}
                          onClick={() => setAnalysisStyle(style)}
                          className={`py-2 px-4 rounded-lg capitalize transition text-gray-900 ${
                            analysisStyle === style
                              ? 'bg-white/50 font-semibold'
                              : 'bg-white/20 hover:bg-white/30'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs opacity-70 mt-2 text-gray-900">
                      This controls the tone and emotion of the end-of-conversation screen generated when you tap "Done"
                    </p>
                  </div>
                </div>

                {/* System Prompt */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">System Prompt</h3>
                  <p className="text-sm opacity-90 text-gray-900">
                    Customize how the assistant behaves. This prompt defines the assistant's role and boundaries.
                  </p>
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className={`w-full h-64 p-4 ${glassClass} rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-600`}
                    placeholder="Enter system prompt..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={savePrompt}
                      className="px-6 py-2 bg-white/30 rounded-lg hover:bg-white/40 transition font-medium text-gray-900"
                    >
                      Save Prompt
                    </button>
                    <button
                      onClick={resetPrompt}
                      className="px-6 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition text-gray-900"
                    >
                      Reset to Default
                    </button>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="px-6 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition text-gray-900"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Export Button Header */}
              {currentConversation && currentConversation.messages.length > 0 && (
                <div className="flex justify-end p-4 pb-0">
                  <div className="relative" ref={exportMenuRef}>
                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className={`flex items-center gap-2 px-4 py-2 ${glassClass} rounded-lg hover:bg-white/30 transition text-gray-900`}
                      title="Export conversation"
                    >
                      <Download size={18} />
                      <span>Export</span>
                    </button>
                    {showExportMenu && (
                      <div className={`absolute right-0 mt-2 w-48 ${glassClass} rounded-lg shadow-lg border border-white/30 overflow-hidden z-10`}>
                        <button
                          onClick={() => handleExport('json')}
                          className="w-full px-4 py-3 text-left hover:bg-white/30 transition text-gray-900"
                        >
                          Export as JSON
                        </button>
                        <button
                          onClick={() => handleExport('text')}
                          className="w-full px-4 py-3 text-left hover:bg-white/30 transition text-gray-900 border-t border-white/20"
                        >
                          Export as Text
                        </button>
                        <button
                          onClick={() => handleExport('pdf')}
                          className="w-full px-4 py-3 text-left hover:bg-white/30 transition text-gray-900 border-t border-white/20"
                        >
                          Export as PDF
                        </button>
                        <button
                          onClick={() => handleExport('html')}
                          className="w-full px-4 py-3 text-left hover:bg-white/30 transition text-gray-900 border-t border-white/20"
                        >
                          Export as HTML
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="max-w-3xl mx-auto space-y-4">
                  {/* Conversation Starters - Show when only initial greeting */}
                  {currentConversation && currentConversation.messages.length === 1 && !isLoading && (
                    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
                      <div className="text-center space-y-2">
                        <h3 className="text-2xl font-semibold text-gray-900">How are you feeling?</h3>
                        <p className="text-gray-800">Choose a prompt to get started, or write your own</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                        {[
                          "I've been feeling stressed lately...",
                          "Something's been on my mind...",
                          "I need to talk through a decision...",
                          "I'm feeling overwhelmed today",
                          "I accomplished something I'm proud of",
                          "I'm worried about something",
                        ].map((prompt, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setInput(prompt);
                              setTimeout(() => sendMessage(), 100);
                            }}
                            className="text-left p-4 bg-white/30 backdrop-blur-md border border-white/40 rounded-xl hover:bg-white/40 hover:scale-105 transition transform text-gray-900"
                          >
                            <span className="text-sm">{prompt}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentConversation?.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-5 py-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-white/40 backdrop-blur-lg border border-white/50 shadow-sm'
                            : 'bg-white/30 backdrop-blur-md border border-white/40 shadow-sm'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-gray-900">{message.content}</div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] px-5 py-3 rounded-2xl bg-white/30 backdrop-blur-md border border-white/40">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className={`border-t border-white/20 p-6 ${glassClass}`}>
                <div className="max-w-3xl mx-auto space-y-3">
                  {/* Model Selector */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-900">Model:</label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className={`px-3 py-1.5 ${glassClass} rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer`}
                    >
                      {modelOptions.map((model) => (
                        <option key={model} value={model} className="bg-white text-gray-900">
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-4">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={currentConversation ? "Share what's on your mind..." : "Start a new conversation..."}
                      className={`flex-1 p-4 ${glassClass} rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-600`}
                      rows={3}
                      disabled={isLoading}
                    />
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        className="px-8 py-3 bg-white/30 backdrop-blur-md rounded-xl hover:bg-white/40 disabled:bg-white/10 disabled:cursor-not-allowed transition font-medium text-gray-900"
                      >
                        Send
                      </button>
                      <button
                        onClick={handleDone}
                        disabled={isAnalyzing || !currentConversation || currentConversation.messages.length === 0}
                        className="px-8 py-3 bg-green-500/30 backdrop-blur-md rounded-xl hover:bg-green-500/40 disabled:bg-white/10 disabled:cursor-not-allowed transition font-medium text-gray-900"
                      >
                        {isAnalyzing ? 'Thinking...' : 'Done'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* End of Conversation Screen */}
      {showEndScreen && endScreenData && (
        <EndOfConversationScreen
          data={endScreenData}
          onStartNew={handleStartNewFromEndScreen}
          onClose={handleCloseEndScreen}
          glassClass={glassClass}
        />
      )}
    </>
  );
}
