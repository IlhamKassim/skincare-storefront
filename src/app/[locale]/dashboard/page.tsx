import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const { demo } = await searchParams;
  const isDemo = demo === 'true';

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && !isDemo) {
    redirect('/auth');
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {isDemo && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-8 text-blue-800 text-sm">
          <strong>Demo Mode:</strong> You are seeing this page because the payment flow is currently in preview mode. In a live environment, you would be redirected here after a successful Stripe checkout.
        </div>
      )}
      <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="font-medium mb-4">{user?.email || 'demo@skinsync.com'}</p>
            {user && (
              <form action="/auth/signout" method="post">
                <Button variant="outline" type="submit">Sign Out</Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 italic">No active subscriptions found.</p>
            {/* Logic to list Stripe subscriptions would go here */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
