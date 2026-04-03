import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchUserOrders } from "../store/slices/orderSlice";

const statusStyles: Record<string, string> = {
  delivered: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  processing: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  shipped: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
  pending: "bg-[#252535] text-[#9B9BAD] border border-[#2E2E3E]",
  completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
};

const OrderHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, isLoading, error } = useSelector(
    (state: RootState) => state.orders,
  );

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D14] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF4500]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D14] flex items-center justify-center">
        <p className="text-red-400 font-body">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D14] px-4 py-10">
      <div className="container mx-auto max-w-3xl">
        <h1 className="font-display text-2xl font-bold text-[#F0EEFF] mb-8 tracking-tight">
          <span data-test="order-history-heading">Order History</span>
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#7A7A8C] font-body">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusKey = order.status.toLowerCase();
              const statusClass = statusStyles[statusKey] ?? statusStyles.pending;

              return (
                <div
                  key={order.id}
                  className="bg-[#13131C] border border-[#252535] rounded-xl p-6"
                >
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <p className="text-[#F0EEFF] font-body font-semibold">
                        Order #{order.id}
                      </p>
                      <p className="text-[#7A7A8C] font-body text-sm mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-body font-medium ${statusClass}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="border-t border-[#252535] pt-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-[#FF4500] font-body text-xs font-semibold uppercase tracking-widest mb-3">
                          Items
                        </h3>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-[#9B9BAD] font-body text-sm">
                                {item.product?.name || `Product #${item.productId}`}{" "}
                                <span className="text-[#7A7A8C]">x {item.quantity}</span>
                              </span>
                              <span className="text-[#F0EEFF] font-body text-sm font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-[#FF4500] font-body text-xs font-semibold uppercase tracking-widest mb-3">
                          Shipping Address
                        </h3>
                        <div className="text-[#9B9BAD] font-body text-sm space-y-0.5">
                          <p>{order.shippingAddress?.street}</p>
                          <p>
                            {order.shippingAddress?.city},{" "}
                            {order.shippingAddress?.state}{" "}
                            {order.shippingAddress?.zipCode}
                          </p>
                          <p>{order.shippingAddress?.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#252535] mt-5 pt-4 flex justify-between items-center">
                    <span className="text-[#7A7A8C] font-body text-sm font-medium uppercase tracking-widest">
                      Total
                    </span>
                    <span className="text-[#F0EEFF] font-body text-lg font-bold">
                      ${order.total.toFixed?.(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
