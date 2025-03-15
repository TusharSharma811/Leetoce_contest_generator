import React, { useState } from 'react';

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
      const response = await fetch(`http://localhost:5000/api/random-problems?easy=${easyCount}&medium=${mediumCount}&hard=${hardCount}`);
      
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
      const response = await fetch('http://localhost:5000/api/contests', {
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
  const createNewContest = () => {
    setContestCreated(false);
    setContestDetails(null);
    setProblems({
      easy: [],
      medium: [],
      hard: []
    });
  };

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
                  className="w-full hover:cursor-pointer"
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
        <Card className="w-full max-w-4xl">
          <CardHeader className="bg-green-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-800">Contest Created Successfully!</CardTitle>
              <Badge className="bg-green-600">Ready</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h2 className="text-xl font-bold mb-2">{contestDetails.title}</h2>
                <p className="text-gray-600">{contestDetails.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{contestDetails.durationHours} hours</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Start Time</p>
                    <p className="font-medium">
                      {new Date(contestDetails.startTime).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                  <Award className="h-5 w-5 mr-2 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Problems</p>
                    <p className="font-medium">{contestDetails.problems.length} total</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-bold mb-3">Problem Set</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="divide-y">
                    {contestDetails.problems.map((problem, index) => (
                      <li key={problem.questionId} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center">
                          <span className="font-mono bg-gray-200 text-gray-700 px-2 py-1 rounded mr-3">
                            Q{index + 1}
                          </span>
                          <div>
                            <a href={`https://leetcode.com/problems/${problem.titleSlug}/description`} className="font-medium" target='_blank' >{problem.title}</a>
                            <div className="flex items-center mt-1">
                              <Badge 
                                className={`mr-2 ${
                                  problem.difficulty === 'EASY' ? 'bg-green-500' : 
                                  problem.difficulty === 'MEDIUM' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                              >
                                {problem.difficulty}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                Acceptance: {(problem.acRate).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    // In a real app, this would generate a shareable URL
                    alert(`Contest link: ${window.location.origin}/contests/${contestDetails.id}`);
                  }}
                >
                  Share Contest
                </Button>
                
                <Button 
                  className="flex-1"
                  variant="outline"
                  onClick={createNewContest}
                >
                  Create Another Contest
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeetCodeContestCreator;