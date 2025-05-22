import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/authOptions';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SavedAnalysesList from '@/components/dashboard/SavedAnalysesList';

export default async function SavedReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Saved Reports</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your saved property analyses
            </p>
          </div>
          <Button asChild>
            <a href="/renters">New Analysis</a>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            <SavedAnalysesList userId={session.user.id} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
