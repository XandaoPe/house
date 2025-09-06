// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import MenuLateral from './components/MenuLateral';
import '../src/styles/Global.css';

// Criar tema personalizado do MUI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Componente para a página inicial após login
const HomePage: React.FC = () => {
  return (
    <div style={{ padding: '20px', marginLeft: '250px', color: 'white'}}>
      <h2>Bem-vindo ao Sistema</h2>
      <p>Esta é a página principal da aplicação.</p>
    </div>
  );
};

// Layout principal com MenuLateral
const MainLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      <MenuLateral />
      <main style={{ flexGrow: 1, padding: '20px' }}>
        <HomePage />
      </main>
    </div>
  );
};

// Componente para verificar autenticação
const AuthChecker: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return user ? <MainLayout /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/*" element={<AuthChecker />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;