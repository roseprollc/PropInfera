import type { WithId, Document } from 'mongodb';
import type {
  Analysis,
  CalculatorType,
  RentalAnalysisResults,
  AirbnbAnalysisResults,
  WholesaleAnalysisResults,
  MortgageAnalysisResults,
  RentersAnalysisResults,
  AnalysisResults,
  AnalysisMetrics
} from '@/types/analysis';

/**
 * Type guard to check if a document has the required Analysis fields
 */
function isValidAnalysis(doc: WithId<Document>): doc is WithId<Document> & {
  type: CalculatorType;
  userId: string;
  data: AnalysisResults;
  metrics: AnalysisMetrics;
  mode: string;
  createdAt: string;
} {
  return (
    typeof doc === 'object' &&
    doc !== null &&
    'type' in doc &&
    'userId' in doc &&
    'data' in doc &&
    'metrics' in doc &&
    'mode' in doc &&
    'createdAt' in doc
  );
}

/**
 * Safely parses a MongoDB document into an Analysis object
 */
export function parseAnalysis<T extends CalculatorType>(
  doc: WithId<Document>
): Analysis<T> | null {
  if (!isValidAnalysis(doc)) {
    return null;
  }

  const baseAnalysis = {
    _id: doc._id.toString(),
    userId: doc.userId,
    type: doc.type as T,
    data: doc.data,
    metrics: doc.metrics as AnalysisMetrics,
    mode: doc.mode,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    notes: doc.notes,
    source: doc.source
  };

  // Validate the data property matches the type
  switch (doc.type) {
    case 'rental':
      if (doc.data.type !== 'rental') return null;
      return baseAnalysis as Analysis<T>;
    case 'airbnb':
      if (doc.data.type !== 'airbnb') return null;
      return baseAnalysis as Analysis<T>;
    case 'wholesale':
      if (doc.data.type !== 'wholesale') return null;
      return baseAnalysis as Analysis<T>;
    case 'mortgage':
      if (doc.data.type !== 'mortgage') return null;
      return baseAnalysis as Analysis<T>;
    case 'renters':
      if (doc.data.type !== 'renters') return null;
      return baseAnalysis as Analysis<T>;
    default:
      return null;
  }
}

/**
 * Safely parses an array of MongoDB documents into Analysis objects
 */
export function parseAnalyses<T extends CalculatorType>(
  docs: WithId<Document>[]
): Analysis<T>[] {
  return docs
    .map(doc => parseAnalysis<T>(doc))
    .filter((analysis): analysis is Analysis<T> => analysis !== null);
}

/**
 * Type guard to check if a document is a valid Analysis creation payload
 */
export function isValidCreatePayload<T extends CalculatorType>(
  payload: unknown
): payload is Omit<Analysis<T>, '_id' | 'createdAt' | 'updatedAt'> {
  if (typeof payload !== 'object' || payload === null) return false;

  const requiredFields = ['userId', 'type', 'data', 'metrics', 'mode'] as const;
  return requiredFields.every(field => field in payload);
}

/**
 * Type guard to check if a document is a valid Analysis update payload
 */
export function isValidUpdatePayload<T extends CalculatorType>(
  payload: unknown
): payload is Partial<Omit<Analysis<T>, '_id' | 'userId' | 'createdAt' | 'type'>> & {
  _id: string;
} {
  if (typeof payload !== 'object' || payload === null) return false;
  return '_id' in payload;
} 