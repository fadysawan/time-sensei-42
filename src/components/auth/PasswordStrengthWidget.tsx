import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PasswordStrengthWidgetProps {
  password: string;
  className?: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const PasswordStrengthWidget: React.FC<PasswordStrengthWidgetProps> = ({ 
  password, 
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const requirements: PasswordRequirement[] = [
    {
      label: 'At least 8 characters',
      test: (pwd) => pwd.length >= 8
    },
    {
      label: 'Contains uppercase letter',
      test: (pwd) => /[A-Z]/.test(pwd)
    },
    {
      label: 'Contains lowercase letter',
      test: (pwd) => /[a-z]/.test(pwd)
    },
    {
      label: 'Contains number',
      test: (pwd) => /\d/.test(pwd)
    },
    {
      label: 'Contains special character',
      test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
    }
  ];

  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '' };
    
    const passedRequirements = requirements.filter(req => req.test(password)).length;
    const score = (passedRequirements / requirements.length) * 100;
    
    if (score < 40) {
      return { score, label: 'Weak', color: 'text-red-500' };
    } else if (score < 70) {
      return { score, label: 'Fair', color: 'text-yellow-500' };
    } else if (score < 90) {
      return { score, label: 'Good', color: 'text-blue-500' };
    } else {
      return { score, label: 'Strong', color: 'text-green-500' };
    }
  }, [password, requirements]);

  const getProgressBarColor = (score: number) => {
    if (score < 40) return 'bg-red-500';
    if (score < 70) return 'bg-yellow-500';
    if (score < 90) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // Always show the widget, even when password is empty

  return (
    <div className={`${className}`}>
      <div className="bg-gray-800 border border-gray-700 rounded-md text-xs">
        {/* Main widget bar */}
        <div 
          className="flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex-1 bg-gray-600 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${getProgressBarColor(strength.score)}`}
              style={{ width: `${strength.score}%` }}
            />
          </div>
          <span className={`font-medium ${strength.color}`}>
            {strength.label}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-3 w-3 text-gray-400" />
          ) : (
            <ChevronDown className="h-3 w-3 text-gray-400" />
          )}
        </div>
        
        {/* Expandable requirements */}
        {isExpanded && (
          <div className="px-3 pb-2 border-t border-gray-700 pt-2">
            <div className="space-y-1">
              {requirements.map((requirement, index) => {
                const isValid = requirement.test(password);
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`h-2 w-2 rounded-full ${isValid ? 'bg-green-500' : 'bg-gray-500'}`} />
                    <span className={isValid ? 'text-green-400' : 'text-gray-400'}>
                      {requirement.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordStrengthWidget;
