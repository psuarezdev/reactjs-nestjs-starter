import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/home';

export default function AuthRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
