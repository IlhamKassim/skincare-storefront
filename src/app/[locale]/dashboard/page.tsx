import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/app/actions/recommendation';

interface QuizResultRow {
  id: string;
  created_at: string;
  recommended_routine: Product[];
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  const { data: quizResults } = await supabase
    .from('quiz_results')
    .select('id, created_at, recommended_routine')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)
    .returns<QuizResultRow[]>();

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
            {!quizResults || quizResults.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No saved routines yet. Take the quiz to get started.</p>
            ) : (
              <ul className="space-y-4">
                {quizResults.map((result) => (
                  <li key={result.id} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      {new Date(result.created_at).toLocaleDateString('en-MY', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-foreground">
                      {result.recommended_routine.map((p) => p.name).join(', ')}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
