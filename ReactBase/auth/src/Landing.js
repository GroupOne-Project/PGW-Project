import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useHref, useNavigate } from "react-router-dom";

import "./Landing.css";

function Landing() {

    return (
        <div className="landing">
            <div className="header">
                <div className="content">
                    <h3>Welcome To PGW Project</h3>
                    <p>Make the PERT, GANTT and WBS of your project now</p>
                    <img src="/images/landing-header-1ac8944e97.png"></img>
                    <a href="/Login">Commencer</a>
                </div>
            </div>
            {/* ------- */}
            <div className="main">
                <div className="about">
                    <div className="container">
                        <div className="one">
                            <div className="text">
                                <h3>PERT</h3>
                                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus unde atque reiciendis mollitia voluptate consectetur asperiores pariatur aliquam vitae enim ab deserunt voluptatem dolor nam, cumque aspernatur sunt quae dignissimos!</p>                                
                            </div>
                            <img src="/images/landing-header-1ac8944e97.png"></img>
                        </div>
                        <div className="two">
                            <img src="/images/landing-header-1ac8944e97.png"></img>
                            <div className="text">
                                <h3>GANTT</h3>
                                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus unde atque reiciendis mollitia voluptate consectetur asperiores pariatur aliquam vitae enim ab deserunt voluptatem dolor nam, cumque aspernatur sunt quae dignissimos!</p>                                
                            </div>
                        </div>
                        <div className="three">
                            <div className="text">
                                <h3>WBS</h3>
                                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Necessitatibus unde atque reiciendis mollitia voluptate consectetur asperiores pariatur aliquam vitae enim ab deserunt voluptatem dolor nam, cumque aspernatur sunt quae dignissimos!</p>                                
                            </div>
                            <img src="/images/landing-header-1ac8944e97.png"></img>
                        </div>
                    </div>
                </div>
            </div>
            {/* -------- */}
            <div className="footer">
                <div className="team">
                    <h3>Notre Equipe</h3>
                    <div className="images">
                        <div className="item">
                            <img src="/images/s.png"></img>
                            <p>Soro Ange</p>
                        </div>
                        <div className="item">
                            <img src="/images/y.png"></img>
                            <p>Yapi H.Joel</p>
                        </div>
                        <div className="item">
                            <img src="/images/f.jpeg"></img>
                            <p>Kouassi K.Fernand</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* ---------- */}
            {/* <hr></hr> */}
            <div className="available">
                <div className="title-landing">
                    <h3>PGW Project</h3>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, pariatur autem. Repellendus excepturi doloribus maiores blanditiis ab consequuntur maxime explicabo delectus officiis optio non, ullam ad labore fuga libero nemo!</p>                    
                </div>
                <img src="images/landing-teams-a19cfef3a4.png"></img>
            </div>
            <div className="get">
                <a href="/Login">Commencer</a>
            </div>
        </div>
    );
}

export default Landing;