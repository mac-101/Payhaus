import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { db } from '../../firebase.config';
import { ref, update } from 'firebase/database';

const LandlordAccountPage = ({ complexId }) => {
  const { uid } = useAuth();
  const [banks, setBanks] = useState([]);
  const [formData, setFormData] = useState({ accountNumber: '', bankCode: '', businessName: '' });
  const [loading, setLoading] = useState(false);

  // 1. Fetch banks from your Node server on load
  useEffect(() => {
    const loadBanks = async () => {
      try {
        const res = await fetch('http://localhost:5000/banks');
        const result = await res.json();
        if (result.status) setBanks(result.data);
      } catch (err) {
        console.error("Error loading banks:", err);
      }
    };
    loadBanks();
  }, []);

  const handleLinkAccount = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 2. Send data to your Node server
      const response = await fetch('http://localhost:5000/create-subaccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: formData.businessName,
          settlement_bank: formData.bankCode,
          account_number: formData.accountNumber,
          percentage_charge: 0 // Landlord gets 100% by default
        })
      });

      const result = await response.json();

      if (result.status) {
        const subCode = result.data.subaccount_code;
        // 3. Save the returned subaccount_code to Firebase
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
        <select
          required className="w-full border p-2 rounded"
          onChange={e => setFormData({ ...formData, bankCode: e.target.value })}
        >
          <option value="">Select Your Bank</option>
          {banks.map(bank => (
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
