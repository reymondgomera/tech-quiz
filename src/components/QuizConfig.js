import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const QuizConfig = ({ options, quizConfig, setQuizConfig, journalEntry, setJournalEntry }) => {
   const [pageNum, setPageNum] = useState(0);

   const next = () => {
      if (pageNum < options.length) setPageNum(prev => prev + 1);
   };

   const previous = () => {
      if (pageNum > 0) setPageNum(prev => prev - 1);
   };

   const handleSelectOptions = (value, index) => {
      switch (index) {
         case 0:
            setQuizConfig({ ...quizConfig, chosenTag: value });
            break;
         case 1:
            setQuizConfig({ ...quizConfig, chosenDifficulty: value });
            break;
         case 2:
            setQuizConfig({ ...quizConfig, chosenNumQuestions: value });
      }
   };

   const handleJournalEntryChange = e => {
      setJournalEntry({ ...journalEntry, [e.target.name]: e.target.value });
   };

   return (
      <div className='container'>
         {pageNum === 0 && <h1 className='text-center mt-5 mb-0'>Choose Your Topic.</h1>}
         {pageNum === 1 && <h1 className='text-center mt-5 mb-0'>Choose Your Difficulty.</h1>}
         {pageNum === 2 && <h1 className='text-center mt-5 mb-0'>Choose Number of Questions.</h1>}
         {pageNum === 3 && <h1 className='text-center mt-5 mb-0'>When you heard the term "{quizConfig.chosenTag}" what comes to your mind?</h1>}

         <div className='d-flex flex-column'>
            <div className='d-flex flex-wrap justify-content-center align-items-center mt-3'>
               {pageNum === 0 &&
                  options[0].map((tag, index) => (
                     <div
                        key={index}
                        className={`topic-container mx-4 ${quizConfig.chosenTag === tag.tag ? 'active' : ''}`}
                        onClick={() => handleSelectOptions(tag.tag, 0)}
                     >
                        <div className='topic-text'>{tag.displayName}</div>
                        <center>
                           <img className='topic-image' src={tag.image} alt={tag.tag} />
                        </center>
                     </div>
                  ))}

               {pageNum === 1 &&
                  options[1].map((difficulty, index) => (
                     <div
                        key={index}
                        className={`difficulty-container w-100 mx-4 ${quizConfig.chosenDifficulty === difficulty ? 'active' : ''}`}
                        onClick={() => handleSelectOptions(difficulty, 1)}
                     >
                        <div className='difficulty-text'>{difficulty}</div>
                     </div>
                  ))}

               {pageNum === 2 &&
                  options[2].map((numQuestions, index) => (
                     <div
                        key={index}
                        className={`numQuestion-container w-100 mx-4 ${quizConfig.chosenNumQuestions === numQuestions ? 'active' : ''}`}
                        onClick={() => handleSelectOptions(numQuestions, 2)}
                     >
                        <div className='numQuestion-text'>{numQuestions} Questions</div>
                     </div>
                  ))}

               {pageNum === 3 && (
                  <div className='priorLearnings-container w-100 mx-4'>
                     <textarea
                        className='form-control'
                        name='priorLearnings'
                        id='priorLearnings'
                        rows='15'
                        placeholder='your answer here..'
                        value={journalEntry.priorLearnings}
                        onChange={handleJournalEntryChange}
                     ></textarea>
                  </div>
               )}

               <div className='d-flex justify-content-end w-100'>
                  {pageNum > 0 && (
                     <>
                        <button className='btn btn-link-primary align-self-end' onClick={previous}>
                           Previous
                        </button>

                        {pageNum === 1 && (
                           <button className='btn btn-primary mt-4 mx-4' onClick={next} disabled={quizConfig.chosenDifficulty ? false : true}>
                              Next
                           </button>
                        )}

                        {pageNum === 2 && (
                           <button className='btn btn-primary mt-4 mx-4' onClick={next} disabled={quizConfig.chosenNumQuestions ? false : true}>
                              Next
                           </button>
                        )}

                        {pageNum === 3 && (
                           <Link className={`btn btn-primary mt-4 mx-4 ${journalEntry.priorLearnings ? '' : ' disabled'}`} to='/quiz'>
                              Take Quiz
                           </Link>
                        )}
                     </>
                  )}
               </div>
               <div className='d-flex justify-content-between w-100'>
                  {pageNum === 0 && (
                     <>
                        <Link
                           className='btn btn-primary my-4 mx-5   '
                           to='/'
                           onClick={() =>
                              setQuizConfig({
                                 chosenTag: '',
                                 chosenDifficulty: '',
                                 chosenNumQuestions: '',
                              })
                           }
                        >
                           Back to Hompage
                        </Link>
                        <button className='btn btn-primary my-4 mx-5' onClick={next} disabled={quizConfig.chosenTag ? false : true}>
                           Next
                        </button>
                     </>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default QuizConfig;
