import { getCollection } from '@/lib/mongodb-dev';
import type { MongoReport } from '@/types/mongodb';
import { handleApiError, DatabaseError, ValidationError } from '@/lib/utils/handleApiError';
import { requireSession } from '@/lib/utils/session';

interface SaveReportResponse {
  success: boolean;
  message: string;
  reportId?: string;
  status: number;
  code?: string;
}

export async function saveReportToDB(report: Partial<MongoReport>): Promise<SaveReportResponse> {
  try {
    const session = await requireSession();

    if (!report.propertyAddress) {
      throw new ValidationError('Property address is required');
    }

    const reports = await getCollection<MongoReport>('reports');
    
    try {
      const result = await reports.insertOne({
        ...report,
        email: session.email,
        createdAt: new Date(),
        updatedAt: new Date()
      } as MongoReport);

      return {
        success: true,
        message: 'Report saved successfully',
        reportId: result.insertedId.toString(),
        status: 200
      };
    } catch (dbError) {
      throw new DatabaseError('Failed to save report to database');
    }
  } catch (error) {
    return handleApiError(error, 'Failed to save report');
  }
} 