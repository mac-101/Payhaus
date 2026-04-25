import React, { useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { db } from '../../firebase.config';
import { ref, update } from 'firebase/database';

// 1. Hardcoded Local Bank List (Add as many as you need)
const LOCAL_BANKS = [
  { id: 1, name: "Access Bank", code: "044" },
  { id: 2, name: "First Bank of Nigeria", code: "011" },
  { id: 3, name: "Guaranty Trust Bank", code: "058" },
  { id: 4, name: "United Bank for Africa", code: "033" },
  { id: 5, name: "Zenith Bank", code: "057" },
  { id: 6, name: "Kuda Bank", code: "50211" },
  { id: 7, name: "OPay Digital Services", code: "999992" },
];

const LandlordAccountPage = ({ complexId }) => {
  const { uid } = useAuth();
  const [formData, setFormData] = useState({ accountNumber: '', bankCode: '', businessName: '' });
  const [loading, setLoading] = useState(false);

  const handleLinkAccount = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 2. Keep the POST request to your server for creating the subaccount
      const response = await fetch('http://localhost:5000/create-subaccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: formData.businessName,
          settlement_bank: formData.bankCode,
          account_number: formData.accountNumber,
          percentage_charge: 0 
        })
      });

      const result = await response.json();

      if (result.status) {
        const subCode = result.data.subaccount_code;
        await update(ref(db, `complexes/${complexId}`), {
          paystackSubaccountCode: subCode,
          bankLinked: true
        });
        alert("Bank account linked successfully!");
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Server connection failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Link Bank Account</h2>
      <form onSubmit={handleLinkAccount} className="space-y-4">
        <input
          type="text" placeholder="Landlord or Business Name" required
          className="w-full border p-2 rounded"
          onChange={e => setFormData({ ...formData, businessName: e.target.value })}
        />
        
        {/* 3. Using the LOCAL_BANKS list here */}
        <select
          required className="w-full border p-2 rounded"
          onChange={e => setFormData({ ...formData, bankCode: e.target.value })}
        >
          <option value="">Select Your Bank</option>
          {LOCAL_BANKS.map(bank => (
            <option key={bank.id} value={bank.code}>{bank.name}</option>
          ))}
        </select>

        <input
          type="text" placeholder="10-Digit Account Number" required maxLength="10"
          className="w-full border p-2 rounded"
          onChange={e => setFormData({ ...formData, accountNumber: e.target.value })}
        />
        <button
          type="submit" disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Linking..." : "Save Bank Details"}
        </button>
      </form>
    </div>
  );
};

export default LandlordAccountPage;
