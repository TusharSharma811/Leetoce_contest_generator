import React, { useState , useEffect } from 'react';

import { Clock, CalendarDays, Award, Zap } from 'lucide-react';
import Card from '../components/Card';
import CardHeader from '../components/CardHeader';
import CardTitle from '../components/CardTitle';
import CardContent from '../components/CardContent';
import Badge from '../components/Badge';
import Button from '../components/Button';
const ContestPage = ({contestDetails , setContestCreated , setContestDetails}) => {


    const createNewContest = () => {
        setContestCreated(false);
        setContestDetails(null);
        setProblems({
          easy: [],
          medium: [],
          hard: []
        });
      };
    
    
      const [timeLeft, setTimeLeft] = useState(contestDetails.durationHours * 3600);
                        
      useEffect(() => {
        const timer = setInterval(() => {
          setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        
        return () => clearInterval(timer);
      }, [timeLeft]);
  return (
    <div>

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
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Time Remaining</h3>
                      <div className="font-mono text-2xl">
                        {String(Math.floor(timeLeft / 3600)).padStart(2, '0')}:
                        {String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0')}:
                        {String(timeLeft % 60).padStart(2, '0')}
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
                              <a href={`https://leetcode.com/problems/${problem.titleSlug}/description`} className="text-sm text-blue-600 hover:underline ml-3" target="_blank" rel="noopener noreferrer">
                                Solve on LeetCode
                              </a>
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
    </div>
  )
}

export default ContestPage