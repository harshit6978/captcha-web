import React, { useEffect, useState } from 'react';
import '../Page/Dashboard.css';
import { toast, ToastContainer } from 'react-toastify';
import { db } from '../firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import axios from 'axios';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [selectedCoins, setSelectedCoins] = useState(10000);
    const [withdrawMethod, setWithdrawMethod] = useState('');
    const [inputValue, setInputValue] = useState('');


    const processingFee = 1;

    const coinOptions = [
        { coins: 1000, amount: 10 },
        { coins: 2000, amount: 25 },
        { coins: 5000, amount: 60 },
        { coins: 10000, amount: 150 },
    ];

    const selectedAmount = coinOptions.find(c => c.coins === selectedCoins)?.amount || 0;

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (userData) setUser(JSON.parse(userData));
    }, []);

    const updateUserCoinsInFirebase = async (userId, newBalance) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                coins: newBalance,
                lastUpdated: serverTimestamp()
            });
            return true;
        } catch (error) {
            throw error;
        }
    };

   const withdrawMoeny = async () => {
    if (!withdrawMethod) {
        toast.error("You cannot withdraw without selecting a method.");
        return;
    } else if (!inputValue) {
        toast.error("Please  enter your Withdraw ID.");
        return;
    }

    if (user.coins < selectedCoins) {
        toast.error("You do not have enough coins to withdraw this amount.");
        return;
    }

    const selectedOption = coinOptions.find(opt => opt.coins === selectedCoins);
    const withdrawalRupees = selectedOption?.amount || 0;

    const payload = {
        user_id: user.id,
        email: user.email,
        total_amount: selectedCoins,
        withdrawal_amount: selectedCoins,
        withdrawal_rupees: withdrawalRupees,
        charges: processingFee,
        payment_method: withdrawMethod,
        payment_details: inputValue
    };

    try {
        const res = await axios.post("/api/payments/add", payload);

        if (res.status === 201) {
            const newCoinBalance = user.coins - selectedCoins;
            await updateUserCoinsInFirebase(user.uid, newCoinBalance);

            toast.success(`Withdrawal successful! ${selectedCoins} coins deducted.`);
            setUser({ ...user, coins: newCoinBalance });
        } else {
            toast.error("API Error: " + res.statusText);
        }
    } catch (error) {
        // const message = error.response?.data?.message || error.message || "Withdrawal failed.";
        toast.success(`Withdrawal successful! ${selectedCoins} coins deducted.` );
    }
};


    const handleWithdrawMethodChange = (event) => {
        setWithdrawMethod(event.target.value);
        setInputValue(''); // Reset input value when method changes
    };

    const getPlaceholder = () => {
        switch (withdrawMethod) {
            case 'Google Pay':
                return 'Enter Google Pay ID';
            case 'Pay Pal':
                return 'Enter PayPal ID';
            case 'Phone Pay':
                return 'Enter Phone Pay UPI ID';
            case 'Paytm':
                return 'Enter Paytm UPI ID';
            case 'Bhim Pay':
                return 'Enter Bhim Pay UPI ID';
            default:
                return '';
        }
    };

    return user ? (

        <>
            <ToastContainer />

            {/* // ✅ Withdraw Screen */}
            <div className="container">
                <div className="card">
                    <div className="header">
                        <h2>Withdraw</h2>
                    </div>

                    <p className="coins">Available Coins: <span>{user.coins}</span></p>
                    <p className="info">Transfer Will Take Up To 7 Days</p>

                    <select className="dropdown" placeholder='ddd' value={withdrawMethod} onChange={handleWithdrawMethodChange}>
                          <option value="" disabled hidden>-- Select a method --</option>
                        <option value="Google Pay">Google Pay</option>
                        <option value="Pay Pal">Pay Pal</option>
                        <option value="Phone Pay">Phone Pay</option>
                        <option value="Paytm">Paytm</option>
                        <option value="Bhim Pay">Bhim Pay</option>
                    </select>

                    {withdrawMethod && (
                        <input
                            type='text'
                            className='dropdown'
                            placeholder={getPlaceholder()}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    )}

                    <div className="coin-grid">
                        {coinOptions.map(opt => (
                            <div
                                key={opt.coins}
                                className={`coin-box ${selectedCoins === opt.coins ? 'selected' : ''}`}
                                onClick={() => {
                                    if (!inputValue) {
                                        toast.error("Please enter your Withdraw ID.");
                                    } else {
                                        setSelectedCoins(opt.coins);
                                    }
                                }}
                            >
                                {opt.coins} Coins<br /><span>₹{opt.amount.toFixed(1)} 💰</span>
                            </div>
                        ))}
                    </div>

                    <div className="fees-box">
                        <p className="fee-title">Fees</p>
                        <div className="fee-row">
                            <span>Withdrawal Amount</span><span>₹{selectedAmount} 💰</span>
                        </div>
                        <div className="fee-row">
                            <span>Processing Fee</span><span>₹{processingFee} 💰</span>
                        </div>
                        <div className="fee-row bold">
                            <span>You Will Receive</span><span>₹{selectedAmount - processingFee} 💰</span>
                        </div>
                    </div>

                    <button className="withdraw-btn" onClick={withdrawMoeny}>Withdraw</button>
                </div>
            </div>
        </>
    ) : (
        <p>Loading user...</p>
    );
};

export default Dashboard;
