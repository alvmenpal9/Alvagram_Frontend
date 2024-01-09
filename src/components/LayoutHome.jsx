import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom"

const LayoutHome = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [isMobile, setIsMobile] = useState();

    useEffect(() => {
        const userAgent = navigator.userAgent;
        const mobile = /Mobi|Android/i.test(userAgent);

        setIsMobile(mobile);
        setIsLoading(false);
        return () => {
            setIsLoading(true);
        }
    },[])

    return (
        <main className="App">
            <div className={isMobile ? 'main-page mobile' : 'main-page'}>
                <div id="background">
                    <img src="/assets/img/logo_no_text.png" />
                </div>
                <Outlet />
            </div>
        </main>
    )
}

export default LayoutHome;