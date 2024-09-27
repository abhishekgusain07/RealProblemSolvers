'use client'
import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { Bell, Loader2 } from 'lucide-react';
import { useGetNotifications } from '../api/use-getNotifications';

const NotificationComponent = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const {notifications, isLoading: isNotificationsLoading} = useGetNotifications()

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  if(isNotificationsLoading) {
    return (
        <div className='h-screen flex flex-col justify-center items-center'>
            <Loader2 className='size-4 animate-spin' />
        </div>
    )
  }
  return (
    <div className="relative">
      <button
        type='button'
        onClick={toggleNotifications}
        className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Bell className="h-6 w-6" />
        {notifications && notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-gray-200">
          <div className="py-2">
            {notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification._id} className="px-4 py-2 hover:bg-gray-100">
                  <p className="text-sm">{notification.content}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 px-4 py-2">No new notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationComponent;