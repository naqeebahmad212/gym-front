import React from 'react'

const Wrapper = ({ children ,shownav}) => {
    return (
        <>
            <div className={`layout-wrapper layout-content-navbar ${shownav?"layout-menu-expanded":""}`}>
                <div className="layout-container">
                    {children}
                </div>
            </div>
        </>
    );
}

export default Wrapper
