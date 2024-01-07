import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Global_url_api } from "../../constants/global";
import { format } from 'date-fns';

const Notifications = () => {

    const [notifications, setNotifications] = useState([{}]);
    const [isLoading, setIsLoading] = useState(true);
    const { auth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        const getNotifications = async () => {
            try {
                const response = await axiosPrivate.get('/notification', {
                    headers: {
                        Authorization: auth.accessToken
                    }
                });

                if (response?.status === 200) {
                    setNotifications(response?.data?.notifications);
                    setIsLoading(false);
                }
            } catch (error) {
                if (error?.response?.status === 403) {
                    navigate('/login')
                }
            }
        };

        getNotifications();

        return () => {
            setIsLoading(true);
            setNotifications([{}]);
        }

    }, [])

    return (
        <section className="main_content">
            <h1 style={{ color: 'var(--primary-color)', textAlign: 'center' }}>Notifications</h1>
            {isLoading
                ? 'Loading...'
                : (
                    notifications.length > 0
                        ? (
                            <ul className="notifications">
                                {notifications.map(notification => (
                                    <li key={notification._id} className="notification-item">
                                        <div className="notification-description">
                                            <h3 style={{ color: 'var(--primary-color)' }}>{notification?.User.username}</h3>
                                            <p>
                                                {notification.typeNotification === 'Like'
                                                    ? 'Liked your post'
                                                    :  notification.typeNotification === 'Comment' && 'Left a comment'
                                                }
                                            </p>
                                            <p style={{ color: 'var(--dark-gray)' }}>{format(new Date(notification.date), 'M/dd kk:mm')}</p>
                                        </div>
                                        <div className="notification-thumbnail">
                                            <img src={`${Global_url_api}post/image/${notification?.Post.image}`} alt="thumbnail" />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )
                        : <h2>No notifications</h2>
                )
            }
        </section>
    )
}

export default Notifications;