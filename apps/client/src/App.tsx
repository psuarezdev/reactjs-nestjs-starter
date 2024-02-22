import { useSessionStore } from './hooks/useSessionStore';
import MainRouter from './routers/MainRouter';
import AuthRouter from './routers/AuthRouter';
import Navbar from './components/Navbar';

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
