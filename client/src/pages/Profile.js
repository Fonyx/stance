import React from 'react'
// import { useParams } from 'react-router-dom';
// import { useQuery } from '@apollo/client';

export default function Profile(profile) {

    // const {profileId} = useParams();

    // const {loading, data} = useQuery(GET_PROFILE, {
    //     variables: {profileId: profileId}
    // });

    // const profile = data?.profile || {};

    // if(loading){
    //     return <div>Loading...</div>
    // }

    return (
        <div>
            <h2 className="card-header">
                {profile.name}'s friends have endorsed these skills...
            </h2>
        </div>
    )
}
