import React, { useState , useEffect } from 'react';
import ContestPage from './ContestPage';
import { Clock, CalendarDays, Award, Zap } from 'lucide-react';
import Card from '../components/Card';
import CardHeader from '../components/CardHeader';
import CardTitle from '../components/CardTitle';
import CardContent from '../components/CardContent';
import Badge from '../components/Badge';
import Button from '../components/Button';

// Main App Component
const LeetCodeContestCreator = () => {
const [title, setTitle] = useState('My Custom Contest');
  const [description, setDescription] = useState('A personalized LeetCode contest');
  const [duration, setDuration] = useState(2);
  const [loading, setLoading] = useState(false);
  const [contestCreated, setContestCreated] = useState(false);
  const [contestDetails, setContestDetails] = useState(null);
  
  // Problem selection
  const [easyCount, setEasyCount] = useState(1);
  const [mediumCount, setMediumCount] = useState(2);
  const [hardCount, setHardCount] = useState(1);
  const [problems, setProblems] = useState({
    easy: [],
    medium: [],
    hard: []
  });

  // Generate random problems
  const generateRandomProblems = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would call your backend API
      const response = await fetch(`https://lcg-backend.onrender.com/api/random-problems?easy=${easyCount}&medium=${mediumCount}&hard=${hardCount}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch problems');
      }
      
      const data = await response.json();
      setProblems(data);
      setLoading(false);
      
    } catch (error) {
      console.error('Error generating problems:', error);
      setLoading(false);
    }
  };

  // Create contest
  const createContest = async () => {
    try {
      setLoading(true);
      
      // Combine all problems
      const allProblems = [
        ...problems.easy,
        ...problems.medium,
        ...problems.hard
      ];
      
      // In a real implementation, this would call your backend API
      const response = await fetch('https://lcg-backend.onrender.com/api/contests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          problems: allProblems,
          durationHours: duration
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create contest');
      }
      
      const data = await response.json();
      setContestDetails(data.contest);
      setContestCreated(true);
      setLoading(false);
      
    } catch (error) {
      console.error('Error creating contest:', error);
      setLoading(false);
    }
  };

  // Reset app state to create another contest
  

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">LeetCode Contest Creator</h1>
      
      {!contestCreated ? (
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b p-4">
              <h2 className="text-xl font-semibold">Contest Details</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Contest Title</label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter contest title" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input 
                    type="text"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Enter contest description" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Duration (hours): {duration}</label>
                  <div className="flex items-center">
                    <span className="mr-2">1</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <span className="ml-2">5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="border-b p-4">
              <h2 className="text-xl font-semibold">Problem Selection</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium">Easy Problems: {easyCount}</label>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
                      {problems.easy.length} selected
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={generateRandomProblems} 
                  className="w-full hover:cursor-pointer bg-green-400 hover:bg-green-500 text-white py-2 rounded-md"
                  disabled={loading || (easyCount + mediumCount + hardCount === 0)}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Random Problems
                </button>
              </div>
            </div>
          </div>
          
          {(problems.easy.length > 0 || problems.medium.length > 0 || problems.hard.length > 0) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Selected Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {problems.easy.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Easy Problems:</h3>
                      <ul className="list-disc pl-5">
                        {problems.easy.map(problem => (
                          <li key={problem.questionId} className="mb-1">
                            {problem.title} (Acceptance: {(problem.acRate).toFixed(1)}%)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {problems.medium.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Medium Problems:</h3>
                      <ul className="list-disc pl-5">
                        {problems.medium.map(problem => (
                          <li key={problem.questionId} className="mb-1">
                            {problem.title} (Acceptance: {(problem.acRate).toFixed(1)}%)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {problems.hard.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Hard Problems:</h3>
                      <ul className="list-disc pl-5">
                        {problems.hard.map(problem => (
                          <li key={problem.questionId} className="mb-1">
                            {problem.title} (Acceptance: {(problem.acRate).toFixed(1)}%)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          <button 
            onClick={createContest} 
            className="w-full bg-blue-600 hover:bg-blue-700 hover:cursor-pointer"
            disabled={loading || (problems.easy.length + problems.medium.length + problems.hard.length === 0)}
          >
            {loading ? 'Creating...' : 'Create Contest'}
          </button>
        </div>
      ) : (
       <div className="w-full max-w-4xl">
          <ContestPage contestDetails={contestDetails} setContestDetails={setContestCreated} setContestCreated={setContestDetails} />
        </div>
      )}
    </div>
  );
};

export default LeetCodeContestCreator;