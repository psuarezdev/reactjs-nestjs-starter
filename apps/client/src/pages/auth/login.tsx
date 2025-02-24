import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ErrorAlert from '../../components/error-alert';
import { Button, Input } from '@nextui-org/react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSessionStore } from '../../hooks/use-session-store';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  // We're using email as the username
  username: z.string().email({
    message: 'Please enter a valid email address'
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long'
  })
});

export default function Login() {
  const navigate = useNavigate();
  const logIn = useSessionStore(state => state.logIn);
  const [error, setError] = useState<string | null>();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const isSubmitting = form.formState.isSubmitting;
  const errors = form.formState.errors;

  const onSubmit = async(formData: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if(!res.ok) {
        setError('Wrong username or password');
      }
      
      const { accessToken, refreshToken, expiresIn } = await res.json();

      logIn({ accessToken, refreshToken, expiresIn });
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] max-w-[500px] mx-auto">
      <h1 className="text-3xl font-bold mb-5">Sign In</h1>
      {error && <ErrorAlert className="mb-5" message={error} onClose={() => setError(null)} />}
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-5 w-full">
        <div className="w-full">
          <Input
            type="email"
            label="Email"
            {...form.register('username')}
          />
          {errors.username && <span className="text-red-500">{errors.username.message}</span>}
        </div>
        <div className="w-full">
          <Input
            type="password"
            label="Password"
            {...form.register('password')}
          />
          {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        </div>
        <Button disabled={isSubmitting} type="submit" className="w-full text-md rounded p-3 transition-all duration-300" color="primary" variant="flat">
          Sign In
        </Button>
      </form>
    </section>
  );
}
