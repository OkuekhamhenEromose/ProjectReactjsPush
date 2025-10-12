import { useState } from 'react';
import Layout from './common/Layout';
import ECommerceApp from './components/Ecommerce-simple';
import './App.css'

const App = () => {
  const [currentProject, setCurrentProject] = useState(null);

  const handleSelectProject = (projectId) => {
    setCurrentProject(projectId);
  };

  const handleBackToHome = () => {
    setCurrentProject(null);
  };

  if (currentProject === 1) {
    return <ECommerceApp onBackToHome={handleBackToHome} />;
  }

  return <Layout onSelectProject={handleSelectProject} />;
};

export default App
