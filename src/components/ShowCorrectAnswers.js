import { Fragment } from 'react';
import { RiQuestionnaireFill } from 'react-icons/ri';
import { BsCircleFill, BsSquareFill } from 'react-icons/bs';

const ShowCorrectAnswers = ({ id, difficulty, tag, getKeyByValue, questions, userAnswers }) => {
   return (
      <div>
         <div className='modal fade' id={id} data-bs-backdrop='static' data-bs-keyboard='false' tabIndex='-1'>
            <div className='modal-dialog'>
               <div className='modal-content'>
                  <div className='modal-header'>
                     <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                  </div>

                  <div className='modal-body overflow-auto'>
                     <div className='d-flex justify-content-between'>
                        <div>
                           <BsCircleFill className='text-secondary' />
                           <small className='ms-2'>Your Answer</small>
                        </div>
                        <div>
                           <BsSquareFill className='text-primary' />
                           <small className='ms-2'>Correct Answer</small>
                        </div>
                        <div>
                           <BsSquareFill className='text-danger' />
                           <small className='ms-2'>Incorrect Answer</small>
                        </div>
                     </div>
                     {questions.map((question, questionIndex) => (
                        <Fragment key={questionIndex}>
                           <div className='mt-4'>
                              <div className='d-flex justify-content-between align-items-center mb-4'>
                                 <div className='d-flex align-items-center'>
                                    <h6 className='m-0'>Topic:</h6>
                                    <span className='badge bg-primary ms-2'>{tag}</span>
                                    <span className='badge bg-secondary ms-2'>{difficulty.toLowerCase()}</span>
                                 </div>
                                 <h5 className='text-end'>
                                    <RiQuestionnaireFill className='text-primary fs-1' /> &nbsp;{questionIndex + 1}/{questions.length}
                                 </h5>
                              </div>
                              <h4>{question.question}</h4>
                           </div>

                           <div>
                              {Object.keys(question.answers).map((key, index) => (
                                 <Fragment key={index}>
                                    {question.answers[key] != null && (
                                       <div
                                          className={`answers w-100  d-flex flex-column rounded position-relative ${
                                             key === getKeyByValue(question.correct_answers, 'true') ? ' correct-answer ' : ' wrong-answer '
                                          }`}
                                       >
                                          {userAnswers.filter(ans => ans.question === questionIndex && ans.answer == key).length > 0 && (
                                             <span className='position-absolute top-0 start-100 translate-middle p-2 bg-secondary border border-light rounded-circle'></span>
                                          )}
                                          {question.answers[key]}
                                       </div>
                                    )}
                                 </Fragment>
                              ))}
                           </div>
                        </Fragment>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ShowCorrectAnswers;
