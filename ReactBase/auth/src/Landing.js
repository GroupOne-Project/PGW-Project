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
                    <p>Conçevez le WBS, PERT et le GANTT de votre projet meintenant.</p>
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
                                <p>PERT est un outil de planification de projet. Il est utilisé pour calculer, de façon réaliste, le temps nécessaire pour terminer un projet. PERT signifie « Program Evaluation Review Technique » (technique d'évaluation et d'examen de programmes).</p>                                
                            </div>
                            {/* <img src="/images/wbs.png"></img> */}
                        </div>
                        <div className="two">
                            {/* <img src="/images/gantt.png"></img> */}
                            <div className="text">
                                <h3>GANTT</h3>
                                <p>Le diagramme de Gantt, couramment utilisé en gestion de projet, est l'un des outils les plus efficaces pour représenter visuellement l'état d'avancement des différentes activités (tâches) qui constituent un projet.</p>                                
                            </div>
                        </div>
                        <div className="three">
                            <div className="text">
                                <h3>WBS</h3>
                                <p>Un organigramme des tâches du projet (OTP)1 ou structure de découpage du projet (SDP)2, ou encore work breakdown structure (WBS) (en anglais), est une décomposition hiérarchique des travaux nécessaires pour réaliser les objectifs d'un projet3. Elle a pour but d’aider à organiser le projet, en définissant la totalité de son contenu et en servant de référence pour planifier les activités et établir le budget prévisionnel.</p>                                
                            </div>
                            {/* <img src="/images/wbs.png"></img> */}
                        </div>
                    </div>
                </div>
            </div>
            {/* <hr></hr> */}
            <div className="available">
                <div className="title-landing">
                    <h3>PGW Project</h3>
                    <p>PGW Project est disponible sur presque toute les plateformes :</p>
                    <p>Mobile, Desktop, Tablette</p>
                </div>
                <img src="images/landing-teams-a19cfef3a4.png"></img>
            </div>
            <div className="get">
                <a href="/Login">Commencer</a>
            </div>
            {/* -------- */}
            <div className="footer">
                <div className="team">
                    <h3>Notre Equipe</h3>
                    <div className="images">
                        <div className="item">
                            <img src="/images/a1.png"></img>
                            <p>Soro Ange</p>
                        </div>
                        <div className="item">
                            <img src="/images/y.png"></img>
                            <p>Coulibaly Yaya.H</p>
                        </div>
                        <div className="item">
                            <img src="/images/s.png"></img>
                            <p>Atse Achi</p>
                        </div>
                        <div className="item">
                            <img src="/images/y.png"></img>
                            <p>Yapi H.Joel</p>
                        </div>
                        <div className="item">
                            <img src="/images/y.png"></img>
                            <p>Kouassi K.Fernand</p>
                        </div>
                        <div className="item">
                            <img src="/images/s.png"></img>
                            <p>Kouassi Dominique</p>
                        </div>
                        <div className="item">
                            <img src="/images/y.png"></img>
                            <p>Trah Justin</p>
                        </div>
                    </div>
                </div>

                <div className="contact">
                    <h1>Nous Contacter</h1>
                    <form>                                           
                        <a href="mailto: hamedcuenca5@gmail.com">Email</a>
                    </form>
                </div>
            </div>
            {/* ---------- */}            
        </div>
    );
}

export default Landing;