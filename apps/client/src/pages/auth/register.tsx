import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ErrorAlert from '../../components/error-alert';
import { Button, Input } from '@nextui-org/react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  // We're using email as the username
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters long'
  }),
  email: z.string().email({
    message: 'Please enter a valid email address'
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long'
  }),
  confirmPassword: z.string().min(8, {
    message: 'Password must be at least 8 characters long'
  })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const isSubmitting = form.formState.isSubmitting;
  const errors = form.formState.errors;

  const onSubmit = async(formData: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      if(!res.ok) {
        setError('An error occurred');
      }
      
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] max-w-[500px] mx-auto">
      <h1 className="text-3xl font-bold mb-5">Sign Up</h1>
      {error && <ErrorAlert className="mb-5" message={error} onClose={() => setError(null)} />}
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-5 w-full">
        <div className="w-full">
          <Input
            type="name"
            label="Name"
            {...form.register('name')}
          />
          {errors.name && <span className="text-red-500">{errors.name.message}</span>}
        </div>
        <div className="w-full">
          <Input
            type="email"
            label="Email"
            {...form.register('email')}
          />
          {errors.email && <span className="text-red-500">{errors.email.message}</span>}
        </div>
        <div className="w-full">
          <Input
            type="password"
            label="Password"
            {...form.register('password')}
          />
          {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        </div>
        <div className="w-full">
          <Input
            type="password"
            label="Confirm Password"
            {...form.register('confirmPassword')}
          />
          {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
        </div>

        <Button disabled={isSubmitting} type="submit" className="w-full text-md rounded p-3 transition-all duration-300" color="primary" variant="flat">
          Sign Up
        </Button>
      </form>
    </section>
  );
}
