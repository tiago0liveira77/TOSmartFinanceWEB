import { useState, useRef, useEffect } from 'react';
import { useAIInsights, useRefreshInsights, useAIForecast, useAIChat, useClearChat } from '@/hooks/useAI';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency } from '@/utils/currency';
import { currentYearMonth } from '@/utils/date';
import type { ChatMessage } from '@/types/ai.types';

function InsightsPanel() {
  const [month, setMonth] = useState(currentYearMonth());
  const { data: insights, isLoading, isError } = useAIInsights(month);
  const { mutate: refresh, isPending: refreshing } = useRefreshInsights(month);

  return (
    <Card title="Insights de IA">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 flex-1"
          />
          <Button variant="secondary" size="sm" onClick={() => refresh()} isLoading={refreshing}>
            Actualizar
          </Button>
        </div>

        {isLoading || refreshing ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-sm text-gray-500 text-center py-6">
            <p className="text-2xl mb-2">🤖</p>
            <p>Não foi possível gerar insights.</p>
            <p className="text-xs mt-1">Verifica a chave API do Groq.</p>
          </div>
        ) : !insights?.insights?.length ? (
          <div className="text-sm text-gray-500 text-center py-6">
            <p className="text-2xl mb-2">📊</p>
            <p>Sem dados suficientes para este mês.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {insights.insights.map((insight, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="text-base shrink-0">💡</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        )}

        {insights?.generatedAt && (
          <p className="text-xs text-gray-400 pt-1 border-t border-gray-100">
            Gerado em {new Date(insights.generatedAt).toLocaleString('pt-PT')}
          </p>
        )}
      </div>
    </Card>
  );
}

function ForecastPanel() {
  const { data: forecast, isLoading, isError } = useAIForecast(3);

  return (
    <Card title="Previsão — próximos 3 meses">
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-sm text-gray-500 text-center py-4 space-y-1">
          <p className="text-2xl">⚠️</p>
          <p>Erro ao gerar previsão.</p>
          <p className="text-xs">Verifica os logs do ai-service.</p>
        </div>
      ) : !forecast?.predictions?.length ? (
        <div className="text-sm text-gray-500 text-center py-4 space-y-1">
          <p className="text-2xl">📈</p>
          <p>Sem dados históricos suficientes.</p>
          <p className="text-xs">Regista transações durante alguns meses para gerar previsões.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b border-gray-100">
              <th className="text-left pb-2">Mês</th>
              <th className="text-right pb-2">Despesas previstas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {forecast.predictions.map((pred) => (
              <tr key={pred.month}>
                <td className="py-2 text-gray-700">{pred.month}</td>
                <td className="py-2 text-right font-medium text-red-500">
                  {formatCurrency(pred.totalPredicted)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}

function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mutate: sendMessage, isPending } = useAIChat();
  const { mutate: clearChat, isPending: clearing } = useClearChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isPending) return;
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    sendMessage(
      { message: text, conversationId },
      {
        onSuccess: (res) => {
          setConversationId(res.conversationId);
          setMessages((prev) => [...prev, { role: 'assistant', content: res.message, timestamp: res.timestamp }]);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: 'Erro ao obter resposta. Tenta novamente.', timestamp: new Date().toISOString() },
          ]);
        },
      }
    );
  };

  const handleClear = () => {
    if (conversationId) {
      clearChat(conversationId, {
        onSuccess: () => { setMessages([]); setConversationId(undefined); },
      });
    } else {
      setMessages([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const suggestions = [
    'Como foram as minhas despesas este mês?',
    'Onde estou a gastar mais?',
    'Como posso poupar mais?',
  ];

  return (
    <Card
      title="Chat Financeiro"
      footer={
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Faz uma pergunta sobre as tuas finanças..."
            disabled={isPending}
            className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          />
          <Button size="sm" onClick={handleSend} isLoading={isPending} disabled={!input.trim()}>
            Enviar
          </Button>
        </div>
      }
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400">
          {messages.length === 0
            ? 'Começa por perguntar algo sobre as tuas finanças.'
            : `${Math.ceil(messages.length / 2)} trocas`}
        </p>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClear} isLoading={clearing}>
            Limpar
          </Button>
        )}
      </div>

      <div className="h-96 overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm gap-2">
            <span className="text-4xl">🤖</span>
            <p>Olá! Em que posso ajudar?</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-xs border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isPending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </Card>
  );
}

export function AIAssistantPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Assistente IA</h2>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-2 space-y-4">
          <InsightsPanel />
          <ForecastPanel />
        </div>
        <div className="lg:col-span-3 lg:sticky lg:top-6">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
