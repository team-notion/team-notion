// PaymentVerification.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getData } from '@/components/lib/apiMethods';
import { toast } from 'sonner';
import { apiEndpoints } from '@/components/lib/apiEndpoints';
import CONFIG from '@/components/utils/config';
import { LOCAL_STORAGE_KEYS } from '@/components/utils/localStorageKeys';
import Loader from '@/components/ui/Loader/Loader';
import { CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState('loading');
  
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const trxref = searchParams.get('trxref');
        const reference = searchParams.get('reference');
        const paymentId = sessionStorage.getItem('pending_payment_id');
        
        if (!trxref || !reference) {
          toast.error('Payment information not found');
          navigate('/reservation-management');
          return;
        }

        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
        
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VERIFY_PAYMENTS}?reference=${reference}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const resp = response.data;

        if (response.status === 200 || response.status === 201 || resp?.data?.status === 'success') {
          toast.success(resp?.message || 'Payment successful! Your reservation is confirmed.');

          setStatus('success');
          setSuccessMessage(resp?.message);

          sessionStorage.removeItem('pending_payment_id');
          sessionStorage.removeItem('reservation_code');
          
          setVerifying(false);
          setTimeout(() => {
            navigate('/reservation-management');
          }, 5000);
        }
        else {
          setStatus('error');
          setErrorMessage(resp?.message);
          
          toast.error(resp?.message || 'Payment verification failed');
          setTimeout(() => {
            navigate('/reservation-management');
          }, 5000);
        }
      }
      catch (err: any) {
        const errData = err?.response?.data;

        if (errData && typeof errData === 'object') {
          Object.keys(errData).forEach((key) => {
            if (Array.isArray(errData[key]) && errData[key].length > 0) {
              errData[key].forEach((message: string) => {
                setStatus('error');
                setErrorMessage(message);
                
                toast.error(message);
              });
            }
            else {
              setStatus('error');
              setErrorMessage(errData[key]);

              toast.error(errData[key]);
            }
          });
        }
        
        navigate('/reservation-management');
      }
      finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className='bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center'>
        {verifying && status === 'loading' && (
          <div className='space-y-4'>
            <Skeleton className='h-16 w-16 rounded-full mx-auto' />
            <Skeleton className='h-8 w-3/4 mx-auto' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-5/6 mx-auto' />
            <p className="text-lg lg:text-xl font-semibold text-shadow-neutral-800">Verifying your payment...</p>
          </div>
        )}

        {status === 'success' && (
          <>
            <div className='mb-4 flex justify-center'>
              <CheckCircle2 className='w-16 h-16 text-green-500' />
            </div>

            <div className='text-center mb-8'>
              <h1 className='text-lg lg:text-xl font-semibold text-neutral-800 mb-4'>
                Payment Verification Success
              </h1>
              <p className="text-sm text-green-600 leading-snug">
                {successMessage}
              </p>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className='mb-4 flex justify-center'>
              <CheckCircle2 className='w-16 h-16 text-red-500' />
            </div>

            <div className='text-center mb-8'>
              <h1 className='text-lg lg:text-xl font-semibold text-neutral-800 mb-4'>
                Payment Verification Failure
              </h1>
              <p className="text-sm text-red-600 leading-snug">
                {errorMessage}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentVerification;