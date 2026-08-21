import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppShell from './layouts/AppShell';
import Landing from './pages/Landing';

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
