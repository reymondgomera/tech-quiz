import useFetch from './hooks/useFetch';
import { Fragment, useState } from 'react';
import { RiEmotionHappyLine, RiEmotionSadLine, RiQuestionnaireFill } from 'react-icons/ri';
import { API_KEY } from '../App';
import { Link } from 'react-router-dom';
import { db, collection, addDoc, serverTimestamp } from '../firebase';
import ShowCorrectAnswers from './ShowCorrectAnswers';
import { toast } from 'react-toastify';
import { MdQuiz } from 'react-icons/md';

const Quiz = ({ difficulty, tag, limit, setQuizConfig, user, journalEntry, setJournalEntry }) => {
   const [currentQuestion, setCurrentQuestion] = useState(0);
   const {
      data: questions,
      isLoading: questionsIsLoading,
      error: questionsError,
   } = useFetch(`/questions?apiKey=${API_KEY}&difficulty=${difficulty}&limit=${limit}&tags=${tag}`);
   const [userAnswers, setUserAnswers] = useState([]);
   const [score, setScore] = useState(0);
   const [showScore, setShowScore] = useState(false);
   const [showNewLearnings, setShowNewLearnings] = useState(false);
   const [isJournalEntrySaved, setIsJournalEntrySaved] = useState(false);

   const next = () => {
      if (currentQuestion < questions.length) setCurrentQuestion(prev => prev + 1);
   };

   const previous = () => {
      if (currentQuestion > 0) setCurrentQuestion(prev => prev - 1);
   };

   const handleShowNewLearnings = () => {
      setShowNewLearnings(prev => !prev);
   };

   const handleJournalEntryChange = e => {
      setJournalEntry({ ...journalEntry, [e.target.name]: e.target.value });
   };

   const handleAnswer = (index, questionId, answer) => {
      if (!userAnswers[index]) {
         setUserAnswers([...userAnswers, { id: questionId, question: index, answer: answer }]);
      } else {
         setUserAnswers([...userAnswers.filter(ans => ans.question !== index), { id: questionId, question: index, answer: answer }]);
      }
   };

   const checkAnswer = () => {
      questions.forEach(question => {
         const correctAnswerKey = getKeyByValue(question.correct_answers, 'true');
         userAnswers.forEach(userAnswer => {
            if (question.id === userAnswer.id && correctAnswerKey === userAnswer.answer) {
               setScore(prev => prev + 1);
            }
         });
      });

      setShowScore(true);
   };

   const getKeyByValue = (object, value) => {
      const correctAnswer = Object.keys(object).find(key => object[key] === value);
      const key = correctAnswer.split('_');
      return `${key[0]}_${key[1]}`;
   };

   const reset = () => {
      setScore(0);
      setUserAnswers([]);
      setQuizConfig({ chosenTag: '', chosenDifficulty: '', chosenNumQuestions: '' });
      setJournalEntry({ priorLearnings: '', newLearnings: '' });
   };

   const submitJournalEntry = () => {
      if (journalEntry.priorLearnings && journalEntry.newLearnings) {
         addDoc(collection(db, 'journal-entries'), {
            displayName: user.displayName,
            topic: tag,
            difficulty: difficulty,
            numQuestions: limit,
            timestamp: serverTimestamp(),
            priorLearnings: journalEntry.priorLearnings,
            newLearnings: journalEntry.newLearnings,
         })
            .then(() => {
               toast.success('Journal entry has been saved.');
               setIsJournalEntrySaved(true);
               setJournalEntry({ priorLearnings: '', newLearnings: '' });
            })
            .catch(err => toast.error(err.message));
      }
   };

   return (
      <div className='container'>
         {!showNewLearnings && (
            <Link className='h1 d-block text-secondary no-underline text-center mt-5 mb-0' to='/' onClick={reset}>
               Tech Quiz
               <MdQuiz className='ms-1' />
            </Link>
         )}
         <div className='d-flex flex-column align-items-center justify-content-center p-3'>
            {questionsIsLoading && !showScore && (
               <div className='mt-2'>
                  <div className='spinner-border text-primary spinner-large mt-5' role='status'></div>
               </div>
            )}
            {!questionsIsLoading && questionsError && !showScore && <div className='text-center my-5'>{questionsError}</div>}

            {questions.length > 0 && !showScore && (
               <>
                  <div className='w-75 mt-4'>
                     <div className='d-flex justify-content-between align-items-center mb-4'>
                        <div className='d-flex align-items-center'>
                           <h6 className='m-0'>Topic:</h6>
                           <span className='badge bg-primary ms-2'>{tag}</span>
                           <span className='badge bg-secondary ms-2'>{difficulty.toLowerCase()}</span>
                        </div>
                        <h5 className='text-end'>
                           <RiQuestionnaireFill className='text-primary fs-1' /> &nbsp;{currentQuestion + 1}/{questions.length}
                        </h5>
                     </div>
                     <h4>{questions[currentQuestion].question}</h4>
                  </div>
                  <div className='w-75'>
                     {Object.keys(questions[currentQuestion].answers).map((key, index) => (
                        <Fragment key={index}>
                           {questions[currentQuestion].answers[key] != null && (
                              <div
                                 className={`answers w-100 d-flex flex-column rounded ${
                                    userAnswers.filter(ans => ans.question === currentQuestion && ans.answer === key && questions).length > 0 &&
                                    'active'
                                 }`}
                                 onClick={() => handleAnswer(currentQuestion, questions[currentQuestion].id, key)}
                              >
                                 {questions[currentQuestion].answers[key]}
                              </div>
                           )}
                        </Fragment>
                     ))}
                  </div>
                  <div className='d-flex justify-content-end w-75 mt-4'>
                     {currentQuestion > 0 && (
                        <button className='btn btn-link-primary align-self-end' onClick={previous}>
                           Previous
                        </button>
                     )}

                     {currentQuestion < questions.length - 1 ? (
                        <button
                           className='btn btn-primary ms-3 align-self-end'
                           disabled={currentQuestion + 1 <= userAnswers.length ? false : true}
                           onClick={next}
                        >
                           Next
                        </button>
                     ) : (
                        <button className='btn btn-primary ms-3 align-self-end' onClick={checkAnswer}>
                           Submit
                        </button>
                     )}
                  </div>
               </>
            )}
         </div>

         {/* show input for new learnings */}
         {showNewLearnings && (
            <div>
               <div className='d-flex flex-column align-items-center'>
                  <h1 className='text-center mt-5 mb-0'>What are your new learnings or realization after taking the quiz?</h1>
                  <div className='priorLearnings-container w-100 mx-4'>
                     <textarea
                        className='form-control'
                        name='newLearnings'
                        id='newLearnings'
                        rows='15'
                        placeholder='your answer here..'
                        value={journalEntry.newLearnings}
                        onChange={handleJournalEntryChange}
                     ></textarea>
                  </div>
                  <div className='d-flex justify-content-between align-items-center mt-4 w-100'>
                     <div className=''>
                        &nbsp;
                        {isJournalEntrySaved && (
                           <Link className='btn btn-primary' to='/' onClick={reset}>
                              Back to Hompage
                           </Link>
                        )}
                     </div>
                     <div className='d-flex justify-content-end flex-wrap'>
                        <button className='btn btn-link-primary me-sm-3' onClick={submitJournalEntry}>
                           Saved Journal Entry
                        </button>
                        <Link className={`btn btn-primary ${isJournalEntrySaved ? '' : ' disabled'}`} to='/quiz-config' onClick={reset}>
                           Take Quiz Again
                        </Link>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* show Score */}
         {showScore && !showNewLearnings && (
            <div className='mt-4'>
               {score / limit >= 0.5 && score / limit <= 1 ? (
                  <div className='p-3 d-flex flex-column align-items-center'>
                     <div>
                        <h3 className='h4'>
                           Incredible knowledge, congratulation you <span className='text-primary fw-bolder'>PASSED!</span>
                        </h3>
                     </div>
                     <div>
                        <RiEmotionHappyLine className='my-2 icon-large text-primary' />
                     </div>
                     <div>
                        <h3>
                           {score} / {limit}
                        </h3>
                     </div>
                     <div className='mt-5 align-self-end'>
                        <button className='btn btn-link-primary me-3' data-bs-toggle='modal' data-bs-target='#modal-show-correct-answers'>
                           Show Correct Answer
                        </button>
                        <button className='btn btn-primary' onClick={handleShowNewLearnings}>
                           Next
                        </button>
                     </div>
                  </div>
               ) : (
                  <div className='p-3 d-flex flex-column align-items-center'>
                     <div>
                        <h3 className='h4'>
                           Oh, no! you need to study more, I am sorry you <span className='text-danger fw-bolder'>FAILED!</span>
                        </h3>
                     </div>
                     <div>
                        <RiEmotionSadLine className='my-2 icon-large text-danger' />
                     </div>
                     <div>
                        <h3>
                           {score} / {limit}
                        </h3>
                     </div>
                     <div className='mt-5 align-self-end'>
                        <button className='btn btn-link-primary me-3' data-bs-toggle='modal' data-bs-target='#modal-show-correct-answers'>
                           Show Correct Answer
                        </button>
                        <button className='btn btn-primary' onClick={handleShowNewLearnings}>
                           Next
                        </button>
                     </div>
                  </div>
               )}
            </div>
         )}

         <ShowCorrectAnswers
            id='modal-show-correct-answers'
            getKeyByValue={getKeyByValue}
            questions={questions}
            userAnswers={userAnswers}
            difficulty={difficulty}
            tag={tag}
         />
      </div>
   );
};

export default Quiz;
