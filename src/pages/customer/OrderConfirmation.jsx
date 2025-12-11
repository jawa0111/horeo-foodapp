import { useLocation, Link } from 'react-router-dom';

export default function OrderConfirmation() {
    const location = useLocation();
    const { order, orderId } = location.state || {};

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Order Not Found</h2>
                    <Link to="/" className="text-[#FF8A00] hover:text-[#FF6B00]">
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600 mb-4">Thank you for your order</p>
                    
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="text-xl font-semibold text-gray-900">{orderId}</p>
                    </div>

                    <div className="space-y-4 mb-8">
                        <p>We've sent a confirmation email to <strong>{order.sender.email}</strong></p>
                        <p>Your order will be delivered to:</p>
                        <p className="font-medium">{order.address.details}</p>
                    </div>

                    <Link 
                        to="/"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#FF8A00] hover:bg-[#FF6B00] transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}