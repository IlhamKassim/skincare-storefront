import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <AuthForm view="sign-in" />
    </div>
  );
}
