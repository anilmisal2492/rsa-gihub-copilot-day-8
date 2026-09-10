import cors from 'cors';
import express from 'express';
import type { Express } from 'express';
import { loadSettings, type Settings } from './config/settings.js';
import { errorHandler, notFoundHandler } from './errors.js';
import { requestLogging } from './middleware/request-logging.js';
import { ProviderLLMClient } from './llm/provider-client.js';
import { SqliteAssessmentRepository } from './repositories/assessment-repository.js';
import { SqliteConversationRepository } from './repositories/conversation-repository.js';
import { createSqliteDatabase, type SqliteDatabase } from './repositories/sqlite.js';
import { conversationsRouter } from './routes/conversations.js';
import { healthRouter } from './routes/health.js';
import { messagesRouter } from './routes/messages.js';
import { resetRouter } from './routes/reset.js';
import { ConversationService } from './services/conversation-service.js';
import type { LLMClient } from './llm/LLMClient.js';
import type { AssessmentRepository, ConversationRepository } from './repositories/repository-types.js';

export interface AppOverrides {
  llmClient?: LLMClient;
  database?: SqliteDatabase;
  conversationRepository?: ConversationRepository;
  assessmentRepository?: AssessmentRepository;
  logger?: Parameters<typeof requestLogging>[0];
}

export function createApp(settings: Settings = loadSettings(), overrides: AppOverrides = {}): Express {
  const database = overrides.database ?? createSqliteDatabase(settings.dbUrl);
  const llmClient = overrides.llmClient ?? new ProviderLLMClient(settings.model, settings.openAiApiKey);
  const conversationRepository = overrides.conversationRepository ?? new SqliteConversationRepository(database);
  const assessmentRepository = overrides.assessmentRepository ?? new SqliteAssessmentRepository(database);
  const service = new ConversationService(conversationRepository, assessmentRepository, llmClient);
  const app = express();

  app.use(cors({ origin: settings.corsOrigins }));
  app.use(requestLogging(overrides.logger));
  app.use(express.json({ limit: '64kb' }));
  app.use('/api', healthRouter(settings, llmClient));
  app.use('/api', conversationsRouter(service));
  app.use('/api', messagesRouter(service));
  app.use('/api', resetRouter(service));
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
