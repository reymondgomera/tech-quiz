import { Fragment, useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Quiz from './components/Quiz';
import { db, auth, onAuthStateChanged } from '../src/firebase';

// topic images
import docker from './assets/images/docker.svg';
import html from './assets/images/html.svg';
import javascript from './assets/images/javascript.svg';
import mysql from './assets/images/mysql.svg';
import linux from './assets/images/linux.svg';
import php from './assets/images/php.svg';
import laravel from './assets/images/laravel.svg';
import wordpress from './assets/images/wordpress.svg';
import kubernetes from './assets/images/kubernetes.svg';
import devops from './assets/images/devops.svg';
import QuizConfig from './components/QuizConfig';
import LandingPage from './components/LandingPage';
import Signin from './components/Signin';
import Signup from './components/Signup';

import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';
import JournalEntries from './components/JournalEntries';

export const API_KEY = 'HYBD3xe1yt1iabuQPsU3YNMZIlYWmZlT9t4tVfRG';

function App() {
   const options = [
      [
         { tag: 'html', displayName: 'HTML', image: html },
         { tag: 'javascript', displayName: 'JavaScript', image: javascript },
         { tag: 'mysql', displayName: 'MySQL', image: mysql },
         { tag: 'docker', displayName: 'Docker', image: docker },
         { tag: 'linux', displayName: 'Linux', image: linux },
         { tag: 'php', displayName: 'PHP', image: php },
         { tag: 'laravel', displayName: 'Laravel', image: laravel },
         { tag: 'wordpress', displayName: 'Wordpress', image: wordpress },
         { tag: 'kubernetes', displayName: 'Kubernetes', image: kubernetes },
         { tag: 'devops', displayName: 'DevOps', image: devops },
      ],
      ['Easy', 'Medium', 'Hard'],
      [5, 10, 15, 20],
   ];

   const [quizConfig, setQuizConfig] = useState({
      chosenTag: '',
      chosenDifficulty: '',
      chosenNumQuestions: '',
   });

   const [user, setUser] = useState(null);
   const [journalEntry, setJournalEntry] = useState({ priorLearnings: '', newLearnings: '' });

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, authUser => {
         if (authUser) setUser(authUser);
         else setUser(null);
      });

      // perform clean up
      return () => {
         unsubscribe();
      };
   }, [user]);

   return (
      <>
         <Router>
            <Routes>
               <Route path='/' element={<LandingPage user={user} />} />
               <Route path='/signin' element={!user ? <Signin setUser={setUser} /> : <Navigate replace to='/' />} />
               <Route path='/signup' element={<Signup />} />
               <Route
                  path='/quiz-config'
                  element={
                     user ? (
                        <QuizConfig
                           options={options}
                           quizConfig={quizConfig}
                           setQuizConfig={setQuizConfig}
                           journalEntry={journalEntry}
                           setJournalEntry={setJournalEntry}
                        />
                     ) : (
                        <Navigate replace to='/signin' />
                     )
                  }
               />
               <Route
                  path='/quiz'
                  element={
                     quizConfig.chosenTag && quizConfig.chosenDifficulty && quizConfig.chosenNumQuestions ? (
                        <Quiz
                           user={user}
                           journalEntry={journalEntry}
                           setJournalEntry={setJournalEntry}
                           difficulty={quizConfig.chosenDifficulty && quizConfig.chosenDifficulty}
                           limit={quizConfig.chosenNumQuestions && quizConfig.chosenNumQuestions}
                           tag={quizConfig.chosenTag && quizConfig.chosenTag}
                           setQuizConfig={setQuizConfig}
                        />
                     ) : (
                        <Navigate replace to='/quiz-config' />
                     )
                  }
               />
               <Route path='/journal-entries' element={user ? <JournalEntries user={user} /> : <Navigate replace to='/signin' />} />
            </Routes>
         </Router>
         <ToastContainer autoClose='2500' theme='light' style={{ fontSize: '15px', width: '330px' }} />
      </>
   );
}

export default App;
