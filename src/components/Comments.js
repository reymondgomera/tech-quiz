import { useState, useEffect } from 'react';
import { db, collection, doc, query, onSnapshot, orderBy } from '../firebase';

const Comments = ({ docId, formatTimestamp }) => {
   const [comments, setComments] = useState([]);
   const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const docRef = doc(db, 'journal-entries', docId);
      const q = query(collection(docRef, 'comments'), orderBy('timestamp', 'asc'));

      const unsubscribe = onSnapshot(
         q,
         snapshot => {
            if (!snapshot.empty) {
               setComments(
                  snapshot.docs.map(doc => ({
                     id: doc.id,
                     ...doc.data(),
                  }))
               );

               document.querySelector(`#comment-count-${docId}`).innerHTML = snapshot.docs.length;
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
      <div className='comments-container'>
         {isLoading && (
            <div className='d-flex justify-content-center w-100 mt-2'>
               <div className='spinner-border text-primary spinner-border-sm mb-3' role='status'></div>
            </div>
         )}

         {!isLoading && error && <div className='text-center mb-3'>{error}</div>}

         {comments.length > 0 ? (
            comments.map(comment => (
               <div className='comment' key={comment.id}>
                  <small className=' comment-header'>
                     <span className='comment-displayName'>{comment.displayName} </span>&nbsp;|&nbsp;&nbsp;
                     {comment.timestamp && formatTimestamp(comment.timestamp) && formatTimestamp(comment.timestamp).date}
                     &nbsp; | &nbsp;
                     {comment.timestamp && formatTimestamp(comment.timestamp) && formatTimestamp(comment.timestamp).time}
                  </small>
                  <div>{comment.text}</div>
               </div>
            ))
         ) : (
            <div className='text-center mt-3'>No comment at the moment..</div>
         )}
      </div>
   );
};

export default Comments;
