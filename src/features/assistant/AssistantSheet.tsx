import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { X, Bot, RotateCcw, ShieldAlert, ImagePlus } from 'lucide-react';
import {
  Conversation,
  ConversationContent,
  ConversationDownload,
  Message,
  MessageContent,
  MessageResponse,
  PromptInput,
  PromptInputHeader,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTools,
  Suggestions,
  Suggestion,
  Tool,
  ToolHeader,
  ToolContent,
  Shimmer,
  Attachments,
  Attachment,
  AttachmentPreview,
  type AttachedImage,
} from '../../components/ai-elements';
import {
  VisaDetailsVisualizer,
  FeeSummaryVisualizer,
  DocChecklistVisualizer,
  PassportValidityVisualizer,
  TrackingVisualizer,
} from './components/ToolVisualizers';
import { useAssistantChat } from './useAssistantChat';
import type {
  VisaDetailsResult,
  FeeCalculationResult,
  RequiredDocumentsResult,
  PassportValidityResult,
  TrackingStatusResult,
} from '../../services/ai/types';

export interface AssistantSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentStepId?: string;
}

export function AssistantSheet({
  isOpen,
  onClose,
  currentStepId = 'visa-selection',
}: AssistantSheetProps) {
  const { messages, status, currentToolCalls, sendMessage, resetChat, contextSuggestions } =
    useAssistantChat(currentStepId);

  const [inputVal, setInputVal] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedImage[]>([]);
  const [openToolIndex, setOpenToolIndex] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (attachedFiles.length + files.length > 3) {
      setUploadError('Maximum 3 images allowed at a time.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    files.slice(0, 3 - attachedFiles.length).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select valid image files (JPEG, PNG, WebP).');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Images must be smaller than 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setAttachedFiles((prev) => [
          ...prev,
          {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: file.name,
            url,
            size: file.size,
            type: file.type,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachedFiles((prev) => prev.filter((f) => f.id !== id));
    setUploadError(null);
  };

  const handleSubmit = ({ text }: { text: string }) => {
    if (text.trim() || attachedFiles.length > 0) {
      sendMessage({ text, files: attachedFiles });
      setInputVal('');
      setAttachedFiles([]);
      setUploadError(null);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage({ text: suggestion });
  };

  return (
    <aside
      aria-label="Asha AI Visa Guide"
      aria-hidden={!isOpen}
      className={`fixed top-16 sm:top-18 bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[350px] md:w-[370px] lg:w-[380px] h-[calc(100vh-80px)] sm:h-[calc(100vh-92px)] max-h-[calc(100vh-80px)] rounded-3xl border border-[var(--color-border)] shadow-2xl bg-[var(--color-surface-card)] overflow-hidden flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom-right ${
        isOpen
          ? 'opacity-100 scale-100 pointer-events-auto'
          : 'opacity-0 scale-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col h-full w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)]/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--color-saffron-bright)]/15 border border-[var(--color-saffron-bright)]/30 flex items-center justify-center text-[var(--color-saffron-bright)] dark:text-amber-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2
                  id="assistant-panel-title"
                  className="font-bold text-sm text-[var(--color-ink)] leading-tight"
                >
                  Asha — AI Visa Guide
                </h2>
                <span className="text-[9px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">
                  Gemini 2.5 Flash
                </span>
              </div>
              <span className="text-[10px] text-[var(--color-ink-muted)] block">
                Official VisaReThink Consular Assistant
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <ConversationDownload messages={messages} />
            <button
              type="button"
              onClick={resetChat}
              className="p-1.5 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-subtle)] rounded-lg transition-colors cursor-pointer"
              title="Reset conversation"
              aria-label="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-[var(--color-surface-subtle)] rounded-lg transition-colors cursor-pointer"
              title="Close Assistant"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conversation Body */}
        <div className="flex-1 overflow-hidden">
          <Conversation className="h-full">
            <ConversationContent>
              {messages.map((msg, index) => {
                const textContent =
                  msg.parts?.find((p) => p.type === 'text')?.text ||
                  (msg as unknown as { content?: string })?.content ||
                  '';
                const isAssistant = msg.role === 'assistant';

                // Look for tool calls associated with assistant response
                const toolCall = isAssistant && currentToolCalls[index - 1];

                return (
                  <Message key={msg.id || index} from={msg.role as 'user' | 'assistant'}>
                    <MessageContent
                      className={
                        isAssistant
                          ? 'bg-[var(--color-surface-subtle)] text-[var(--color-ink)] border border-[var(--color-border)]'
                          : 'bg-[var(--color-indigo-primary)] text-white font-medium'
                      }
                    >
                      {/* Attached user images preview in chat */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {msg.attachments.map((att) => (
                            <AttachmentPreview key={att.id} url={att.url} alt={att.name} />
                          ))}
                        </div>
                      )}

                      <MessageResponse>{textContent}</MessageResponse>

                      {toolCall && (
                        <Tool defaultOpen={openToolIndex === index}>
                          <ToolHeader
                            toolName={toolCall.toolName}
                            state="success"
                            isOpen={openToolIndex === index}
                            onToggle={() =>
                              setOpenToolIndex(openToolIndex === index ? null : index)
                            }
                          />
                          <ToolContent isOpen={openToolIndex === index}>
                            {toolCall.toolName === 'getVisaDetails' && (
                              <VisaDetailsVisualizer data={toolCall.output as VisaDetailsResult} />
                            )}
                            {toolCall.toolName === 'calculateVisaFees' && (
                              <FeeSummaryVisualizer
                                data={toolCall.output as FeeCalculationResult}
                              />
                            )}
                            {toolCall.toolName === 'getRequiredDocuments' && (
                              <DocChecklistVisualizer
                                data={toolCall.output as RequiredDocumentsResult}
                              />
                            )}
                            {toolCall.toolName === 'checkPassportValidity' && (
                              <PassportValidityVisualizer
                                data={toolCall.output as PassportValidityResult}
                              />
                            )}
                            {toolCall.toolName === 'trackApplicationStatus' && (
                              <TrackingVisualizer data={toolCall.output as TrackingStatusResult} />
                            )}
                          </ToolContent>
                        </Tool>
                      )}
                    </MessageContent>
                  </Message>
                );
              })}

              {status === 'streaming' && (
                <div className="px-4 py-2">
                  <Shimmer />
                </div>
              )}
            </ConversationContent>
          </Conversation>
        </div>

        {/* Suggestions Bar */}
        <div className="px-3.5 pt-2 pb-1.5 border-t border-[var(--color-border)] bg-[var(--color-surface-subtle)]/40 shrink-0">
          <span className="text-[10px] font-semibold text-[var(--color-ink-muted)] tracking-wider uppercase mb-1 block">
            Suggested for this step:
          </span>
          <Suggestions className="no-scrollbar">
            {contextSuggestions.map((suggestion) => (
              <Suggestion
                key={suggestion}
                suggestion={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
              />
            ))}
          </Suggestions>
        </div>

        {/* Input Area */}
        <div className="p-3 bg-[var(--color-surface-card)] border-t border-[var(--color-border)] shrink-0">
          {uploadError && (
            <div className="mb-2 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-lg">
              {uploadError}
            </div>
          )}

          <PromptInput onSubmit={handleSubmit}>
            {/* Attachment preview pills */}
            {attachedFiles.length > 0 && (
              <PromptInputHeader>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[10px] font-semibold text-[var(--color-ink-muted)] uppercase">
                    Attached Images ({attachedFiles.length}/3)
                  </span>
                </div>
                <Attachments variant="inline">
                  {attachedFiles.map((file) => (
                    <Attachment
                      key={file.id}
                      data={file}
                      onRemove={() => removeAttachment(file.id)}
                    />
                  ))}
                </Attachments>
              </PromptInputHeader>
            )}

            <PromptInputTextarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={
                attachedFiles.length > 0
                  ? 'Ask Asha to verify this image...'
                  : 'Ask Asha about visa fees, photo specs, or tracking...'
              }
            />

            <PromptInputFooter>
              <PromptInputTools>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={attachedFiles.length >= 3}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    attachedFiles.length >= 3
                      ? 'opacity-40 pointer-events-none border-transparent'
                      : 'text-[var(--color-ink)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-subtle)] hover:border-[var(--color-saffron-bright)] border-[var(--color-border)] shadow-2xs'
                  }`}
                  title="Attach passport scan or visa photograph (max 3)"
                  aria-label="Attach images (up to 3)"
                >
                  <ImagePlus className="w-3.5 h-3.5 text-[var(--color-saffron-bright)]" />
                  <span>Attach ({attachedFiles.length}/3)</span>
                </button>

                <div className="hidden sm:flex items-center gap-1 text-[10px] text-[var(--color-ink-muted)] pl-1">
                  <ShieldAlert className="w-3 h-3 text-[var(--color-saffron-bright)]" />
                  <span>In-App Guide</span>
                </div>
              </PromptInputTools>

              <PromptInputSubmit
                status={status === 'streaming' ? 'streaming' : 'ready'}
                disabled={
                  (!inputVal.trim() && attachedFiles.length === 0) || status === 'streaming'
                }
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </aside>
  );
}
