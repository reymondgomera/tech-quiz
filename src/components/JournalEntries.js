import React, { useEffect, useState } from 'react';
import { db, collection, query, onSnapshot, orderBy, doc, addDoc, serverTimestamp } from '../firebase';
import { RiQuestionnaireFill } from 'react-icons/ri';
import { FaComments } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import Footer from './Footer';
import Header from './Header';
import Comments from './Comments';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';

const JournalEntries = ({ user }) => {
   const [journalEntries, setJournalEntries] = useState([]);
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [comment, setComment] = useState('');

   const [pageNumber, setPageNumber] = useState(0);
   const itemPerPage = 5;
   const pageVisited = pageNumber * itemPerPage;
   const pageCount = Math.ceil(journalEntries.length / itemPerPage);

   const changePage = ({ selected }) => {
      setPageNumber(selected);
   };

   const formatTimestamp = timestamp => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const tConvert = time => {
         // Check correct time format and split into components
         time = time.toString().match(/^([01]?\d|2[0-3])(:)([0-5]?\d)(:[0-5]?\d)?$/) || [time];

         if (time.length > 1) {
            // If time format correct
            time = time.slice(1); // Remove full string match value
            time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
         }
         return time.join(''); // return adjusted time or original string
      };

      const formattedTimestamp = {
         date: `${months[timestamp.toDate().getMonth()]} ${timestamp.toDate().getDate()}, ${timestamp.toDate().getFullYear()}`,
         time: tConvert(`${timestamp.toDate().getHours()}:${timestamp.toDate().getMinutes()}:${timestamp.toDate().getSeconds()}`),
      };

      return formattedTimestamp;
   };

   const addComment = async (e, docId) => {
      e.preventDefault();
      if (comment) {
         const docRef = doc(db, 'journal-entries', docId);
         addDoc(collection(docRef, 'comments'), {
            displayName: user.displayName,
            text: comment,
            timestamp: serverTimestamp(),
         })
            .then(() => {
               setComment('');
               // e.target.parentElement.parentElement.parentElement.childNodes[0].value = '';
               e.target.reset();
            })
            .catch(err => toast.error(err.message));
      }
   };

   useEffect(() => {
      const q = query(collection(db, 'journal-entries'), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(
         q,
         snapshot => {
            if (!snapshot.empty) {
               setJournalEntries(
                  snapshot.docs.map(doc => ({
                     id: doc.id,
                     ...doc.data(),
                  }))
               );
            }
            setIsLoading(false);
         },
         err => {
            setError(err.message);
            console.error(err.message);
         }
      );

      // perform clean up
      return () => {
         unsubscribe();
      };
   }, []);

   return (
      <div className='page-container d-flex flex-column align-items-center justify-content-center'>
         <Header user={user} />
         <div className='container d-flex flex-column my-auto '>
            {isLoading && (
               <div className='d-flex justify-content-center w-100 mt-2'>
                  <div className='spinner-border text-primary spinner-large mt-5' role='status'></div>
               </div>
            )}

            {!isLoading && error && <div className='text-center my-5'>{error}</div>}

            {!isLoading && (
               <div className='bg-white w-100 rounded p-3 mb-5 position-relative'>
                  {journalEntries.length > 0 &&
                     journalEntries.slice(pageVisited, pageVisited + itemPerPage).map(entry => (
                        <div key={entry.id} className='entry'>
                           <div className='entry-header d-flex align-items-center'>
                              <div className='mx-2 user-avatar position-relative'>
                                 <div className='text-white position-absolute top-50 start-50 translate-middle'>{entry.displayName.charAt(0)}</div>
                              </div>
                              <div className='entry-info'>
                                 <div className='fw-bold entry-displayName'>{entry.displayName}</div>
                                 <small className='entry-timestamp'>
                                    {entry.timestamp && formatTimestamp(entry.timestamp) && formatTimestamp(entry.timestamp).date}&nbsp; | &nbsp;
                                    {entry.timestamp && formatTimestamp(entry.timestamp) && formatTimestamp(entry.timestamp).time}
                                 </small>
                                 <div className='entry-quiz-config'>
                                    <span className='badge bg-primary'>{entry.topic}</span>
                                    <span className='badge bg-secondary ms-2'>{entry.difficulty.toLowerCase()}</span>
                                    <span className='ms-2'>
                                       <RiQuestionnaireFill className='text-primary entry-numQuestions' /> &nbsp;
                                       {entry.numQuestions}
                                    </span>
                                 </div>
                              </div>
                           </div>
                           <div className='entry-body mt-3 row border-bottom py-2'>
                              <div className='col-12 col-lg-6 p-0'>
                                 <div className='rounded-left bg-primary p-2'>When you heard the term "{entry.topic}" what comes to your mind?</div>
                                 <div className='entry-learnings'>{entry.priorLearnings}</div>
                              </div>
                              <div className='mt-3 mt-lg-0 col-12 col-lg-6 p-0'>
                                 <div className='rounded-right bg-secondary p-2'>
                                    What are your new learnings or realization after taking the quiz?
                                 </div>
                                 <div className='entry-learnings'>{entry.newLearnings}</div>
                              </div>
                           </div>
                           <div className='entry-comments'>
                              <div className='accordion accordion-flush' id='accordionFlushExample'>
                                 <div className='accordion-item'>
                                    <h2 className='accordion-header' id='flush-headingOne'>
                                       <button
                                          className='accordion-button collapsed py-1 p-3 rounded commentButton'
                                          type='button'
                                          data-bs-toggle='collapse'
                                          data-bs-target={`#entry-comments-${entry.id}`}
                                       >
                                          <FaComments className='text-primary me-2' />
                                          <small className='position-relative'>
                                             Comments
                                             <span
                                                id={`comment-count-${entry.id}`}
                                                className='ms-3 mt-2 position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary'
                                             ></span>
                                          </small>
                                       </button>
                                    </h2>
                                    <div
                                       id={`entry-comments-${entry.id}`}
                                       className='accordion-collapse collapse'
                                       data-bs-parent='#accordionFlushExample'
                                    >
                                       <div className='accordion-body py-2'>
                                          <div className='entry-comments border-bottom mb-2 py-1'>
                                             <small>
                                                <Comments docId={entry.id} formatTimestamp={formatTimestamp} />
                                             </small>
                                          </div>
                                          <div className='entry-comment-input border p-1 pe-2'>
                                             <form className='d-flex align-items-center' onSubmit={e => addComment(e, entry.id)}>
                                                <input
                                                   type='text'
                                                   className='w-100 rounded border-0 me-3 p-0'
                                                   name='comment'
                                                   placeholder='Add comment...'
                                                   onChange={e => setComment(e.target.value)}
                                                />
                                                <button className='btn p-0' disabled={comment ? false : true}>
                                                   <IoMdSend className='text-primary send-comment-btn' type='submit' />
                                                </button>
                                             </form>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
               </div>
            )}

            {!isLoading && journalEntries.length > 0 && (
               <ReactPaginate
                  previousLabel='Previous'
                  breakLabel='...'
                  nextLabel='Next'
                  pageCount={pageCount}
                  onPageChange={changePage}
                  containerClassName='pagination align-self-end'
                  previousClassName='page-item'
                  previousLinkClassName='page-link'
                  nextClassName='page-item'
                  nextLinkClassName='page-link'
                  pageClassName='page-item'
                  pageLinkClassName='page-link'
                  breakClassName='page-item'
                  breakLinkClassName='page-link'
                  activeClassName='active'
               />
            )}
         </div>
         <div className='p-3'>&nbsp;</div>
         <Footer />
      </div>
   );
};

export default JournalEntries;
