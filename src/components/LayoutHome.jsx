import { Outlet } from "react-router-dom"

const LayoutHome = () => {
    return (
        <main className="App">
            <div className="main-page">
                <div id="background">
                    <img src="/src/assets/img/logo_no_text.png" />
                    <h1>ALVAGRAM</h1>
                </div>
                <Outlet />
            </div>
        </main>
    )
}

export default LayoutHome;