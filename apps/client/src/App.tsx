import { useSessionStore } from './hooks/use-session-store';
import MainRouter from './routers/main-router';
import AuthRouter from './routers/auth-router';
import Navbar from './components/navbar';

export default function App() {
  const { accessToken, refreshToken, expiresIn, logIn } = useSessionStore();

  if(expiresIn && new Date().getTime() > expiresIn) {
    fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { Authorization: `Refresh ${refreshToken}` },
    })
      .then(res => res.json())
      .then(data => logIn(data))
      .catch(err => console.error(err));
  }

  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        {accessToken ? <MainRouter /> : <AuthRouter />}
      </main>
    </>
  );
}
