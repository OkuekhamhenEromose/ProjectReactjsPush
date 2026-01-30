import { useState } from 'react';
import Layout from './common/Layout';
import ECommerceApp from './components/Ecommerce-simple';
import TaskManagerApp from './components/TaskManager';
import ExpenseTrackerApp from './components/ExpenseTracker';
import ChatApp from './components/ChatApplication';
import NoteTakingApp from './components/NoteTaking';
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
  if (currentProject === 3) {
    return <TaskManagerApp onBackToHome={handleBackToHome} />;
  }

  if (currentProject === 5) {
    return <ExpenseTrackerApp onBackToHome={handleBackToHome} />;
  }
  if (currentProject === 8) {
    return <ChatApp onBackToHome={handleBackToHome} />;
  }
  if (currentProject === 14) {
    return <NoteTakingApp onBackToHome={handleBackToHome} />;
  }

  return <Layout onSelectProject={handleSelectProject} />;
};

export default App
