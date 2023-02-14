import { MdQuiz } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { auth, signOut } from '../firebase';
import { toast } from 'react-toastify';

const Header = ({ user }) => {
   const signout = () => {
      signOut(auth).then(() => toast.success('Sign out successfully.'));
   };

   return (
      <header className='bg-secondary w-100'>
         <div className='container'>
            <nav className='navbar navbar-expand-lg'>
               <div className='container-fluid p-0'>
                  <Link className='Navbar-brand d-block no-underline text-white h4 m-0 py-4' to='/'>
                     Tech Quiz
                     <MdQuiz className='ms-1' />
                  </Link>
                  <button
                     className='navbar-toggler'
                     type='button'
                     data-bs-toggle='collapse'
                     data-bs-target='#navbarSupportedContent'
                     aria-controls='navbarSupportedContent'
                     aria-expanded='false'
                     aria-label='Toggle navigation'
                  >
                     <span className='navbar-toggler-icon'></span>
                  </button>
                  <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                     <ul className='navbar-nav me-auto mb-2 mb-lg-0'></ul>
                     <div className='d-flex align-items-center'>
                        <div className='mx-lg-2'>
                           <Link className='d-block no-underline text-white m-0 py-2 py-lg-4' to='/journal-entries'>
                              Journal Entries
                           </Link>
                        </div>

                        {user ? (
                           <>
                              <div className='mx-2 user-avatar position-relative'>
                                 <div className='position-absolute top-50 start-50 translate-middle'>
                                    {user.displayName && user.displayName.charAt(0)}
                                 </div>
                              </div>
                              <div className='mx-2'>
                                 <button className='btn btn-primary' onClick={signout}>
                                    Sign Out
                                 </button>
                              </div>
                           </>
                        ) : (
                           <>
                              <div className='ms-2'>
                                 <Link className='btn  btn-link-primary' to='/signup'>
                                    Sign Up
                                 </Link>
                              </div>
                              <div className='mx-2'>
                                 <Link className='btn btn-primary' to='/signin'>
                                    Sign In
                                 </Link>
                              </div>
                           </>
                        )}
                     </div>
                  </div>
               </div>
            </nav>
         </div>
      </header>
   );
};

export default Header;
