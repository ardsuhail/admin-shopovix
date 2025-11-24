"use client"
import { useState, useEffect } from "react";
import DashboardClient from "@/component/DashboardClient";

const Page = () => {
    const [ordersData, setOrdersData] = useState([])
    const [customersData, setCustomersData] = useState([])
    const [subscribersData, setSubscribersData] = useState([])
    const [reviewsData, setReviewsData] = useState([])
    const [queriesData, setQueriesData] = useState([])
    
    useEffect(() => {
        fetch('/api/allorders')
            .then(res => res.json())
            .then(data => {
                console.log('Orders API Response:', data);
                setOrdersData(data.allorders || data.orders || [])
            })
            .catch((error) => {
                console.error('Orders fetch error:', error);
                setOrdersData([]);
            })
    }, [])

    useEffect(() => {
        fetch('/api/customer-order')
            .then(res => res.json())
            .then(data => {
                console.log('Customers API Response:', data);
                setCustomersData(data.customer || data.customers || [])
            })
            .catch((error) => {
                console.error('Customers fetch error:', error);
                setCustomersData([]);
            })
    }, [])

    useEffect(() => {
        fetch('/api/subscriber')
            .then(res => res.json())
            .then(data => {
                console.log('Subscribers API Response:', data);
                setSubscribersData(data.subscribers || data.subscriber || [])
            })
            .catch((error) => {
                console.error('Subscribers fetch error:', error);
                setSubscribersData([]);
            })
    }, [])

    useEffect(() => {
        fetch('/api/reviews')
            .then(res => res.json())
            .then(data => {
                console.log('Reviews API Response:', data);
                setReviewsData(data.reviews || data.review || [])
            })
            .catch((error) => {
                console.error('Reviews fetch error:', error);
                setReviewsData([]);
            })
    }, [])

    useEffect(() => {
        fetch('/api/query')
            .then(res => res.json())
            .then(data => {
                console.log('Queries API Response:', data);
                setQueriesData(data.queries || data.query || [])
            })
            .catch((error) => {
                console.error('Queries fetch error:', error);
                setQueriesData([]);
            })
    }, [])
    
    // Loading state show karo jab tak data load nahi hota
    const isLoading = !ordersData && !customersData && !subscribersData && !reviewsData && !queriesData;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <DashboardClient initialData={{
                orders: ordersData,
                customers: customersData,
                subscribers: subscribersData,
                reviews: reviewsData,
                queries: queriesData
            }} />
        </div>
    )
}

export default Page;