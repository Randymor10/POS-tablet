import React from 'react';
import { ArrowLeft, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useEmployee } from '../contexts/EmployeeContext';
import { useNavigate } from 'react-router-dom';

interface PageLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  headerCenterContent?: React.ReactNode;
  headerRightContent?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  pageTitle,
  showBackButton = false,
  onBackClick,
  headerCenterContent,
  headerRightContent,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { employee, logout } = useEmployee();
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="pos-app">
      <header className="header">
        <div className="header-left">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={handleBackClick}
                className="flex items-center gap-2 px-4 py-2 rounded-lg shadow hover:shadow-md transition-all"
                style={{ 
                  backgroundColor: 'var(--bg-secondary)', 
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <ArrowLeft size={20} />
                Back to POS
              </button>
            )}
            <div>
              <h1 className="header-title">{pageTitle}</h1>
              {employee && (
                <div className="employee-info">
                  <span className="employee-name">Welcome, {employee.name}</span>
                  <span className="employee-id">ID: {employee.employee_id}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="header-center">
          {headerCenterContent}
        </div>

        <div className="header-right">
          <button className="icon-button" onClick={toggleTheme} title="Toggle theme">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {headerRightContent}

          {employee && (
            <button 
              className="icon-button logout-button" 
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default PageLayout;