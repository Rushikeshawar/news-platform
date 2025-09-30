import React from 'react';
import ReactDOM from 'react-dom/client';

// Import CSS in correct order
import './styles/variables.css';
import './styles/global.css';
import './styles/components/AiMlCard.css';
import './styles/components/ArticleCard.css';
import './styles/components/CategoryStats.css';
import './styles/components/ErrorMessage.css';
import './styles/components/LoadingSpinner.css';
import './styles/components/Pagination.css';
import './styles/components/TimeSaverCard.css';
import './styles/pages/HomePage.css';
import './styles/pages/ArticlesPage.css';
import './styles/pages/AiMlPage.css';
import './styles/pages/TimeSaverPage.css';
import './styles/pages/LoginPage.css';
import './styles/pages/ProfilePage.css';
import './App.css';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);