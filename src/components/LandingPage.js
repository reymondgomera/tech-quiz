import illustration1 from '../assets/images/illustration-1.svg';
import { Link } from 'react-router-dom';
import { auth, signOut } from '../firebase';
import { toast } from 'react-toastify';
import Header from './Header';
import Footer from './Footer';

const LandingPage = ({ user }) => {
   const signout = () => {
      signOut(auth).then(() => toast.success('Sign out successfully.'));
   };

   return (
      <div className='page-container d-flex flex-column align-items-center justify-content-center'>
         <Header user={user} signout={signout} />
         <section className='my-auto bg-secondary'>
            <div className='container'>
               <div className='row justify-content-center align-items-center'>
                  <div className='col-10 col-lg-5'>
                     <div className='fs-1 banner-text'>
                        Test and refresh your knowledge on variety of <span className='text-primary'>Technical Topics.</span>
                     </div>
                     <div className='mt-4 banner-button'>
                        <Link className='btn btn-primary btn-lg' to='/quiz-config'>
                           Take Quiz
                        </Link>
                     </div>
                  </div>
                  <div className='col-12 my-5 m-lg-0 col-lg-7'>
                     <img className='illustration-image' src={illustration1} alt='illustration-1' />
                  </div>
               </div>
            </div>
         </section>
         <Footer />
      </div>
   );
};

export default LandingPage;
