import React from 'react';

const PayStack = ({ rentAmount, tenantEmail, landlordSubaccount }) => {
 
  // 1. Calculate: Rent + ₦100 tenant flat fee
  const tenantFee = 100;
  const amountInKobo = (Number(rentAmount) + tenantFee) * 100; // ₦30,100 → 3010000

  const handlePayment = () => {
    // Check if script is loaded
    if (!window.PaystackPop) {
      alert("Paystack is loading... please try again in a second.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: 'pk_test_7db487090a5d1c3c229168fe56ef78687d73241b', // REPLACE with your Paystack public key
      email: tenantEmail,
      amount: amountInKobo,
      subaccount: landlordSubaccount,
      bearer: 'subaccount', 
      currency: 'NGN',
      reference: `PAYHAUS_${new Date().getTime()}`,
      callback: (response) => {
        console.log('Paid:', response);
        // Backend calls: https://api.paystack.co/transaction/verify/:reference
        alert('Payment successful! Reference: ' + response.reference);
      },
      onClose: () => {
        alert('Payment closed');
      }
    });

    handler.openIframe();
  };

  return (
    <button onClick={handlePayment}>
      Pay ₦{(amountInKobo / 100).toLocaleString()}
    </button>
  );
};

export default PayStack;
