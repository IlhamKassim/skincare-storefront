import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="font-heading text-3xl font-bold mb-8 text-foreground">User Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-1">Email</p>
            <p className="font-medium mb-4 text-foreground">{user.email}</p>
            <form action="/api/auth/signout" method="post">
              <Button variant="outline" type="submit">Sign Out</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Saved Routines</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">No saved routines yet. Take the quiz to get started.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
