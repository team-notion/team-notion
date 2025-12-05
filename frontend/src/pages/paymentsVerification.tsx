// PaymentVerification.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getData } from '@/components/lib/apiMethods';
import { toast } from 'sonner';
import { apiEndpoints } from '@/components/lib/apiEndpoints';
import CONFIG from '@/components/utils/config';
import { LOCAL_STORAGE_KEYS } from '@/components/utils/localStorageKeys';

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paymentId = sessionStorage.getItem('pending_payment_id');
        const reference = searchParams.get('reference');
        
        if (!paymentId) {
          toast.error('Payment information not found');
          navigate('/reservation-management');
          return;
        }

        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
        
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VERIFY_PAYMENTS}?reference=${reference}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const resp = response.data.results;

        if (response.status === 200 || response.status === 201) {
          toast.success(resp?.message || 'Payment successful! Your reservation is confirmed.');
          sessionStorage.removeItem('pending_payment_id');
          sessionStorage.removeItem('reservation_code');
          navigate('/reservation-management');
        }
        else {
          toast.error('Payment verification failed');
          navigate('/reservation-management');
        }
      }
      catch (err: any) {
        const errData = err?.response?.data;

        if (errData && typeof errData === 'object') {
          Object.keys(errData).forEach((key) => {
            if (Array.isArray(errData[key]) && errData[key].length > 0) {
              errData[key].forEach((message: string) => {
                toast.error(message);
              });
            }
            else {
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
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {verifying ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-lg">Verifying your payment...</p>
          </>
        ) : (
          <p>Redirecting...</p>
        )}
      </div>
    </div>
  );
};

export default PaymentVerification;