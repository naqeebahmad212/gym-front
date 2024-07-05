import { faFaceFrown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const NoPageFound = () => {
    return (
        <div className='row d-flex w-100 h-100'
            style={{
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <FontAwesomeIcon icon={faFaceFrown} style={{
                fontSize: "200px",
            }} />
            <h1 style={{
                color: 'black',
                fontSize: '50px',
                textAlign:'center'
            }}> NO Page Found</h1>
        </div>
    )
}

export default NoPageFound
