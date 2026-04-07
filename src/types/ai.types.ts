export interface InsightResponse {
  month: string;
  insights: string[];
  generatedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
  timestamp: string;
}

export interface ForecastResponse {
  predictions: MonthForecast[];
}

export interface MonthForecast {
  month: string;
  totalPredicted: number;
  categories: CategoryPrediction[];
}

export interface CategoryPrediction {
  name: string;
  predicted: number;
  confidence: 'ALTA' | 'MÉDIA' | 'BAIXA';
}
