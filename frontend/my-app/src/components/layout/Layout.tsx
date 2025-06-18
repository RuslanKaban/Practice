import React from "react";
import Header from "./header/Header"
import Footer from "./footer/Footer"

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    return(
        <div>
            <Header />
            <main style={{padding: '20px'}}>{children}</main>
            <Footer />
        </div>
    )
}
export default Layout