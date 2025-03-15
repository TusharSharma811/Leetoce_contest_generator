const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// LeetCode API endpoints
const LEETCODE_API_URL = 'https://leetcode.com/api';
const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

// Get problems by difficulty
app.get('/api/problems/:difficulty', async (req, res) => {
  try {
    const { difficulty } = req.params;
    
    // GraphQL query to get problems filtered by difficulty

    const query = `
      query problemsetQuestionListV2($difficulty: String!) {
        problemsetQuestionListV2: questionList(
          categorySlug: "", 
          filters: { difficulty: $difficulty }
          limit: 50
        ) {
          total
          questions {
            questionId
            title
            titleSlug
            difficulty
            acRate
            topicTags {
              name
            }
          }
        }
      }
    `;
    
    const response = await axios.post(LEETCODE_GRAPHQL_URL, {
      query,
      variables: { difficulty: difficulty.toUpperCase() }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    if (!response.data || !response.data.data) {
      throw new Error('Invalid response from LeetCode API');
    }
    
    const problems = response.data.data.problemsetQuestionList.questions;
    res.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ error: 'Failed to fetch problems from LeetCode' });
  }
});

// Create custom contest
app.post('/api/contests', async (req, res) => {
  try {
    const { title, description, problems, durationHours } = req.body;
    
    // In a real implementation, you would interact with LeetCode API
    // to create the contest if they provide such functionality
    
    // For now, just simulate contest creation
    const contestId = `contest-${Date.now()}`;
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + (durationHours * 60 * 60 * 1000));
    
    const contest = {
      id: contestId,
      title,
      description,
      problems,
      startTime,
      endTime,
      durationHours
    };
    
    // Here you would save the contest to a database
    
    res.status(201).json({
      success: true,
      message: 'Contest created successfully',
      contest
    });
  } catch (error) {
    console.error('Error creating contest:', error);
    res.status(500).json({ error: 'Failed to create contest' });
  }
});

// Get random problems by difficulty
app.get('/api/random-problems', async (req, res) => {
  try {
    const { easy, medium, hard } = req.query;
    
    const getRandomProblems = async (difficulty, count) => {
      if (!count || count <= 0) return [];
      const query = `
      query problemsetQuestionListV2($limit: Int) {
          problemsetQuestionListV2(limit: $limit) {
              questions {
                  questionFrontendId
                  title
                  titleSlug
                  difficulty
              }
          }
      }
  `;

  const variables = {
      limit: 50 // Fetch more problems to allow filtering
  };

  
      const response = await fetch("https://leetcode.com/graphql", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({ query, variables })
      });

      const text = await response.text(); // Read raw response
      console.log("Raw API Response:", text); // Debugging

      const data = JSON.parse(text);

      if (!data?.data?.problemsetQuestionListV2?.questions) {
          throw new Error("Invalid API response format");
      }

      // Filter questions by difficulty
      const filteredQuestions = data.data.problemsetQuestionListV2.questions.filter(
          (q) => q.difficulty.toLowerCase() === difficulty.toLowerCase()
      );

      // Randomly select required number of problems
      const selectedQuestions = filteredQuestions
          .sort(() => 0.5 - Math.random()) // Shuffle
          .slice(0, count); // Pick count problems

      return selectedQuestions;
    };
    
    const easyProblems = await getRandomProblems('EASY', parseInt(easy) || 0);
    const mediumProblems = await getRandomProblems('MEDIUM', parseInt(medium) || 0);
    const hardProblems = await getRandomProblems('HARD', parseInt(hard) || 0);
    
    res.json({
      easy: easyProblems,
      medium: mediumProblems,
      hard: hardProblems,
      total: easyProblems.length + mediumProblems.length + hardProblems.length
    });
  } catch (error) {
    console.error('Error fetching random problems:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    res.status(500).json({ error: 'Failed to fetch random problems' });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});